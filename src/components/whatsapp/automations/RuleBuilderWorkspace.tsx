import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Sun, 
  Moon, 
  ShieldCheck, 
  ShieldAlert,
  Zap,
  Check
} from 'lucide-react';
import { AutomationRuleItem, AutomationCondition, AutomationAction } from './types';

interface RuleBuilderWorkspaceProps {
  initialRule: AutomationRuleItem;
  isReadOnly: boolean;
  theme: 'light' | 'dark';
  onBack: () => void;
  onSaveRule: (rule: AutomationRuleItem) => void;
  onToggleTheme: () => void;
}

export const RuleBuilderWorkspace: React.FC<RuleBuilderWorkspaceProps> = ({
  initialRule,
  isReadOnly,
  theme,
  onBack,
  onSaveRule,
  onToggleTheme
}) => {
  const [rule, setRule] = useState<AutomationRuleItem>(initialRule);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const isDark = theme === 'dark';

  const handleSave = () => {
    if (isReadOnly) return;
    onSaveRule({
      ...rule,
      lastUpdated: 'Just now'
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const addCondition = () => {
    if (isReadOnly) return;
    const newCond: AutomationCondition = {
      id: `c-${Date.now()}`,
      field: 'message_text',
      operator: 'contains',
      value: ''
    };
    setRule(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCond]
    }));
  };

  const removeCondition = (id: string) => {
    if (isReadOnly) return;
    setRule(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c.id !== id)
    }));
  };

  const addAction = () => {
    if (isReadOnly) return;
    const newAction: AutomationAction = {
      id: `a-${Date.now()}`,
      type: 'add_label',
      params: { label: 'New Tag' }
    };
    setRule(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
  };

  const removeAction = (id: string) => {
    if (isReadOnly) return;
    setRule(prev => ({
      ...prev,
      actions: prev.actions.filter(a => a.id !== id)
    }));
  };

  return (
    <div className={`p-4 sm:p-6 min-h-full transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F4F5F7] text-slate-900'
    }`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className={`p-2 rounded-xl border transition-colors ${
                isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
              title="Return to Rules Library"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#5A4AD2]" />
                <h1 className="text-lg font-bold tracking-tight">
                  Rule Builder: {rule.name}
                </h1>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Configure trigger events, matching rules, and dispatch actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-colors ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              type="button"
              disabled={isReadOnly}
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isReadOnly
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-[#5A4AD2] hover:bg-[#4B3DB5] text-white'
              }`}
            >
              {isSavedNotice ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{isSavedNotice ? 'Saved!' : 'Save Rule'}</span>
            </button>
          </div>
        </div>

        {/* Rule Metadata Form */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rule Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Rule Name</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={rule.name}
                onChange={(e) => setRule(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Status</label>
              <select
                disabled={isReadOnly}
                value={rule.status}
                onChange={(e) => setRule(prev => ({ ...prev, status: e.target.value as any }))}
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Paused">Paused</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              rows={2}
              disabled={isReadOnly}
              value={rule.description}
              onChange={(e) => setRule(prev => ({ ...prev, description: e.target.value }))}
              className={`w-full px-3 py-2 rounded-xl border text-xs ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>
        </div>

        {/* IF: Conditions Box */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold">
                IF
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Trigger Conditions</h2>
            </div>
            <button
              type="button"
              disabled={isReadOnly}
              onClick={addCondition}
              className="flex items-center gap-1 text-xs font-bold text-[#5A4AD2] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Condition</span>
            </button>
          </div>

          <div className="space-y-3">
            {rule.conditions.map((cond, idx) => (
              <div key={cond.id || idx} className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={cond.field}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRule(prev => ({
                      ...prev,
                      conditions: prev.conditions.map((c, i) => i === idx ? { ...c, field: val } : c)
                    }));
                  }}
                  className={`w-40 px-3 py-1.5 rounded-lg border text-xs ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                  placeholder="field_name"
                />
                <select
                  disabled={isReadOnly}
                  value={cond.operator}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setRule(prev => ({
                      ...prev,
                      conditions: prev.conditions.map((c, i) => i === idx ? { ...c, operator: val } : c)
                    }));
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="equals">equals</option>
                  <option value="contains">contains</option>
                  <option value="not_equals">not equals</option>
                  <option value="is_present">is present</option>
                </select>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={cond.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRule(prev => ({
                      ...prev,
                      conditions: prev.conditions.map((c, i) => i === idx ? { ...c, value: val } : c)
                    }));
                  }}
                  className={`flex-1 min-w-[140px] px-3 py-1.5 rounded-lg border text-xs ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                  placeholder="value"
                />
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => removeCondition(cond.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* THEN: Actions Box */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
                THEN
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Execution Actions</h2>
            </div>
            <button
              type="button"
              disabled={isReadOnly}
              onClick={addAction}
              className="flex items-center gap-1 text-xs font-bold text-[#5A4AD2] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Action</span>
            </button>
          </div>

          <div className="space-y-3">
            {rule.actions.map((act, idx) => (
              <div key={act.id || idx} className="flex items-center gap-2 flex-wrap">
                <select
                  disabled={isReadOnly}
                  value={act.type}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setRule(prev => ({
                      ...prev,
                      actions: prev.actions.map((a, i) => i === idx ? { ...a, type: val } : a)
                    }));
                  }}
                  className={`w-48 px-3 py-1.5 rounded-lg border text-xs ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="assign_conversation">Assign Conversation</option>
                  <option value="add_label">Add Label / Tag</option>
                  <option value="send_template">Send WhatsApp Template</option>
                  <option value="resolve">Resolve Conversation</option>
                </select>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={JSON.stringify(act.params)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setRule(prev => ({
                        ...prev,
                        actions: prev.actions.map((a, i) => i === idx ? { ...a, params: parsed } : a)
                      }));
                    } catch {}
                  }}
                  className={`flex-1 min-w-[160px] px-3 py-1.5 rounded-lg border text-xs font-mono ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
                  }`}
                  placeholder='{"team": "Reception Desk"}'
                />
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => removeAction(act.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Zap, 
  Plus, 
  Search, 
  Sun, 
  Moon, 
  ShieldCheck, 
  ShieldAlert, 
  Play, 
  Pause, 
  Trash2, 
  Edit3,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { AutomationRuleItem } from './types';

interface AutomationsLibraryViewProps {
  rules: AutomationRuleItem[];
  theme: 'light' | 'dark';
  isReadOnly: boolean;
  onSelectRule: (rule: AutomationRuleItem) => void;
  onCreateRule: () => void;
  onUpdateRules: React.Dispatch<React.SetStateAction<AutomationRuleItem[]>>;
  onToggleTheme: () => void;
  onTogglePermission: () => void;
}

export const AutomationsLibraryView: React.FC<AutomationsLibraryViewProps> = ({
  rules,
  theme,
  isReadOnly,
  onSelectRule,
  onCreateRule,
  onUpdateRules,
  onToggleTheme,
  onTogglePermission
}) => {
  const [search, setSearch] = useState('');
  const isDark = theme === 'dark';

  const filteredRules = rules.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRuleStatus = (ruleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isReadOnly) return;
    onUpdateRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        return {
          ...r,
          status: r.status === 'Active' ? 'Paused' : 'Active'
        };
      }
      return r;
    }));
  };

  const deleteRule = (ruleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isReadOnly) return;
    onUpdateRules(prev => prev.filter(r => r.id !== ruleId));
  };

  return (
    <div className={`p-4 sm:p-6 min-h-full transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F4F5F7] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#5A4AD2]" />
              <h1 className="text-xl font-extrabold tracking-tight">
                WhatsApp Automation Rules
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-[#5A4AD2] dark:bg-violet-950 dark:text-violet-300">
                Event Triggers
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Define linear event-driven routing, auto-assignments, and SLA tag updates.
            </p>
          </div>

          {/* Prototype Controls & Action */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              type="button"
              onClick={onToggleTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-colors ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
              <span className="font-semibold">{isDark ? 'Dark' : 'Light'}</span>
            </button>

            <button
              type="button"
              onClick={onTogglePermission}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-colors ${
                isReadOnly
                  ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300'
              }`}
            >
              {isReadOnly ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span className="font-semibold">{isReadOnly ? 'Read-Only' : 'Can Edit'}</span>
            </button>

            <button
              type="button"
              disabled={isReadOnly}
              onClick={onCreateRule}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-colors ${
                isReadOnly 
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-[#5A4AD2] hover:bg-[#4B3DB5] text-white shadow-sm'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Rule</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search automation rules..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span>Total Rules: <strong>{rules.length}</strong></span>
            <span>Active: <strong className="text-emerald-500">{rules.filter(r => r.status === 'Active').length}</strong></span>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-3">
          {filteredRules.map((rule) => {
            const isActive = rule.status === 'Active';
            return (
              <div
                key={rule.id}
                onClick={() => onSelectRule(rule)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                    : 'bg-white border-slate-200 hover:border-violet-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {rule.name}
                      </h2>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {rule.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
                      {rule.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <div className="text-right hidden sm:block mr-2">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {rule.executionCount.toLocaleString()} runs
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Updated {rule.lastUpdated}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleRuleStatus(rule.id, e)}
                      disabled={isReadOnly}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
                      }`}
                      title={isActive ? 'Pause Rule' : 'Activate Rule'}
                    >
                      {isActive ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRule(rule);
                      }}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
                      }`}
                      title="Edit Rule"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => deleteRule(rule.id, e)}
                      disabled={isReadOnly}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        isDark ? 'border-slate-700 hover:bg-rose-950/50' : 'border-slate-200 hover:bg-rose-50'
                      }`}
                      title="Delete Rule"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </button>
                  </div>
                </div>

                {/* Condition & Action pill summary */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="font-bold text-slate-400">IF:</span>
                  {rule.conditions.map((c, i) => (
                    <span key={c.id || i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                      {c.field} {c.operator} "{c.value}"
                    </span>
                  ))}
                  <span className="font-bold text-[#5A4AD2] ml-2">THEN:</span>
                  {rule.actions.map((a, i) => (
                    <span key={a.id || i} className="px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-950/60 text-[#5A4AD2] dark:text-violet-300 font-medium">
                      {a.type.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredRules.length === 0 && (
            <div className={`p-8 text-center rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
              <Zap className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <div className="text-sm font-bold">No Automation Rules Match</div>
              <p className="text-xs text-slate-400 mt-1">Try clearing your search query or create a new automation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

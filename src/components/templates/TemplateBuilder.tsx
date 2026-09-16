/**
 * Template Builder Workspace
 * Visual designer for Meta WhatsApp Cloud API templates with live device preview.
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CornerDownLeft,
  ExternalLink,
  Phone,
  Sparkles,
  Smartphone,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { TemplateDraft, TemplateButton, TemplateVariable } from './types';
import { extractVariablesFromText, interpolateText } from './templateUtils';

interface TemplateBuilderProps {
  initialDraft?: TemplateDraft | null;
  onSaveTemplate: (draft: TemplateDraft) => void;
  onBackToLibrary: () => void;
}

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
  initialDraft,
  onSaveTemplate,
  onBackToLibrary,
}) => {
  const [name, setName] = useState(initialDraft?.name || 'clinic_consultation_notice');
  const [category, setCategory] = useState<'MARKETING' | 'UTILITY' | 'AUTHENTICATION'>(
    initialDraft?.category || 'UTILITY'
  );
  const [language, setLanguage] = useState(initialDraft?.language || 'en_US');
  const [headerType, setHeaderType] = useState<'none' | 'text' | 'image' | 'document'>(
    initialDraft?.header?.type || 'text'
  );
  const [headerText, setHeaderText] = useState(
    initialDraft?.header?.text || 'Agamagizh Care — Clinic Update'
  );
  const [body, setBody] = useState(
    initialDraft?.body ||
      'Hello {{1}}, your consultation with {{2}} is confirmed for {{3}} at our Adyar campus.'
  );
  const [footer, setFooter] = useState(
    initialDraft?.footer || 'Reply STOP to unsubscribe'
  );

  const [buttons, setButtons] = useState<TemplateButton[]>(
    initialDraft?.buttons || [
      { id: 'b-1', type: 'QUICK_REPLY', text: 'Confirm Slot' },
      { id: 'b-2', type: 'PHONE_NUMBER', text: 'Call Front Desk', value: '+914428400001' },
    ]
  );

  // Dynamic detected variables
  const detectedIndices = extractVariablesFromText(`${headerText} ${body}`);
  const [variableExamples, setVariableExamples] = useState<Record<number, string>>({
    1: 'Meera Sundaram',
    2: 'Dr. Rajesh Sharma',
    3: 'Tomorrow at 10:30 AM',
  });

  const variables: TemplateVariable[] = detectedIndices.map((idx) => ({
    token: `{{${idx}}}`,
    index: idx,
    example: variableExamples[idx] || `Sample Value ${idx}`,
    description: `Variable {{${idx}}}`,
  }));

  const interpolatedBody = interpolateText(body, variables);
  const interpolatedHeader = interpolateText(headerText, variables);

  const handleAddVariable = () => {
    const nextIdx = detectedIndices.length > 0 ? Math.max(...detectedIndices) + 1 : 1;
    setBody((prev) => `${prev} {{${nextIdx}}}`);
    setVariableExamples((prev) => ({ ...prev, [nextIdx]: `Sample ${nextIdx}` }));
  };

  const handleAddButton = (type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER') => {
    if (buttons.length >= 3) return;
    setButtons((prev) => [
      ...prev,
      {
        id: `btn-${Date.now()}`,
        type,
        text: type === 'QUICK_REPLY' ? 'Quick Option' : type === 'URL' ? 'Visit Portal' : 'Call Doctor',
        value: type === 'URL' ? 'https://agamagizh.org' : '+914428400001',
      },
    ]);
  };

  const handleRemoveButton = (id: string) => {
    setButtons((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSave = () => {
    const draft: TemplateDraft = {
      id: initialDraft?.id || `draft-${Date.now()}`,
      name: name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      category,
      language,
      source: 'local_draft',
      status: 'local_draft',
      isCampaignEligible: true,
      header: {
        type: headerType,
        text: headerType === 'text' ? headerText : undefined,
      },
      body,
      footer,
      variables,
      buttons,
      createdAt: initialDraft?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onSaveTemplate(draft);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 overflow-hidden text-xs">
      {/* Top Bar */}
      <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToLibrary}
            className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-white">Meta WhatsApp Template Designer</h2>
            <p className="text-[11px] text-slate-400">Compose and test message structure before Meta submission</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Draft Template</span>
        </button>
      </div>

      {/* Main split view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form controls */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 max-w-2xl border-r border-slate-800">
          {/* Metadata */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block font-medium text-slate-300 mb-1">Template Identifier</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-hidden focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-hidden focus:border-emerald-500"
              >
                <option value="UTILITY">Utility (Reminders/Alerts)</option>
                <option value="MARKETING">Marketing (Promotions)</option>
                <option value="AUTHENTICATION">Authentication (OTP)</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-hidden focus:border-emerald-500"
              >
                <option value="en_US">English (en_US)</option>
                <option value="ta">Tamil (ta)</option>
                <option value="hi">Hindi (hi)</option>
              </select>
            </div>
          </div>

          {/* Header */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Header Component (Optional)</span>
              <div className="flex items-center gap-1.5">
                {(['none', 'text', 'image', 'document'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setHeaderType(t)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-medium ${
                      headerType === t
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {headerType === 'text' && (
              <input
                type="text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="Header text banner"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-hidden focus:border-emerald-500"
              />
            )}
          </div>

          {/* Body Text */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Message Body</span>
              <button
                type="button"
                onClick={handleAddVariable}
                className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-medium border border-slate-700"
              >
                <Plus className="w-3 h-3" />
                <span>Add {'{{variable}}'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs leading-relaxed focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Detected Variable Examples */}
          {detectedIndices.length > 0 && (
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
              <span className="font-semibold text-slate-200 block">Variable Sample Values (for preview)</span>
              <div className="grid grid-cols-2 gap-2">
                {detectedIndices.map((idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-bold w-10 text-[11px]">{`{{${idx}}}`}</span>
                    <input
                      type="text"
                      value={variableExamples[idx] || ''}
                      onChange={(e) =>
                        setVariableExamples({ ...variableExamples, [idx]: e.target.value })
                      }
                      className="flex-1 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 text-xs"
                      placeholder={`Value for {{${idx}}}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-2">
            <span className="font-semibold text-slate-200 block">Footer Text (Optional)</span>
            <input
              type="text"
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              placeholder="e.g. Reply STOP to opt out"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Buttons */}
          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Action Buttons (Max 3)</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={buttons.length >= 3}
                  onClick={() => handleAddButton('QUICK_REPLY')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 disabled:opacity-40"
                >
                  + Quick Reply
                </button>
                <button
                  type="button"
                  disabled={buttons.length >= 3}
                  onClick={() => handleAddButton('PHONE_NUMBER')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 disabled:opacity-40"
                >
                  + Call
                </button>
                <button
                  type="button"
                  disabled={buttons.length >= 3}
                  onClick={() => handleAddButton('URL')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 disabled:opacity-40"
                >
                  + URL
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {buttons.map((btn) => (
                <div
                  key={btn.id}
                  className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                      {btn.type}
                    </span>
                    <input
                      type="text"
                      value={btn.text}
                      onChange={(e) => {
                        const val = e.target.value;
                        setButtons((prev) =>
                          prev.map((b) => (b.id === btn.id ? { ...b, text: val } : b))
                        );
                      }}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs flex-1"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveButton(btn.id)}
                    className="text-slate-400 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Phone Mockup Preview */}
        <div className="w-96 bg-slate-950 p-6 flex flex-col items-center justify-center border-l border-slate-800 shrink-0">
          <div className="w-72 bg-[#ECE5DD] rounded-3xl shadow-2xl overflow-hidden border-4 border-slate-700 flex flex-col h-[520px]">
            {/* Phone Notch/Status */}
            <div className="bg-[#075E54] text-white px-4 py-2 text-xs flex items-center justify-between font-medium">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  +
                </div>
                <span>Agamagizh Care</span>
              </div>
              <span className="text-[10px] opacity-80">Online</span>
            </div>

            {/* WhatsApp Chat area */}
            <div
              className="flex-1 p-3 overflow-y-auto flex flex-col justify-end space-y-2"
              style={{
                backgroundImage: 'radial-gradient(#DFD7CA 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            >
              {/* Message Bubble */}
              <div className="bg-white rounded-xl p-3 shadow text-slate-900 space-y-2 text-xs">
                {headerType === 'text' && headerText && (
                  <div className="font-bold text-slate-900 text-xs border-b border-slate-100 pb-1">
                    {interpolatedHeader}
                  </div>
                )}
                {headerType === 'image' && (
                  <div className="w-full h-24 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-[10px]">
                    [Image Header Banner]
                  </div>
                )}
                {headerType === 'document' && (
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600 text-[10px] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Prescription_Record.pdf</span>
                  </div>
                )}

                <p className="whitespace-pre-wrap text-[11px] leading-relaxed text-slate-800">
                  {interpolatedBody || 'Template body content'}
                </p>

                {footer && (
                  <span className="text-[9px] text-slate-400 block pt-1">{footer}</span>
                )}

                {buttons.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    {buttons.map((btn) => (
                      <div
                        key={btn.id}
                        className="py-1 px-2 bg-slate-50 border border-slate-200 text-[#00A884] font-semibold text-center rounded text-[11px] flex items-center justify-center gap-1.5"
                      >
                        {btn.type === 'QUICK_REPLY' && <CornerDownLeft className="w-3 h-3 opacity-60" />}
                        {btn.type === 'URL' && <ExternalLink className="w-3 h-3 opacity-60" />}
                        {btn.type === 'PHONE_NUMBER' && <Phone className="w-3 h-3 opacity-60" />}
                        <span>{btn.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 mt-3">Live WhatsApp Client Simulation</span>
        </div>
      </div>
    </div>
  );
};

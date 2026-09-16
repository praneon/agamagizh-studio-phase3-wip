/**
 * Provider Synced Template Read-Only Inspector Modal
 * Shows Meta Cloud API template status, quality metrics, and duplicate-as-draft capability.
 */

import React from 'react';
import { X, Copy, CheckCircle2, ShieldCheck, CornerDownLeft, ExternalLink, Phone } from 'lucide-react';
import { WhatsAppTemplate } from '../../types';

interface ProviderTemplateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: WhatsAppTemplate | null;
  onDuplicateAsDraft: (template: WhatsAppTemplate) => void;
}

export const ProviderTemplateDetailModal: React.FC<ProviderTemplateDetailModalProps> = ({
  isOpen,
  onClose,
  template,
  onDuplicateAsDraft,
}) => {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-sm text-white">{template.name}</h3>
            </div>
            <p className="text-[11px] text-slate-400">Meta Cloud Synced Template Inspector</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Category</span>
              <span className="font-semibold text-slate-200">{template.category}</span>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Status</span>
              <span className="font-semibold text-emerald-400 uppercase text-[11px]">{template.status}</span>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Language</span>
              <span className="font-mono text-slate-200">{template.language}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Raw Template Body
            </span>
            <p className="whitespace-pre-wrap font-mono text-[11px] text-slate-300 leading-relaxed">
              {template.body}
            </p>
            {template.footer && (
              <span className="text-[10px] text-slate-500 block pt-1 border-t border-slate-800">
                {template.footer}
              </span>
            )}
          </div>

          {template.buttons && template.buttons.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Interactive Buttons
              </span>
              <div className="flex flex-wrap gap-2">
                {template.buttons.map((btn, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-200 text-[11px] flex items-center gap-1.5"
                  >
                    <span>{btn.text}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">({btn.type})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onDuplicateAsDraft(template);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate as Editable Draft</span>
          </button>
        </div>
      </div>
    </div>
  );
};

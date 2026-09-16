import React from 'react';
import { AppWindow, X } from 'lucide-react';

interface Props {
  isDark?: boolean;
}

export const OverlaysAndModalsSection: React.FC<Props> = ({ isDark }) => {
  return (
    <section id="overlays" className={`p-6 rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <AppWindow className="w-5 h-5 text-[#5A4AD2]" />
        <h2 className="text-lg font-bold">Drawers & Modal Overlays</h2>
      </div>
      <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Standard side slide-over drawers and center-anchored dialog structures.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800">
            <div className="text-xs font-bold">Right Drawer Mockup</div>
            <X className="w-4 h-4 text-slate-400" />
          </div>
          <div className="py-4 text-xs text-slate-500 dark:text-slate-400">
            Slide-over drawer pattern used in Recipient Detail, Pipeline Inspection, and Template Preview.
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800">
            <div className="text-xs font-bold">Center Modal Dialog</div>
            <X className="w-4 h-4 text-slate-400" />
          </div>
          <div className="py-4 text-xs text-slate-500 dark:text-slate-400">
            Constrained max-w-xl centered overlay with backdrop-blur and keyboard escape dismissal.
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Type } from 'lucide-react';

interface Props {
  isDark?: boolean;
}

export const TypographyAndSpacingSection: React.FC<Props> = ({ isDark }) => {
  return (
    <section id="typography" className={`p-6 rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <Type className="w-5 h-5 text-[#5A4AD2]" />
        <h2 className="text-lg font-bold">Typography & Spacing System</h2>
      </div>
      <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Standard typographic scale and spacing increments used across all operational modules.
      </p>
      <div className="space-y-4">
        <div className="border-b pb-3 dark:border-slate-800">
          <div className="text-2xl font-extrabold tracking-tight">Display Heading (24px, ExtraBold)</div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">text-2xl font-extrabold tracking-tight</div>
        </div>
        <div className="border-b pb-3 dark:border-slate-800">
          <div className="text-xl font-bold tracking-tight">Section Heading (20px, Bold)</div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">text-xl font-bold tracking-tight</div>
        </div>
        <div className="border-b pb-3 dark:border-slate-800">
          <div className="text-base font-semibold">Subsection / Card Header (16px, Semibold)</div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">text-base font-semibold</div>
        </div>
        <div className="border-b pb-3 dark:border-slate-800">
          <div className="text-sm font-normal leading-relaxed">Regular Body Text (14px, 1.5 line-height) - Used for primary reading context, chat transcripts, and descriptions.</div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">text-sm leading-relaxed</div>
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500">Caption & Metadata (12px, Medium) - Used for secondary stamps, badges, and ledger hints.</div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">text-xs font-medium</div>
        </div>
      </div>
    </section>
  );
};

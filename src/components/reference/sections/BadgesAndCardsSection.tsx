import React from 'react';
import { BadgeCheck, CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';

interface Props {
  isDark?: boolean;
}

export const BadgesAndCardsSection: React.FC<Props> = ({ isDark }) => {
  return (
    <section id="badges" className={`p-6 rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <BadgeCheck className="w-5 h-5 text-[#5A4AD2]" />
        <h2 className="text-lg font-bold">Badges, Pills & Surface Cards</h2>
      </div>
      <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Status indicator pills and modular surface container components.
      </p>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Status Badges</h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 className="w-3 h-3" />
              <span>Delivered</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              <BadgeCheck className="w-3 h-3" />
              <span>Read</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <Clock className="w-3 h-3" />
              <span>Queued / Scheduled</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              <XCircle className="w-3 h-3" />
              <span>Failed</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
              <AlertTriangle className="w-3 h-3" />
              <span>Excluded</span>
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Surface Card Container</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-xs font-bold mb-1">Standard Surface Card</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                12-16px border-radius with crisp 1px border matching theme contrast limits.
              </p>
            </div>
            <div className={`p-4 rounded-xl border-l-4 border-l-[#5A4AD2] border ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-xs font-bold mb-1">Accent Strip Card</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Used for urgent pipeline notifications, pinned clinical warnings, and broadcast alerts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { ShieldAlert, Loader2, Inbox, Lock, RefreshCw } from 'lucide-react';

interface Props {
  isDark?: boolean;
}

export const SystemStatesSection: React.FC<Props> = ({ isDark }) => {
  return (
    <section id="states" className={`p-6 rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-5 h-5 text-[#5A4AD2]" />
        <h2 className="text-lg font-bold">System States (Empty, Loading, Error, Permission)</h2>
      </div>
      <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Canonical fallback and boundary states required across all modules.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Empty State */}
        <div className={`p-6 rounded-xl border text-center ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 text-slate-500">
            <Inbox className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold mb-1">No Records Found</div>
          <p className="text-[11px] text-slate-400">Try adjusting your filters or search terms.</p>
        </div>

        {/* Loading State */}
        <div className={`p-6 rounded-xl border text-center ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-950/60 flex items-center justify-center mx-auto mb-2 text-[#5A4AD2]">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div className="text-xs font-bold mb-1">Loading Analytics...</div>
          <p className="text-[11px] text-slate-400">Aggregating WhatsApp delivery records.</p>
        </div>

        {/* Error State */}
        <div className={`p-6 rounded-xl border text-center ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center mx-auto mb-2 text-rose-600">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold mb-1">Unable to Load Data</div>
          <p className="text-[11px] text-slate-400">Network connection interrupted. Retry.</p>
        </div>

        {/* Permission State */}
        <div className={`p-6 rounded-xl border text-center ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center mx-auto mb-2 text-amber-600">
            <Lock className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold mb-1">Access Restricted</div>
          <p className="text-[11px] text-slate-400">Only Administrator role may view analytics.</p>
        </div>
      </div>
    </section>
  );
};

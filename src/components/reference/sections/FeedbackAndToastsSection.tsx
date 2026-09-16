import React from 'react';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Props {
  isDark?: boolean;
}

export const FeedbackAndToastsSection: React.FC<Props> = ({ isDark }) => {
  return (
    <section id="feedback" className={`p-6 rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-[#5A4AD2]" />
        <h2 className="text-lg font-bold">Feedback Alerts & Toast Notifications</h2>
      </div>
      <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Standard toast notifications and inline banner feedback mechanisms.
      </p>

      <div className="space-y-3 max-w-2xl">
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span><strong>Success:</strong> Campaign "Q4 Wellness Advisory" successfully dispatched to 420 recipients.</span>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span><strong>Error:</strong> Failed to connect to WhatsApp provider channel. Check inbox credentials.</span>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-xs">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span><strong>Information:</strong> Template synchronized with Meta Cloud API provider.</span>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { DailyOutcomeItem } from './types';

interface RecipientOutcomesChartProps {
  data: DailyOutcomeItem[];
  isDark?: boolean;
}

export const RecipientOutcomesChart: React.FC<RecipientOutcomesChartProps> = ({
  data,
  isDark
}) => {
  const maxSent = Math.max(...data.map(d => d.sent), 100);

  return (
    <div className={`p-4 rounded-xl border flex flex-col justify-between ${
      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
    }`}>
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recipient Outcomes Over Time
          </h2>
          <span className="text-[10px] text-slate-400 font-mono">Daily Trend (Last 7 Days)</span>
        </div>
        <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Volume of outbound dispatched messages vs successfully read outcomes.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {data.map((item) => {
          const sentPct = Math.round((item.sent / maxSent) * 100);
          const readPct = Math.round((item.read / maxSent) * 100);

          return (
            <div key={item.date} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300 font-mono">{item.date}</span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{item.sent} sent</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{item.read} read</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${readPct}%` }} 
                  className="bg-blue-500 h-full rounded-l-full" 
                  title={`Read: ${item.read}`}
                />
                <div 
                  style={{ width: `${Math.max(0, sentPct - readPct)}%` }} 
                  className="bg-indigo-300 dark:bg-indigo-700 h-full rounded-r-full" 
                  title={`Sent: ${item.sent}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
          <span>Sent Outbound</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>Read by Contact</span>
        </div>
      </div>
    </div>
  );
};

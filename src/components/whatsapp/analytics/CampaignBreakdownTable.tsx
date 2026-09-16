import React from 'react';
import { CampaignBreakdownItem } from './types';

interface CampaignBreakdownTableProps {
  campaigns: CampaignBreakdownItem[];
  selectedCampaignId: string;
  onSelectCampaign: (id: string) => void;
  isDark?: boolean;
}

export const CampaignBreakdownTable: React.FC<CampaignBreakdownTableProps> = ({
  campaigns,
  selectedCampaignId,
  onSelectCampaign,
  isDark
}) => {
  return (
    <div className={`p-4 rounded-xl border flex flex-col justify-between ${
      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
    }`}>
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Campaign Performance
          </h2>
          <span className="text-[10px] text-slate-400 font-mono">By Broadcast</span>
        </div>
        <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Select any campaign to isolate recipient ledger outcomes.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className={`border-b ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
            <tr>
              <th className="pb-2 font-bold">Campaign</th>
              <th className="pb-2 font-bold text-right">Sent</th>
              <th className="pb-2 font-bold text-right">Delivered</th>
              <th className="pb-2 font-bold text-right">Read</th>
              <th className="pb-2 font-bold text-right">Failed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {campaigns.map((c) => {
              const isSelected = selectedCampaignId === c.campaignId;
              return (
                <tr
                  key={c.campaignId}
                  onClick={() => onSelectCampaign(isSelected ? 'all' : c.campaignId)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? isDark ? 'bg-violet-950/40 text-violet-200 font-semibold' : 'bg-violet-50 text-[#5A4AD2] font-semibold'
                      : isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 pr-2">
                    <div className="font-bold truncate max-w-[180px]">{c.title}</div>
                    <div className="text-[10px] text-slate-400">{c.inbox}</div>
                  </td>
                  <td className="py-2.5 text-right font-mono">{c.metrics.sent}</td>
                  <td className="py-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400">{c.metrics.delivered}</td>
                  <td className="py-2.5 text-right font-mono text-blue-600 dark:text-blue-400">{c.metrics.read}</td>
                  <td className="py-2.5 text-right font-mono text-rose-600 dark:text-rose-400">{c.metrics.failed}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        Click any row above to filter the recipient ledger below.
      </div>
    </div>
  );
};

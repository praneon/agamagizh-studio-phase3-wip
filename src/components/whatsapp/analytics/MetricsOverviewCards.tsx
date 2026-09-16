import React from 'react';
import { 
  Send, 
  CheckCheck, 
  Eye, 
  MessageSquare, 
  AlertCircle, 
  ShieldAlert 
} from 'lucide-react';
import { CanonicalMetrics, CanonicalRecipientStatus } from './types';

interface MetricsOverviewCardsProps {
  metrics: CanonicalMetrics;
  selectedStatus: CanonicalRecipientStatus | 'all';
  onSelectStatus: (status: CanonicalRecipientStatus | 'all') => void;
  isDark?: boolean;
}

export const MetricsOverviewCards: React.FC<MetricsOverviewCardsProps> = ({
  metrics,
  selectedStatus,
  onSelectStatus,
  isDark
}) => {
  const cards: Array<{
    status: CanonicalRecipientStatus;
    label: string;
    count: number;
    pct?: string;
    icon: React.ElementType;
    color: string;
    bgHover: string;
    activeBorder: string;
  }> = [
    {
      status: 'sent',
      label: 'Sent',
      count: metrics.sent,
      icon: Send,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgHover: isDark ? 'hover:bg-slate-800/80' : 'hover:bg-indigo-50/50',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/20'
    },
    {
      status: 'delivered',
      label: 'Delivered',
      count: metrics.delivered,
      pct: metrics.sent > 0 ? `${Math.round((metrics.delivered / metrics.sent) * 100)}%` : '0%',
      icon: CheckCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgHover: isDark ? 'hover:bg-slate-800/80' : 'hover:bg-emerald-50/50',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20'
    },
    {
      status: 'read',
      label: 'Read',
      count: metrics.read,
      pct: metrics.delivered > 0 ? `${Math.round((metrics.read / metrics.delivered) * 100)}%` : '0%',
      icon: Eye,
      color: 'text-blue-600 dark:text-blue-400',
      bgHover: isDark ? 'hover:bg-slate-800/80' : 'hover:bg-blue-50/50',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/20'
    },
    {
      status: 'replied',
      label: 'Replied',
      count: metrics.replied,
      pct: metrics.read > 0 ? `${Math.round((metrics.replied / metrics.read) * 100)}%` : '0%',
      icon: MessageSquare,
      color: 'text-[#5A4AD2] dark:text-violet-400',
      bgHover: isDark ? 'hover:bg-slate-800/80' : 'hover:bg-violet-50/50',
      activeBorder: 'border-[#5A4AD2] ring-2 ring-violet-500/20'
    },
    {
      status: 'failed',
      label: 'Failed',
      count: metrics.failed,
      pct: metrics.sent > 0 ? `${Math.round((metrics.failed / metrics.sent) * 100)}%` : '0%',
      icon: AlertCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bgHover: isDark ? 'hover:bg-slate-800/80' : 'hover:bg-rose-50/50',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/20'
    },
    {
      status: 'excluded',
      label: 'Excluded (Safety)',
      count: metrics.excluded,
      icon: ShieldAlert,
      color: 'text-amber-600 dark:text-amber-400',
      bgHover: isDark ? 'hover:bg-slate-800/80' : 'hover:bg-amber-50/50',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = selectedStatus === c.status;
        return (
          <button
            key={c.status}
            type="button"
            onClick={() => onSelectStatus(c.status)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              isSelected
                ? `${c.activeBorder} ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`
                : `${c.bgHover} ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {c.label}
              </span>
              <Icon className={`w-4 h-4 ${c.color}`} />
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold tracking-tight">
                {c.count.toLocaleString()}
              </span>
              {c.pct && (
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  {c.pct}
                </span>
              )}
            </div>

            <div className="mt-1">
              <span className="text-[10px] text-slate-400 underline">
                {isSelected ? 'Click to reset' : 'Drilldown ledger →'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

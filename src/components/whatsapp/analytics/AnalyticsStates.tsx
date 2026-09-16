import React from 'react';
import { 
  Loader2, 
  AlertTriangle, 
  ShieldAlert, 
  Inbox, 
  RotateCcw,
  RefreshCw
} from 'lucide-react';

interface BaseStateProps {
  isDark?: boolean;
}

export const AnalyticsLoadingSkeleton: React.FC<BaseStateProps> = ({ isDark }) => {
  return (
    <div className={`p-8 rounded-xl border text-center space-y-4 ${
      isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-950/60 flex items-center justify-center mx-auto text-[#5A4AD2]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <div>
        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Loading Delivery Analytics...
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Querying WhatsApp Cloud API carrier delivery receipts and recipient statuses.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 max-w-4xl mx-auto pt-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
        ))}
      </div>
    </div>
  );
};

export const AnalyticsErrorState: React.FC<BaseStateProps & { onRetry: () => void }> = ({
  isDark,
  onRetry
}) => {
  return (
    <div className={`p-8 rounded-xl border text-center space-y-3 ${
      isDark ? 'bg-rose-950/20 border-rose-900/40' : 'bg-rose-50 border-rose-200'
    }`}>
      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 flex items-center justify-center mx-auto text-rose-600">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div>
        <div className="text-sm font-bold text-rose-900 dark:text-rose-200">
          Analytics Pipeline Temporarily Unavailable
        </div>
        <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto mt-1">
          Failed to aggregate carrier ledger records from the WhatsApp Cloud API provider.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Retry Aggregation</span>
      </button>
    </div>
  );
};

export const AnalyticsPermissionState: React.FC<BaseStateProps> = ({ isDark }) => {
  return (
    <div className={`p-12 rounded-xl border text-center space-y-3 ${
      isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center mx-auto text-amber-600">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <div>
        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Permission Required: WhatsApp Operations Analytics
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
          Your active staff role does not hold permission to inspect broadcast delivery ledgers and patient response metrics.
        </p>
      </div>
    </div>
  );
};

export const AnalyticsEmptyState: React.FC<BaseStateProps & { onResetFilters: () => void }> = ({
  isDark,
  onResetFilters
}) => {
  return (
    <div className={`p-12 rounded-xl border text-center space-y-3 ${
      isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
        <Inbox className="w-6 h-6" />
      </div>
      <div>
        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
          No Broadcast Data in Selected Range
        </div>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          There are no campaign dispatches or recipient deliveries recorded matching the active filters.
        </p>
      </div>
      <button
        type="button"
        onClick={onResetFilters}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5A4AD2] hover:bg-[#4B3DB5] text-white text-xs font-bold"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Filter Criteria</span>
      </button>
    </div>
  );
};

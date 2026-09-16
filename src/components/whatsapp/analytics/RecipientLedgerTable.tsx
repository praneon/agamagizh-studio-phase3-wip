import React from 'react';
import { 
  Search, 
  X, 
  Eye, 
  CheckCheck, 
  MessageSquare, 
  AlertCircle, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { RecipientLedgerItem, CanonicalRecipientStatus } from './types';

interface RecipientLedgerTableProps {
  recipients: RecipientLedgerItem[];
  selectedStatus: CanonicalRecipientStatus | 'all';
  onSelectStatus: (status: CanonicalRecipientStatus | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewDetails: (recipient: RecipientLedgerItem) => void;
  onClearFilters: () => void;
  isDark?: boolean;
}

export const RecipientLedgerTable: React.FC<RecipientLedgerTableProps> = ({
  recipients,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
  onViewDetails,
  onClearFilters,
  isDark
}) => {
  const getStatusBadge = (status: CanonicalRecipientStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCheck className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      case 'read':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <Eye className="w-3 h-3" />
            <span>Read</span>
          </span>
        );
      case 'replied':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300">
            <MessageSquare className="w-3 h-3" />
            <span>Replied</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            <AlertCircle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
      case 'excluded':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <ShieldAlert className="w-3 h-3" />
            <span>Excluded</span>
          </span>
        );
      case 'sent':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            <span>Sent</span>
          </span>
        );
    }
  };

  return (
    <div className={`p-4 rounded-xl border space-y-4 ${
      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
    }`}>
      {/* Ledger Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recipient Delivery Ledger
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {recipients.length} records
            </span>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Per-recipient delivery timestamps, exclusion reasons, and conversation audit links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search recipient or phone..."
              className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Ledger Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-xs text-left">
          <thead className={`border-b ${isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <tr>
              <th className="px-3 py-2.5 font-bold">Recipient</th>
              <th className="px-3 py-2.5 font-bold">Campaign / Inbox</th>
              <th className="px-3 py-2.5 font-bold">Delivery Status</th>
              <th className="px-3 py-2.5 font-bold">Lifecycle Time</th>
              <th className="px-3 py-2.5 font-bold">Detail Note</th>
              <th className="px-3 py-2.5 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {recipients.map((rec) => (
              <tr
                key={rec.id}
                onClick={() => onViewDetails(rec)}
                className={`cursor-pointer transition-colors ${
                  isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                }`}
              >
                <td className="px-3 py-2.5">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{rec.contactName}</div>
                  <div className="font-mono text-[11px] text-slate-500">{rec.destination}</div>
                </td>
                <td className="px-3 py-2.5 max-w-[200px]">
                  <div className="truncate font-medium">{rec.campaignName}</div>
                  <div className="text-[10px] text-slate-400">{rec.inbox}</div>
                </td>
                <td className="px-3 py-2.5">
                  {getStatusBadge(rec.status)}
                </td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-slate-400">
                  {rec.lifecycleTime}
                </td>
                <td className="px-3 py-2.5 max-w-[220px]">
                  {rec.reason ? (
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 truncate block">
                      {rec.reason}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Standard delivery</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(rec);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5A4AD2] hover:underline"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {recipients.length === 0 && (
        <div className={`p-8 text-center rounded-xl border ${
          isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            No Recipients Match Selected Filters
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Try resetting your status drilldown or search terms.
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-3 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#5A4AD2] text-white hover:bg-[#4B3DB5]"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

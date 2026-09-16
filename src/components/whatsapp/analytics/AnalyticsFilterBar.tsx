import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Calendar, 
  RefreshCw 
} from 'lucide-react';
import { DateRangePreset } from './types';

interface AnalyticsFilterBarProps {
  campaigns: Array<{ id: string; name: string }>;
  inboxes: Array<{ id: string; name: string }>;
  selectedCampaignId: string;
  onSelectCampaign: (id: string) => void;
  selectedInbox: string;
  onSelectInbox: (inbox: string) => void;
  dateRange: DateRangePreset;
  onSelectDateRange: (range: DateRangePreset) => void;
  customStartDate: string;
  onCustomStartDateChange: (val: string) => void;
  customEndDate: string;
  onCustomEndDateChange: (val: string) => void;
  onResetAllFilters: () => void;
  onRefresh: () => void;
  isDark?: boolean;
}

export const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({
  campaigns,
  inboxes,
  selectedCampaignId,
  onSelectCampaign,
  selectedInbox,
  onSelectInbox,
  dateRange,
  onSelectDateRange,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
  onResetAllFilters,
  onRefresh,
  isDark
}) => {
  return (
    <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
    }`}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Filter className="w-3.5 h-3.5 text-[#5A4AD2]" />
          <span>Filters:</span>
        </div>

        {/* Campaign Select */}
        <select
          value={selectedCampaignId}
          onChange={(e) => onSelectCampaign(e.target.value)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          {campaigns.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Inbox Select */}
        <select
          value={selectedInbox}
          onChange={(e) => onSelectInbox(e.target.value)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          {inboxes.map(i => (
            <option key={i.id} value={i.id}>{i.name}</option>
          ))}
        </select>

        {/* Date Range Select */}
        <select
          value={dateRange}
          onChange={(e) => onSelectDateRange(e.target.value as DateRangePreset)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <option value="last_7_days">Last 7 Days</option>
          <option value="last_30_days">Last 30 Days</option>
          <option value="this_month">This Month</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="custom">Custom Range</option>
        </select>

        {dateRange === 'custom' && (
          <div className="flex items-center gap-1.5 text-xs">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => onCustomStartDateChange(e.target.value)}
              className={`px-2 py-1 rounded border text-xs ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
              }`}
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => onCustomEndDateChange(e.target.value)}
              className={`px-2 py-1 rounded border text-xs ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 self-end md:self-center">
        <button
          type="button"
          onClick={onRefresh}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
            isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
          }`}
          title="Refresh Data"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#5A4AD2]" />
          <span>Refresh</span>
        </button>

        <button
          type="button"
          onClick={onResetAllFilters}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors ${
            isDark ? 'border-slate-800 hover:bg-slate-800 dark:hover:text-slate-200' : 'border-slate-200 hover:bg-slate-100'
          }`}
          title="Reset Filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

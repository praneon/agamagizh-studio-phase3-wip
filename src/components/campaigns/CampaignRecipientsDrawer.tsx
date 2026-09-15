import React, { useState, useEffect } from 'react';
import { X, Search, Filter, AlertTriangle, CheckCircle2, Eye, ShieldAlert, Phone } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { BackendCampaignRecipient } from '../../types/crm';

interface CampaignRecipientsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId?: number | string;
  campaignTitle: string;
  statusFilter?: string;
}

export const CampaignRecipientsDrawer: React.FC<CampaignRecipientsDrawerProps> = ({
  isOpen,
  onClose,
  campaignId = 1,
  campaignTitle,
  statusFilter
}) => {
  const { provider } = useCrm();
  const [activeFilter, setActiveFilter] = useState<string>(statusFilter || 'all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [recipients, setRecipients] = useState<BackendCampaignRecipient[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    const fetchRecipients = async () => {
      setIsLoading(true);
      try {
        const res = await provider.getCampaignRecipients(campaignId, {
          status: activeFilter === 'all' ? undefined : activeFilter,
          page,
          perPage: 50,
        });
        if (mounted) {
          setRecipients(res.recipients);
          setTotalCount(res.meta.total);
        }
      } catch (err) {
        console.error('Failed to load campaign recipients:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchRecipients();
    return () => {
      mounted = false;
    };
  }, [isOpen, campaignId, activeFilter, page, provider]);

  if (!isOpen) return null;

  const filtered = recipients.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const phone = r.phone_number || '';
      const status = r.status.toLowerCase();
      const err = (r.error_message || '').toLowerCase();
      return phone.includes(q) || status.includes(q) || err.includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#5A4AD2]">
                Canonical Recipient Records
              </span>
              <h2 className="text-base font-extrabold text-slate-900 truncate max-w-sm">
                {campaignTitle}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
            {(['all', 'read', 'delivered', 'failed', 'excluded'] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  setActiveFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-colors ${
                  activeFilter === st
                    ? 'bg-white text-[#5A4AD2] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search recipient phone or status..."
              className="w-full text-xs pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white"
            />
          </div>

          {/* Recipient Records List */}
          <div className="space-y-2.5">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Loading recipient records...
              </div>
            ) : paginated.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No recipient records found for this filter.
              </div>
            ) : (
              paginated.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Recipient #{rec.id} {rec.contact_id ? `(Contact #${rec.contact_id})` : ''}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      rec.status === 'read'
                        ? 'bg-purple-100 text-[#5A4AD2]'
                        : rec.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rec.status === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono">{rec.phone_number || 'N/A'}</span>
                    <span>Lifecycle: {rec.read_at ? 'Read' : rec.delivered_at ? 'Delivered' : rec.sent_at ? 'Sent' : 'Queued'}</span>
                  </div>

                  {rec.error_message && (
                    <div className="p-2 bg-red-50 text-red-700 rounded-lg text-[11px] flex items-start gap-1.5 border border-red-100">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{rec.error_message}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Page {page} of {totalPages} ({filtered.length} records)</span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 font-semibold"
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

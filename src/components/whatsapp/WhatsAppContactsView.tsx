import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  Phone, 
  MessageSquare, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Send,
  Building2,
  Calendar
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { CrmContactSummary, CrmContactDetail, UpdateConsentPayload } from '../../types/crm';
import { Contact } from '../../types';

interface WhatsAppContactsViewProps {
  onOpenConversationWithContact: (contact: Contact) => void;
}

export const WhatsAppContactsView: React.FC<WhatsAppContactsViewProps> = ({
  onOpenConversationWithContact
}) => {
  const { provider } = useCrm();
  const [contacts, setContacts] = useState<CrmContactSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [consentFilter, setConsentFilter] = useState<'all' | 'opted_in' | 'opted_out' | 'unconfirmed'>('all');
  
  // Selected contact detail for right drawer
  const [selectedContactId, setSelectedContactId] = useState<number | string | null>(null);
  const [contactDetail, setContactDetail] = useState<CrmContactDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isUpdatingConsent, setIsUpdatingConsent] = useState(false);

  // Load contacts list
  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const res = await provider.getContacts({ q: search || undefined, perPage: 50 });
      setContacts(res.contacts || []);
    } catch (err) {
      console.error('Failed to load WhatsApp contacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [provider]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadContacts();
  };

  // Load selected contact detail
  useEffect(() => {
    if (!selectedContactId) {
      setContactDetail(null);
      return;
    }

    let mounted = true;
    setIsLoadingDetail(true);
    provider.getContact(selectedContactId)
      .then(detail => {
        if (mounted) setContactDetail(detail);
      })
      .catch(err => {
        console.error('Failed to load contact detail:', err);
      })
      .finally(() => {
        if (mounted) setIsLoadingDetail(false);
      });

    return () => { mounted = false; };
  }, [selectedContactId, provider]);

  // Update consent
  const handleUpdateConsent = async (purpose: 'marketing' | 'transactional' | 'appointment_reminders', newStatus: 'opted_in' | 'opted_out') => {
    if (!selectedContactId || !contactDetail) return;
    setIsUpdatingConsent(true);
    try {
      const updated = await provider.updateContactConsent(selectedContactId, {
        purpose,
        status: newStatus,
        source: 'Studio Consent Manager UI',
      });
      setContactDetail(updated);
    } catch (err) {
      console.error('Failed to update consent:', err);
    } finally {
      setIsUpdatingConsent(false);
    }
  };

  const filteredContacts = contacts.filter(c => {
    if (consentFilter !== 'all') {
      const status = c.consent_status || 'unconfirmed';
      if (status !== consentFilter) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (c.name || '').toLowerCase().includes(q) ||
        (c.phone_number || '').includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">WhatsApp Contacts & Consent</h1>
          <p className="text-xs text-[#6E737F]">
            Directory of verified WhatsApp identities, explicit channel consent records, and communication histories.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#E3E5E9] shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone (+91...)"
            className="w-full text-xs pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#5A4AD2] focus:bg-white text-slate-800"
          />
        </form>

        {/* Consent Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          {[
            { id: 'all' as const, label: 'All Contacts' },
            { id: 'opted_in' as const, label: 'Marketing Opted In' },
            { id: 'unconfirmed' as const, label: 'Unconfirmed' },
            { id: 'opted_out' as const, label: 'Opted Out' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setConsentFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors text-[11px] ${
                consentFilter === tab.id
                  ? 'bg-white text-[#5A4AD2] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts List Table */}
      <div className="bg-white rounded-2xl border border-[#E3E5E9] overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-[#5A4AD2] border-t-transparent rounded-full animate-spin mx-auto" />
            <span>Loading WhatsApp directory...</span>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-1">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No WhatsApp contacts found</p>
            <p className="text-[11px] text-slate-400">Try adjusting your search query or consent filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E3E5E9] bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">WhatsApp Phone</th>
                  <th className="py-3 px-4">Consent Status</th>
                  <th className="py-3 px-4">Labels</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E5E9]">
                {filteredContacts.map(c => {
                  const consentBadge = c.consent_status === 'opted_in' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      Opted In
                    </span>
                  ) : c.consent_status === 'opted_out' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-50 text-red-700 border border-red-200">
                      <ShieldAlert className="w-3 h-3" />
                      Opted Out
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                      Unconfirmed
                    </span>
                  );

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedContactId(c.id)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#5A4AD2]/10 text-[#5A4AD2] font-bold flex items-center justify-center shrink-0">
                            {(c.name || 'P').charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{c.name || 'Unnamed Contact'}</span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {c.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {c.phone_number || 'No Phone'}
                      </td>
                      <td className="py-3 px-4">
                        {consentBadge}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(c.labels || []).slice(0, 3).map((lbl, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                              {lbl}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            onOpenConversationWithContact({
                              id: String(c.id),
                              name: c.name || 'Contact',
                              phone: c.phone_number || '',
                              email: '',
                              channel: 'whatsapp',
                              status: 'active',
                              labels: c.labels || [],
                              conversationsCount: 1,
                              lastActivity: 'Today',
                              customAttributes: (c.custom_attributes as any) || {},
                            });
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#EEECFB] text-[#5A4AD2] hover:bg-[#5A4AD2] hover:text-white rounded-lg text-xs font-bold transition-colors"
                          title="Open WhatsApp Chat"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Contact Drawer with Real Consent Management */}
      {selectedContactId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end">
          <div className="w-full sm:max-w-lg bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#5A4AD2] text-white font-extrabold text-lg flex items-center justify-center">
                    {(contactDetail?.name || 'P').charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">{contactDetail?.name || 'Patient Contact'}</h2>
                    <span className="text-xs font-mono text-slate-500">{contactDetail?.phone_number || 'No Phone'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedContactId(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Action Button */}
              <button
                type="button"
                onClick={() => {
                  if (contactDetail) {
                    onOpenConversationWithContact({
                      id: String(contactDetail.id),
                      name: contactDetail.name || 'Contact',
                      phone: contactDetail.phone_number || '',
                      email: '',
                      channel: 'whatsapp',
                      status: 'active',
                      labels: contactDetail.labels?.map(l => l.title) || [],
                      conversationsCount: 1,
                      lastActivity: 'Today',
                      customAttributes: (contactDetail.custom_attributes as any) || {},
                    });
                    setSelectedContactId(null);
                  }
                }}
                className="w-full py-2.5 bg-[#5A4AD2] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#4C3DC2] shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Active WhatsApp Chat</span>
              </button>

              {isLoadingDetail ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading complete profile & consent ledger...</div>
              ) : (
                <div className="space-y-5 text-xs">
                  {/* Real ContactChannelConsent Section */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#5A4AD2]" />
                        <h4 className="font-extrabold text-slate-900 uppercase tracking-wide text-[11px]">
                          Contact Channel Consent
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-400">Audit Ledger</span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Explicit consent records governed by Telecommunication and Privacy mandates. Consent cannot be inferred from conversation existence.
                    </p>

                    {/* Consents list */}
                    <div className="space-y-2.5">
                      {[
                        { purpose: 'marketing' as const, label: 'Marketing & Promotional Broadcasts' },
                        { purpose: 'transactional' as const, label: 'Transactional & Account Notices' },
                        { purpose: 'appointment_reminders' as const, label: 'Intake & Clinic Reminders' },
                      ].map(item => {
                        const record = contactDetail?.consents?.find(c => c.purpose === item.purpose);
                        const isOptedIn = record?.status === 'opted_in';

                        return (
                          <div
                            key={item.purpose}
                            className="p-3 bg-white rounded-xl border border-slate-200/70 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800">{item.label}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                isOptedIn ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {record?.status || 'unconfirmed'}
                              </span>
                            </div>

                            {record?.source && (
                              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                                <span>Evidence: <strong className="text-slate-600">{record.source}</strong></span>
                                {record.captured_at && (
                                  <span>{new Date(record.captured_at).toLocaleDateString()}</span>
                                )}
                              </div>
                            )}

                            {/* Toggle Consent */}
                            <div className="pt-1 flex items-center gap-2">
                              <button
                                type="button"
                                disabled={isUpdatingConsent}
                                onClick={() => handleUpdateConsent(item.purpose, isOptedIn ? 'opted_out' : 'opted_in')}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                                  isOptedIn
                                    ? 'border-red-200 text-red-700 hover:bg-red-50'
                                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                }`}
                              >
                                {isOptedIn ? 'Revoke Consent' : 'Grant Explicit Opt-In'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* WhatsApp Broadcast Delivery Records */}
                  {contactDetail?.campaigns && contactDetail.campaigns.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-900 uppercase tracking-wide text-[11px]">
                        Campaign Delivery Records
                      </h4>
                      <div className="space-y-2">
                        {contactDetail.campaigns.map(camp => (
                          <div key={camp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-slate-900">{camp.campaign_title}</div>
                              <div className="text-[10px] text-slate-400">
                                {camp.delivered_at ? `Delivered ${new Date(camp.delivered_at).toLocaleDateString()}` : 'Queued'}
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-blue-800">
                              {camp.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active Clinic Pipeline Cards */}
                  {contactDetail?.pipeline && contactDetail.pipeline.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-900 uppercase tracking-wide text-[11px]">
                        Clinic Intake Pipeline
                      </h4>
                      <div className="space-y-2">
                        {contactDetail.pipeline.map(pipe => (
                          <div key={pipe.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{pipe.pipeline}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEECFB] text-[#5A4AD2]">
                                {pipe.stage}
                              </span>
                            </div>
                            {pipe.appointment_at && (
                              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{new Date(pipe.appointment_at).toLocaleDateString()} ({pipe.appointment_mode})</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedContactId(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

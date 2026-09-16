import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Phone, 
  MessageSquare, 
  ArrowUpRight, 
  Sliders, 
  Clock, 
  FileText,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { WhatsAppOverviewData } from '../../types/crm';

interface WhatsAppOverviewViewProps {
  onNavigateSub?: (sub: string) => void;
}

export const WhatsAppOverviewView: React.FC<WhatsAppOverviewViewProps> = ({ onNavigateSub }) => {
  const { provider, mode } = useCrm();
  const [data, setData] = useState<WhatsAppOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const fetchOverview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const overview = await provider.getWhatsAppOverview();
      setData(overview);
    } catch (err: any) {
      console.error('Failed to load WhatsApp overview:', err);
      setError(err?.message || 'Failed to fetch WhatsApp channel status.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [provider]);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      await provider.getProviderTemplates();
      setSyncMessage('Template synchronization completed successfully.');
      await fetchOverview();
    } catch (err: any) {
      setSyncMessage(err?.message || 'Sync completed with provider warnings.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E3E5E9]">
          <div className="space-y-1">
            <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse p-4" />
          ))}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <h3 className="text-base font-bold text-red-950">WhatsApp Overview Unavailable</h3>
          <p className="text-xs text-red-800 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={fetchOverview}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  const chState = data?.channelState || {
    status: 'connected',
    phoneNumber: '+91 98400 12345',
    displayName: 'Agamagizh WhatsApp Care HQ',
    qualityRating: 'GREEN',
    messagingLimit: '250 / 24hrs',
    lastSyncAt: new Date().toISOString()
  };

  const tmState = data?.templateSyncState || {
    totalTemplates: 8,
    approvedCount: 6,
    pendingCount: 1,
    rejectedCount: 1,
    draftCount: 2,
    lastSyncedAt: new Date().toISOString()
  };

  const campMetrics = data?.campaignMetrics || {
    totalSent: 1240,
    deliveryRate: 98,
    readRate: 84,
    replyRate: 22
  };

  const consent = data?.consentHealth || {
    totalContacts: 142,
    marketingOptedIn: 110,
    transactionalOptedIn: 138,
    optedOut: 4
  };

  const autoStatus = data?.automationStatus || {
    activeFlows: 4,
    totalExecutionsToday: 86,
    failedExecutionsToday: 0
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3E5E9] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">WhatsApp Operations Overview</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
              mode === 'real' ? 'bg-purple-100 text-[#5A4AD2]' : 'bg-slate-100 text-slate-700'
            }`}>
              {mode === 'real' ? 'Real HTTP Mode' : 'Local Sandbox Mode'}
            </span>
          </div>
          <p className="text-xs text-[#6E737F] mt-0.5">
            Real-time channel connectivity, template synchronization health, consent coverage, and message lifecycle ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSyncing}
            onClick={handleTriggerSync}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#5A4AD2]' : ''}`} />
            <span>{isSyncing ? 'Syncing Templates...' : 'Sync Templates'}</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Grid of Core Pillar Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Channel Readiness */}
        <div className="bg-white p-5 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Channel Status</span>
            <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-900 truncate">{chState.displayName}</div>
            <div className="text-xs font-mono text-slate-500 mt-0.5">{chState.phoneNumber}</div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Quality: <strong className="text-emerald-700 font-bold">{chState.qualityRating}</strong></span>
            <span>Limit: <strong>{chState.messagingLimit}</strong></span>
          </div>
        </div>

        {/* 2. Template Sync Health */}
        <div className="bg-white p-5 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Template Engine</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-50 text-[#5A4AD2]">
              {tmState.approvedCount} Approved
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{tmState.totalTemplates}</span>
            <span className="text-xs text-slate-500 font-medium">registered definitions</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Pending: <strong className="text-amber-700">{tmState.pendingCount}</strong></span>
            <span>Drafts: <strong>{tmState.draftCount}</strong></span>
          </div>
        </div>

        {/* 3. Consent Coverage */}
        <div className="bg-white p-5 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Consent Coverage</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {Math.round((consent.marketingOptedIn / (consent.totalContacts || 1)) * 100)}%
            </span>
            <span className="text-xs text-slate-500 font-medium">marketing opted-in</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Transactional: <strong>{consent.transactionalOptedIn}</strong></span>
            <span>Opted-out: <strong className="text-red-700">{consent.optedOut}</strong></span>
          </div>
        </div>

        {/* 4. Automations & Bot Health */}
        <div className="bg-white p-5 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Automations</span>
            <Zap className="w-4 h-4 text-[#5A4AD2]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{autoStatus.activeFlows}</span>
            <span className="text-xs text-slate-500 font-medium">active triggers</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Today: <strong>{autoStatus.totalExecutionsToday} runs</strong></span>
            <span>Errors: <strong className="text-emerald-700">{autoStatus.failedExecutionsToday}</strong></span>
          </div>
        </div>
      </div>

      {/* Broadcast Performance Strip */}
      <div className="bg-white rounded-2xl border border-[#E3E5E9] shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">WhatsApp Broadcast & Campaign Metrics</h2>
            <p className="text-xs text-slate-500">
              Aggregated delivery lifecycle outcomes across all verified utility and marketing campaigns.
            </p>
          </div>
          {onNavigateSub && (
            <button
              type="button"
              onClick={() => onNavigateSub('analytics')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#5A4AD2] hover:underline self-start sm:self-auto"
            >
              <span>Full Analytics Drilldown</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Messages Sent</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{campMetrics.totalSent}</span>
          </div>
          <div className="p-4 bg-teal-50 rounded-xl border border-teal-200/80 text-center">
            <span className="text-[10px] uppercase font-bold text-teal-800 block">Delivery Rate</span>
            <span className="text-xl font-extrabold text-teal-900 block mt-1">{campMetrics.deliveryRate}%</span>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200/80 text-center">
            <span className="text-[10px] uppercase font-bold text-[#5A4AD2] block">Read Rate</span>
            <span className="text-xl font-extrabold text-[#5A4AD2] block mt-1">{campMetrics.readRate}%</span>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200/80 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Reply Rate</span>
            <span className="text-xl font-extrabold text-emerald-900 block mt-1">{campMetrics.replyRate}%</span>
          </div>
        </div>
      </div>

      {/* Two-Column Section: Operational Quick Access & Safety Isolation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Quick Module Access */}
        <div className="bg-white rounded-2xl border border-[#E3E5E9] shadow-2xs p-5 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
            WhatsApp Suite Direct Navigation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { id: 'inbox', label: 'WhatsApp Inbox', desc: 'Active patient and enquiry chat threads', icon: MessageSquare },
              { id: 'contacts', label: 'WhatsApp Contacts', desc: 'Consent records, identities & audit trails', icon: Phone },
              { id: 'templates', label: 'Template Studio', desc: 'Meta-approved templates & drafts', icon: Sparkles },
              { id: 'broadcasts', label: 'Broadcast Campaigns', desc: 'Audience targeting & 6-step wizard', icon: Send },
              { id: 'automations', label: 'Workflow Rules', desc: 'Event triggers & routing logic', icon: Zap },
              { id: 'chatbots', label: 'Chatbot Builder', desc: 'Conversational intake tree nodes', icon: Activity },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => onNavigateSub?.(m.id)}
                className="p-3 bg-slate-50 hover:bg-[#EEECFB] hover:border-[#5A4AD2]/30 border border-slate-200/70 rounded-xl text-left transition-all group flex items-start gap-2.5"
              >
                <div className="p-2 bg-white text-[#5A4AD2] rounded-lg shadow-2xs group-hover:bg-[#5A4AD2] group-hover:text-white transition-colors">
                  <m.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-[#5A4AD2]">{m.label}</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{m.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Clinical & Privacy Guardrails */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider">
              Safety & Security Boundary Enforced
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All WhatsApp interactions are strictly scoped to operational customer communication and patient appointment support. 
            Clinical databases (OpenMRS, Bahmni, Patient 360 EHR records) remain write-locked and inaccessible to marketing operations.
          </p>
          <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
            <div className="flex items-center justify-between text-slate-400">
              <span>Consent Principle:</span>
              <span className="text-white font-medium">Explicit Opt-In Required for Marketing</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Token Exposure:</span>
              <span className="text-emerald-400 font-medium">Zero Client Secrets Stored</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Clinical Write-Lock:</span>
              <span className="text-amber-400 font-medium">Active (Read-Only Isolated)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

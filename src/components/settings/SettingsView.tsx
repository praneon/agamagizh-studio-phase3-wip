import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Inbox, 
  Users, 
  Shield, 
  MessageSquare, 
  Globe, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Server,
  Lock,
  Plus, 
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { CrmInbox, CrmAgent, CrmTeam } from '../../types/crm';

export const SettingsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'crm' | 'inboxes' | 'agents' | 'teams' | 'canned'>('crm');

  const {
    provider,
    mode,
    setMode,
    baseUrl,
    setBaseUrl,
    accountContext,
    connection,
    clinicalWritesEnabled,
  } = useCrm();

  const [inboxes, setInboxes] = useState<CrmInbox[]>([]);
  const [agents, setAgents] = useState<CrmAgent[]>([]);
  const [teams, setTeams] = useState<CrmTeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadSettingsData = async () => {
      setIsLoading(true);
      try {
        const [ibData, agData, tmData] = await Promise.all([
          provider.getInboxes().catch(() => []),
          provider.getAgents().catch(() => []),
          provider.getTeams().catch(() => []),
        ]);
        if (mounted) {
          setInboxes(ibData);
          setAgents(agData);
          setTeams(tmData);
        }
      } catch (err) {
        console.error('Failed to load settings data:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadSettingsData();
    return () => {
      mounted = false;
    };
  }, [provider]);

  const cannedList = [
    { shortcode: '/greeting', content: 'Vanakkam! Welcome to Agamagizh Child Development Center. How can we support your family today?' },
    { shortcode: '/hours', content: 'Our center timings are Monday to Saturday from 08:30 AM to 07:30 PM.' },
    { shortcode: '/reschedule', content: 'To reschedule your scheduled intake session, please reply with your preferred weekday slot.' },
    { shortcode: '/address', content: 'Agamagizh Center is located at 14/2 Gandhi Nagar 2nd Main Road, Adyar, Chennai 600020.' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Console Workspace Settings</h1>
        <p className="text-xs text-[#6E737F]">
          Manage CRM data connectivity, tenant accounts, connected inboxes, team member permissions, and canned snippets.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E3E5E9] pb-2 text-xs font-bold overflow-x-auto">
        {[
          { id: 'crm' as const, label: 'CRM & Data Layer' },
          { id: 'inboxes' as const, label: 'Inboxes & Channels', count: inboxes.length },
          { id: 'agents' as const, label: 'Agents & Roles', count: agents.length },
          { id: 'teams' as const, label: 'Teams & Routing', count: teams.length },
          { id: 'canned' as const, label: 'Canned Responses', count: cannedList.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'bg-[#5A4AD2] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label} {tab.count !== undefined && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Tab 0: CRM & Data Layer (Safe Configuration Panel) */}
      {activeSubTab === 'crm' && (
        <div className="space-y-6 max-w-4xl">
          {/* Clinical Write-Lock Safety Notice Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wide">
                  Clinical Write-Lock Active ({clinicalWritesEnabled ? 'Unlocked' : 'Strictly Enforced'})
                </h4>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-extrabold rounded-full">
                  READ-ONLY CLINICAL
                </span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Hospital-platform clinical APIs, Bahmni writes, OpenMRS databases, and Patient 360 records are completely isolated and write-locked. 
                All operations performed in this Studio console are strictly scoped to operational WhatsApp communications and CRM customer support.
              </p>
            </div>
          </div>

          {/* CRM Connection Configuration Card */}
          <div className="bg-white rounded-2xl border border-[#E3E5E9] shadow-2xs p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">CRM Provider Mode</h3>
                <p className="text-xs text-slate-500">
                  Select between isolated local mock execution and direct connection to your local Chatwoot Rails backend.
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setMode('local')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'local'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Local Provider (Mock)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('real')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'real'
                      ? 'bg-[#5A4AD2] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Real CRM (Chatwoot HTTP)
                </button>
              </div>
            </div>

            {/* Backend URL & Health Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Backend Base URL</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="http://localhost:3000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#5A4AD2]"
                />
                <span className="text-[11px] text-slate-400">
                  Target Rails server address. Secrets/tokens remain server-side and are never stored in client code.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Connection Health</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {connection.status === 'healthy' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-slate-800 capitalize">
                        {connection.status === 'healthy' ? 'Connected & Healthy' : connection.status}
                      </span>
                      {connection.latencyMs > 0 && (
                        <span className="text-[11px] text-slate-500 block">
                          Response latency: {connection.latencyMs}ms
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => connection.checkNow()}
                    disabled={connection.isChecking}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                    title="Check Connection Now"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${connection.isChecking ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tenant Account Selection & Discovery */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Tenant Account Context</h4>
                  <p className="text-[11px] text-slate-500">
                    Dynamically retrieved from the CRM user session. No hardcoded account IDs.
                  </p>
                </div>
                {accountContext.activeAccount && (
                  <span className="px-2.5 py-1 bg-[#EEECFB] text-[#5A4AD2] font-mono font-bold text-xs rounded-lg">
                    Current ID: #{accountContext.activeAccount.id}
                  </span>
                )}
              </div>

              {accountContext.availableAccounts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {accountContext.availableAccounts.map((acc) => {
                    const isSelected = accountContext.activeAccount?.id === acc.id;
                    return (
                      <div
                        key={acc.id}
                        onClick={() => accountContext.switchAccount(acc.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#5A4AD2] bg-[#F4F3FD] ring-1 ring-[#5A4AD2]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 block">{acc.name}</span>
                          <span className="text-[11px] text-slate-500 capitalize">
                            Role: {acc.role} • Status: {acc.status}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#5A4AD2]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500">
                  {accountContext.isLoading ? 'Discovering tenant accounts...' : 'No accounts detected. Using fallback local context.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Inboxes */}
      {activeSubTab === 'inboxes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Connected Channels & Inboxes</h3>
            <button className="px-3 py-1.5 bg-[#5A4AD2] text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Channel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inboxes.map((ib) => (
              <div key={ib.id} className="bg-white p-5 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#EEECFB] text-[#5A4AD2] flex items-center justify-center font-bold">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{ib.name}</h4>
                  <span className="text-[11px] text-[#5A4AD2] font-semibold block">{ib.phone_number || (ib as any).phone || (ib as any).email || 'Channel #' + ib.id}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="capitalize">{ib.channel_type || (ib as any).channel || 'whatsapp'}</span>
                  <span className="font-semibold text-slate-800">ID #{ib.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Agents */}
      {activeSubTab === 'agents' && (
        <div className="bg-white rounded-2xl border border-[#E3E5E9] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#E3E5E9] flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Active Team Roster</h3>
            <button className="px-3 py-1.5 bg-[#5A4AD2] text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-[#6E737F] font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agents.map((ag) => {
                const initials = ag.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <tr key={ag.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#5A4AD2] text-white flex items-center justify-center font-bold text-xs">
                        {(ag as any).avatar || initials}
                      </div>
                      <span>{ag.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{ag.email}</td>
                    <td className="py-3 px-4 capitalize font-semibold text-slate-800">{ag.role}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {ag.availability_status || (ag as any).status || 'online'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-xs font-bold text-[#5A4AD2] hover:underline">
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Teams */}
      {activeSubTab === 'teams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Configured Teams & Routing</h3>
            <button className="px-3 py-1.5 bg-[#5A4AD2] text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Team</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teams.map((tm) => (
              <div key={tm.id} className="bg-white p-5 rounded-2xl border border-[#E3E5E9] shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#EEECFB] text-[#5A4AD2] flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Routing Active
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{tm.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{tm.description || 'General routing group'}</p>
                </div>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
                  <span>Auto-assignment: {tm.allow_auto_assign ? 'Enabled' : 'Disabled'}</span>
                  <span className="font-semibold text-slate-800">ID #{tm.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Canned Responses */}
      {activeSubTab === 'canned' && (
        <div className="bg-white rounded-2xl border border-[#E3E5E9] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#E3E5E9] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Saved Canned Responses</h3>
              <p className="text-xs text-slate-500">Insert quick snippets in chat using slash shortcuts</p>
            </div>
            <button className="px-3 py-1.5 bg-[#5A4AD2] text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Canned Reply</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {cannedList.map((item, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1 max-w-2xl">
                  <span className="font-mono font-bold text-[#5A4AD2] bg-[#EEECFB] px-2 py-0.5 rounded text-[11px]">
                    {item.shortcode}
                  </span>
                  <p className="text-slate-700 pt-1 leading-relaxed">{item.content}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

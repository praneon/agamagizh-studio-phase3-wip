import React, { useState } from 'react';
import { 
  Settings, 
  Inbox, 
  Users, 
  Shield, 
  MessageSquare, 
  Globe, 
  Key, 
  CheckCircle2, 
  Plus, 
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';
import { INBOXES_LIST, AGENTS_LIST } from '../../data/mockData';

export const SettingsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'inboxes' | 'agents' | 'teams' | 'canned' | 'security'>('inboxes');

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
          Manage connected inboxes, team member permissions, automated canned snippets, and security webhooks.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E3E5E9] pb-2 text-xs font-bold overflow-x-auto">
        {[
          { id: 'inboxes' as const, label: 'Inboxes & Channels', count: INBOXES_LIST.length },
          { id: 'agents' as const, label: 'Agents & Roles', count: AGENTS_LIST.length },
          { id: 'teams' as const, label: 'Teams & Routing', count: 3 },
          { id: 'canned' as const, label: 'Canned Responses', count: cannedList.length },
          { id: 'security' as const, label: 'Webhooks & API Keys' },
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
            {INBOXES_LIST.map((ib) => (
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
                  <span className="text-[11px] text-[#5A4AD2] font-semibold block">{ib.phone || ib.email}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="capitalize">{ib.channel}</span>
                  <span className="font-semibold text-slate-800">{ib.openConversationsCount} active chats</span>
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
              {AGENTS_LIST.map((ag) => (
                <tr key={ag.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#5A4AD2] text-white flex items-center justify-center font-bold text-xs">
                      {ag.avatar}
                    </div>
                    <span>{ag.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{ag.email}</td>
                  <td className="py-3 px-4 capitalize font-semibold text-slate-800">{ag.role}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {ag.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-xs font-bold text-[#5A4AD2] hover:underline">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Tab 4: Security & Webhooks */}
      {activeSubTab === 'security' && (
        <div className="bg-white rounded-2xl border border-[#E3E5E9] p-5 shadow-2xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Meta Webhooks & Callback Verification</h3>
          <p className="text-slate-600">
            Configure this endpoint inside your Meta App Developer Portal under the WhatsApp Cloud API product.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-mono text-[11px]">
            <div>
              <span className="text-slate-400 uppercase font-sans font-bold text-[10px] block">Webhook Callback URL</span>
              <span className="text-slate-800 font-bold">https://api.agamagizh.org/webhooks/whatsapp/v20</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-sans font-bold text-[10px] block">Verify Token</span>
              <span className="text-slate-800 font-bold">agamagizh_waba_verify_2026_secure</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-700 font-semibold pt-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Webhook live and receiving message status updates (200 OK)</span>
          </div>
        </div>
      )}
    </div>
  );
};

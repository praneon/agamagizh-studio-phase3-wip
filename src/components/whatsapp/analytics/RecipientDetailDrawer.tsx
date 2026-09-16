import React from 'react';
import { 
  X, 
  ExternalLink, 
  MessageSquare, 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { RecipientLedgerItem } from './types';

interface RecipientDetailDrawerProps {
  recipient: RecipientLedgerItem | null;
  onClose: () => void;
  onOpenConversation?: (convoId: string) => void;
  onOpenContact?: (contactId: string, name: string, phone: string) => void;
  isDark?: boolean;
}

export const RecipientDetailDrawer: React.FC<RecipientDetailDrawerProps> = ({
  recipient,
  onClose,
  onOpenConversation,
  onOpenContact,
  isDark
}) => {
  if (!recipient) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className={`w-full max-w-md h-full shadow-2xl flex flex-col justify-between transition-all ${
        isDark ? 'bg-slate-900 text-slate-100 border-l border-slate-800' : 'bg-white text-slate-900 border-l border-slate-200'
      }`}>
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold">Recipient Delivery Audit</h2>
              <p className="text-[11px] font-mono text-slate-400">ID: {recipient.id}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {/* Contact Card */}
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#5A4AD2]" />
                  <span className="text-xs font-bold">{recipient.contactName}</span>
                </div>
                {recipient.contactId && onOpenContact && (
                  <button
                    type="button"
                    onClick={() => onOpenContact(recipient.contactId!, recipient.contactName, recipient.destination)}
                    className="text-[11px] text-[#5A4AD2] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
                <Phone className="w-3.5 h-3.5" />
                <span>{recipient.destination}</span>
              </div>
            </div>

            {/* Campaign info */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Campaign Information
              </label>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {recipient.campaignName}
              </div>
              <div className="text-xs text-slate-500">
                Channel Inbox: <strong>{recipient.inbox}</strong>
              </div>
            </div>

            {/* Status & Diagnostics */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Delivery Lifecycle
              </label>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <span className="text-slate-500">Current Status</span>
                  <span className="font-bold capitalize text-slate-900 dark:text-slate-100">{recipient.status}</span>
                </div>
                {recipient.sentAt && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">
                    <span className="text-slate-500">Outbound Sent</span>
                    <span>{recipient.sentAt}</span>
                  </div>
                )}
                {recipient.deliveredAt && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">
                    <span className="text-slate-500">Carrier Delivered</span>
                    <span>{recipient.deliveredAt}</span>
                  </div>
                )}
                {recipient.readAt && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">
                    <span className="text-slate-500">Read By Contact</span>
                    <span>{recipient.readAt}</span>
                  </div>
                )}
                {recipient.repliedAt && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">
                    <span className="text-slate-500">Customer Reply</span>
                    <span>{recipient.repliedAt}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Reason if failed or excluded */}
            {recipient.reason && (
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Carrier Failure / Safety Exclusion Diagnostic</span>
                </div>
                <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed font-mono">
                  {recipient.reason}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          {recipient.conversationId && onOpenConversation ? (
            <button
              type="button"
              onClick={() => onOpenConversation(recipient.conversationId!)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#5A4AD2] hover:bg-[#4B3DB5] text-white text-xs font-bold transition-colors shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Open Conversation</span>
            </button>
          ) : (
            <div className="text-xs text-slate-400">No linked conversation</div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl border text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

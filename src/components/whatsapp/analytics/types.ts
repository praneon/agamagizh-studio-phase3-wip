export type CanonicalRecipientStatus =
  | 'sent'
  | 'delivered'
  | 'read'
  | 'replied'
  | 'failed'
  | 'excluded';

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'this_month'
  | 'custom';

export interface CanonicalMetrics {
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  failed: number;
  excluded: number;
}

export interface RecipientLedgerItem {
  id: string;
  recipientId: string;
  contactName: string;
  destination: string;
  campaignId: string;
  campaignName: string;
  inbox: string;
  status: CanonicalRecipientStatus;
  lifecycleTime: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  repliedAt?: string;
  failedAt?: string;
  reason?: string;
  conversationId?: string;
  contactId?: string;
}

export interface CampaignBreakdownItem {
  campaignId: string;
  title: string;
  inbox: string;
  scheduledAt: string;
  metrics: CanonicalMetrics;
}

export interface DailyOutcomeItem {
  date: string;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  failed: number;
  excluded: number;
}

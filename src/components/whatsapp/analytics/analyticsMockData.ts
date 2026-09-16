import { 
  CanonicalMetrics, 
  CampaignBreakdownItem, 
  DailyOutcomeItem, 
  RecipientLedgerItem 
} from './types';

export const MOCK_CAMPAIGNS = [
  { id: 'all', name: 'All Broadcast Campaigns' },
  { id: 'cmp-1', name: 'Q4 Center Operational Timings & Holiday Notice' },
  { id: 'cmp-2', name: 'October Health & Wellness Workshop Announcement' },
  { id: 'cmp-3', name: 'Weekend Consultation Reminders' },
  { id: 'cmp-4', name: 'Annual Client Satisfaction Feedback Survey' }
];

export const MOCK_INBOXES = [
  { id: 'all', name: 'All Inboxes' },
  { id: 'Agamagizh WhatsApp Main', name: 'Agamagizh WhatsApp Main' },
  { id: 'Adyar Reception Desk', name: 'Adyar Reception Desk' },
  { id: 'Anna Nagar Clinic Support', name: 'Anna Nagar Clinic Support' }
];

export const MOCK_GLOBAL_METRICS: CanonicalMetrics = {
  sent: 1270,
  delivered: 1210,
  read: 1045,
  replied: 198,
  failed: 26,
  excluded: 44
};

export const MOCK_CAMPAIGN_BREAKDOWNS: CampaignBreakdownItem[] = [
  {
    campaignId: 'cmp-1',
    title: 'Q4 Center Operational Timings & Holiday Notice',
    inbox: 'Agamagizh WhatsApp Main',
    scheduledAt: '2026-09-10 09:00 AM',
    metrics: {
      sent: 420,
      delivered: 412,
      read: 388,
      replied: 64,
      failed: 8,
      excluded: 14
    }
  },
  {
    campaignId: 'cmp-2',
    title: 'October Health & Wellness Workshop Announcement',
    inbox: 'Agamagizh WhatsApp Main',
    scheduledAt: '2026-09-13 10:00 AM',
    metrics: {
      sent: 520,
      delivered: 498,
      read: 395,
      replied: 42,
      failed: 12,
      excluded: 28
    }
  },
  {
    campaignId: 'cmp-3',
    title: 'Weekend Consultation Reminders',
    inbox: 'Adyar Reception Desk',
    scheduledAt: '2026-09-14 06:00 PM',
    metrics: {
      sent: 285,
      delivered: 260,
      read: 222,
      replied: 82,
      failed: 4,
      excluded: 2
    }
  },
  {
    campaignId: 'cmp-4',
    title: 'Annual Client Satisfaction Feedback Survey',
    inbox: 'Agamagizh WhatsApp Main',
    scheduledAt: '2026-09-14 11:30 AM',
    metrics: {
      sent: 45,
      delivered: 40,
      read: 40,
      replied: 10,
      failed: 2,
      excluded: 0
    }
  }
];

export const MOCK_DAILY_OUTCOMES: DailyOutcomeItem[] = [
  { date: 'Sep 09', sent: 110, delivered: 106, read: 92, replied: 18, failed: 2, excluded: 4 },
  { date: 'Sep 10', sent: 420, delivered: 412, read: 388, replied: 64, failed: 8, excluded: 14 },
  { date: 'Sep 11', sent: 95, delivered: 91, read: 78, replied: 12, failed: 1, excluded: 2 },
  { date: 'Sep 12', sent: 80, delivered: 77, read: 66, replied: 15, failed: 1, excluded: 0 },
  { date: 'Sep 13', sent: 520, delivered: 498, read: 395, replied: 42, failed: 12, excluded: 28 },
  { date: 'Sep 14', sent: 330, delivered: 300, read: 262, replied: 92, failed: 6, excluded: 2 }
];

export const MOCK_RECIPIENT_LEDGER: RecipientLedgerItem[] = [
  {
    id: 'r-1',
    recipientId: 'rec-1',
    contactName: 'Suresh Ramanathan',
    destination: '+91 98401 92831',
    campaignId: 'cmp-1',
    campaignName: 'Q4 Center Operational Timings & Holiday Notice',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'read',
    lifecycleTime: '10:14 AM',
    sentAt: '10:12 AM',
    deliveredAt: '10:13 AM',
    readAt: '10:14 AM',
    contactId: 'cnt-10',
    conversationId: 'conv-101'
  },
  {
    id: 'r-2',
    recipientId: 'rec-2',
    contactName: 'Meenakshi Sundaram',
    destination: '+91 97910 44821',
    campaignId: 'cmp-1',
    campaignName: 'Q4 Center Operational Timings & Holiday Notice',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'replied',
    lifecycleTime: '10:25 AM',
    sentAt: '10:12 AM',
    deliveredAt: '10:13 AM',
    readAt: '10:18 AM',
    repliedAt: '10:25 AM',
    contactId: 'cnt-2',
    conversationId: 'conv-102'
  },
  {
    id: 'r-3',
    recipientId: 'rec-3',
    contactName: 'Ananya Deshmukh',
    destination: '+91 98842 11904',
    campaignId: 'cmp-1',
    campaignName: 'Q4 Center Operational Timings & Holiday Notice',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'delivered',
    lifecycleTime: '10:15 AM',
    sentAt: '10:12 AM',
    deliveredAt: '10:15 AM',
    contactId: 'cnt-3',
    conversationId: 'conv-103'
  },
  {
    id: 'r-4',
    recipientId: 'rec-4',
    contactName: 'Venkatesh Balaji',
    destination: '+91 94440 33819',
    campaignId: 'cmp-1',
    campaignName: 'Q4 Center Operational Timings & Holiday Notice',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'read',
    lifecycleTime: '10:30 AM',
    sentAt: '10:12 AM',
    deliveredAt: '10:14 AM',
    readAt: '10:30 AM',
    contactId: 'cnt-4',
    conversationId: 'conv-104'
  },
  {
    id: 'r-5',
    recipientId: 'rec-5',
    contactName: 'Raghavan Pillai',
    destination: '+91 98400 99881',
    campaignId: 'cmp-1',
    campaignName: 'Q4 Center Operational Timings & Holiday Notice',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'failed',
    lifecycleTime: '10:12 AM',
    sentAt: '10:12 AM',
    failedAt: '10:12 AM',
    reason: 'Phone number not registered on WhatsApp (Code: 131026)',
    contactId: 'cnt-5'
  },
  {
    id: 'r-6',
    recipientId: 'rec-6',
    contactName: 'Devi Saravanan',
    destination: '+91 94441 55667',
    campaignId: 'cmp-1',
    campaignName: 'Q4 Center Operational Timings & Holiday Notice',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'excluded',
    lifecycleTime: '10:10 AM',
    reason: 'Contact explicitly opted out of broadcast messaging (Preflight Safety Exclusion)',
    contactId: 'cnt-6'
  },
  {
    id: 'r-7',
    recipientId: 'rec-7',
    contactName: 'Bala Chandran',
    destination: '+91 98840 22331',
    campaignId: 'cmp-1',
    campaignName: 'Q4 Center Operational Timings & Holiday Notice',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'delivered',
    lifecycleTime: '10:16 AM',
    sentAt: '10:12 AM',
    deliveredAt: '10:16 AM',
    contactId: 'cnt-7'
  },
  {
    id: 'r-8',
    recipientId: 'rec-8',
    contactName: 'Nithya Krishnan',
    destination: '+91 97909 88123',
    campaignId: 'cmp-1',
    campaignName: 'Q4 Center Operational Timings & Holiday Notice',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'read',
    lifecycleTime: '10:45 AM',
    sentAt: '10:12 AM',
    deliveredAt: '10:15 AM',
    readAt: '10:45 AM',
    contactId: 'cnt-8'
  },
  {
    id: 'r-9',
    recipientId: 'rec-9',
    contactName: 'Manojbhai Shah',
    destination: '+91 98201 33445',
    campaignId: 'cmp-2',
    campaignName: 'October Health & Wellness Workshop Announcement',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'failed',
    lifecycleTime: '10:13 AM',
    sentAt: '10:12 AM',
    failedAt: '10:13 AM',
    reason: 'Meta Cloud API Error: Recipient phone number format invalid (Code: 100)',
    contactId: 'cnt-9'
  },
  {
    id: 'r-10',
    recipientId: 'rec-10',
    contactName: 'Karthika Selvam',
    destination: '+91 98403 66778',
    campaignId: 'cmp-2',
    campaignName: 'October Health & Wellness Workshop Announcement',
    inbox: 'Agamagizh WhatsApp Main',
    status: 'read',
    lifecycleTime: '11:02 AM',
    sentAt: '10:12 AM',
    deliveredAt: '10:14 AM',
    readAt: '11:02 AM',
    contactId: 'cnt-11'
  }
];

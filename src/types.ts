/**
 * Studio Frontend Presentation, Operational, and Pipeline Types
 * Authoritative Canonical Type Definitions matching Agamagizh Studio Specifications
 */

export type TopNavSection = 
  | 'my-inbox'
  | 'my_inbox'
  | 'conversations'
  | 'captain'
  | 'contacts'
  | 'companies'
  | 'reports'
  | 'clinic-pipeline'
  | 'clinic_pipeline'
  | 'pipeline'
  | 'campaigns'
  | 'whatsapp'
  | 'help-center'
  | 'help_center'
  | 'settings';

export type WhatsAppSubSection = 
  | 'overview'
  | 'inbox'
  | 'conversations'
  | 'contacts'
  | 'broadcasts'
  | 'campaigns'
  | 'templates'
  | 'pipelines'
  | 'automations'
  | 'rules'
  | 'chatbots'
  | 'analytics'
  | 'settings';

export interface AgentUser {
  id: string | number;
  name: string;
  email?: string;
  avatar?: string;
  role: 'Administrator' | 'Agent' | string;
  status: 'online' | 'busy' | 'offline';
  assignedInboxCount?: number;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone: string;
  avatar?: string;
  company?: string;
  lastActivity: string;
  status?: 'active' | 'archived';
  labels?: string[];
  conversationsCount: number;
  channel?: 'whatsapp' | 'live_chat' | 'email' | 'sms' | string;
  location?: string;
  consentStatus?: 'opted_in' | 'opted_out' | 'unconfirmed' | string;
  customAttributes?: Record<string, any>;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  phone?: string;
  address?: string;
  contactsCount?: number;
  openConversations?: number;
  dealsCount?: number;
}

export interface MessageAttachment {
  id?: string;
  name: string;
  type: 'pdf' | 'image' | 'audio' | 'doc' | 'video' | 'file';
  size?: string;
  url?: string;
}

export interface Message {
  id: string;
  conversationId?: string;
  sender: 'contact' | 'agent' | 'system' | 'bot';
  senderName?: string;
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  isPrivateNote?: boolean;
  attachments?: MessageAttachment[] | Array<{
    id: string;
    type: 'image' | 'audio' | 'video' | 'file';
    url: string;
    name: string;
    size?: string;
  }>;
}

export interface Conversation {
  id: string;
  contactId?: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  channel?: 'whatsapp' | 'live_chat' | 'email' | 'sms' | 'web' | string;
  status: 'open' | 'pending' | 'snoozed' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedAgent?: string;
  assignedTeam?: string;
  labels: string[];
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  inbox: string;
  messages: Message[];
  customAttributes?: Record<string, any>;
}

// Clinic Pipeline (Operational Kanban board)
export interface ClinicPipelineStage {
  id: string;
  title: string;
  color: string;
  description: string;
}

export interface ClinicPipelineCard {
  id: string;
  stageId: string;
  title: string;
  contactName: string;
  contactPhone: string;
  company?: string;
  value?: string;
  assignedAgent?: string;
  assignedTeam?: string;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  labels?: string[];
  nextActivity?: string;
  lastContacted: string;
  nextActionDate?: string;
  conversationId?: string;
}

// WhatsApp Campaigns / Broadcasts
export type CampaignStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'running' 
  | 'paused' 
  | 'completed' 
  | 'cancelled' 
  | 'failed'
  | 'archived';

export type AudienceType = 
  | 'labels' 
  | 'csv' 
  | 'saved_filter' 
  | 'manual'
  | 'all'
  | 'filter';

export interface WhatsAppCampaign {
  id: string;
  title: string;
  channelInbox?: string;
  inbox?: string;
  status: CampaignStatus;
  audienceType: AudienceType;
  audienceSummary: string;
  templateId?: string;
  templateName?: string;
  scheduledAt?: string;
  completedAt?: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  repliedCount: number;
  failedCount: number;
  excludedCount: number;
  createdAt: string;
}

export interface CampaignRecipient {
  id: string;
  campaignId: string;
  contactName: string;
  phone: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'excluded';
  lifecycleTime: string;
  reason?: string;
}

// WhatsApp Templates
export type TemplateStatus = 
  | 'local_draft' 
  | 'pending' 
  | 'approved' 
  | 'rejected';

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  status: TemplateStatus;
  source?: 'local_draft' | 'provider' | string;
  isCampaignEligible?: boolean;
  rejectionReason?: string;
  lastSyncedAt?: string;
  createdAt?: string;
  lastUpdated?: string;
  header?: {
    type?: 'none' | 'text' | 'image' | 'document' | string;
    format?: 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'VIDEO' | string;
    text?: string;
  };
  body: string;
  footer?: string;
  buttons?: Array<{
    type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER' | 'quick_reply' | string;
    text: string;
    value?: string;
  }>;
  variableExamples?: Record<string, string>;
  variableDescriptions?: Record<string, string>;
}

// WhatsApp Automations / Linear Rules (WHEN -> IF ALL/ANY -> THEN)
export type AutomationTrigger = 
  | 'conversation_created'
  | 'message_created'
  | 'conversation_status_changed'
  | 'contact_created';

export interface RuleCondition {
  attribute: string;
  operator: 'equals' | 'contains' | 'not_equals' | 'is_present';
  value: string;
}

export interface RuleAction {
  action: 'assign_agent' | 'assign_team' | 'add_label' | 'send_message' | 'resolve_conversation' | 'snooze_conversation';
  params: Record<string, string>;
}

export interface AutomationRule {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  status: 'draft' | 'published' | 'paused' | 'archived';
  trigger: AutomationTrigger;
  conditionMatch: 'ALL' | 'ANY';
  conditions: RuleCondition[];
  actions: RuleAction[];
  executionCount: number;
  lastTriggered?: string;
}

// WhatsApp Chatbots (Visual Node-Based Flow Builder)
export type ChatbotNodeType = 
  | 'start' 
  | 'message' 
  | 'question' 
  | 'choice' 
  | 'condition' 
  | 'wait' 
  | 'handoff' 
  | 'end';

export interface ChatbotNode {
  id: string;
  type: ChatbotNodeType;
  title: string;
  content: {
    messageText?: string;
    questionText?: string;
    variableName?: string;
    choices?: string[];
    conditionExpression?: string;
    waitDurationSeconds?: number;
    handoffTeam?: string;
  };
  x: number;
  y: number;
}

export interface ChatbotEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface ChatbotFlow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  version: string;
  lastModified: string;
  nodes: ChatbotNode[];
  edges: ChatbotEdge[];
}

export interface WhatsAppRule {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  eventTrigger: string;
  conditions: string[];
  actions: string[];
  channelInbox: string;
  executionCount: number;
}

export interface ChatbotStep {
  id: string;
  stepNumber: number;
  type: 'send_message' | 'branch_choice' | 'collect_input' | 'handoff_agent';
  prompt: string;
  options?: string[];
  targetAction?: string;
}

export interface WhatsAppChatbot {
  id: string;
  name: string;
  channelInbox: string;
  triggerKeyword: string;
  status: 'active' | 'draft';
  description: string;
  steps: ChatbotStep[];
  triggersCount: number;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

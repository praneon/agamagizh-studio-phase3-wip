/**
 * Agamagizh Studio CRM Contracts & Rails Backend Types
 * Mirrors the canonical schemas from /crm/chatwoot-phase1
 */

export interface AccountSummary {
  id: number;
  name: string;
  status: string;
  role: string;
  active_at?: string;
  permissions?: string[];
  availability?: string;
  auto_offline?: boolean;
}

export interface UserProfile {
  id: number;
  name: string;
  display_name?: string;
  email: string;
  role: string;
  account_id: number;
  accounts: AccountSummary[];
  avatar_url?: string;
}

export interface CrmInbox {
  id: number;
  name: string;
  channel_type: string;
  phone_number?: string;
  provider?: string;
  avatar_url?: string;
}

export interface CrmMessageSender {
  id: number;
  name: string;
  type: 'user' | 'contact' | 'agent_bot';
  avatar_url?: string;
}

export interface CrmMessageAttachment {
  id: number;
  file_type: string;
  data_url: string;
  thumb_url?: string;
  file_size?: number;
}

export interface CrmMessage {
  id: number;
  content: string;
  message_type: number; // 0: incoming, 1: outgoing, 2: activity, 3: template
  status: 'sent' | 'delivered' | 'read' | 'failed';
  content_type: string;
  conversation_id: number;
  inbox_id: number;
  created_at: number;
  private: boolean;
  source_id?: string;
  sender?: CrmMessageSender;
  attachments?: CrmMessageAttachment[];
  content_attributes?: Record<string, unknown>;
}

export interface CrmConversationSummary {
  id: number; // display_id
  uuid: string;
  contact: {
    id: number;
    name: string;
    phone_number: string;
  };
  whatsapp_identity?: string;
  inbox: {
    id: number;
    name: string;
    provider?: string;
  };
  status: 'open' | 'resolved' | 'pending' | 'snoozed';
  unread_count: number;
  assignee?: {
    id: number;
    name: string;
  };
  team?: {
    id: number;
    name: string;
  };
  labels: string[];
  can_reply: boolean;
  pipeline_stage?: string;
  last_activity_at?: string;
  last_message?: {
    id: number;
    content: string;
    message_type: number;
    status: string;
    content_type: string;
  };
}

export interface CrmConversationDetail extends CrmConversationSummary {
  messages: CrmMessage[];
}

export interface CrmContactChannelConsent {
  purpose: string;
  status: 'opted_in' | 'opted_out' | 'revoked' | 'unconfirmed';
  source?: string;
  captured_at?: string;
  revoked_at?: string;
}

export interface CrmWhatsAppIdentity {
  inbox_id: number;
  inbox_name: string;
  source_id: string;
}

export interface CrmContactSummary {
  id: number;
  name: string;
  phone_number: string;
  identifier?: string;
  custom_attributes: Record<string, unknown>;
  labels: { id: number; title: string }[];
  whatsapp_identities: CrmWhatsAppIdentity[];
  last_activity_at?: string;
  consent_status?: string;
  pipeline_stage?: string;
  owner?: string;
  team?: string;
  open_conversation_id?: number;
}

export interface CrmContactDetail extends CrmContactSummary {
  consents: CrmContactChannelConsent[];
  conversations: {
    id: number;
    display_id: number;
    status: string;
    inbox_id: number;
    last_activity_at?: string;
  }[];
  campaigns: {
    id: number;
    campaign_id: number;
    campaign_title: string;
    status: string;
    destination: string;
    sent_at?: string;
    delivered_at?: string;
    read_at?: string;
    replied_at?: string;
  }[];
  pipeline: {
    id: number;
    pipeline: string;
    stage: string;
    owner?: string;
    team?: string;
    next_action_at?: string;
    appointment_at?: string;
    appointment_mode?: string;
    external_reference_id?: string;
  }[];
  automations: {
    id: number;
    flow: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
  appointments: {
    pipeline_card_id: number;
    at?: string;
    mode?: string;
    reference?: string;
    source?: string;
  }[];
  activity: {
    id: number;
    pipeline_card_id: number;
    action: string;
    created_at: string;
  }[];
}

export interface CrmCompany {
  id: number;
  name: string;
  domain?: string;
  description?: string;
  industry?: string;
  phone_number?: string;
  address?: string;
  custom_attributes?: Record<string, unknown>;
}

// Clinic Pipeline Contracts
export interface BackendPipelineStage {
  id: number;
  name: string;
  position: number;
  color?: string;
}

export interface BackendPipeline {
  id: number;
  name: string;
  stages: BackendPipelineStage[];
}

export interface BackendPipelineActivity {
  id: number;
  action: string;
  changes: Record<string, unknown>;
  actor?: string;
  created_at: string;
}

export interface BackendPipelineCard {
  id: number;
  pipeline_id: number;
  stage_id: number;
  stage_name: string;
  contact: {
    id: number;
    name: string;
    phone_number: string;
  };
  conversation_id?: number;
  owner?: {
    id: number;
    name: string;
  };
  team?: {
    id: number;
    name: string;
  };
  source?: string;
  external_source?: string;
  external_reference_id?: string;
  next_action_at?: string;
  appointment_at?: string;
  appointment_mode?: string;
  operational_note?: string;
  position: number;
  lock_version: number;
  updated_at: string;
  activities?: BackendPipelineActivity[];
}

export interface MoveCardPayload {
  clinic_pipeline_stage_id: number;
  position: number;
  lock_version: number;
}

export interface StaleCardConflict {
  error: string;
  card: BackendPipelineCard;
}

// Campaign Preflight & Recipient Contracts
export interface BackendPreflightPlanner {
  candidates: number;
  valid: number;
  excluded: number;
  duplicate: number;
  suppressed: number;
  no_consent: number;
  invalid_phone: number;
  missing_contact_inbox: number;
}

export interface BackendPreflightResult {
  total: number;
  eligible: number;
  within_safety_ceiling: boolean;
  excluded: Record<string, number>;
  planner: BackendPreflightPlanner;
}

export interface BackendCampaignRecipient {
  id: number;
  contact_id: number;
  contact_name?: string;
  destination: string;
  status: string;
  failure_code?: string;
  attempts: number;
  queued_at?: string;
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  failed_at?: string;
  replied_at?: string;
}

export interface BackendCampaign {
  id: number;
  display_id: number;
  title: string;
  description?: string;
  message?: string;
  enabled: boolean;
  inbox_id: number;
  sender_id?: number;
  scheduled_at?: string;
  campaign_status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled';
  consent_purpose?: string;
  consent_confirmed_at?: string;
  throttle_per_minute?: number;
  local_safety_ceiling?: number;
  audience?: {
    type: 'labels' | 'csv' | 'saved_filter' | 'manual';
    id?: string | number;
  };
  trigger_rules?: Record<string, unknown>;
  template_params?: Record<string, unknown>;
  composer_state?: Record<string, unknown>;
}

// WhatsApp Template Draft Contracts
export interface BackendTemplateDraft {
  id: number;
  inbox_id: number;
  inbox_name: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  template_type: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  definition: {
    header?: { format: string; text?: string; examples?: Record<string, unknown> };
    body: { text: string; examples?: Record<string, unknown> };
    footer?: { text?: string };
    buttons?: { type: string; text: string; url?: string; phone_number?: string }[];
  };
  provider_template_id?: string;
  updated_at: string;
  created_at: string;
}

export interface BackendPrepareDraftResponse {
  draft: BackendTemplateDraft;
  provider_payload: Record<string, unknown>;
  submission_blocked: boolean;
}

// Automation Flow Contracts
export interface BackendFlowRunEvent {
  id: number;
  sequence: number;
  type: string;
  node_id: string;
  created_at: string;
}

export interface BackendFlowRun {
  id: number;
  version_id: number;
  contact_id: number;
  conversation_id?: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'suspended';
  current_node_id?: string;
  suspension_reason?: string;
  created_at: string;
  events: BackendFlowRunEvent[];
}

export interface BackendAutomationFlow {
  id: number;
  name: string;
  inbox_id?: number;
  status: 'draft' | 'published' | 'paused' | 'archived';
  active_version_id?: number;
  run_count: number;
  last_run_at?: string;
  last_run_status?: string;
  last_published_at?: string;
  published: boolean;
  mode?: 'rule_builder' | 'chatbot';
  trigger_summary?: string;
  action_summary?: string;
  draft_graph?: Record<string, unknown>;
  draft_configuration?: Record<string, unknown>;
  updated_at: string;
}

export interface CapabilityItem {
  key: string;
  label_key: string;
  category: string;
  fields?: { key: string; type: string; required?: boolean; min?: number; max?: number }[];
  branching?: boolean;
  asynchronous?: boolean;
  terminal?: boolean;
  enabled?: boolean;
}

export interface BackendCapabilityRegistry {
  schema_version: number;
  product_modes: string[];
  triggers: CapabilityItem[];
  conditions: CapabilityItem[];
  actions: CapabilityItem[];
  flow_nodes: CapabilityItem[];
  chatbot_nodes: CapabilityItem[];
}

export interface BackendChatbotStarter {
  id: string;
  title: string;
  description: string;
  category: string;
  nodes_count: number;
}

// Operational Analytics Contracts
export interface BackendOperationalAnalytics {
  from: string;
  to: string;
  inbox_id?: number;
  campaign_id?: number;
  overview: {
    total_messages: number;
    sent_count: number;
    delivered_count: number;
    read_count: number;
    replied_count: number;
    failed_count: number;
    delivery_rate: number;
    read_rate: number;
    response_rate: number;
    failure_rate: number;
  };
  failure_reasons: Record<string, number>;
  hourly_distribution: { hour: string; sent: number; delivered: number; read: number; failed: number }[];
  campaign_breakdown: {
    campaign_id: number;
    campaign_title: string;
    total: number;
    delivered: number;
    read: number;
    failed: number;
  }[];
}

export interface CrmAgent {
  id: number;
  name: string;
  email: string;
  role: string;
  availability_status?: string;
  avatar_url?: string;
}

export interface CrmTeam {
  id: number;
  name: string;
  description?: string;
  allow_auto_assign?: boolean;
}

export interface ProviderWhatsAppTemplate {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'PAUSED';
  components: Array<{
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
    format?: string;
    text?: string;
    buttons?: Array<{ type: string; text: string; url?: string; phone_number?: string }>;
    example?: Record<string, any>;
  }>;
  campaign_eligible: boolean;
  rejected_reason?: string;
  last_synced_at?: string;
}

export interface UpdateConsentPayload {
  purpose: 'marketing' | 'transactional' | 'appointment_reminders';
  status: 'opted_in' | 'opted_out' | 'revoked' | 'unconfirmed';
  source?: string;
}

export interface WhatsAppOverviewData {
  inboxes: CrmInbox[];
  channelState: {
    status: 'connected' | 'reauth_required' | 'disconnected';
    phoneNumber: string;
    displayName: string;
    qualityRating: 'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN';
    messagingLimit: string;
    lastSyncAt: string;
  };
  templateSyncState: {
    totalTemplates: number;
    approvedCount: number;
    pendingCount: number;
    rejectedCount: number;
    draftCount: number;
    lastSyncedAt: string;
  };
  campaignMetrics: {
    totalSent: number;
    deliveryRate: number;
    readRate: number;
    replyRate: number;
  };
  consentHealth: {
    totalContacts: number;
    marketingOptedIn: number;
    transactionalOptedIn: number;
    optedOut: number;
  };
  automationStatus: {
    activeFlows: number;
    totalExecutionsToday: number;
    failedExecutionsToday: number;
  };
}


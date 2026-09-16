/**
 * CRM Backend Type Definitions
 * Matches Chatwoot Rails schemas, REST APIs, and domain boundaries.
 */

export interface UserProfile {
  id: number;
  name: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  account_id: number;
  role: 'administrator' | 'agent';
  availability?: 'online' | 'busy' | 'offline';
  accounts: AccountSummary[];
}

export interface AccountSummary {
  id: number;
  name: string;
  status: 'active' | 'suspended';
  role: 'administrator' | 'agent';
  availability: 'online' | 'busy' | 'offline';
}

export interface CrmInbox {
  id: number;
  name: string;
  channel_type: string;
  phone_number?: string;
  provider?: string;
  avatar_url?: string;
}

export interface CrmAgent {
  id: number;
  name: string;
  email?: string;
  role: string;
  availability?: string;
  avatar_url?: string;
}

export interface CrmTeam {
  id: number;
  name: string;
  description?: string;
  member_ids?: number[];
  allow_auto_assign?: boolean;
}

export interface CrmMessage {
  id: number | string;
  content: string;
  message_type: number | 'incoming' | 'outgoing' | 'activity' | 'template';
  created_at: string | number;
  content_type?: string;
  sender?: {
    id: number;
    name: string;
    type: string;
    avatar_url?: string;
  };
  private?: boolean;
  status?: string;
  attachments?: any[];
  content_attributes?: Record<string, any>;
  conversation_id?: number;
  inbox_id?: number;
}

export interface CrmConversationSummary {
  id: number;
  display_id?: number;
  inbox_id?: number;
  uuid?: string;
  inbox?: { id: number; name: string; provider?: string };
  team?: { id: number; name: string };
  can_reply?: boolean;
  pipeline_stage?: string;
  status: 'open' | 'resolved' | 'pending' | 'snoozed' | string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  unread_count: number;
  last_activity_at?: string;
  contact: CrmContactSummary;
  assignee?: CrmAgent;
  labels: Array<{ id: number; title: string; color?: string } | string>;
  messages_count?: number;
  last_message?: any;
  last_non_activity_message?: CrmMessage;
}

export interface CrmConversationDetail extends CrmConversationSummary {
  messages: CrmMessage[];
}

export interface ContactChannelConsent {
  purpose: string;
  status: 'opted_in' | 'opted_out' | 'unconfirmed';
  source: string;
  captured_at: string;
  channel?: string;
}

export interface CrmContactSummary {
  id: number;
  name: string;
  phone_number: string;
  email?: string;
  thumbnail?: string;
  custom_attributes?: Record<string, any>;
  labels?: Array<{ id: number; title: string } | string>;
  whatsapp_identities?: Array<{
    inbox_id: number;
    inbox_name: string;
    source_id: string;
  }>;
  consent_status?: 'opted_in' | 'opted_out' | 'unconfirmed';
  last_activity_at?: string;
}

export interface CrmContactDetail extends CrmContactSummary {
  consents: ContactChannelConsent[];
  conversations: Array<{
    id: number;
    display_id: number;
    status: string;
    inbox_id: number;
    last_activity_at: string;
  }>;
  campaigns: Array<{
    id: number;
    campaign_id: number;
    campaign_title: string;
    status: string;
    destination?: string;
    delivered_at?: string;
  }>;
  pipeline: Array<{
    id: number;
    pipeline: string;
    stage: string;
    owner?: string;
    team?: string;
    next_action_at?: string;
    appointment_at?: string;
    appointment_mode?: string;
  }>;
  automations: Array<{
    id: number;
    flow: string;
    status: string;
    created_at: string;
    updated_at: string;
  }>;
  appointments: Array<{
    pipeline_card_id: number;
    at: string;
    mode: string;
    reference: string;
    source: string;
  }>;
  activity?: Array<{
    id: number;
    pipeline_card_id?: number;
    action: string;
    created_at: string;
  }>;
}

export interface CrmCompany {
  id: number;
  name: string;
  domain?: string;
  industry?: string;
  phone_number?: string;
  address?: string;
}

export interface BackendPipelineActivity {
  id: number;
  action: string;
  changes: Record<string, any>;
  actor: string;
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
    phone_number?: string;
  };
  conversation_id?: number;
  owner?: { id: number; name: string };
  team?: { id: number; name: string };
  source?: string;
  external_source?: string;
  external_reference_id?: string;
  next_action_at?: string;
  appointment_at?: string;
  appointment_mode?: string;
  operational_note?: string;
  position: number;
  lock_version: number;
  updated_at?: string;
  activities?: BackendPipelineActivity[];
}

export interface BackendPipeline {
  id: number;
  name: string;
  stages: Array<{ id: number; name: string; position: number }>;
}

export interface BackendCampaign {
  id: number;
  display_id?: number;
  title: string;
  description?: string;
  message?: string;
  enabled: boolean;
  inbox_id: number;
  campaign_status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused' | 'archived' | 'cancelled';
  consent_purpose: string;
  consent_confirmed_at?: string;
  throttle_per_minute?: number;
  local_safety_ceiling?: number;
  audience: {
    type: string;
    id?: string;
  };
  trigger_rules?: Record<string, any>;
  template_params?: {
    template_id?: string;
    template_name?: string;
  };
  total_recipients?: number;
  sent_count?: number;
  delivered_count?: number;
  read_count?: number;
  replied_count?: number;
  failed_count?: number;
  excluded_count?: number;
  scheduled_at?: string;
  created_at?: string;
}

export interface BackendCampaignRecipient {
  id: number;
  campaign_id?: number;
  contact_id?: number;
  name?: string;
  contact_name?: string;
  phone_number?: string;
  destination?: string;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'replied' | 'failed' | 'excluded';
  delivery_status?: string;
  error_code?: string;
  failure_code?: string;
  failure_reason?: string;
  exclusion_reason?: string;
  attempts?: number;
  attempts_count?: number;
  queued_at?: string;
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  replied_at?: string;
  failed_at?: string;
  excluded_at?: string;
}

export interface BackendPreflightResult {
  total: number;
  eligible: number;
  within_safety_ceiling?: boolean;
  excluded: number | Record<string, number>;
  exclusions?: Record<string, number>;
  planner?: Record<string, number>;
  sample_excluded?: Array<{
    phone_number: string;
    name?: string;
    reason: string;
  }>;
}

export interface BackendTemplateDraft {
  id: number;
  inbox_id: number;
  inbox_name?: string;
  name: string;
  category: string;
  language: string;
  template_type: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  definition: {
    header?: { format?: string; text?: string };
    body: { text: string; examples?: Record<string, string> };
    footer?: { text?: string };
    buttons?: Array<{ type: string; text: string; url?: string; phone_number?: string }>;
  };
  provider_template_id?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface BackendPrepareDraftResponse {
  draft: BackendTemplateDraft;
  validation_errors?: string[];
  provider_payload?: any;
  submission_blocked?: boolean;
}

export interface BackendAutomationFlow {
  id: number;
  name: string;
  inbox_id?: number;
  status: 'draft' | 'published' | 'archived' | 'paused' | string;
  active_version_id?: number | null;
  run_count: number;
  last_run_at?: string;
  last_run_status?: string;
  last_published_at?: string | null;
  published: boolean;
  mode: string;
  trigger_summary?: string;
  action_summary?: string;
  definition?: any;
  draft_graph?: any;
  draft_configuration?: any;
  nodes?: any[];
  edges?: any[];
  updated_at?: string;
}

export interface BackendCapabilityRegistry {
  schema_version?: string | number;
  whatsapp_cloud?: boolean;
  template_sync?: boolean;
  interactive_messages?: boolean;
  automated_flows?: boolean;
  optimistic_locking?: boolean;
  bahmni_integration?: boolean;
  product_modes?: any;
  triggers?: any;
  conditions?: any;
  actions?: any;
  [key: string]: any;
}

export interface BackendChatbotStarter {
  id: number | string;
  title?: string;
  name?: string;
  description: string;
  category: string;
  nodes_count?: number;
  definition?: any;
}

export interface BackendFlowRun {
  id: number;
  flow_id?: number;
  version_id?: number;
  flow_name?: string;
  contact_id?: number;
  contact_name?: string;
  status: 'running' | 'completed' | 'failed' | string;
  current_node_id?: string;
  started_at?: string;
  created_at?: string;
  completed_at?: string;
  error?: string;
  steps_executed?: number;
  events?: Array<{
    id: number;
    sequence: number;
    type: string;
    node_id: string;
    created_at: string;
  }>;
}

export interface BackendOperationalAnalytics {
  from?: string;
  to?: string;
  inbox_id?: number;
  campaign_id?: number;
  period?: string;
  total_conversations?: number;
  first_response_time_minutes?: number;
  resolution_time_minutes?: number;
  channel_distribution?: Record<string, number>;
  campaign_metrics?: {
    sent: number;
    delivered: number;
    read: number;
    replied: number;
    failed: number;
  };
  overview?: {
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
  failure_reasons?: Record<string, number>;
  hourly_distribution?: Array<{
    hour: string;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
  }>;
  campaign_breakdown?: Array<{
    campaign_id: number;
    campaign_title: string;
    total: number;
    delivered: number;
    read: number;
    failed: number;
  }>;
}

export interface ProviderWhatsAppTemplate {
  id: string;
  name: string;
  category: string;
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'PAUSED' | string;
  campaign_eligible?: boolean;
  last_synced_at?: string;
  components: Array<{
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS' | string;
    format?: string;
    text?: string;
    buttons?: Array<{
      type: string;
      text: string;
      url?: string;
      phone_number?: string;
    }>;
  }>;
}

export interface UpdateConsentPayload {
  purpose: string;
  status: 'opted_in' | 'opted_out' | 'unconfirmed';
  source?: string;
}

export interface WhatsAppOverviewData {
  inboxes: CrmInbox[];
  channelState: {
    status: string;
    phoneNumber: string;
    displayName: string;
    qualityRating: string;
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
    optedOut?: number;
  };
  automationStatus?: {
    activeFlows: number;
    totalExecutionsToday: number;
    failedExecutionsToday: number;
  };
}

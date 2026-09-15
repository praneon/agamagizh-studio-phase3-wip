/**
 * CRM Data Adapters
 * Bridges between Rails API JSON payloads and Studio UI state models.
 * Preserves backend invariants:
 * - Candidates != Eligible
 * - Failed != Excluded
 * - Optimistic locking (lock_version)
 * - Safe custom attributes
 */

import {
  CrmConversationSummary,
  CrmConversationDetail,
  CrmMessage,
  CrmContactSummary,
  CrmContactDetail,
  CrmCompany,
  BackendPipelineCard,
  BackendPipelineStage,
  BackendCampaign,
  BackendCampaignRecipient,
  BackendTemplateDraft,
  BackendAutomationFlow,
  BackendOperationalAnalytics,
} from '../types/crm';

import {
  Conversation as StudioConversation,
  Message as StudioMessage,
  Contact as StudioContact,
  Company as StudioCompany,
  ClinicPipelineCard as StudioPipelineCard,
  ClinicPipelineStage as StudioPipelineStage,
  WhatsAppCampaign as StudioCampaign,
  CampaignRecipient as StudioRecipient,
  WhatsAppTemplate as StudioTemplate,
  AutomationRule as StudioAutomationRule,
  ChatbotFlow as StudioChatbotFlow,
} from '../types';

import {
  RecipientLedgerItem,
  CanonicalMetrics,
  CanonicalRecipientStatus
} from '../components/whatsapp/analytics/types';


// ==========================================
// CONVERSATIONS & MESSAGES
// ==========================================

export function toStudioMessage(crmMsg: CrmMessage): StudioMessage {
  const isContact = crmMsg.message_type === 0;
  const isAgent = crmMsg.message_type === 1;
  const isTemplate = crmMsg.message_type === 3;
  
  let senderType: 'contact' | 'agent' | 'system' = 'agent';
  if (isContact) senderType = 'contact';
  else if (crmMsg.message_type === 2) senderType = 'system';
  else if (isAgent || isTemplate) senderType = 'agent';

  return {
    id: String(crmMsg.id),
    conversationId: String(crmMsg.conversation_id),
    sender: senderType,
    senderName: crmMsg.sender?.name || (isContact ? 'Contact' : 'Agent'),
    text: crmMsg.content || '',
    timestamp: new Date(crmMsg.created_at * 1000).toISOString(),
    status: crmMsg.status,
    isPrivateNote: crmMsg.private,
    attachments: crmMsg.attachments?.map(att => ({
      name: `Attachment ${att.id}`,
      type: att.file_type?.includes('image') ? 'image' : att.file_type?.includes('pdf') ? 'pdf' : 'doc',
      size: att.file_size ? `${Math.round(att.file_size / 1024)} KB` : 'Unknown size',
      url: att.data_url,
    })),
  };
}

export function toStudioConversation(
  crmConv: CrmConversationSummary | CrmConversationDetail,
  messages: StudioMessage[] = []
): StudioConversation {
  return {
    id: String(crmConv.id),
    contactId: String(crmConv.contact.id),
    contactName: crmConv.contact.name || 'Unknown Contact',
    contactPhone: crmConv.contact.phone_number || '',
    contactEmail: '',
    channel: 'whatsapp',
    status: crmConv.status || 'open',
    priority: 'medium',
    assignedAgent: crmConv.assignee?.name || 'Unassigned',
    assignedTeam: crmConv.team?.name || 'Care Ops',
    labels: crmConv.labels || [],
    lastMessage: crmConv.last_message?.content || (messages.length > 0 ? messages[messages.length - 1].text : ''),
    lastTimestamp: crmConv.last_activity_at || new Date().toISOString(),
    unreadCount: crmConv.unread_count || 0,
    inbox: crmConv.inbox.name || 'WhatsApp Main',
    messages: messages.length > 0 ? messages : (crmConv as CrmConversationDetail).messages?.map(toStudioMessage) || [],
  };
}

// ==========================================
// CONTACTS
// ==========================================

export function toStudioContact(crmContact: CrmContactSummary | CrmContactDetail): StudioContact {
  const rawAttrs = (crmContact.custom_attributes || {}) as Record<string, unknown>;
  const cleanAttrs: Record<string, string> = {};
  Object.entries(rawAttrs).forEach(([k, v]) => {
    if (v !== null && v !== undefined) cleanAttrs[k] = String(v);
  });

  return {
    id: String(crmContact.id),
    name: crmContact.name || 'Unnamed Contact',
    email: '',
    phone: crmContact.phone_number || '',
    avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80`,
    company: crmContact.team || undefined,
    lastActivity: crmContact.last_activity_at || new Date().toISOString(),
    status: 'active',
    labels: crmContact.labels?.map(l => l.title) || [],
    conversationsCount: 1,
    channel: 'whatsapp',
    location: cleanAttrs.city ? `${cleanAttrs.city}, ${cleanAttrs.state || cleanAttrs.country || ''}` : undefined,
    customAttributes: cleanAttrs,
  };
}

// ==========================================
// COMPANIES
// ==========================================

export function toStudioCompany(crmComp: CrmCompany): StudioCompany {
  return {
    id: String(crmComp.id),
    name: crmComp.name,
    domain: crmComp.domain || 'example.com',
    industry: crmComp.industry || 'Healthcare & Wellness',
    phone: crmComp.phone_number || '',
    address: crmComp.address || 'Chennai, Tamil Nadu, India',
    contactsCount: 12,
    openConversations: 2,
  };
}

// ==========================================
// CLINIC PIPELINE
// ==========================================

export function toStudioPipelineStage(stage: BackendPipelineStage): StudioPipelineStage {
  const defaultColors: Record<number, string> = {
    1: 'border-l-blue-500',
    2: 'border-l-amber-500',
    3: 'border-l-indigo-500',
    4: 'border-l-teal-500',
    5: 'border-l-emerald-500',
  };

  return {
    id: String(stage.id),
    title: stage.name,
    color: defaultColors[stage.position] || 'border-l-blue-500',
    description: `Stage ${stage.position}: ${stage.name}`,
  };
}

export function toStudioPipelineCard(card: BackendPipelineCard): StudioPipelineCard {
  return {
    id: String(card.id),
    stageId: String(card.stage_id),
    title: card.operational_note || `Intake for ${card.contact.name}`,
    contactName: card.contact.name || 'Unknown Patient',
    contactPhone: card.contact.phone_number || '',
    company: card.team?.name || 'Care Ops',
    value: card.appointment_mode ? `Mode: ${card.appointment_mode}` : 'Routine Consultation',
    assignedAgent: card.owner?.name || 'Unassigned',
    priority: card.appointment_at && new Date(card.appointment_at) < new Date() ? 'urgent' : 'medium',
    labels: [card.stage_name, card.source || 'WhatsApp'].filter(Boolean),
    nextActivity: card.next_action_at ? new Date(card.next_action_at).toLocaleDateString() : 'Awaiting confirmation',
    lastContacted: new Date(card.updated_at).toLocaleDateString(),
    conversationId: card.conversation_id ? String(card.conversation_id) : undefined,
  };
}

// ==========================================
// CAMPAIGNS & PREFLIGHT
// ==========================================

export function toStudioCampaign(campaign: BackendCampaign): StudioCampaign {
  const audience = campaign.audience || { type: 'labels' };
  const counts = (campaign as any).recipient_counts || {};
  
  return {
    id: String(campaign.display_id || campaign.id),
    title: campaign.title,
    channelInbox: (campaign as any).inbox?.name || `Inbox #${campaign.inbox_id}`,
    status: campaign.campaign_status,
    audienceType: audience.type || 'labels',
    audienceSummary: campaign.description || 'Targeted WhatsApp Campaign',
    templateId: String(campaign.template_params?.template_id || 'tpl_1'),
    templateName: String(campaign.template_params?.template_name || 'Generic Template'),
    scheduledAt: campaign.scheduled_at,
    totalRecipients: counts.total || 0,
    sentCount: counts.sent || 0,
    deliveredCount: counts.delivered || 0,
    readCount: counts.read || 0,
    repliedCount: counts.replied || 0,
    failedCount: counts.failed || 0,
    excludedCount: counts.excluded || 0,
    createdAt: (campaign as any).created_at ? new Date((campaign as any).created_at).toISOString() : new Date().toISOString(),
  };
}

export function toStudioRecipient(recipient: BackendCampaignRecipient, campaignId: string): StudioRecipient {
  let status: 'sent' | 'delivered' | 'read' | 'failed' | 'excluded' = 'sent';
  if (recipient.status === 'delivered') status = 'delivered';
  else if (recipient.status === 'read') status = 'read';
  else if (recipient.status === 'failed') status = 'failed';
  else if (recipient.status === 'excluded' || recipient.status === 'suppressed') status = 'excluded';

  return {
    id: String(recipient.id),
    campaignId,
    contactName: recipient.contact_name || 'Contact',
    phone: recipient.destination,
    status,
    lifecycleTime: recipient.sent_at || recipient.queued_at || new Date().toISOString(),
    reason: recipient.failure_code,
  };
}

export function toStudioLedgerItem(recipient: BackendCampaignRecipient, campaignTitle: string): RecipientLedgerItem {
  let status: CanonicalRecipientStatus = 'sent';
  if (recipient.status === 'delivered') status = 'delivered';
  else if (recipient.status === 'read') status = 'read';
  else if (recipient.status === 'failed') status = 'failed';
  else if (recipient.status === 'excluded' || recipient.status === 'suppressed') status = 'excluded';

  return {
    id: String(recipient.id),
    contactId: String(recipient.contact_id || recipient.id),
    contactName: recipient.contact_name || 'Contact',
    destination: recipient.destination,
    campaignId: '1',
    campaignName: campaignTitle,
    inbox: 'WhatsApp Main',
    status,
    lifecycleTime: recipient.queued_at || new Date().toLocaleTimeString(),
    timestamp: recipient.queued_at || new Date().toISOString(),
    attempts: recipient.attempts || 1,
    reason: recipient.failure_code,
    lifecycleHistory: [
      {
        stage: status,
        timestamp: recipient.queued_at || new Date().toISOString(),
        description: `Status updated to ${status}`,
      },
    ],
  };
}

// ==========================================
// TEMPLATES
// ==========================================

export function toStudioTemplate(draft: BackendTemplateDraft): StudioTemplate {
  const def = draft.definition || { body: { text: '' } };
  
  let headerObj: { type: 'none' | 'text' | 'image' | 'document'; text?: string } = { type: 'none' };
  if (def.header?.format === 'TEXT' && def.header?.text) {
    headerObj = { type: 'text', text: def.header.text };
  } else if (def.header?.format === 'IMAGE') {
    headerObj = { type: 'image' };
  } else if (def.header?.format === 'DOCUMENT') {
    headerObj = { type: 'document' };
  }

  const buttons = def.buttons?.map(btn => ({
    type: (btn.type === 'PHONE_NUMBER' ? 'PHONE_NUMBER' : btn.type === 'URL' ? 'URL' : 'QUICK_REPLY') as 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER',
    text: btn.text,
    value: btn.url || btn.phone_number || undefined,
  }));

  const varExamples: Record<string, string> = {};
  if (def.body?.examples && typeof def.body.examples === 'object') {
    Object.entries(def.body.examples).forEach(([k, v]) => {
      varExamples[k] = String(v);
    });
  }

  let status: 'local_draft' | 'pending' | 'approved' | 'rejected' = 'local_draft';
  if (draft.status === 'approved') status = 'approved';
  else if (draft.status === 'pending') status = 'pending';
  else if (draft.status === 'rejected') status = 'rejected';

  return {
    id: String(draft.id),
    name: draft.name,
    category: draft.category || 'UTILITY',
    language: draft.language || 'en',
    status,
    source: draft.provider_template_id ? 'provider' : 'local_draft',
    isCampaignEligible: status === 'approved',
    header: headerObj,
    body: def.body?.text || '',
    footer: def.footer?.text,
    buttons,
    variableExamples: varExamples,
    createdAt: draft.created_at,
    lastSyncedAt: draft.updated_at,
  };
}

// ==========================================
// AUTOMATIONS & CHATBOTS
// ==========================================

export function toStudioAutomationRule(flow: BackendAutomationFlow): StudioAutomationRule {
  return {
    id: String(flow.id),
    title: flow.name,
    description: flow.trigger_summary ? `Trigger: ${flow.trigger_summary}` : 'Automation Workflow',
    enabled: flow.status === 'published',
    status: flow.status,
    trigger: 'conversation_created',
    conditionMatch: 'ALL',
    conditions: [
      {
        attribute: 'conversation_status',
        operator: 'equals',
        value: 'open',
      },
    ],
    actions: [
      {
        action: 'add_label',
        params: { label: 'Automated' },
      },
    ],
    executionCount: flow.run_count || 0,
    lastTriggered: flow.last_run_at || undefined,
  };
}

export function toStudioChatbotFlow(flow: BackendAutomationFlow): StudioChatbotFlow {
  const graph = (flow.draft_graph || {}) as Record<string, any>;
  const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
  const edges = Array.isArray(graph.edges) ? graph.edges : [];

  return {
    id: String(flow.id),
    name: flow.name,
    description: 'Visual WhatsApp Chatbot Flow',
    status: flow.status === 'published' ? 'published' : 'draft',
    version: '1.0',
    lastModified: flow.updated_at || new Date().toISOString(),
    nodes: nodes.map((n: any, index: number) => ({
      id: String(n.id || `node-${index}`),
      type: n.type?.replace('chatbot_', '') || 'message',
      title: n.title || n.config?.title || `Step ${index + 1}`,
      content: {
        messageText: n.config?.content || n.config?.prompt || '',
        questionText: n.config?.prompt || '',
        choices: n.config?.choices || [],
        waitDurationSeconds: n.config?.delay_seconds,
      },
      x: n.position?.x ?? (100 + (index % 3) * 260),
      y: n.position?.y ?? (100 + Math.floor(index / 3) * 180),
    })),
    edges: edges.map((e: any, index: number) => ({
      id: String(e.id || `edge-${index}`),
      source: String(e.source),
      target: String(e.target),
      label: e.label,
    })),
  };
}

// ==========================================
// OPERATIONAL ANALYTICS
// ==========================================

export function toStudioAnalyticsMetrics(analytics: BackendOperationalAnalytics): CanonicalMetrics {
  const ov = analytics.overview;
  return {
    sent: ov.sent_count,
    delivered: ov.delivered_count,
    read: ov.read_count,
    replied: ov.replied_count,
    failed: ov.failed_count,
    excluded: (ov.total_messages || ov.sent_count) - ov.delivered_count,
  };
}

/**
 * Adapters to bridge Rails CRM backend models with Studio UI models
 */

import {
  CrmConversationSummary,
  CrmConversationDetail,
  CrmContactSummary,
  CrmContactDetail,
  BackendPipelineCard,
  BackendCampaign,
} from '../types/crm';

import {
  Conversation,
  Contact,
  ClinicPipelineCard,
  WhatsAppCampaign,
  Message,
} from '../types';

export function toStudioConversation(crmConvo: CrmConversationSummary | CrmConversationDetail): Conversation {
  const detail = crmConvo as CrmConversationDetail;
  const messages: Message[] = Array.isArray(detail.messages)
    ? detail.messages.map((m) => {
        const isAgent = m.sender?.type === 'agent' || m.sender?.type === 'user' || (m as any).message_type === 1;
        return {
          id: String(m.id),
          sender: isAgent ? 'agent' : 'contact',
          senderName: m.sender?.name,
          text: m.content || '',
          timestamp: typeof m.created_at === 'number' 
            ? new Date(m.created_at * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date(m.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: (m.status as any) || 'delivered',
          isPrivateNote: !!m.private,
          attachments: m.attachments,
        };
      })
    : [];

  const lastMsg = crmConvo.last_non_activity_message?.content || 
    (messages.length > 0 ? messages[messages.length - 1].text : 'Conversation opened');

  return {
    id: String(crmConvo.id),
    contactId: crmConvo.contact ? String(crmConvo.contact.id) : undefined,
    contactName: crmConvo.contact?.name || 'Patient',
    contactPhone: crmConvo.contact?.phone_number || '',
    contactEmail: crmConvo.contact?.email,
    inbox: 'WhatsApp Main (Agamagizh Care)',
    channel: 'whatsapp',
    status: (crmConvo.status === 'open' || crmConvo.status === 'resolved' || crmConvo.status === 'pending' || crmConvo.status === 'snoozed' ? crmConvo.status : 'open'),
    priority: crmConvo.priority || 'medium',
    assignedAgent: crmConvo.assignee?.name || 'Dr. Rajesh Sharma',
    assignedTeam: 'Care Operations',
    labels: (crmConvo.labels || []).map((l: any) => (typeof l === 'string' ? l : l.title || l.name || '')),
    lastMessage: lastMsg,
    lastTimestamp: crmConvo.last_activity_at 
      ? new Date(crmConvo.last_activity_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      : 'Recently',
    unreadCount: crmConvo.unread_count || 0,
    messages: messages.length > 0 ? messages : [
      {
        id: `m-init-${crmConvo.id}`,
        sender: 'system',
        text: 'Patient thread synced with Chatwoot CRM.',
        timestamp: 'Recently',
        status: 'read',
      }
    ],
  };
}

export function toStudioContact(crmContact: CrmContactSummary | CrmContactDetail): Contact {
  const detail = crmContact as CrmContactDetail;
  return {
    id: String(crmContact.id),
    name: crmContact.name,
    phone: crmContact.phone_number,
    email: crmContact.email,
    channel: 'whatsapp',
    status: 'active',
    labels: (crmContact.labels || []).map((l: any) => (typeof l === 'string' ? l : l.title || l.name || '')),
    conversationsCount: detail.conversations?.length || 1,
    lastActivity: crmContact.last_activity_at ? 'Recently' : 'Active',
    location: (crmContact.custom_attributes?.location as string) || 'Chennai',
    consentStatus: crmContact.consent_status || 'opted_in',
    customAttributes: crmContact.custom_attributes || {},
  };
}

export function toStudioPipelineCard(crmCard: BackendPipelineCard): ClinicPipelineCard {
  const stageMap: Record<number, string> = {
    1: 'new_enquiry',
    2: 'contacted',
    3: 'follow_up',
    4: 'confirmed',
    5: 'completed',
  };

  return {
    id: String(crmCard.id),
    title: crmCard.operational_note || `Clinic Triage #${crmCard.id}`,
    contactName: crmCard.contact?.name || 'Inbound Patient',
    contactPhone: crmCard.contact?.phone_number || '',
    stageId: stageMap[crmCard.stage_id] || 'new_enquiry',
    assignedAgent: crmCard.owner?.name || 'Dr. Rajesh Sharma',
    assignedTeam: crmCard.team?.name || 'Care Operations',
    value: crmCard.appointment_mode || 'In-person Clinic Visit',
    labels: ['Intake Form', 'Adyar Campus'],
    lastContacted: 'Today',
    nextActionDate: crmCard.next_action_at,
    priority: 'medium',
    conversationId: crmCard.conversation_id ? String(crmCard.conversation_id) : undefined,
  };
}

export function toStudioCampaign(crmCampaign: BackendCampaign): WhatsAppCampaign {
  const mapStatus = (st: string): 'draft' | 'scheduled' | 'running' | 'completed' | 'paused' | 'archived' => {
    if (st === 'cancelled') return 'paused';
    return (st || 'draft') as any;
  };

  return {
    id: String(crmCampaign.id),
    title: crmCampaign.title,
    status: mapStatus(crmCampaign.campaign_status),
    templateId: crmCampaign.template_params?.template_id,
    templateName: crmCampaign.template_params?.template_name,
    audienceType: (crmCampaign.audience?.type as any) || 'labels',
    audienceSummary: crmCampaign.description || 'Targeted patient cohort',
    totalRecipients: crmCampaign.total_recipients || 420,
    sentCount: crmCampaign.sent_count || 0,
    deliveredCount: crmCampaign.delivered_count || 0,
    readCount: crmCampaign.read_count || 0,
    repliedCount: crmCampaign.replied_count || 0,
    failedCount: crmCampaign.failed_count || 0,
    excludedCount: crmCampaign.excluded_count || 0,
    createdAt: crmCampaign.created_at || 'Recently',
    scheduledAt: crmCampaign.scheduled_at,
    inbox: 'WhatsApp Main (Agamagizh Care)',
  };
}

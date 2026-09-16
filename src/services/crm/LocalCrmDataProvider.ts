/**
 * Local In-Memory CRM Data Provider
 * Provides offline/local development mode adhering strictly to Rails contracts and invariants.
 */

import { CrmDataProvider } from './CrmDataProvider';
import {
  UserProfile,
  AccountSummary,
  CrmInbox,
  CrmConversationSummary,
  CrmConversationDetail,
  CrmMessage,
  CrmContactSummary,
  CrmContactDetail,
  CrmCompany,
  BackendPipeline,
  BackendPipelineCard,
  BackendCampaign,
  BackendCampaignRecipient,
  BackendPreflightResult,
  BackendTemplateDraft,
  BackendPrepareDraftResponse,
  BackendAutomationFlow,
  BackendCapabilityRegistry,
  BackendChatbotStarter,
  BackendFlowRun,
  BackendOperationalAnalytics,
  CrmAgent,
  CrmTeam,
  ProviderWhatsAppTemplate,
  UpdateConsentPayload,
  WhatsAppOverviewData,
  BackendPipelineActivity,
} from '../../types/crm';

import {
  INITIAL_CONVERSATIONS,
  INITIAL_CONTACTS,
  INITIAL_COMPANIES,
  INITIAL_CAMPAIGNS,
  CAMPAIGN_RECIPIENTS_SAMPLE,
  INITIAL_RULES,
  INITIAL_CHATBOT,
  AGENTS_LIST,
  INITIAL_TEMPLATES,
} from '../../data/mockData';

import { OPERATIONAL_STAGES, INITIAL_PIPELINE_ITEMS } from '../../components/pipeline/pipelineMockData';
import { MOCK_GLOBAL_METRICS } from '../../components/whatsapp/analytics/analyticsMockData';

export class LocalCrmDataProvider implements CrmDataProvider {
  readonly mode = 'local' as const;
  readonly baseUrl = 'http://localhost:3000';
  accountId: number = 1;

  private userProfile: UserProfile = {
    id: 1,
    name: 'Dr. Rajesh Sharma',
    display_name: 'Dr. Rajesh (Care Ops Lead)',
    email: 'rajesh.sharma@agamagizh.org',
    role: 'administrator',
    availability: 'online',
    account_id: 1,
    accounts: [
      {
        id: 1,
        name: 'Agamagizh Care HQ (Chennai Main)',
        status: 'active',
        role: 'administrator',
        availability: 'online',
      },
      {
        id: 2,
        name: 'Agamagizh Rural Outreach Clinic (Coimbatore)',
        status: 'active',
        role: 'agent',
        availability: 'online',
      },
    ],
  };

  private inboxes: CrmInbox[] = [
    {
      id: 101,
      name: 'WhatsApp Main (Agamagizh Care)',
      channel_type: 'Channel::Whatsapp',
      phone_number: '+91 98400 12345',
      provider: 'whatsapp_cloud',
    },
    {
      id: 102,
      name: 'Emergency Patient Triage',
      channel_type: 'Channel::Whatsapp',
      phone_number: '+91 98400 67890',
      provider: 'whatsapp_cloud',
    },
  ];

  // Pipeline Cards in memory with lock_version
  private pipelineCards: BackendPipelineCard[] = INITIAL_PIPELINE_ITEMS.map((c, index) => ({
    id: 1000 + index,
    pipeline_id: 1,
    stage_id: c.stageId === 'new_enquiry' ? 1 : c.stageId === 'contacted' ? 2 : c.stageId === 'follow_up' ? 3 : c.stageId === 'confirmed' ? 4 : 5,
    stage_name: c.stageId.replace(/_/g, ' ').toUpperCase(),
    contact: {
      id: 200 + index,
      name: c.contactName,
      phone_number: c.contactPhone || '+91 98400 00000',
    },
    conversation_id: c.conversationId ? Number(c.conversationId.replace(/\D/g, '')) : undefined,
    owner: { id: 1, name: c.assignedAgent },
    team: { id: 1, name: c.assignedTeam || 'Care Operations' },
    source: 'whatsapp',
    external_source: 'patient_intake_form',
    external_reference_id: `REF-INT-${1000 + index}`,
    next_action_at: new Date(Date.now() + 86400000).toISOString(),
    appointment_at: new Date(Date.now() + 172800000).toISOString(),
    appointment_mode: 'In-person Clinic Visit',
    operational_note: c.title,
    position: index,
    lock_version: 1,
    updated_at: new Date().toISOString(),
    activities: [
      {
        id: 500 + index,
        action: 'card_created',
        changes: { stage: 'New Inquiry' },
        actor: 'Dr. Rajesh Sharma',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  }));

  // Campaigns in memory
  private campaigns: BackendCampaign[] = INITIAL_CAMPAIGNS.map((c, index) => ({
    id: index + 1,
    display_id: index + 1,
    title: c.title,
    description: c.audienceSummary,
    message: 'Hello {{1}}, this is an operational notice from Agamagizh Care.',
    enabled: c.status !== 'draft',
    inbox_id: 101,
    campaign_status: c.status as any,
    consent_purpose: 'appointment_reminders',
    consent_confirmed_at: new Date().toISOString(),
    throttle_per_minute: 200,
    local_safety_ceiling: 500,
    audience: {
      type: c.audienceType,
      id: 'default',
    },
    trigger_rules: {},
    template_params: {
      template_id: c.templateId,
      template_name: c.templateName,
    },
  }));

  // Template Drafts in memory
  private templateDrafts: BackendTemplateDraft[] = [
    {
      id: 1,
      inbox_id: 101,
      inbox_name: 'WhatsApp Main (Agamagizh Care)',
      name: 'appointment_reminder_v2',
      category: 'UTILITY',
      language: 'en',
      template_type: 'STANDARD',
      status: 'approved',
      definition: {
        header: { format: 'TEXT', text: 'Appointment Reminder: Agamagizh Care' },
        body: {
          text: 'Hello {{1}}, your consultation with {{2}} is confirmed for {{3}} at {{4}}. Please arrive 15 minutes early.',
          examples: { '1': 'Ananya', '2': 'Dr. Sharma', '3': 'Tomorrow', '4': '10:30 AM' },
        },
        footer: { text: 'Reply STOP to opt out of reminders' },
        buttons: [
          { type: 'QUICK_REPLY', text: 'Confirm Attendance' },
          { type: 'QUICK_REPLY', text: 'Reschedule Request' },
        ],
      },
      provider_template_id: 'meta_waba_tpl_098124',
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 2,
      inbox_id: 101,
      inbox_name: 'WhatsApp Main (Agamagizh Care)',
      name: 'post_discharge_checkin',
      category: 'UTILITY',
      language: 'en',
      template_type: 'STANDARD',
      status: 'approved',
      definition: {
        body: {
          text: 'Namaste {{1}}, how are you feeling today following your recent procedure? Please tap below to share your comfort rating.',
          examples: { '1': 'Karthik' },
        },
        buttons: [
          { type: 'QUICK_REPLY', text: 'Feeling Good' },
          { type: 'QUICK_REPLY', text: 'Need Nurse Callback' },
        ],
      },
      provider_template_id: 'meta_waba_tpl_772109',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ];

  // Automation Flows in memory
  private flows: BackendAutomationFlow[] = INITIAL_RULES.map((r, index) => ({
    id: index + 1,
    name: r.title,
    inbox_id: 101,
    status: r.enabled ? 'published' : 'draft',
    active_version_id: r.enabled ? 1 : null,
    run_count: r.executionCount || 0,
    last_run_at: new Date(Date.now() - 7200000).toISOString(),
    last_run_status: 'completed',
    last_published_at: r.enabled ? new Date(Date.now() - 86400000).toISOString() : null,
    published: r.enabled,
    mode: 'rule_builder',
    trigger_summary: r.trigger,
    action_summary: r.actions.map(a => a.action).join(', '),
    updated_at: new Date().toISOString(),
  }));

  // Account & Profile
  async getProfile(): Promise<UserProfile> {
    return this.userProfile;
  }

  async getAccounts(): Promise<AccountSummary[]> {
    return this.userProfile.accounts;
  }

  async switchAccount(accountId: number): Promise<void> {
    const found = this.userProfile.accounts.find(a => a.id === accountId);
    if (found) {
      this.accountId = accountId;
      this.userProfile.account_id = accountId;
    }
  }

  async checkHealth(): Promise<{ status: 'healthy' | 'unreachable' | 'degraded'; latencyMs: number }> {
    return { status: 'healthy', latencyMs: 8 };
  }

  // Inboxes, Agents & Teams
  async getInboxes(): Promise<CrmInbox[]> {
    return this.inboxes;
  }

  async getAgents(inboxId?: number): Promise<CrmAgent[]> {
    return AGENTS_LIST.map((a: any, idx) => ({
      id: idx + 1,
      name: a.name,
      email: a.email,
      role: (a.role || 'agent').toLowerCase(),
      availability: a.status || 'online',
      avatar_url: a.avatar,
    }));
  }

  async getTeams(): Promise<CrmTeam[]> {
    return [
      { id: 1, name: 'Care Navigation & Triage', description: 'Frontline patient enquiry and initial intake', allow_auto_assign: true },
      { id: 2, name: 'Clinical Follow-up Team', description: 'Post-consultation and medication query management', allow_auto_assign: true },
      { id: 3, name: 'Billing & Insurance Desk', description: 'OP/IP tariff and cashless authorization', allow_auto_assign: false },
      { id: 4, name: 'Senior Consultant Desk', description: 'Escalations and complex medical protocol queries', allow_auto_assign: false },
    ];
  }

  // Conversations & Messages
  async getConversations(params?: { status?: string; q?: string; page?: number; perPage?: number; per_page?: number }): Promise<{
    conversations: CrmConversationSummary[];
    meta: { count: number; page: number; per_page: number };
  }> {
    let list = INITIAL_CONVERSATIONS;
    if (params?.status && params.status !== 'all') {
      list = list.filter(c => c.status === params.status);
    }
    if (params?.q) {
      const query = params.q.toLowerCase();
      list = list.filter(
        c => c.contactName.toLowerCase().includes(query) || c.contactPhone.includes(query)
      );
    }

    const summaries: CrmConversationSummary[] = list.map(c => ({
      id: Number(c.id) || 1,
      display_id: Number(c.id) || 1,
      inbox_id: 101,
      uuid: `uuid-${c.id}`,
      contact: {
        id: Number(c.contactId) || 1,
        name: c.contactName,
        phone_number: c.contactPhone,
      },
      inbox: {
        id: 101,
        name: c.inbox,
        provider: 'whatsapp_cloud',
      },
      status: c.status as any,
      unread_count: c.unreadCount,
      messages_count: (c.messages || []).length,
      assignee: { id: 1, name: c.assignedAgent, role: 'agent' },
      team: { id: 1, name: c.assignedTeam },
      labels: c.labels,
      can_reply: true,
      pipeline_stage: 'Active Triage',
      last_activity_at: c.lastTimestamp,
      last_message: {
        id: 1,
        content: c.lastMessage,
        message_type: 0,
        status: 'read',
        content_type: 'text',
      },
    }));

    return {
      conversations: summaries,
      meta: { count: summaries.length, page: params?.page || 1, per_page: 25 },
    };
  }

  async getConversation(id: number | string): Promise<CrmConversationDetail> {
    const found = INITIAL_CONVERSATIONS.find(c => String(c.id) === String(id)) || INITIAL_CONVERSATIONS[0];
    
    return {
      id: Number(found.id) || 1,
      display_id: Number(found.id) || 1,
      inbox_id: 101,
      messages_count: (found.messages || []).length,
      uuid: `uuid-${found.id}`,
      contact: {
        id: Number(found.contactId) || 1,
        name: found.contactName,
        phone_number: found.contactPhone,
      },
      inbox: {
        id: 101,
        name: found.inbox,
        provider: 'whatsapp_cloud',
      },
      status: found.status as any,
      unread_count: found.unreadCount,
      assignee: { id: 1, name: found.assignedAgent, role: 'agent' },
      team: { id: 1, name: found.assignedTeam },
      labels: found.labels,
      can_reply: true,
      pipeline_stage: 'Active Triage',
      last_activity_at: found.lastTimestamp,
      messages: found.messages.map((m, idx) => ({
        id: idx + 1,
        content: m.text,
        message_type: m.sender === 'contact' ? 0 : m.sender === 'system' ? 2 : 1,
        status: (m.status || 'read') as any,
        content_type: 'text',
        conversation_id: Number(found.id) || 1,
        inbox_id: 101,
        created_at: Math.floor(new Date(m.timestamp).getTime() / 1000),
        private: !!m.isPrivateNote,
        sender: {
          id: m.sender === 'contact' ? 201 : 1,
          name: m.senderName || (m.sender === 'contact' ? found.contactName : 'Dr. Rajesh Sharma'),
          type: m.sender === 'contact' ? 'contact' : 'user',
        },
      })),
    };
  }

  async sendMessage(
    conversationId: number | string,
    content: string,
    isPrivate?: boolean
  ): Promise<CrmMessage> {
    const newMsg: CrmMessage = {
      id: Date.now(),
      content,
      message_type: isPrivate ? 2 : 1,
      status: 'sent',
      content_type: 'text',
      conversation_id: Number(conversationId),
      inbox_id: 101,
      created_at: Math.floor(Date.now() / 1000),
      private: !!isPrivate,
      sender: {
        id: 1,
        name: 'Dr. Rajesh Sharma',
        type: 'user',
      },
    };
    return newMsg;
  }

  async toggleConversationStatus(conversationId: number | string, status?: string): Promise<void> {
    const conv = INITIAL_CONVERSATIONS.find(c => String(c.id) === String(conversationId));
    if (conv) {
      conv.status = (status || (conv.status === 'open' ? 'resolved' : 'open')) as any;
    }
  }

  async toggleConversationPriority(conversationId: number | string, priority: string): Promise<void> {
    const conv = INITIAL_CONVERSATIONS.find(c => String(c.id) === String(conversationId));
    if (conv) {
      conv.priority = priority as any;
    }
  }

  async assignConversationAgent(conversationId: number | string, assigneeId?: number): Promise<void> {
    const conv = INITIAL_CONVERSATIONS.find(c => String(c.id) === String(conversationId));
    if (conv) {
      conv.assignedAgent = assigneeId ? 'Dr. Rajesh Sharma' : 'Unassigned';
    }
  }

  async assignConversationTeam(conversationId: number | string, teamId?: number): Promise<void> {
    const conv = INITIAL_CONVERSATIONS.find(c => String(c.id) === String(conversationId));
    if (conv) {
      conv.assignedTeam = teamId ? 'Care Operations' : 'General';
    }
  }

  async updateConversationLabels(conversationId: number | string, labels: string[]): Promise<void> {
    const conv = INITIAL_CONVERSATIONS.find(c => String(c.id) === String(conversationId));
    if (conv) {
      conv.labels = labels;
    }
  }

  // Contacts
  async getContacts(params?: { q?: string; page?: number; perPage?: number; per_page?: number }): Promise<{
    contacts: CrmContactSummary[];
    meta: { count: number; page: number; per_page: number };
  }> {
    let list = INITIAL_CONTACTS;
    if (params?.q) {
      const q = params.q.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q));
    }

    const summaries: CrmContactSummary[] = list.map(c => ({
      id: Number(c.id) || 1,
      name: c.name,
      phone_number: c.phone,
      identifier: `PAT-${c.id}`,
      custom_attributes: {
        city: 'Chennai',
        country: 'India',
        preferred_contact_channel: 'whatsapp',
        preferred_language: 'ta',
      },
      labels: c.labels.map((l, i) => ({ id: i + 1, title: l })),
      whatsapp_identities: [
        { inbox_id: 101, inbox_name: 'WhatsApp Main', source_id: c.phone },
      ],
      last_activity_at: c.lastActivity,
      consent_status: 'opted_in',
      pipeline_stage: 'Follow-up Scheduled',
      owner: 'Dr. Rajesh Sharma',
      team: 'Care Operations',
      open_conversation_id: 1,
    }));

    return {
      contacts: summaries,
      meta: { count: summaries.length, page: params?.page || 1, per_page: 20 },
    };
  }

  async getContact(id: number | string): Promise<CrmContactDetail> {
    const base = (await this.getContacts()).contacts.find(c => String(c.id) === String(id)) || (await this.getContacts()).contacts[0];
    
    return {
      ...base,
      consents: [
        {
          purpose: 'appointment_reminders',
          status: 'opted_in',
          source: 'clinic_intake_paper_consent',
          captured_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        },
        {
          purpose: 'health_tips_and_broadcasts',
          status: 'opted_in',
          source: 'whatsapp_qr_kiosk',
          captured_at: new Date(Date.now() - 86400000 * 14).toISOString(),
        },
      ],
      conversations: [
        {
          id: 1,
          display_id: 1,
          status: 'open',
          inbox_id: 101,
          last_activity_at: new Date().toISOString(),
        },
      ],
      campaigns: [
        {
          id: 1,
          campaign_id: 1,
          campaign_title: 'Pre-op Fasting Notice',
          status: 'delivered',
          destination: base.phone_number,
          delivered_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      pipeline: [
        {
          id: 1001,
          pipeline: 'Clinic Patient Intake',
          stage: 'Clinical Triage',
          owner: 'Dr. Rajesh Sharma',
          team: 'Care Operations',
          next_action_at: new Date(Date.now() + 86400000).toISOString(),
          appointment_at: new Date(Date.now() + 172800000).toISOString(),
          appointment_mode: 'In-person Clinic Visit',
        },
      ],
      automations: [
        {
          id: 1,
          flow: 'WhatsApp Inbound Greeting',
          status: 'completed',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date(Date.now() - 3590000).toISOString(),
        },
      ],
      appointments: [
        {
          pipeline_card_id: 1001,
          at: new Date(Date.now() + 172800000).toISOString(),
          mode: 'In-person Clinic Visit',
          reference: 'REF-INT-1001',
          source: 'patient_intake_form',
        },
      ],
      activity: [
        {
          id: 1,
          pipeline_card_id: 1001,
          action: 'Moved to Clinical Triage',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
    };
  }

  async createContact(data: Partial<CrmContactSummary>): Promise<CrmContactSummary> {
    const created: CrmContactSummary = {
      id: Date.now(),
      name: data.name || 'New Patient',
      phone_number: data.phone_number || '+91 90000 00000',
      custom_attributes: data.custom_attributes || {},
      labels: data.labels || [],
      whatsapp_identities: [
        { inbox_id: 101, inbox_name: 'WhatsApp Main', source_id: data.phone_number || '' },
      ],
      consent_status: 'opted_in',
      last_activity_at: new Date().toISOString(),
    };
    return created;
  }

  async updateContact(id: number | string, data: Partial<CrmContactSummary>): Promise<CrmContactSummary> {
    const contact = await this.getContact(id);
    return { ...contact, ...data };
  }

  async updateContactConsent(contactId: number | string, consent: UpdateConsentPayload): Promise<CrmContactDetail> {
    const contact = await this.getContact(contactId);
    const existingConsentIndex = contact.consents.findIndex(c => c.purpose === consent.purpose);
    if (existingConsentIndex >= 0) {
      contact.consents[existingConsentIndex] = {
        ...contact.consents[existingConsentIndex],
        status: consent.status,
        source: consent.source || contact.consents[existingConsentIndex].source,
        captured_at: new Date().toISOString(),
      };
    } else {
      contact.consents.push({
        purpose: consent.purpose,
        status: consent.status,
        source: consent.source || 'Studio UI',
        captured_at: new Date().toISOString(),
      });
    }
    return contact;
  }

  async updateContactLabels(contactId: number | string, labels: string[]): Promise<void> {
    const contact = await this.getContact(contactId);
    contact.labels = labels.map((l, i) => ({ id: i + 1, title: l }));
  }

  async updateContactAttributes(contactId: number | string, attributes: Record<string, unknown>): Promise<void> {
    const contact = await this.getContact(contactId);
    contact.custom_attributes = {
      ...contact.custom_attributes,
      ...attributes,
    };
  }

  // Companies
  async getCompanies(): Promise<CrmCompany[]> {
    return INITIAL_COMPANIES.map(c => ({
      id: Number(c.id.replace(/\D/g, '')) || 1,
      name: c.name,
      domain: c.domain,
      industry: c.industry,
      phone_number: c.phone,
      address: c.address,
    }));
  }

  async getCompany(id: number | string): Promise<CrmCompany> {
    const comps = await this.getCompanies();
    return comps.find(c => String(c.id) === String(id)) || comps[0];
  }

  // WhatsApp Operations & Overview
  async getWhatsAppOverview(): Promise<WhatsAppOverviewData> {
    const drafts = await this.getTemplateDrafts();
    return {
      inboxes: this.inboxes,
      channelState: {
        status: 'connected',
        phoneNumber: '+91 98400 12345',
        displayName: 'Agamagizh WhatsApp Care HQ',
        qualityRating: 'GREEN',
        messagingLimit: '250 / 24hrs (Safe Local Mode)',
        lastSyncAt: new Date().toISOString(),
      },
      templateSyncState: {
        totalTemplates: drafts.length + INITIAL_TEMPLATES.length,
        approvedCount: drafts.filter(d => d.status === 'approved').length + INITIAL_TEMPLATES.filter(t => t.status === 'approved').length,
        pendingCount: drafts.filter(d => d.status === 'pending').length + INITIAL_TEMPLATES.filter(t => t.status === 'pending').length,
        rejectedCount: drafts.filter(d => d.status === 'rejected').length + INITIAL_TEMPLATES.filter(t => t.status === 'rejected').length,
        draftCount: drafts.filter(d => d.status === 'draft').length,
        lastSyncedAt: new Date().toISOString(),
      },
      campaignMetrics: {
        totalSent: MOCK_GLOBAL_METRICS.sent,
        deliveryRate: Math.round((MOCK_GLOBAL_METRICS.delivered / MOCK_GLOBAL_METRICS.sent) * 100),
        readRate: Math.round((MOCK_GLOBAL_METRICS.read / MOCK_GLOBAL_METRICS.delivered) * 100),
        replyRate: Math.round((MOCK_GLOBAL_METRICS.replied / MOCK_GLOBAL_METRICS.delivered) * 100),
      },
      consentHealth: {
        totalContacts: INITIAL_CONTACTS.length,
        marketingOptedIn: Math.round(INITIAL_CONTACTS.length * 0.75),
        transactionalOptedIn: Math.round(INITIAL_CONTACTS.length * 0.95),
        optedOut: Math.round(INITIAL_CONTACTS.length * 0.05),
      },
      automationStatus: {
        activeFlows: this.flows.filter(f => f.published).length,
        totalExecutionsToday: 142,
        failedExecutionsToday: 1,
      },
    };
  }

  // Clinic Pipeline
  async getPipelines(): Promise<BackendPipeline[]> {
    return [
      {
        id: 1,
        name: 'Clinic Patient Intake Pipeline',
        stages: OPERATIONAL_STAGES.map((s, idx) => ({
          id: idx + 1,
          name: s.title,
          position: idx + 1,
        })),
      },
    ];
  }

  async getPipelineCards(): Promise<BackendPipelineCard[]> {
    return this.pipelineCards;
  }

  async getPipelineCard(id: number | string): Promise<BackendPipelineCard> {
    const card = this.pipelineCards.find(c => String(c.id) === String(id));
    if (!card) throw new Error(`Card #${id} not found`);
    return card;
  }

  async getPipelineActivities(cardId: number | string): Promise<BackendPipelineActivity[]> {
    const card = await this.getPipelineCard(cardId);
    return card.activities || [];
  }

  async createPipelineCard(card: Partial<BackendPipelineCard>): Promise<BackendPipelineCard> {
    const newCard: BackendPipelineCard = {
      id: Date.now(),
      pipeline_id: card.pipeline_id || 1,
      stage_id: card.stage_id || 1,
      stage_name: card.stage_name || 'NEW INQUIRY',
      contact: card.contact || { id: 999, name: 'Walk-in Patient', phone_number: '+91 99999 99999' },
      owner: card.owner || { id: 1, name: 'Dr. Rajesh Sharma' },
      team: card.team || { id: 1, name: 'Care Operations' },
      source: 'whatsapp',
      operational_note: card.operational_note || 'Direct triage creation',
      position: this.pipelineCards.length,
      lock_version: 1,
      updated_at: new Date().toISOString(),
      activities: [
        {
          id: Date.now(),
          action: 'card_created',
          changes: {},
          actor: 'Dr. Rajesh Sharma',
          created_at: new Date().toISOString(),
        },
      ],
    };
    this.pipelineCards.push(newCard);
    return newCard;
  }

  async updatePipelineCard(id: number | string, card: Partial<BackendPipelineCard>): Promise<BackendPipelineCard> {
    const index = this.pipelineCards.findIndex(c => String(c.id) === String(id));
    if (index === -1) throw new Error(`Card #${id} not found`);

    const existing = this.pipelineCards[index];
    const updated: BackendPipelineCard = {
      ...existing,
      ...card,
      lock_version: existing.lock_version + 1,
      updated_at: new Date().toISOString(),
    };
    this.pipelineCards[index] = updated;
    return updated;
  }

  async movePipelineCard(
    id: number | string,
    targetStageId: number,
    position: number,
    lockVersion: number
  ): Promise<BackendPipelineCard> {
    const card = this.pipelineCards.find(c => String(c.id) === String(id));
    if (!card) throw new Error(`Card #${id} not found`);

    // Invariant: Optimistic locking validation
    if (card.lock_version !== lockVersion) {
      const conflictError = new Error('This card changed elsewhere. The board has been refreshed.');
      (conflictError as any).status = 409;
      (conflictError as any).card = card;
      throw conflictError;
    }

    const stages = (await this.getPipelines())[0].stages;
    const stage = stages.find(s => s.id === targetStageId);

    card.stage_id = targetStageId;
    if (stage) card.stage_name = stage.name;
    card.position = position;
    card.lock_version += 1;
    card.updated_at = new Date().toISOString();

    if (!card.activities) card.activities = [];
    card.activities.unshift({
      id: Date.now(),
      action: 'card_moved',
      changes: { stage_id: targetStageId, position },
      actor: 'Dr. Rajesh Sharma',
      created_at: new Date().toISOString(),
    });

    return card;
  }

  async deletePipelineCard(id: number | string): Promise<void> {
    this.pipelineCards = this.pipelineCards.filter(c => String(c.id) !== String(id));
  }

  // Campaigns
  async getCampaigns(): Promise<BackendCampaign[]> {
    return this.campaigns;
  }

  async getCampaign(id: number | string): Promise<BackendCampaign> {
    const found = this.campaigns.find(c => String(c.display_id || c.id) === String(id));
    if (!found) throw new Error(`Campaign #${id} not found`);
    return found;
  }

  async createCampaign(campaign: Partial<BackendCampaign>): Promise<BackendCampaign> {
    const newCampaign: BackendCampaign = {
      id: this.campaigns.length + 1,
      display_id: this.campaigns.length + 1,
      title: campaign.title || 'Untitled Campaign',
      description: campaign.description,
      message: campaign.message || '',
      enabled: campaign.enabled ?? false,
      inbox_id: campaign.inbox_id || 101,
      campaign_status: campaign.campaign_status || 'draft',
      consent_purpose: campaign.consent_purpose || 'appointment_reminders',
      consent_confirmed_at: campaign.consent_confirmed_at || new Date().toISOString(),
      throttle_per_minute: campaign.throttle_per_minute || 120,
      local_safety_ceiling: campaign.local_safety_ceiling || 500,
      audience: campaign.audience || { type: 'labels' },
      template_params: campaign.template_params || {},
    };
    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  async updateCampaign(id: number | string, campaign: Partial<BackendCampaign>): Promise<BackendCampaign> {
    const index = this.campaigns.findIndex(c => String(c.display_id || c.id) === String(id));
    if (index === -1) throw new Error(`Campaign #${id} not found`);
    this.campaigns[index] = { ...this.campaigns[index], ...campaign };
    return this.campaigns[index];
  }

  // Invariants: Candidates != Eligible; Failed != Excluded
  async preflightPreview(campaign: Partial<BackendCampaign>): Promise<BackendPreflightResult> {
    const candidates = 1240;
    const eligible = 890;
    const excludedCount = candidates - eligible; // 350

    return {
      total: candidates,
      eligible: eligible,
      within_safety_ceiling: eligible <= (campaign.local_safety_ceiling || 1000),
      excluded: {
        missing_consent: 180,
        consent_revoked: 45,
        duplicate_destination: 55,
        suppressed: 40,
        invalid_phone: 20,
        missing_contact_inbox: 10,
      },
      planner: {
        candidates: candidates,
        valid: eligible,
        excluded: excludedCount,
        duplicate: 55,
        suppressed: 40,
        no_consent: 225, // missing_consent + consent_revoked
        invalid_phone: 20,
        missing_contact_inbox: 10,
      },
    };
  }

  async getCampaignPreflight(campaignId: number | string): Promise<BackendPreflightResult> {
    const campaign = await this.getCampaign(campaignId);
    return this.preflightPreview(campaign);
  }

  async getCampaignRecipients(
    campaignId: number | string,
    params?: { status?: string; page?: number; perPage?: number }
  ): Promise<{
    recipients: BackendCampaignRecipient[];
    meta: { total: number; page: number; per_page: number };
  }> {
    let list = CAMPAIGN_RECIPIENTS_SAMPLE;
    if (params?.status && params.status !== 'all') {
      list = list.filter(r => r.status === params.status);
    }

    const payload: BackendCampaignRecipient[] = list.map((r: any, idx) => ({
      id: idx + 1,
      contact_id: r.contact_id || (100 + idx),
      contact_name: r.name || r.contactName || 'Recipient',
      name: r.name || r.contactName || 'Recipient',
      destination: r.phone_number || r.phone || '',
      phone_number: r.phone_number || r.phone || '',
      status: r.status,
      failure_code: r.failure_reason || r.reason,
      attempts: 1,
      queued_at: new Date(Date.now() - 3600000).toISOString(),
      sent_at: new Date(Date.now() - 3500000).toISOString(),
      delivered_at: r.status !== 'failed' && r.status !== 'excluded' ? new Date(Date.now() - 3400000).toISOString() : undefined,
      read_at: r.status === 'read' ? new Date(Date.now() - 3000000).toISOString() : undefined,
      failed_at: r.status === 'failed' ? new Date(Date.now() - 3500000).toISOString() : undefined,
    }));

    return {
      recipients: payload,
      meta: { total: payload.length, page: params?.page || 1, per_page: params?.perPage || 50 },
    };
  }

  async getCampaignRecipient(campaignId: number | string, recipientId: number | string): Promise<BackendCampaignRecipient> {
    const res = await this.getCampaignRecipients(campaignId, { page: 1, perPage: 100 });
    const found = res.recipients.find(r => String(r.id) === String(recipientId));
    if (!found) throw new Error(`Recipient #${recipientId} not found`);
    return found;
  }

  exportCampaignRecipientsUrl(campaignId: number | string): string {
    return `/api/v1/accounts/${this.accountId}/campaigns/${campaignId}/recipient_export`;
  }

  async campaignLifecycle(
    campaignId: number | string,
    action: 'pause' | 'resume' | 'cancel' | 'recompute'
  ): Promise<void> {
    const campaign = await this.getCampaign(campaignId);
    if (action === 'pause') campaign.campaign_status = 'paused';
    else if (action === 'resume') campaign.campaign_status = 'running';
    else if (action === 'cancel') campaign.campaign_status = 'cancelled';
  }

  async previewAudienceCsv(file: File): Promise<{ total_rows: number; valid_rows: number; invalid_rows: number; sample: any[] }> {
    return {
      total_rows: 250,
      valid_rows: 232,
      invalid_rows: 18,
      sample: [
        { name: 'Dr. Anand Raman', phone: '+919840011111', consent_source: 'kiosk' },
        { name: 'Lakshmi Narayanan', phone: '+919840022222', consent_source: 'web_form' },
      ],
    };
  }

  async importAudienceCsv(
    file: File,
    inboxId: number,
    mapping: Record<string, string>,
    confirmConsent: boolean
  ): Promise<{ imported_count: number; label: string }> {
    return {
      imported_count: 232,
      label: `broadcast_csv_${Date.now()}_import`,
    };
  }

  // Templates
  async getProviderTemplates(inboxId?: number): Promise<ProviderWhatsAppTemplate[]> {
    const statusMap: Record<string, 'APPROVED' | 'PENDING' | 'REJECTED' | 'PAUSED'> = {
      approved: 'APPROVED',
      pending: 'PENDING',
      rejected: 'REJECTED',
      paused: 'PAUSED',
    };
    return INITIAL_TEMPLATES.map(t => ({
      id: t.id,
      name: t.name,
      category: t.category,
      language: t.language,
      status: statusMap[t.status.toLowerCase()] || 'APPROVED',
      components: [
        ...(t.header ? [{ type: 'HEADER' as const, format: t.header.type.toUpperCase(), text: t.header.text }] : []),
        { type: 'BODY' as const, text: t.body },
        ...(t.footer ? [{ type: 'FOOTER' as const, text: t.footer }] : []),
        ...(t.buttons ? [{ type: 'BUTTONS' as const, buttons: t.buttons }] : []),
      ],
      campaign_eligible: t.isCampaignEligible,
      last_synced_at: new Date().toISOString(),
    }));
  }

  async getTemplateDrafts(): Promise<BackendTemplateDraft[]> {
    return this.templateDrafts;
  }

  async getTemplateDraft(id: number | string): Promise<BackendTemplateDraft> {
    const found = this.templateDrafts.find(d => String(d.id) === String(id));
    if (!found) throw new Error(`Template draft #${id} not found`);
    return found;
  }

  async createTemplateDraft(draft: Partial<BackendTemplateDraft>): Promise<BackendTemplateDraft> {
    const newDraft: BackendTemplateDraft = {
      id: Date.now(),
      inbox_id: draft.inbox_id || 101,
      inbox_name: 'WhatsApp Main (Agamagizh Care)',
      name: draft.name || 'new_template_draft',
      category: draft.category || 'UTILITY',
      language: draft.language || 'en',
      template_type: draft.template_type || 'STANDARD',
      status: 'draft',
      definition: draft.definition || { body: { text: '' } },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.templateDrafts.unshift(newDraft);
    return newDraft;
  }

  async updateTemplateDraft(id: number | string, draft: Partial<BackendTemplateDraft>): Promise<BackendTemplateDraft> {
    const index = this.templateDrafts.findIndex(d => String(d.id) === String(id));
    if (index === -1) throw new Error(`Template draft #${id} not found`);
    this.templateDrafts[index] = { ...this.templateDrafts[index], ...draft, updated_at: new Date().toISOString() };
    return this.templateDrafts[index];
  }

  async prepareTemplateDraft(id: number | string): Promise<BackendPrepareDraftResponse> {
    const draft = await this.getTemplateDraft(id);
    return {
      draft,
      provider_payload: {
        name: draft.name,
        language: draft.language,
        category: draft.category,
        components: [
          { type: 'BODY', text: draft.definition.body.text },
        ],
      },
      submission_blocked: true, // Safely locked per instructions
    };
  }

  // Automations & Chatbots
  async getAutomationFlows(): Promise<BackendAutomationFlow[]> {
    return this.flows;
  }

  async getAutomationFlow(id: number | string): Promise<BackendAutomationFlow> {
    const found = this.flows.find(f => String(f.id) === String(id));
    if (!found) throw new Error(`Flow #${id} not found`);
    return found;
  }

  async getCapabilities(): Promise<BackendCapabilityRegistry> {
    return {
      schema_version: 2,
      product_modes: ['rule_builder', 'chatbot'],
      triggers: [
        {
          key: 'inbound_whatsapp',
          label_key: 'AUTOMATION_FLOWS.TRIGGERS.INBOUND_WHATSAPP',
          category: 'whatsapp',
          fields: [{ key: 'keywords', type: 'tags', required: false }],
          enabled: true,
        },
      ],
      conditions: [
        { key: 'contact_label', label_key: 'AUTOMATION_FLOWS.CONDITIONS.CONTACT_LABEL', category: 'condition', enabled: true },
        { key: 'contact_attribute', label_key: 'AUTOMATION_FLOWS.CONDITIONS.CONTACT_ATTRIBUTE', category: 'condition', enabled: true },
        { key: 'marketing_consent', label_key: 'AUTOMATION_FLOWS.CONDITIONS.MARKETING_CONSENT', category: 'condition', enabled: true },
        { key: 'conversation_status', label_key: 'AUTOMATION_FLOWS.CONDITIONS.CONVERSATION_STATUS', category: 'condition', enabled: true },
        { key: 'assignee_id', label_key: 'AUTOMATION_FLOWS.CONDITIONS.ASSIGNEE_ID', category: 'condition', enabled: true },
        { key: 'team_id', label_key: 'AUTOMATION_FLOWS.CONDITIONS.TEAM_ID', category: 'condition', enabled: true },
        { key: 'pipeline_stage', label_key: 'AUTOMATION_FLOWS.CONDITIONS.PIPELINE_STAGE', category: 'condition', enabled: true },
      ],
      actions: [
        { key: 'handoff', label_key: 'AUTOMATION_FLOWS.ACTIONS.HANDOFF', category: 'operations', terminal: true, enabled: true },
        { key: 'end', label_key: 'AUTOMATION_FLOWS.ACTIONS.END', category: 'operations', terminal: true, enabled: true },
        { key: 'send_template', label_key: 'AUTOMATION_FLOWS.ACTIONS.SEND_TEMPLATE', category: 'messaging', enabled: true },
        { key: 'send_text', label_key: 'AUTOMATION_FLOWS.ACTIONS.SEND_TEXT', category: 'messaging', enabled: true },
        { key: 'add_label', label_key: 'AUTOMATION_FLOWS.ACTIONS.ADD_LABEL', category: 'operations', enabled: true },
        { key: 'remove_label', label_key: 'AUTOMATION_FLOWS.ACTIONS.REMOVE_LABEL', category: 'operations', enabled: true },
        { key: 'assign_agent', label_key: 'AUTOMATION_FLOWS.ACTIONS.ASSIGN_AGENT', category: 'operations', enabled: true },
        { key: 'assign_team', label_key: 'AUTOMATION_FLOWS.ACTIONS.ASSIGN_TEAM', category: 'operations', enabled: true },
        { key: 'create_pipeline_card', label_key: 'AUTOMATION_FLOWS.ACTIONS.CREATE_PIPELINE_CARD', category: 'operations', enabled: true },
        { key: 'move_pipeline_card', label_key: 'AUTOMATION_FLOWS.ACTIONS.MOVE_PIPELINE_CARD', category: 'operations', enabled: true },
      ],
      flow_nodes: [
        { key: 'wait', label_key: 'AUTOMATION_FLOWS.NODES.WAIT', category: 'control', enabled: true },
        { key: 'condition_group', label_key: 'AUTOMATION_FLOWS.NODES.CONDITION_GROUP', category: 'control', enabled: true },
      ],
      chatbot_nodes: [
        { key: 'chatbot_start', label_key: 'AUTOMATION_FLOWS.NODES.CHATBOT_START', category: 'control', enabled: true },
        { key: 'chatbot_message', label_key: 'AUTOMATION_FLOWS.NODES.CHATBOT_MESSAGE', category: 'messaging', enabled: true },
        { key: 'chatbot_question', label_key: 'AUTOMATION_FLOWS.NODES.CHATBOT_QUESTION', category: 'messaging', enabled: true },
        { key: 'chatbot_choice', label_key: 'AUTOMATION_FLOWS.NODES.CHATBOT_CHOICE', category: 'logic', enabled: true },
        { key: 'chatbot_condition', label_key: 'AUTOMATION_FLOWS.NODES.CHATBOT_CONDITION', category: 'logic', enabled: true },
        { key: 'wait', label_key: 'AUTOMATION_FLOWS.NODES.WAIT', category: 'control', enabled: true },
        { key: 'chatbot_handoff', label_key: 'AUTOMATION_FLOWS.NODES.CHATBOT_HANDOFF', category: 'operations', terminal: true, enabled: true },
        { key: 'chatbot_end', label_key: 'AUTOMATION_FLOWS.NODES.CHATBOT_END', category: 'control', terminal: true, enabled: true },
      ],
    };
  }

  async getChatbotStarters(): Promise<BackendChatbotStarter[]> {
    return [
      {
        id: 'appointment_triage',
        title: 'Clinic Appointment Triage',
        description: 'Collect patient symptoms, confirm appointment slot, and hand off to nurse.',
        category: 'Clinical Operations',
        nodes_count: 6,
      },
      {
        id: 'faq_general',
        title: 'Hospital Hours & Location FAQ',
        description: 'Provide instant answers on visiting hours, clinic locations, and pharmacy timings.',
        category: 'Information & FAQs',
        nodes_count: 4,
      },
      {
        id: 'feedback_collector',
        title: 'Post-Visit Care Satisfaction',
        description: 'Collect CSAT rating and prompt for optional feedback comments.',
        category: 'Feedback',
        nodes_count: 5,
      },
    ];
  }

  async createChatbotFromStarter(starterId: string, name: string): Promise<BackendAutomationFlow> {
    const newFlow: BackendAutomationFlow = {
      id: Date.now(),
      name,
      inbox_id: 101,
      status: 'draft',
      active_version_id: null,
      run_count: 0,
      published: false,
      mode: 'chatbot',
      trigger_summary: 'inbound_whatsapp',
      action_summary: 'send_text, handoff',
      draft_graph: {
        nodes: (INITIAL_CHATBOT as any).nodes || [],
        edges: (INITIAL_CHATBOT as any).edges || [],
      },
      updated_at: new Date().toISOString(),
    };
    this.flows.unshift(newFlow);
    return newFlow;
  }

  async createAutomationFlow(flow: Partial<BackendAutomationFlow>): Promise<BackendAutomationFlow> {
    const newFlow: BackendAutomationFlow = {
      id: Date.now(),
      name: flow.name || 'New Flow',
      inbox_id: flow.inbox_id || 101,
      status: flow.status || 'draft',
      active_version_id: null,
      run_count: 0,
      published: false,
      mode: flow.mode || 'rule_builder',
      trigger_summary: flow.trigger_summary || 'inbound_whatsapp',
      action_summary: flow.action_summary || '',
      draft_graph: flow.draft_graph,
      draft_configuration: flow.draft_configuration,
      updated_at: new Date().toISOString(),
    };
    this.flows.unshift(newFlow);
    return newFlow;
  }

  async updateAutomationFlow(id: number | string, flow: Partial<BackendAutomationFlow>): Promise<BackendAutomationFlow> {
    const index = this.flows.findIndex(f => String(f.id) === String(id));
    if (index === -1) throw new Error(`Flow #${id} not found`);
    this.flows[index] = { ...this.flows[index], ...flow, updated_at: new Date().toISOString() };
    return this.flows[index];
  }

  async validateFlowGraph(
    flowId: number | string,
    graph: Record<string, unknown>
  ): Promise<{ valid: boolean; errors: string[]; schema_version: number }> {
    const nodes = (graph.nodes as any[]) || [];
    const errors: string[] = [];

    if (nodes.length === 0) {
      errors.push('Graph must contain at least one node');
    }
    const hasTerminal = nodes.some(n => ['end', 'chatbot_end', 'handoff', 'chatbot_handoff'].includes(n.type));
    if (!hasTerminal) {
      errors.push('Flow should contain at least one terminal node (Handoff or End)');
    }

    return {
      valid: errors.length === 0,
      errors,
      schema_version: 2,
    };
  }

  async previewChatbot(
    flowId: number | string,
    graph: Record<string, unknown>,
    variables?: Record<string, string>
  ): Promise<{ valid: boolean; errors?: string[]; simulated_steps?: any[] }> {
    const validation = await this.validateFlowGraph(flowId, graph);
    if (!validation.valid) {
      return { valid: false, errors: validation.errors };
    }

    return {
      valid: true,
      simulated_steps: [
        { step: 1, type: 'start', description: 'Triggered by inbound message' },
        { step: 2, type: 'message', content: 'Welcome to Agamagizh Care!' },
        { step: 3, type: 'question', prompt: 'Are you an existing patient?' },
      ],
    };
  }

  async publishFlow(
    flowId: number | string,
    graph: Record<string, unknown>,
    configuration?: Record<string, unknown>
  ): Promise<BackendAutomationFlow> {
    const flow = await this.getAutomationFlow(flowId);
    flow.status = 'published';
    flow.published = true;
    flow.active_version_id = Date.now();
    flow.last_published_at = new Date().toISOString();
    flow.draft_graph = graph;
    flow.draft_configuration = configuration;
    return flow;
  }

  async duplicateFlow(id: number | string): Promise<BackendAutomationFlow> {
    const flow = await this.getAutomationFlow(id);
    const copy: BackendAutomationFlow = {
      ...flow,
      id: Date.now(),
      name: `${flow.name} (Copy)`,
      status: 'draft',
      published: false,
      active_version_id: null,
      run_count: 0,
      updated_at: new Date().toISOString(),
    };
    this.flows.unshift(copy);
    return copy;
  }

  async archiveFlow(id: number | string): Promise<BackendAutomationFlow> {
    const flow = await this.getAutomationFlow(id);
    flow.status = 'archived';
    flow.published = false;
    return flow;
  }

  async pauseFlow(id: number | string): Promise<BackendAutomationFlow> {
    const flow = await this.getAutomationFlow(id);
    flow.status = 'paused';
    return flow;
  }

  async resumeFlow(id: number | string): Promise<BackendAutomationFlow> {
    const flow = await this.getAutomationFlow(id);
    flow.status = 'published';
    return flow;
  }

  async getFlowRuns(id: number | string): Promise<BackendFlowRun[]> {
    return [
      {
        id: 1,
        version_id: 1,
        contact_id: 201,
        status: 'completed',
        current_node_id: 'node_end',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        events: [
          { id: 101, sequence: 1, type: 'node_entered', node_id: 'start', created_at: new Date(Date.now() - 3600000).toISOString() },
          { id: 102, sequence: 2, type: 'node_entered', node_id: 'msg_welcome', created_at: new Date(Date.now() - 3590000).toISOString() },
          { id: 103, sequence: 3, type: 'node_entered', node_id: 'node_end', created_at: new Date(Date.now() - 3580000).toISOString() },
        ],
      },
    ];
  }

  // Operational Analytics
  async getOperationalAnalytics(params?: {
    from?: string;
    to?: string;
    inboxId?: number;
    campaignId?: number;
  }): Promise<BackendOperationalAnalytics> {
    return {
      from: params?.from || new Date(Date.now() - 86400000 * 30).toISOString(),
      to: params?.to || new Date().toISOString(),
      inbox_id: params?.inboxId,
      campaign_id: params?.campaignId,
      overview: {
        total_messages: MOCK_GLOBAL_METRICS.sent,
        sent_count: MOCK_GLOBAL_METRICS.sent,
        delivered_count: MOCK_GLOBAL_METRICS.delivered,
        read_count: MOCK_GLOBAL_METRICS.read,
        replied_count: MOCK_GLOBAL_METRICS.replied,
        failed_count: MOCK_GLOBAL_METRICS.failed,
        delivery_rate: Math.round((MOCK_GLOBAL_METRICS.delivered / MOCK_GLOBAL_METRICS.sent) * 100),
        read_rate: Math.round((MOCK_GLOBAL_METRICS.read / MOCK_GLOBAL_METRICS.delivered) * 100),
        response_rate: Math.round((MOCK_GLOBAL_METRICS.replied / MOCK_GLOBAL_METRICS.delivered) * 100),
        failure_rate: Math.round((MOCK_GLOBAL_METRICS.failed / MOCK_GLOBAL_METRICS.sent) * 100),
      },
      failure_reasons: {
        '131026: Message undeliverable': 42,
        '131047: Re-engagement window expired': 28,
        '130429: Rate limit hit': 15,
        '131051: Unsupported message type': 7,
      },
      hourly_distribution: [
        { hour: '09:00', sent: 120, delivered: 118, read: 92, failed: 2 },
        { hour: '11:00', sent: 240, delivered: 235, read: 180, failed: 5 },
        { hour: '14:00', sent: 310, delivered: 304, read: 245, failed: 6 },
        { hour: '16:00', sent: 180, delivered: 178, read: 140, failed: 2 },
      ],
      campaign_breakdown: [
        { campaign_id: 1, campaign_title: 'Pre-op Fasting Protocol', total: 420, delivered: 412, read: 360, failed: 8 },
        { campaign_id: 2, campaign_title: 'Post-discharge Follow-up Check', total: 310, delivered: 305, read: 275, failed: 5 },
      ],
    };
  }

  async getAnalyticsDetails(
    metric: string,
    reason?: string,
    page?: number
  ): Promise<{ items: any[]; meta: { total: number; page: number } }> {
    return {
      items: [
        { id: 1, recipient: 'Ananya S.', phone: '+919840011111', reason: reason || 'Delivery Failed', timestamp: new Date().toISOString() },
      ],
      meta: { total: 1, page: page || 1 },
    };
  }

  exportAnalyticsUrl(params?: { from?: string; to?: string; inboxId?: number }): string {
    return `/api/v1/accounts/${this.accountId}/operational_analytics/export?from=${params?.from || ''}&to=${params?.to || ''}`;
  }
}

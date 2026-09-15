/**
 * Real HTTP CRM Data Provider
 * Connects directly to Chatwoot Rails backend endpoints (/api/v1/...)
 * Dynamically discovers account context from /api/v1/profile.
 * Handles 409 Conflict for optimistic locking.
 * Safe credentials handling (no VITE_ secrets).
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

export class HttpCrmDataProvider implements CrmDataProvider {
  readonly mode = 'real' as const;
  readonly baseUrl: string;
  accountId: number | null = null;
  private cachedProfile: UserProfile | null = null;

  constructor(customBaseUrl?: string, customAccountId?: number) {
    this.baseUrl = customBaseUrl || (import.meta as any).env?.VITE_CHATWOOT_BASE_URL || '';
    if (customAccountId) {
      this.accountId = customAccountId;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = new Headers(options.headers || {});
    
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    headers.set('Accept', 'application/json');

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include Rails session cookies
    });

    if (response.status === 409) {
      // Optimistic lock conflict
      const data = await response.json().catch(() => ({}));
      const conflictError = new Error(data.error || 'This resource was updated concurrently.');
      (conflictError as any).status = 409;
      (conflictError as any).card = data.card;
      throw conflictError;
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      let errorJson: any = null;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        // non-json error
      }
      const message = errorJson?.error || errorJson?.message || `HTTP ${response.status}: ${errorText}`;
      const err = new Error(message);
      (err as any).status = response.status;
      (err as any).body = errorJson || errorText;
      throw err;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  private async ensureAccountId(): Promise<number> {
    if (this.accountId) return this.accountId;
    const profile = await this.getProfile();
    if (profile.account_id) {
      this.accountId = profile.account_id;
      return this.accountId;
    }
    if (profile.accounts && profile.accounts.length > 0) {
      this.accountId = profile.accounts[0].id;
      return this.accountId;
    }
    throw new Error('No accessible CRM account found for the authenticated user.');
  }

  // Profile & Account Context
  async getProfile(): Promise<UserProfile> {
    if (this.cachedProfile) return this.cachedProfile;
    const profile = await this.request<UserProfile>('/api/v1/profile');
    this.cachedProfile = profile;
    if (!this.accountId && profile.account_id) {
      this.accountId = profile.account_id;
    }
    return profile;
  }

  async getAccounts(): Promise<AccountSummary[]> {
    const profile = await this.getProfile();
    return profile.accounts || [];
  }

  async switchAccount(accountId: number): Promise<void> {
    await this.request('/api/v1/profile/set_active_account', {
      method: 'POST',
      body: JSON.stringify({ profile: { account_id: accountId } }),
    });
    this.accountId = accountId;
    if (this.cachedProfile) {
      this.cachedProfile.account_id = accountId;
    }
  }

  async checkHealth(): Promise<{ status: 'healthy' | 'unreachable' | 'degraded'; latencyMs: number }> {
    const start = Date.now();
    try {
      await this.request('/auth/validate_token', { method: 'GET' });
      return { status: 'healthy', latencyMs: Date.now() - start };
    } catch {
      try {
        await this.request('/api/v1/profile', { method: 'GET' });
        return { status: 'healthy', latencyMs: Date.now() - start };
      } catch {
        return { status: 'unreachable', latencyMs: Date.now() - start };
      }
    }
  }

  // Inboxes, Agents & Teams
  async getInboxes(): Promise<CrmInbox[]> {
    const accountId = await this.ensureAccountId();
    const data = await this.request<{ payload: CrmInbox[] } | CrmInbox[]>(`/api/v1/accounts/${accountId}/inboxes`);
    return Array.isArray(data) ? data : data.payload || [];
  }

  async getAgents(inboxId?: number): Promise<CrmAgent[]> {
    const accountId = await this.ensureAccountId();
    const url = inboxId
      ? `/api/v1/accounts/${accountId}/inbox_members/${inboxId}`
      : `/api/v1/accounts/${accountId}/agents`;
    try {
      const data = await this.request<{ payload: CrmAgent[] } | CrmAgent[]>(url);
      const list = Array.isArray(data) ? data : (data as any).payload || [];
      return list.map((a: any) => ({
        id: a.id,
        name: a.name || a.available_name || 'Agent',
        email: a.email || '',
        role: a.role || 'agent',
        availability_status: a.availability_status || 'online',
        avatar_url: a.avatar_url,
      }));
    } catch {
      return [];
    }
  }

  async getTeams(): Promise<CrmTeam[]> {
    const accountId = await this.ensureAccountId();
    try {
      const data = await this.request<{ payload: CrmTeam[] } | CrmTeam[]>(`/api/v1/accounts/${accountId}/teams`);
      const list = Array.isArray(data) ? data : (data as any).payload || [];
      return list.map((t: any) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        allow_auto_assign: t.allow_auto_assign,
      }));
    } catch {
      return [];
    }
  }

  // Conversations
  async getConversations(params?: { status?: string; q?: string; page?: number }): Promise<{
    conversations: CrmConversationSummary[];
    meta: { count: number; page: number; per_page: number };
  }> {
    const accountId = await this.ensureAccountId();
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.q) query.set('q', params.q);
    if (params?.page) query.set('page', String(params.page));

    // Try WhatsApp-specific endpoint first, fallback to standard conversations
    try {
      return await this.request(`/api/v1/accounts/${accountId}/whatsapp_conversations?${query.toString()}`);
    } catch {
      const data = await this.request<any>(`/api/v1/accounts/${accountId}/conversations?${query.toString()}`);
      const list = data.data?.payload || data.payload || [];
      return {
        conversations: list,
        meta: { count: data.data?.meta?.all_count || list.length, page: params?.page || 1, per_page: 25 },
      };
    }
  }

  async getConversation(id: number | string): Promise<CrmConversationDetail> {
    const accountId = await this.ensureAccountId();
    try {
      return await this.request<CrmConversationDetail>(`/api/v1/accounts/${accountId}/whatsapp_conversations/${id}`);
    } catch {
      return await this.request<CrmConversationDetail>(`/api/v1/accounts/${accountId}/conversations/${id}`);
    }
  }

  async sendMessage(
    conversationId: number | string,
    content: string,
    isPrivate?: boolean,
    attachments?: File[]
  ): Promise<CrmMessage> {
    const accountId = await this.ensureAccountId();
    if (attachments && attachments.length > 0) {
      const formData = new FormData();
      formData.append('content', content);
      if (isPrivate) formData.append('private', 'true');
      attachments.forEach(file => formData.append('attachments[]', file));
      return await this.request<CrmMessage>(`/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: formData,
      });
    }

    return await this.request<CrmMessage>(`/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, private: !!isPrivate }),
    });
  }

  async toggleConversationStatus(conversationId: number | string, status?: string): Promise<void> {
    const accountId = await this.ensureAccountId();
    await this.request(`/api/v1/accounts/${accountId}/conversations/${conversationId}/toggle_status`, {
      method: 'POST',
      body: JSON.stringify(status ? { status } : {}),
    });
  }

  async toggleConversationPriority(conversationId: number | string, priority: string): Promise<void> {
    const accountId = await this.ensureAccountId();
    await this.request(`/api/v1/accounts/${accountId}/conversations/${conversationId}/toggle_priority`, {
      method: 'POST',
      body: JSON.stringify({ priority }),
    });
  }

  async assignConversationAgent(conversationId: number | string, assigneeId?: number): Promise<void> {
    const accountId = await this.ensureAccountId();
    await this.request(`/api/v1/accounts/${accountId}/conversations/${conversationId}/assignments`, {
      method: 'POST',
      body: JSON.stringify({ assignee_id: assigneeId || null }),
    });
  }

  async assignConversationTeam(conversationId: number | string, teamId?: number): Promise<void> {
    const accountId = await this.ensureAccountId();
    await this.request(`/api/v1/accounts/${accountId}/conversations/${conversationId}/assignments`, {
      method: 'POST',
      body: JSON.stringify({ team_id: teamId || null }),
    });
  }

  async updateConversationLabels(conversationId: number | string, labels: string[]): Promise<void> {
    const accountId = await this.ensureAccountId();
    await this.request(`/api/v1/accounts/${accountId}/conversations/${conversationId}/labels`, {
      method: 'POST',
      body: JSON.stringify({ labels }),
    });
  }

  // Contacts
  async getContacts(params?: { q?: string; page?: number }): Promise<{
    contacts: CrmContactSummary[];
    meta: { count: number; page: number; per_page: number };
  }> {
    const accountId = await this.ensureAccountId();
    const query = new URLSearchParams();
    if (params?.q) query.set('q', params.q);
    if (params?.page) query.set('page', String(params.page));

    try {
      return await this.request(`/api/v1/accounts/${accountId}/whatsapp_contacts?${query.toString()}`);
    } catch {
      const res = await this.request<any>(`/api/v1/accounts/${accountId}/contacts?${query.toString()}`);
      return {
        contacts: res.payload || [],
        meta: { count: res.meta?.count || (res.payload || []).length, page: params?.page || 1, per_page: 20 },
      };
    }
  }

  async getContact(id: number | string): Promise<CrmContactDetail> {
    const accountId = await this.ensureAccountId();
    try {
      return await this.request<CrmContactDetail>(`/api/v1/accounts/${accountId}/whatsapp_contacts/${id}`);
    } catch {
      const res = await this.request<{ payload: CrmContactDetail }>(`/api/v1/accounts/${accountId}/contacts/${id}`);
      return res.payload;
    }
  }

  async createContact(data: Partial<CrmContactSummary>): Promise<CrmContactSummary> {
    const accountId = await this.ensureAccountId();
    const res = await this.request<{ payload: { contact: CrmContactSummary } }>(`/api/v1/accounts/${accountId}/contacts`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.payload.contact;
  }

  async updateContact(id: number | string, data: Partial<CrmContactSummary>): Promise<CrmContactSummary> {
    const accountId = await this.ensureAccountId();
    const res = await this.request<{ payload: { contact: CrmContactSummary } }>(`/api/v1/accounts/${accountId}/contacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res.payload.contact;
  }

  async updateContactConsent(contactId: number | string, consent: UpdateConsentPayload): Promise<CrmContactDetail> {
    const accountId = await this.ensureAccountId();
    try {
      return await this.request<CrmContactDetail>(`/api/v1/accounts/${accountId}/whatsapp_contacts/${contactId}/consent`, {
        method: 'POST',
        body: JSON.stringify({ consent }),
      });
    } catch {
      // Fallback: update custom_attributes with consent
      await this.request(`/api/v1/accounts/${accountId}/contacts/${contactId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          custom_attributes: {
            [`consent_${consent.purpose}`]: consent.status,
            [`consent_${consent.purpose}_source`]: consent.source || 'Studio UI',
            [`consent_${consent.purpose}_at`]: new Date().toISOString(),
          },
        }),
      });
      return await this.getContact(contactId);
    }
  }

  async updateContactLabels(contactId: number | string, labels: string[]): Promise<void> {
    const accountId = await this.ensureAccountId();
    await this.request(`/api/v1/accounts/${accountId}/contacts/${contactId}/labels`, {
      method: 'POST',
      body: JSON.stringify({ labels }),
    });
  }

  async updateContactAttributes(contactId: number | string, attributes: Record<string, unknown>): Promise<void> {
    const accountId = await this.ensureAccountId();
    await this.request(`/api/v1/accounts/${accountId}/contacts/${contactId}`, {
      method: 'PATCH',
      body: JSON.stringify({ custom_attributes: attributes }),
    });
  }

  // Companies
  async getCompanies(params?: { page?: number }): Promise<CrmCompany[]> {
    const accountId = await this.ensureAccountId();
    const page = params?.page || 1;
    const res = await this.request<{ payload: CrmCompany[] } | CrmCompany[]>(`/api/v1/accounts/${accountId}/companies?page=${page}`);
    return Array.isArray(res) ? res : res.payload || [];
  }

  async getCompany(id: number | string): Promise<CrmCompany> {
    const accountId = await this.ensureAccountId();
    return await this.request<CrmCompany>(`/api/v1/accounts/${accountId}/companies/${id}`);
  }

  // WhatsApp Operations & Overview
  async getWhatsAppOverview(): Promise<WhatsAppOverviewData> {
    const inboxes = await this.getInboxes();
    const waInboxes = inboxes.filter(i => i.channel_type === 'Channel::Whatsapp');
    let analyticsOverview: any = null;
    try {
      analyticsOverview = await this.getOperationalAnalytics();
    } catch {
      // safe fallback
    }
    let drafts: BackendTemplateDraft[] = [];
    try {
      drafts = await this.getTemplateDrafts();
    } catch {
      // safe fallback
    }

    return {
      inboxes: waInboxes.length > 0 ? waInboxes : inboxes,
      channelState: {
        status: waInboxes.length > 0 ? 'connected' : 'disconnected',
        phoneNumber: waInboxes[0]?.phone_number || '+91 98400 12345',
        displayName: waInboxes[0]?.name || 'Agamagizh WhatsApp Care',
        qualityRating: 'GREEN',
        messagingLimit: '250 / 24hrs (Safe Local Tier)',
        lastSyncAt: new Date().toISOString(),
      },
      templateSyncState: {
        totalTemplates: drafts.length,
        approvedCount: drafts.filter(d => d.status === 'approved').length,
        pendingCount: drafts.filter(d => d.status === 'pending').length,
        rejectedCount: drafts.filter(d => d.status === 'rejected').length,
        draftCount: drafts.filter(d => d.status === 'draft').length,
        lastSyncedAt: new Date().toISOString(),
      },
      campaignMetrics: {
        totalSent: analyticsOverview?.overview?.sent_count || 0,
        deliveryRate: analyticsOverview?.overview?.delivery_rate || 0,
        readRate: analyticsOverview?.overview?.read_rate || 0,
        replyRate: analyticsOverview?.overview?.response_rate || 0,
      },
      consentHealth: {
        totalContacts: 0,
        marketingOptedIn: 0,
        transactionalOptedIn: 0,
        optedOut: 0,
      },
      automationStatus: {
        activeFlows: 0,
        totalExecutionsToday: 0,
        failedExecutionsToday: 0,
      },
    };
  }

  // Clinic Pipeline
  async getPipelines(): Promise<BackendPipeline[]> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendPipeline[]>(`/api/v1/accounts/${accountId}/clinic_pipelines`);
  }

  async getPipelineCards(params?: {
    pipelineId?: number;
    contactId?: number;
    overdue?: boolean;
    nextActions?: boolean;
  }): Promise<BackendPipelineCard[]> {
    const accountId = await this.ensureAccountId();
    const query = new URLSearchParams();
    if (params?.pipelineId) query.set('clinic_pipeline_id', String(params.pipelineId));
    if (params?.contactId) query.set('contact_id', String(params.contactId));
    if (params?.overdue) query.set('overdue', 'true');
    if (params?.nextActions) query.set('next_actions', 'true');

    return await this.request<BackendPipelineCard[]>(`/api/v1/accounts/${accountId}/clinic_pipeline_cards?${query.toString()}`);
  }

  async getPipelineCard(id: number | string): Promise<BackendPipelineCard> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendPipelineCard>(`/api/v1/accounts/${accountId}/clinic_pipeline_cards/${id}`);
  }

  async getPipelineActivities(cardId: number | string): Promise<BackendPipelineActivity[]> {
    const card = await this.getPipelineCard(cardId);
    return card.activities || [];
  }

  async createPipelineCard(card: Partial<BackendPipelineCard>): Promise<BackendPipelineCard> {
    const accountId = await this.ensureAccountId();
    const payload: Record<string, unknown> = {
      ...card,
      clinic_pipeline_id: card.pipeline_id ?? (card as any).clinic_pipeline_id,
      clinic_pipeline_stage_id: card.stage_id ?? (card as any).clinic_pipeline_stage_id,
      contact_id: card.contact?.id ?? (card as any).contact_id,
      owner_id: card.owner?.id ?? (card as any).owner_id,
      team_id: card.team?.id ?? (card as any).team_id,
    };
    return await this.request<BackendPipelineCard>(`/api/v1/accounts/${accountId}/clinic_pipeline_cards`, {
      method: 'POST',
      body: JSON.stringify({ clinic_pipeline_card: payload }),
    });
  }

  async updatePipelineCard(id: number | string, card: Partial<BackendPipelineCard>): Promise<BackendPipelineCard> {
    const accountId = await this.ensureAccountId();
    const payload: Record<string, unknown> = {
      ...card,
    };
    if (card.pipeline_id !== undefined) payload.clinic_pipeline_id = card.pipeline_id;
    if (card.stage_id !== undefined) payload.clinic_pipeline_stage_id = card.stage_id;
    if (card.contact?.id !== undefined) payload.contact_id = card.contact.id;
    if (card.owner?.id !== undefined) payload.owner_id = card.owner.id;
    if (card.team?.id !== undefined) payload.team_id = card.team.id;

    return await this.request<BackendPipelineCard>(`/api/v1/accounts/${accountId}/clinic_pipeline_cards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ clinic_pipeline_card: payload }),
    });
  }

  async movePipelineCard(
    id: number | string,
    targetStageId: number,
    position: number,
    lockVersion: number
  ): Promise<BackendPipelineCard> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendPipelineCard>(`/api/v1/accounts/${accountId}/clinic_pipeline_cards/${id}/move`, {
      method: 'PATCH',
      body: JSON.stringify({
        clinic_pipeline_stage_id: targetStageId,
        position,
        lock_version: lockVersion,
      }),
    });
  }

  async deletePipelineCard(id: number | string): Promise<void> {
    const accountId = await this.ensureAccountId();
    await this.request(`/api/v1/accounts/${accountId}/clinic_pipeline_cards/${id}`, {
      method: 'DELETE',
    });
  }

  // Campaigns
  async getCampaigns(): Promise<BackendCampaign[]> {
    const accountId = await this.ensureAccountId();
    const res = await this.request<BackendCampaign[] | { payload: BackendCampaign[] }>(`/api/v1/accounts/${accountId}/campaigns`);
    return Array.isArray(res) ? res : res.payload || [];
  }

  async getCampaign(id: number | string): Promise<BackendCampaign> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendCampaign>(`/api/v1/accounts/${accountId}/campaigns/${id}`);
  }

  async createCampaign(campaign: Partial<BackendCampaign>): Promise<BackendCampaign> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendCampaign>(`/api/v1/accounts/${accountId}/campaigns`, {
      method: 'POST',
      body: JSON.stringify({ campaign }),
    });
  }

  async updateCampaign(id: number | string, campaign: Partial<BackendCampaign>): Promise<BackendCampaign> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendCampaign>(`/api/v1/accounts/${accountId}/campaigns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ campaign }),
    });
  }

  async preflightPreview(campaign: Partial<BackendCampaign>): Promise<BackendPreflightResult> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendPreflightResult>(`/api/v1/accounts/${accountId}/campaigns/preflight_preview`, {
      method: 'POST',
      body: JSON.stringify({ campaign }),
    });
  }

  async getCampaignPreflight(campaignId: number | string): Promise<BackendPreflightResult> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendPreflightResult>(`/api/v1/accounts/${accountId}/campaigns/${campaignId}/preflight`);
  }

  async getCampaignRecipients(
    campaignId: number | string,
    params?: { status?: string; failureCode?: string; page?: number; perPage?: number }
  ): Promise<{
    recipients: BackendCampaignRecipient[];
    meta: { total: number; page: number; per_page: number };
  }> {
    const accountId = await this.ensureAccountId();
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.failureCode) query.set('failure_code', params.failureCode);
    if (params?.page) query.set('page', String(params.page));
    if (params?.perPage) query.set('per_page', String(params.perPage));

    return await this.request(`/api/v1/accounts/${accountId}/campaigns/${campaignId}/recipients?${query.toString()}`);
  }

  async getCampaignRecipient(campaignId: number | string, recipientId: number | string): Promise<BackendCampaignRecipient> {
    const accountId = await this.ensureAccountId();
    try {
      return await this.request<BackendCampaignRecipient>(`/api/v1/accounts/${accountId}/campaigns/${campaignId}/recipients/${recipientId}`);
    } catch {
      const res = await this.getCampaignRecipients(campaignId, { page: 1, perPage: 100 });
      const found = res.recipients.find(r => String(r.id) === String(recipientId));
      if (!found) throw new Error(`Recipient #${recipientId} not found in campaign #${campaignId}`);
      return found;
    }
  }

  exportCampaignRecipientsUrl(campaignId: number | string): string {
    return `${this.baseUrl}/api/v1/accounts/${this.accountId}/campaigns/${campaignId}/recipient_export`;
  }

  async campaignLifecycle(
    campaignId: number | string,
    action: 'pause' | 'resume' | 'cancel' | 'recompute'
  ): Promise<void> {
    const accountId = await this.ensureAccountId();
    await this.request(`/api/v1/accounts/${accountId}/campaigns/${campaignId}/${action}`, {
      method: 'POST',
    });
  }

  async previewAudienceCsv(file: File, mapping: Record<string, string>): Promise<{ total_rows: number; valid_rows: number; invalid_rows: number; sample: any[] }> {
    const accountId = await this.ensureAccountId();
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(mapping).forEach(([k, v]) => formData.append(`mapping[${k}]`, v));

    return await this.request(`/api/v1/accounts/${accountId}/campaigns/csv_preview`, {
      method: 'POST',
      body: formData,
    });
  }

  async importAudienceCsv(
    file: File,
    inboxId: number,
    mapping: Record<string, string>,
    confirmConsent: boolean
  ): Promise<{ imported_count: number; label: string }> {
    const accountId = await this.ensureAccountId();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('inbox_id', String(inboxId));
    formData.append('confirm_consent', String(confirmConsent));
    Object.entries(mapping).forEach(([k, v]) => formData.append(`mapping[${k}]`, v));

    return await this.request(`/api/v1/accounts/${accountId}/campaigns/csv_import`, {
      method: 'POST',
      body: formData,
    });
  }

  // Templates
  async getProviderTemplates(inboxId?: number): Promise<ProviderWhatsAppTemplate[]> {
    const accountId = await this.ensureAccountId();
    try {
      const inboxes = await this.getInboxes();
      const targetInbox = inboxId || inboxes.find(i => i.channel_type === 'Channel::Whatsapp')?.id || inboxes[0]?.id;
      if (!targetInbox) return [];
      const res = await this.request<any>(`/api/v1/accounts/${accountId}/inboxes/${targetInbox}/whatsapp_templates`);
      const raw = Array.isArray(res) ? res : res.payload || [];
      return raw.map((t: any) => ({
        id: String(t.id || t.name),
        name: t.name,
        category: t.category || 'UTILITY',
        language: t.language || 'en',
        status: (t.status || 'APPROVED').toUpperCase(),
        components: t.components || [],
        campaign_eligible: (t.status || '').toUpperCase() === 'APPROVED',
        rejected_reason: t.rejected_reason,
        last_synced_at: t.updated_at || new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  }

  async getTemplateDrafts(): Promise<BackendTemplateDraft[]> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendTemplateDraft[]>(`/api/v1/accounts/${accountId}/whatsapp_template_drafts`);
  }

  async getTemplateDraft(id: number | string): Promise<BackendTemplateDraft> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendTemplateDraft>(`/api/v1/accounts/${accountId}/whatsapp_template_drafts/${id}`);
  }

  async createTemplateDraft(draft: Partial<BackendTemplateDraft>): Promise<BackendTemplateDraft> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendTemplateDraft>(`/api/v1/accounts/${accountId}/whatsapp_template_drafts`, {
      method: 'POST',
      body: JSON.stringify({ whatsapp_template_draft: draft }),
    });
  }

  async updateTemplateDraft(id: number | string, draft: Partial<BackendTemplateDraft>): Promise<BackendTemplateDraft> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendTemplateDraft>(`/api/v1/accounts/${accountId}/whatsapp_template_drafts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ whatsapp_template_draft: draft }),
    });
  }

  async prepareTemplateDraft(id: number | string): Promise<BackendPrepareDraftResponse> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendPrepareDraftResponse>(`/api/v1/accounts/${accountId}/whatsapp_template_drafts/${id}/prepare`, {
      method: 'POST',
    });
  }

  // Automations & Chatbots
  async getAutomationFlows(): Promise<BackendAutomationFlow[]> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendAutomationFlow[]>(`/api/v1/accounts/${accountId}/automation_flows`);
  }

  async getAutomationFlow(id: number | string): Promise<BackendAutomationFlow> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendAutomationFlow>(`/api/v1/accounts/${accountId}/automation_flows/${id}`);
  }

  async getCapabilities(): Promise<BackendCapabilityRegistry> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendCapabilityRegistry>(`/api/v1/accounts/${accountId}/automation_flows/capabilities`);
  }

  async getChatbotStarters(): Promise<BackendChatbotStarter[]> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendChatbotStarter[]>(`/api/v1/accounts/${accountId}/automation_flows/chatbot_starters`);
  }

  async createChatbotFromStarter(starterId: string, name: string): Promise<BackendAutomationFlow> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendAutomationFlow>(`/api/v1/accounts/${accountId}/automation_flows/create_chatbot_from_starter`, {
      method: 'POST',
      body: JSON.stringify({ starter_id: starterId, name }),
    });
  }

  async createAutomationFlow(flow: Partial<BackendAutomationFlow>): Promise<BackendAutomationFlow> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendAutomationFlow>(`/api/v1/accounts/${accountId}/automation_flows`, {
      method: 'POST',
      body: JSON.stringify({ automation_flow: flow }),
    });
  }

  async updateAutomationFlow(id: number | string, flow: Partial<BackendAutomationFlow>): Promise<BackendAutomationFlow> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendAutomationFlow>(`/api/v1/accounts/${accountId}/automation_flows/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ automation_flow: flow }),
    });
  }

  async validateFlowGraph(
    flowId: number | string,
    graph: Record<string, unknown>
  ): Promise<{ valid: boolean; errors: string[]; schema_version: number }> {
    const accountId = await this.ensureAccountId();
    return await this.request(`/api/v1/accounts/${accountId}/automation_flows/${flowId}/validate_graph`, {
      method: 'POST',
      body: JSON.stringify({ graph }),
    });
  }

  async previewChatbot(
    flowId: number | string,
    graph: Record<string, unknown>,
    variables?: Record<string, string>
  ): Promise<{ valid: boolean; errors?: string[]; simulated_steps?: any[] }> {
    const accountId = await this.ensureAccountId();
    return await this.request(`/api/v1/accounts/${accountId}/automation_flows/${flowId}/preview`, {
      method: 'POST',
      body: JSON.stringify({ graph, variables }),
    });
  }

  async publishFlow(
    flowId: number | string,
    graph: Record<string, unknown>,
    configuration?: Record<string, unknown>
  ): Promise<BackendAutomationFlow> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendAutomationFlow>(`/api/v1/accounts/${accountId}/automation_flows/${flowId}/publish`, {
      method: 'POST',
      body: JSON.stringify({ graph, configuration }),
    });
  }

  async duplicateFlow(id: number | string): Promise<BackendAutomationFlow> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendAutomationFlow>(`/api/v1/accounts/${accountId}/automation_flows/${id}/duplicate`, {
      method: 'POST',
    });
  }

  async archiveFlow(id: number | string): Promise<BackendAutomationFlow> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendAutomationFlow>(`/api/v1/accounts/${accountId}/automation_flows/${id}/archive`, {
      method: 'POST',
    });
  }

  async pauseFlow(id: number | string): Promise<BackendAutomationFlow> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendAutomationFlow>(`/api/v1/accounts/${accountId}/automation_flows/${id}/pause`, {
      method: 'POST',
    });
  }

  async resumeFlow(id: number | string): Promise<BackendAutomationFlow> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendAutomationFlow>(`/api/v1/accounts/${accountId}/automation_flows/${id}/resume`, {
      method: 'POST',
    });
  }

  async getFlowRuns(id: number | string): Promise<BackendFlowRun[]> {
    const accountId = await this.ensureAccountId();
    return await this.request<BackendFlowRun[]>(`/api/v1/accounts/${accountId}/automation_flows/${id}/runs`);
  }

  // Operational Analytics
  async getOperationalAnalytics(params?: {
    from?: string;
    to?: string;
    inboxId?: number;
    campaignId?: number;
  }): Promise<BackendOperationalAnalytics> {
    const accountId = await this.ensureAccountId();
    const query = new URLSearchParams();
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    if (params?.inboxId) query.set('inbox_id', String(params.inboxId));
    if (params?.campaignId) query.set('campaign_id', String(params.campaignId));

    return await this.request<BackendOperationalAnalytics>(`/api/v1/accounts/${accountId}/operational_analytics?${query.toString()}`);
  }

  async getAnalyticsDetails(
    metric: string,
    reason?: string,
    page?: number
  ): Promise<{ items: any[]; meta: { total: number; page: number } }> {
    const accountId = await this.ensureAccountId();
    const query = new URLSearchParams({ metric });
    if (reason) query.set('reason', reason);
    if (page) query.set('page', String(page));

    return await this.request(`/api/v1/accounts/${accountId}/operational_analytics/details?${query.toString()}`);
  }

  exportAnalyticsUrl(params?: { from?: string; to?: string; inboxId?: number }): string {
    return `${this.baseUrl}/api/v1/accounts/${this.accountId}/operational_analytics/export?from=${params?.from || ''}&to=${params?.to || ''}`;
  }
}

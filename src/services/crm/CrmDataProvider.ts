/**
 * Unified CRM Data Provider Interface
 * Supports both Local in-memory mode and real HTTP Rails CRM backend mode.
 */

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

export interface CrmDataProvider {
  // Provider Metadata
  mode: 'local' | 'real';
  baseUrl: string;
  accountId: number | null;

  // Account & Profile Context
  getProfile(): Promise<UserProfile>;
  getAccounts(): Promise<AccountSummary[]>;
  switchAccount(accountId: number): Promise<void>;
  checkHealth(): Promise<{ status: 'healthy' | 'unreachable' | 'degraded'; latencyMs: number }>;

  // Inboxes, Agents & Teams
  getInboxes(): Promise<CrmInbox[]>;
  getAgents(inboxId?: number): Promise<CrmAgent[]>;
  getTeams(): Promise<CrmTeam[]>;

  // Conversations & Messages
  getConversations(params?: { status?: string; q?: string; page?: number }): Promise<{
    conversations: CrmConversationSummary[];
    meta: { count: number; page: number; per_page: number };
  }>;
  getConversation(id: number | string): Promise<CrmConversationDetail>;
  sendMessage(
    conversationId: number | string,
    content: string,
    isPrivate?: boolean,
    attachments?: File[]
  ): Promise<CrmMessage>;
  toggleConversationStatus(conversationId: number | string, status?: string): Promise<void>;
  toggleConversationPriority(conversationId: number | string, priority: string): Promise<void>;
  assignConversationAgent(conversationId: number | string, assigneeId?: number): Promise<void>;
  assignConversationTeam(conversationId: number | string, teamId?: number): Promise<void>;
  updateConversationLabels(conversationId: number | string, labels: string[]): Promise<void>;

  // Contacts
  getContacts(params?: { q?: string; page?: number }): Promise<{
    contacts: CrmContactSummary[];
    meta: { count: number; page: number; per_page: number };
  }>;
  getContact(id: number | string): Promise<CrmContactDetail>;
  createContact(data: Partial<CrmContactSummary>): Promise<CrmContactSummary>;
  updateContact(id: number | string, data: Partial<CrmContactSummary>): Promise<CrmContactSummary>;
  updateContactConsent(contactId: number | string, consent: UpdateConsentPayload): Promise<CrmContactDetail>;
  updateContactLabels(contactId: number | string, labels: string[]): Promise<void>;
  updateContactAttributes(contactId: number | string, attributes: Record<string, unknown>): Promise<void>;

  // Companies
  getCompanies(params?: { page?: number }): Promise<CrmCompany[]>;
  getCompany(id: number | string): Promise<CrmCompany>;

  // WhatsApp Operations & Overview
  getWhatsAppOverview(): Promise<WhatsAppOverviewData>;

  // Clinic Pipeline
  getPipelines(): Promise<BackendPipeline[]>;
  getPipelineCards(params?: {
    pipelineId?: number;
    contactId?: number;
    overdue?: boolean;
    nextActions?: boolean;
  }): Promise<BackendPipelineCard[]>;
  getPipelineCard(id: number | string): Promise<BackendPipelineCard>;
  getPipelineActivities(cardId: number | string): Promise<BackendPipelineActivity[]>;
  createPipelineCard(card: Partial<BackendPipelineCard>): Promise<BackendPipelineCard>;
  updatePipelineCard(id: number | string, card: Partial<BackendPipelineCard>): Promise<BackendPipelineCard>;
  movePipelineCard(
    id: number | string,
    targetStageId: number,
    position: number,
    lockVersion: number
  ): Promise<BackendPipelineCard>;
  deletePipelineCard(id: number | string): Promise<void>;

  // Campaigns
  getCampaigns(): Promise<BackendCampaign[]>;
  getCampaign(id: number | string): Promise<BackendCampaign>;
  createCampaign(campaign: Partial<BackendCampaign>): Promise<BackendCampaign>;
  updateCampaign(id: number | string, campaign: Partial<BackendCampaign>): Promise<BackendCampaign>;
  preflightPreview(campaign: Partial<BackendCampaign>): Promise<BackendPreflightResult>;
  getCampaignPreflight(campaignId: number | string): Promise<BackendPreflightResult>;
  getCampaignRecipients(
    campaignId: number | string,
    params?: { status?: string; failureCode?: string; page?: number; perPage?: number }
  ): Promise<{
    recipients: BackendCampaignRecipient[];
    meta: { total: number; page: number; per_page: number };
  }>;
  getCampaignRecipient(campaignId: number | string, recipientId: number | string): Promise<BackendCampaignRecipient>;
  exportCampaignRecipientsUrl(campaignId: number | string): string;
  campaignLifecycle(
    campaignId: number | string,
    action: 'pause' | 'resume' | 'cancel' | 'recompute'
  ): Promise<void>;
  previewAudienceCsv(file: File, mapping: Record<string, string>): Promise<{ total_rows: number; valid_rows: number; invalid_rows: number; sample: any[] }>;
  importAudienceCsv(file: File, inboxId: number, mapping: Record<string, string>, confirmConsent: boolean): Promise<{ imported_count: number; label: string }>;

  // WhatsApp Templates
  getProviderTemplates(inboxId?: number): Promise<ProviderWhatsAppTemplate[]>;
  getTemplateDrafts(): Promise<BackendTemplateDraft[]>;
  getTemplateDraft(id: number | string): Promise<BackendTemplateDraft>;
  createTemplateDraft(draft: Partial<BackendTemplateDraft>): Promise<BackendTemplateDraft>;
  updateTemplateDraft(id: number | string, draft: Partial<BackendTemplateDraft>): Promise<BackendTemplateDraft>;
  prepareTemplateDraft(id: number | string): Promise<BackendPrepareDraftResponse>;

  // Automations & Chatbots
  getAutomationFlows(): Promise<BackendAutomationFlow[]>;
  getAutomationFlow(id: number | string): Promise<BackendAutomationFlow>;
  getCapabilities(): Promise<BackendCapabilityRegistry>;
  getChatbotStarters(): Promise<BackendChatbotStarter[]>;
  createChatbotFromStarter(starterId: string, name: string): Promise<BackendAutomationFlow>;
  createAutomationFlow(flow: Partial<BackendAutomationFlow>): Promise<BackendAutomationFlow>;
  updateAutomationFlow(id: number | string, flow: Partial<BackendAutomationFlow>): Promise<BackendAutomationFlow>;
  validateFlowGraph(flowId: number | string, graph: Record<string, unknown>): Promise<{ valid: boolean; errors: string[]; schema_version: number }>;
  previewChatbot(
    flowId: number | string,
    graph: Record<string, unknown>,
    variables?: Record<string, string>
  ): Promise<{ valid: boolean; errors?: string[]; simulated_steps?: any[] }>;
  publishFlow(flowId: number | string, graph: Record<string, unknown>, configuration?: Record<string, unknown>): Promise<BackendAutomationFlow>;
  duplicateFlow(id: number | string): Promise<BackendAutomationFlow>;
  archiveFlow(id: number | string): Promise<BackendAutomationFlow>;
  pauseFlow(id: number | string): Promise<BackendAutomationFlow>;
  resumeFlow(id: number | string): Promise<BackendAutomationFlow>;
  getFlowRuns(id: number | string): Promise<BackendFlowRun[]>;

  // Operational Analytics
  getOperationalAnalytics(params?: {
    from?: string;
    to?: string;
    inboxId?: number;
    campaignId?: number;
  }): Promise<BackendOperationalAnalytics>;
  getAnalyticsDetails(
    metric: string,
    reason?: string,
    page?: number
  ): Promise<{ items: any[]; meta: { total: number; page: number } }>;
  exportAnalyticsUrl(params?: { from?: string; to?: string; inboxId?: number }): string;
}

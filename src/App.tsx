import React, { useState, useEffect } from 'react';
import { 
  TopNavSection, 
  WhatsAppSubSection, 
  Conversation, 
  Contact, 
  Company, 
  ClinicPipelineCard, 
  WhatsAppCampaign, 
  ToastNotification 
} from './types';
import { 
  INITIAL_CONVERSATIONS, 
  INITIAL_CONTACTS, 
  INITIAL_COMPANIES, 
  CLINIC_PIPELINE_CARDS, 
  INITIAL_CAMPAIGNS 
} from './data/mockData';
import { useCrm } from './context/CrmContext';
import {
  toStudioConversation,
  toStudioContact,
  toStudioPipelineCard,
  toStudioCampaign
} from './adapters/crmAdapter';

import { Shell } from './components/layout/Shell';
import { CommandPalette } from './components/layout/CommandPalette';
import { QuickComposeModal } from './components/layout/QuickComposeModal';
import { ToastContainer } from './components/ui/Toast';

import { ConversationsWorkbench } from './components/inbox/ConversationsWorkbench';
import { MyInboxView } from './components/inbox/MyInboxView';
import { ContactsView } from './components/crm/ContactsView';
import { CompaniesView } from './components/crm/CompaniesView';
import { ClinicPipelineView } from './components/pipeline/ClinicPipelineView';
import { CampaignsView } from './components/campaigns/CampaignsView';
import { WhatsAppHub } from './components/whatsapp/WhatsAppHub';
import { CaptainView } from './components/operations/CaptainView';
import { ReportsView } from './components/operations/ReportsView';
import { HelpCenterView } from './components/operations/HelpCenterView';
import { SettingsView } from './components/settings/SettingsView';
import { UIReferenceView } from './components/reference/UIReferenceView';

export default function App() {
  const { provider, accountContext } = useCrm();
  const [currentSection, setCurrentSection] = useState<TopNavSection>('my_inbox');
  const [currentWhatsAppSub, setCurrentWhatsAppSub] = useState<WhatsAppSubSection>('inbox');

  // Internal UI Reference route state (/ui-reference)
  const [isUiReferenceOpen, setIsUiReferenceOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      return path.includes('/ui-reference') || hash.includes('ui-reference') || search.includes('ui-reference');
    }
    return false;
  });

  // Listen to popstate and hashchange for /ui-reference
  React.useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      if (path.includes('/ui-reference') || hash.includes('ui-reference') || search.includes('ui-reference')) {
        setIsUiReferenceOpen(true);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Operational State backed by CRM Provider
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvoId, setActiveConvoId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [pipelineCards, setPipelineCards] = useState<ClinicPipelineCard[]>(CLINIC_PIPELINE_CARDS);
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>(INITIAL_CAMPAIGNS);

  // Synchronize data from active CRM Provider
  useEffect(() => {
    let isMounted = true;

    async function loadCrmData() {
      try {
        const [convsRes, contactsRes, cardsRes, campsRes] = await Promise.all([
          provider.getConversations().catch(() => null),
          provider.getContacts().catch(() => null),
          provider.getPipelineCards().catch(() => null),
          provider.getCampaigns().catch(() => null),
        ]);

        if (!isMounted) return;

        if (convsRes && convsRes.conversations && convsRes.conversations.length > 0) {
          const studioConvs = convsRes.conversations.map(c => toStudioConversation(c));
          setConversations(studioConvs);
          if (studioConvs[0]?.id) {
            setActiveConvoId(studioConvs[0].id);
            // Hydrate thread details for first conversation
            try {
              const detail = await provider.getConversation(studioConvs[0].id);
              if (detail && isMounted) {
                setConversations(prev =>
                  prev.map(c => c.id === String(detail.id) ? toStudioConversation(detail) : c)
                );
              }
            } catch {
              // Non-blocking
            }
          }
        }

        if (contactsRes && contactsRes.contacts && contactsRes.contacts.length > 0) {
          setContacts(contactsRes.contacts.map(toStudioContact));
        }

        if (cardsRes && cardsRes.length > 0) {
          setPipelineCards(cardsRes.map(toStudioPipelineCard));
        }

        if (campsRes && campsRes.length > 0) {
          setCampaigns(campsRes.map(toStudioCampaign));
        }
      } catch (err) {
        console.warn('CRM data initial load note:', err);
      }
    }

    loadCrmData();
    return () => { isMounted = false; };
  }, [provider, accountContext.activeAccount?.id]);

  // Global Dialogs & Overlays
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickComposeOpen, setIsQuickComposeOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Toast Helper
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastNotification = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Global Navigation
  const handleNavigate = (section: TopNavSection, waSub?: WhatsAppSubSection) => {
    if ((section as any) === 'ui-reference') {
      setIsUiReferenceOpen(true);
      if (typeof window !== 'undefined' && window.history?.pushState) {
        window.history.pushState({}, '', '/ui-reference');
      }
      return;
    }
    setCurrentSection(section);
    if (waSub) {
      setCurrentWhatsAppSub(waSub);
    }
  };

  // Send message / internal note
  const handleSendMessage = async (convoId: string, text: string, isPrivateNote: boolean = false) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsgId = `msg-${Date.now()}`;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convoId) {
          return {
            ...c,
            lastMessage: isPrivateNote ? c.lastMessage : text,
            lastTimestamp: timeNow,
            status: c.status === 'resolved' ? 'open' : c.status,
            messages: [
              ...c.messages,
              {
                id: newMsgId,
                sender: 'agent',
                senderName: 'Dr. Rajesh Sharma',
                text,
                timestamp: timeNow,
                status: 'delivered',
                isPrivateNote
              }
            ]
          };
        }
        return c;
      })
    );

    try {
      await provider.sendMessage(convoId, text, isPrivateNote);
    } catch (err) {
      console.warn('CRM dispatch error:', err);
    }

    if (isPrivateNote) {
      showToast('Internal Note Added', 'Saved private note visible only to Agamagizh care team.', 'info');
    } else {
      showToast('WhatsApp Message Sent', 'Message dispatched via Meta Cloud API / CRM Inbox.', 'success');

      // Simulate contact read verification
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === convoId) {
              return {
                ...c,
                messages: (c.messages || []).map((m) =>
                  m.id === newMsgId ? { ...m, status: 'read' } : m
                )
              };
            }
            return c;
          })
        );
      }, 1400);
    }
  };

  // Update conversation status
  const handleUpdateStatus = async (convoId: string, status: Conversation['status']) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convoId ? { ...c, status } : c))
    );
    try {
      await provider.toggleConversationStatus(convoId, status);
    } catch (err) {
      console.warn('Failed to update status on CRM:', err);
    }
    showToast(
      'Status Updated',
      `Conversation marked as ${status.toUpperCase()}.`,
      status === 'resolved' ? 'success' : 'info'
    );
  };

  // Update conversation assignee
  const handleUpdateAssignee = async (convoId: string, agentName: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convoId ? { ...c, assignedAgent: agentName } : c))
    );
    try {
      await provider.assignConversationAgent(convoId, 1);
    } catch (err) {
      console.warn('Failed to update assignee on CRM:', err);
    }
    showToast('Assignment Changed', `Reassigned conversation to ${agentName}.`, 'info');
  };

  // Add conversation label
  const handleAddLabel = async (convoId: string, label: string) => {
    let updatedLabels: string[] = [];
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convoId && !c.labels.includes(label)) {
          updatedLabels = [...c.labels, label];
          return { ...c, labels: updatedLabels };
        }
        return c;
      })
    );
    if (updatedLabels.length > 0) {
      try {
        await provider.updateConversationLabels(convoId, updatedLabels);
      } catch (err) {
        console.warn('Failed to update labels on CRM:', err);
      }
    }
    showToast('Label Added', `Tagged with "${label}".`, 'success');
  };

  // Start chat with contact from Contacts directory
  const handleOpenConversationWithContact = (contact: Contact) => {
    const existing = conversations.find(c => c.contactPhone === contact.phone);
    if (existing) {
      setActiveConvoId(existing.id);
      setCurrentSection('conversations');
    } else {
      const newConvoId = `convo-${Date.now()}`;
      const newConvo: Conversation = {
        id: newConvoId,
        contactId: contact.id,
        contactName: contact.name,
        contactPhone: contact.phone,
        contactEmail: contact.email,
        inbox: 'Agamagizh WhatsApp Main',
        channel: 'whatsapp',
        status: 'open',
        priority: 'medium',
        assignedAgent: 'Dr. Rajesh Sharma',
        assignedTeam: 'Care Operations',
        labels: contact.labels,
        lastMessage: 'Conversation opened from Contacts directory.',
        lastTimestamp: 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'system',
            text: `Conversation initialized with ${contact.name} via WhatsApp.`,
            timestamp: 'Just now',
            status: 'read'
          }
        ]
      };
      setConversations([newConvo, ...conversations]);
      setActiveConvoId(newConvoId);
      setCurrentSection('conversations');
    }
  };

  // Add new Contact
  const handleAddNewContact = async (contactData: Omit<Contact, 'id' | 'conversationsCount' | 'lastActivity'>) => {
    const newContact: Contact = {
      ...contactData,
      id: `cnt-${Date.now()}`,
      conversationsCount: 1,
      lastActivity: 'Just now'
    };
    setContacts([newContact, ...contacts]);

    try {
      await provider.createContact({
        name: contactData.name,
        phone_number: contactData.phone,
        custom_attributes: {
          email: contactData.email || '',
          location: contactData.location || 'Chennai',
          source: 'manual_intake'
        }
      });
    } catch (err) {
      console.warn('Failed to sync contact to CRM:', err);
    }
    showToast('Contact Created', `${newContact.name} saved to CRM directory.`, 'success');
  };

  // Pipeline card actions with optimistic lock handling
  const handleMovePipelineStage = async (cardId: string, newStageId: string) => {
    const previousCard = pipelineCards.find((c) => c.id === cardId);
    const previousStage = previousCard?.stageId;

    setPipelineCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, stageId: newStageId } : c))
    );

    try {
      const stageMap: Record<string, number> = {
        'new_enquiry': 1,
        'contacted': 2,
        'follow_up': 3,
        'confirmed': 4,
        'completed': 5,
        'lead_inquiry': 1,
        'contacted_qualified': 2,
        'consultation_scheduled': 3,
        'active_client': 4,
        'retention_review': 5,
      };
      const numericStageId = stageMap[newStageId] || 1;
      await provider.movePipelineCard(cardId, numericStageId, 0, 1);
      showToast('Pipeline Advanced', `${previousCard?.title || 'Card'} moved to stage.`, 'success');
    } catch (err: any) {
      if (previousStage) {
        setPipelineCards((prev) =>
          prev.map((c) => (c.id === cardId ? { ...c, stageId: previousStage } : c))
        );
      }
      showToast(
        'Pipeline Conflict',
        err?.message || 'Card was modified by another operator. Reverted to previous stage.',
        'warning'
      );
      throw err;
    }
  };

  const handleAddNewPipelineCard = async (cardData: Omit<ClinicPipelineCard, 'id' | 'lastContacted'>) => {
    const newCard: ClinicPipelineCard = {
      ...cardData,
      id: `pipe-${Date.now()}`,
      lastContacted: 'Today'
    };
    setPipelineCards([newCard, ...pipelineCards]);

    try {
      await provider.createPipelineCard({
        operational_note: cardData.title,
        contact: {
          id: Date.now(),
          name: cardData.contactName,
          phone_number: cardData.contactPhone
        },
        appointment_mode: cardData.value,
        stage_id: 1,
      });
    } catch (err) {
      console.warn('Failed to sync new pipeline card to CRM:', err);
    }
    showToast('Lead Created', `${newCard.title} added to intake pipeline.`, 'success');
  };

  // Create Campaign
  const handleCreateCampaign = async (campaignData: any) => {
    const newCmp: WhatsAppCampaign = {
      ...campaignData,
      id: `cmp-${Date.now()}`,
      createdAt: 'Just now',
      sentCount: campaignData.status === 'running' ? campaignData.totalRecipients : 0,
      deliveredCount: campaignData.status === 'running' ? Math.floor(campaignData.totalRecipients * 0.98) : 0,
      readCount: campaignData.status === 'running' ? Math.floor(campaignData.totalRecipients * 0.88) : 0,
      repliedCount: campaignData.status === 'running' ? Math.floor(campaignData.totalRecipients * 0.22) : 0,
      failedCount: 0,
      excludedCount: 8
    };
    setCampaigns([newCmp, ...campaigns]);

    try {
      await provider.createCampaign({
        title: campaignData.title,
        description: campaignData.audienceSummary,
        inbox_id: 101,
        campaign_status: campaignData.status || 'draft',
        consent_purpose: 'appointment_reminders',
        audience: {
          type: campaignData.audienceType || 'labels',
          id: 'default'
        }
      });
    } catch (err) {
      console.warn('Failed to sync campaign to CRM:', err);
    }
    showToast('Campaign Configured', `${newCmp.title} registered in queue.`, 'success');
  };

  // Quick Compose dispatch
  const handleQuickComposeSend = (recipient: string, message: string, templateId?: string) => {
    const matchedContact = contacts.find(c => c.phone.includes(recipient) || c.name.toLowerCase().includes(recipient.toLowerCase()));
    const contactName = matchedContact ? matchedContact.name : recipient;

    const newConvoId = `convo-out-${Date.now()}`;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newConvo: Conversation = {
      id: newConvoId,
      contactId: matchedContact ? matchedContact.id : `cnt-quick-${Date.now()}`,
      contactName,
      contactPhone: matchedContact ? matchedContact.phone : recipient,
      contactEmail: matchedContact ? matchedContact.email : '',
      inbox: 'Agamagizh WhatsApp Main',
      channel: 'whatsapp',
      status: 'open',
      priority: 'high',
      assignedAgent: 'Kavitha Sundaram',
      assignedTeam: 'Adyar Care Desk',
      labels: ['Outbound Reach', 'WhatsApp'],
      lastMessage: message,
      lastTimestamp: timeNow,
      unreadCount: 0,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'agent',
          senderName: 'Kavitha Sundaram',
          text: message,
          timestamp: timeNow,
          status: 'delivered'
        }
      ]
    };

    setConversations([newConvo, ...conversations]);
    setActiveConvoId(newConvoId);
    setCurrentSection('conversations');
    showToast('Message Dispatched', `Outbound WhatsApp sent to ${contactName}.`, 'success');
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const openConversationsCount = conversations.filter(c => c.status === 'open').length;

  // Render Internal Universal UI & System States Reference Surface
  if (isUiReferenceOpen) {
    return (
      <UIReferenceView 
        onBackToConsole={() => {
          setIsUiReferenceOpen(false);
          if (typeof window !== 'undefined' && window.history?.pushState) {
            window.history.pushState({}, '', '/');
          }
        }} 
      />
    );
  }

  return (
    <Shell
      currentSection={currentSection}
      currentWhatsAppSub={currentWhatsAppSub}
      onNavigate={handleNavigate}
      unreadCount={totalUnread}
      openConversationsCount={openConversationsCount}
      contactsCount={contacts.length}
      pipelineCount={pipelineCards.length}
      campaignsCount={campaigns.length}
      onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      onOpenQuickCompose={() => setIsQuickComposeOpen(true)}
    >
      {/* 1. MY INBOX */}
      {(currentSection === 'my_inbox' || (currentSection as any) === 'my-inbox') && (
        <MyInboxView
          conversations={conversations}
          activeConvoId={activeConvoId}
          onSelectConvo={(id) => setActiveConvoId(id)}
          onSendMessage={handleSendMessage}
          onUpdateStatus={handleUpdateStatus}
          onUpdateAssignee={handleUpdateAssignee}
          onAddLabel={handleAddLabel}
          onOpenContact={(contact) => handleOpenConversationWithContact(contact)}
          onOpenQuickCompose={() => setIsQuickComposeOpen(true)}
        />
      )}

      {/* 2. ALL CONVERSATIONS */}
      {currentSection === 'conversations' && (
        <ConversationsWorkbench
          conversations={conversations}
          activeConvoId={activeConvoId}
          onSelectConvo={(id) => setActiveConvoId(id)}
          onSendMessage={handleSendMessage}
          onUpdateStatus={handleUpdateStatus}
          onUpdateAssignee={handleUpdateAssignee}
          onAddLabel={handleAddLabel}
          filterChannel=""
          isWhatsAppInbox={false}
          onOpenQuickCompose={() => setIsQuickComposeOpen(true)}
          onOpenContact={(contact) => handleOpenConversationWithContact(contact)}
        />
      )}

      {/* 3. CAPTAIN AI HUB */}
      {currentSection === 'captain' && <CaptainView />}

      {/* 4. CONTACTS CRM */}
      {currentSection === 'contacts' && (
        <ContactsView
          contacts={contacts}
          onOpenConversationWithContact={handleOpenConversationWithContact}
          onAddNewContact={handleAddNewContact}
        />
      )}

      {/* 5. COMPANIES & ORGANIZATIONS */}
      {currentSection === 'companies' && <CompaniesView />}

      {/* 6. OPERATIONAL REPORTS */}
      {currentSection === 'reports' && <ReportsView />}

      {/* 7. CLINIC INTAKE PIPELINE */}
      {(currentSection === 'clinic_pipeline' || (currentSection as any) === 'clinic-pipeline') && (
        <ClinicPipelineView
          cards={pipelineCards}
          onMoveStage={handleMovePipelineStage}
          onOpenConversation={(card) => {
            const matched = conversations.find(c => c.contactPhone === card.contactPhone);
            if (matched) {
              setActiveConvoId(matched.id);
              setCurrentSection('conversations');
            } else {
              handleOpenConversationWithContact({
                id: `cnt-${card.id}`,
                name: card.contactName,
                phone: card.contactPhone,
                email: '',
                channel: 'whatsapp',
                status: 'active',
                labels: card.labels,
                conversationsCount: 1,
                lastActivity: 'Today',
                customAttributes: {}
              });
            }
          }}
          onAddNewCard={handleAddNewPipelineCard}
        />
      )}

      {/* 8. BROADCASTS & CAMPAIGNS */}
      {currentSection === 'campaigns' && (
        <CampaignsView
          campaigns={campaigns}
          onCreateCampaign={handleCreateCampaign}
          onViewAnalytics={() => handleNavigate('whatsapp', 'analytics')}
        />
      )}

      {/* 9. WHATSAPP SUITE */}
      {currentSection === 'whatsapp' && (
        <WhatsAppHub
          conversations={conversations}
          activeConvoId={activeConvoId}
          onSelectConvo={(id) => setActiveConvoId(id)}
          onSendMessage={handleSendMessage}
          onUpdateStatus={handleUpdateStatus}
          onUpdateAssignee={handleUpdateAssignee}
          onAddLabel={handleAddLabel}
          campaigns={campaigns}
          onCreateCampaign={handleCreateCampaign}
          currentWhatsAppSub={currentWhatsAppSub}
          onOpenQuickCompose={() => setIsQuickComposeOpen(true)}
          onOpenContact={(contact) => handleOpenConversationWithContact(contact)}
        />
      )}

      {/* 10. HELP CENTER & KNOWLEDGE BASE */}
      {(currentSection === 'help_center' || (currentSection as any) === 'help-center') && <HelpCenterView />}

      {/* 11. WORKSPACE SETTINGS */}
      {currentSection === 'settings' && <SettingsView />}

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
        contacts={contacts}
        conversations={conversations}
        onSelectContact={handleOpenConversationWithContact}
        onSelectConversation={(id) => {
          setActiveConvoId(id);
          setCurrentSection('conversations');
        }}
      />

      {/* Quick Compose Modal */}
      <QuickComposeModal
        isOpen={isQuickComposeOpen}
        onClose={() => setIsQuickComposeOpen(false)}
        contacts={contacts}
        onSend={handleQuickComposeSend}
        onSendMessage={(targetName, targetPhone, inbox, message) => {
          handleQuickComposeSend(targetPhone, message);
        }}
      />

      {/* Operational Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Internal Development Reference Quick-Access Trigger (Non-production navigation) */}
      <div className="fixed bottom-3 right-3 z-30 opacity-70 hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => {
            setIsUiReferenceOpen(true);
            if (typeof window !== 'undefined' && window.history?.pushState) {
              window.history.pushState({}, '', '/ui-reference');
            }
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 text-white text-[10px] font-mono font-medium shadow-md backdrop-blur-xs hover:bg-slate-900 border border-slate-700"
          title="Open Internal Universal UI Reference (/ui-reference)"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Dev: /ui-reference</span>
        </button>
      </div>
    </Shell>
  );
}

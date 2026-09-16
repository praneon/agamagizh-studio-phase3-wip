import { AutomationRuleItem } from './types';

export const INITIAL_AUTOMATION_RULES: AutomationRuleItem[] = [
  {
    id: 'rule-1',
    name: 'Auto-Assign Inbound WhatsApp to Adyar Care Desk',
    description: 'When a new WhatsApp conversation arrives from Adyar contacts, route to Reception Desk and apply Adyar label.',
    status: 'Active',
    triggerType: 'message_received',
    triggerConfig: {
      channel: 'whatsapp',
      inbox: 'Agamagizh WhatsApp Main',
      messageDirection: 'incoming'
    },
    matchMode: 'ALL',
    conditions: [
      {
        id: 'c-1',
        field: 'inbox_name',
        operator: 'equals',
        value: 'Agamagizh WhatsApp Main'
      },
      {
        id: 'c-2',
        field: 'contact_labels',
        operator: 'contains',
        value: 'Adyar'
      }
    ],
    actions: [
      {
        id: 'a-1',
        type: 'assign_conversation',
        params: { targetType: 'team', targetValue: 'Adyar Care Desk' }
      },
      {
        id: 'a-2',
        type: 'add_label',
        params: { label: 'Adyar Branch' }
      }
    ],
    executionCount: 1420,
    lastUpdated: '12m ago'
  },
  {
    id: 'rule-2',
    name: 'Tag Urgent Inquiries & Notify Duty Lead',
    description: 'When an incoming WhatsApp contains urgent keywords, set priority and alert duty lead agent.',
    status: 'Active',
    triggerType: 'message_received',
    triggerConfig: {
      channel: 'whatsapp',
      inbox: 'Agamagizh WhatsApp Main',
      messageDirection: 'incoming'
    },
    matchMode: 'ANY',
    conditions: [
      {
        id: 'c-3',
        field: 'message_text',
        operator: 'contains',
        value: 'urgent'
      },
      {
        id: 'c-4',
        field: 'message_text',
        operator: 'contains',
        value: 'emergency'
      },
      {
        id: 'c-5',
        field: 'message_text',
        operator: 'contains',
        value: 'cancel today'
      }
    ],
    actions: [
      {
        id: 'a-3',
        type: 'add_label',
        params: { label: 'Urgent Attention' }
      },
      {
        id: 'a-4',
        type: 'assign_conversation',
        params: { targetType: 'agent', targetValue: 'Kavitha Sundaram' }
      }
    ],
    executionCount: 284,
    lastUpdated: '1h ago'
  },
  {
    id: 'rule-3',
    name: 'After-Hours Auto-Acknowledgement Dispatch',
    description: 'Dispatch an automatic greeting and off-hours service hours notice outside 08:30 AM to 07:30 PM IST.',
    status: 'Active',
    triggerType: 'message_received',
    triggerConfig: {
      channel: 'whatsapp',
      inbox: 'Agamagizh WhatsApp Main',
      messageDirection: 'incoming'
    },
    matchMode: 'ALL',
    conditions: [
      {
        id: 'c-6',
        field: 'business_hours_status',
        operator: 'equals',
        value: 'offline'
      }
    ],
    actions: [
      {
        id: 'a-5',
        type: 'send_template',
        params: { template: 'after_hours_auto_reply' }
      }
    ],
    executionCount: 3491,
    lastUpdated: 'Yesterday'
  }
];

export type RuleTriggerType =
  | 'message_received'
  | 'conversation_opened'
  | 'status_changed'
  | 'contact_created';

export interface AutomationCondition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'not_equals' | 'is_present';
  value: string;
}

export interface AutomationAction {
  id: string;
  type: 'assign_conversation' | 'add_label' | 'send_template' | 'resolve' | 'snooze';
  params: Record<string, string>;
}

export interface AutomationRuleItem {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Draft' | 'Paused';
  triggerType: RuleTriggerType;
  triggerConfig?: {
    channel?: string;
    inbox?: string;
    messageDirection?: 'incoming' | 'outgoing';
  };
  matchMode: 'ALL' | 'ANY';
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  executionCount: number;
  lastUpdated: string;
}

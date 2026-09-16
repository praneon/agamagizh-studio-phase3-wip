/**
 * Template Builder & Synced Provider Templates Types
 */

export type TemplateButtonType = 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
export type HeaderType = 'none' | 'text' | 'image' | 'document' | 'video';

export interface TemplateVariable {
  token: string;
  index: number;
  example: string;
  description?: string;
}

export interface TemplateButton {
  id: string;
  type: TemplateButtonType;
  text: string;
  value?: string;
  phoneNumber?: string;
}

export interface TemplateDraft {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  source: 'local_draft' | 'meta_cloud';
  status: 'local_draft' | 'pending' | 'approved' | 'rejected';
  isCampaignEligible: boolean;
  header: {
    type: 'none' | 'text' | 'image' | 'document' | 'video';
    text?: string;
  };
  body: string;
  footer?: string;
  variables: TemplateVariable[];
  buttons: TemplateButton[];
  createdAt: string;
  updatedAt: string;
}

export const SAMPLE_DRAFTS: Record<string, TemplateDraft> = {
  appointment_reminder: {
    id: 'draft-appt-1',
    name: 'appointment_reminder_draft',
    category: 'UTILITY',
    language: 'en_US',
    source: 'local_draft',
    status: 'local_draft',
    isCampaignEligible: false,
    header: {
      type: 'text',
      text: 'Agamagizh Care — Appointment Update',
    },
    body: 'Hello {{1}}, this is a reminder for your upcoming clinical consultation with {{2}} scheduled on {{3}} at {{4}}.',
    footer: 'Agamagizh Multi-Specialty Clinic',
    variables: [
      { token: '{{1}}', index: 1, example: 'Patient Name', description: 'Patient name' },
      { token: '{{2}}', index: 2, example: 'Dr. Rajesh Sharma', description: 'Doctor name' },
      { token: '{{3}}', index: 3, example: 'Monday, 10:00 AM', description: 'Date and time' },
      { token: '{{4}}', index: 4, example: 'Adyar OPD Suite 3', description: 'Location' },
    ],
    buttons: [
      { id: 'btn-1', type: 'QUICK_REPLY', text: 'Confirm Visit' },
      { id: 'btn-2', type: 'QUICK_REPLY', text: 'Request Reschedule' },
    ],
    createdAt: 'Today',
    updatedAt: 'Just now',
  },
};


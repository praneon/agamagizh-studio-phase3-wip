/**
 * Template Builder Utilities & Helpers
 */

import { TemplateDraft } from './types';

export function extractVariablesFromText(text: string): number[] {
  if (!text) return [];
  const matches = text.match(/\{\{(\d+)\}\}/g);
  if (!matches) return [];
  const indices = matches
    .map((m) => {
      const num = m.replace(/[\{\}]/g, '');
      return parseInt(num, 10);
    })
    .filter((n) => !isNaN(n));
  return Array.from(new Set(indices)).sort((a, b) => a - b);
}

export function interpolateText(
  text: string,
  variables: Array<{ index: number; example: string }>
): string {
  if (!text) return '';
  let result = text;
  variables.forEach((v) => {
    const pattern = new RegExp(`\\{\\{${v.index}\\}\\}`, 'g');
    result = result.replace(pattern, v.example || `[Param ${v.index}]`);
  });
  return result;
}

export const SAMPLE_DRAFTS: TemplateDraft[] = [
  {
    id: 'draft-opd-reminder',
    name: 'agamagizh_opd_reminder_v1',
    category: 'UTILITY',
    language: 'en_US',
    source: 'local_draft',
    status: 'approved',
    isCampaignEligible: true,
    header: {
      type: 'text',
      text: 'Agamagizh Care — Appointment Reminder',
    },
    body: 'Hello {{1}}, your consultation with {{2}} is confirmed for {{3}} at our Adyar campus. Please arrive 15 minutes before your slot.',
    footer: 'Reply STOP to opt out of WhatsApp notifications',
    variables: [
      { token: '{{1}}', index: 1, example: 'Meera Sundaram', description: 'Patient Full Name' },
      { token: '{{2}}', index: 2, example: 'Dr. Rajesh Sharma', description: 'Doctor Name' },
      { token: '{{3}}', index: 3, example: 'Tomorrow at 10:30 AM', description: 'Appointment Slot' },
    ],
    buttons: [
      {
        id: 'b-1',
        type: 'QUICK_REPLY',
        text: 'Confirm Attendance',
      },
      {
        id: 'b-2',
        type: 'QUICK_REPLY',
        text: 'Reschedule Slot',
      },
      {
        id: 'b-3',
        type: 'PHONE_NUMBER',
        text: 'Call Clinic',
        phoneNumber: '+914428400001',
      },
    ],
    createdAt: '2026-09-10',
    updatedAt: '2026-09-12',
  },
  {
    id: 'draft-postop-checkin',
    name: 'agamagizh_postop_checkin_day3',
    category: 'UTILITY',
    language: 'en_US',
    source: 'local_draft',
    status: 'approved',
    isCampaignEligible: true,
    header: {
      type: 'text',
      text: 'Post-Procedure Recovery Check-in',
    },
    body: 'Dear {{1}}, how are you feeling 3 days post-procedure? Please let your care coordinator know if you are experiencing any pain or fever.',
    footer: 'Agamagizh Clinical Support Team',
    variables: [
      { token: '{{1}}', index: 1, example: 'Anand Kumar', description: 'Patient Name' },
    ],
    buttons: [
      { id: 'b-4', type: 'QUICK_REPLY', text: 'I feel great' },
      { id: 'b-5', type: 'QUICK_REPLY', text: 'Request Call Back' },
    ],
    createdAt: '2026-09-08',
    updatedAt: '2026-09-11',
  },
];

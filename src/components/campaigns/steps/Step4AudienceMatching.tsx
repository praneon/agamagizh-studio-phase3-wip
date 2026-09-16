/**
 * Campaign Wizard Step 4: Variable Mapping / Audience Parameter Binding
 */

import React from 'react';
import { WhatsAppTemplate } from '../../../types';
import { Sparkles, ArrowRight, User, Phone, Calendar, Info } from 'lucide-react';

interface Step4AudienceMatchingProps {
  template?: WhatsAppTemplate;
  templateParams: Record<string, string>;
  onChangeParams: (params: Record<string, string>) => void;
  showErrors?: boolean;
}

export const Step4AudienceMatching: React.FC<Step4AudienceMatchingProps> = ({
  template,
  templateParams,
  onChangeParams,
  showErrors,
}) => {
  const variables = Object.keys(template?.variableExamples || { '{{1}}': 'Patient Name' });

  const handleParamChange = (varKey: string, mappedField: string) => {
    onChangeParams({
      ...templateParams,
      [varKey]: mappedField,
    });
  };

  return (
    <div className="space-y-5 max-w-2xl text-xs">
      <div>
        <h3 className="text-sm font-semibold text-white">Template Dynamic Variable Mapping</h3>
        <p className="text-slate-400 mt-0.5">
          Map template placeholders like {'{{1}}'}, {'{{2}}'} to patient demographic data or custom tags.
        </p>
      </div>

      <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
        <span className="text-[11px] font-semibold text-emerald-400 block">Selected Template Preview</span>
        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-200 leading-relaxed font-mono text-[11px]">
          {template?.body || 'No template selected'}
        </div>
      </div>

      <div className="space-y-3">
        <span className="font-semibold text-slate-200 block">Parameter Mappings</span>

        {variables.map((vKey) => {
          const varDesc = template?.variableDescriptions?.[vKey] || `Variable ${vKey}`;
          const currentVal = templateParams[vKey] || 'contact.name';

          return (
            <div key={vKey} className="p-3 rounded-lg bg-slate-850 bg-slate-800/40 border border-slate-700/70 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-800/60">
                    {vKey}
                  </span>
                  <span className="font-medium text-slate-300">{varDesc}</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Fallback example: "{template?.variableExamples?.[vKey] || 'Value'}"
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={currentVal}
                  onChange={(e) => handleParamChange(vKey, e.target.value)}
                  className="px-2.5 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="contact.name">Patient Full Name (contact.name)</option>
                  <option value="contact.phone">Mobile Phone (contact.phone)</option>
                  <option value="contact.location">Branch / City (contact.location)</option>
                  <option value="custom.doctor_assigned">Doctor Assigned (Dr. Rajesh / Dr. Arvind)</option>
                  <option value="custom.appointment_date">Next Appointment Date</option>
                  <option value="static">Static Text Custom Value</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

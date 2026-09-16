import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CanonicalMetrics, CanonicalRecipientStatus } from './types';

interface DeliveryFlowDiagramProps {
  metrics: CanonicalMetrics;
  onSelectStatus: (status: CanonicalRecipientStatus | 'all') => void;
  isDark?: boolean;
}

export const DeliveryFlowDiagram: React.FC<DeliveryFlowDiagramProps> = ({
  metrics,
  onSelectStatus,
  isDark
}) => {
  const steps = [
    { label: 'Sent Outbound', count: metrics.sent, status: 'sent' as CanonicalRecipientStatus, color: 'bg-indigo-500' },
    { label: 'Carrier Delivered', count: metrics.delivered, status: 'delivered' as CanonicalRecipientStatus, color: 'bg-emerald-500' },
    { label: 'Read by Recipient', count: metrics.read, status: 'read' as CanonicalRecipientStatus, color: 'bg-blue-500' },
    { label: 'Replied / Converted', count: metrics.replied, status: 'replied' as CanonicalRecipientStatus, color: 'bg-[#5A4AD2]' }
  ];

  return (
    <div className={`p-4 rounded-xl border ${
      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
    }`}>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
        Delivery Conversion Funnel
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <button
              type="button"
              onClick={() => onSelectStatus(step.status)}
              className={`flex-1 w-full p-3 rounded-xl border text-left transition-colors ${
                isDark ? 'bg-slate-950/40 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${step.color}`} />
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {step.label}
                </span>
              </div>
              <div className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {step.count.toLocaleString()}
              </div>
            </button>

            {idx < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

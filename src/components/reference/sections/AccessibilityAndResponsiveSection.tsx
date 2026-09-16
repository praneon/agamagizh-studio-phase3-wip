import React from 'react';
import { ShieldCheck, Eye, Smartphone, Monitor } from 'lucide-react';

interface Props {
  isDark?: boolean;
}

export const AccessibilityAndResponsiveSection: React.FC<Props> = ({ isDark }) => {
  return (
    <section id="accessibility" className={`p-6 rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-[#5A4AD2]" />
        <h2 className="text-lg font-bold">Accessibility & Responsive Viewports</h2>
      </div>
      <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        WCAG AA compliance, focus rings, minimum touch target dimensions, and fluid breakpoints.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-2 text-xs font-bold mb-2">
            <Eye className="w-4 h-4 text-[#5A4AD2]" />
            <span>WCAG AA Color Contrast</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All text colors exceed a 4.5:1 ratio against light and dark backdrops. Interactive focus rings use a clear 2px outline.
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-2 text-xs font-bold mb-2">
            <Smartphone className="w-4 h-4 text-[#5A4AD2]" />
            <span>Touch Target Scaling</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Mobile controls enforce minimum 44×44px hit targets and responsive collapsible drawer structures.
          </p>
        </div>
      </div>
    </section>
  );
};

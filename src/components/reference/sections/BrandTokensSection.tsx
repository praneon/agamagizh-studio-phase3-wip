import React from 'react';
import { Palette, Check } from 'lucide-react';

interface BrandTokensSectionProps {
  isDark?: boolean;
}

export const BrandTokensSection: React.FC<BrandTokensSectionProps> = ({ isDark }) => {
  const brandColors = [
    { name: 'Primary Purple (Brand Flagship)', hex: '#5A4AD2', rgb: 'rgb(90, 74, 210)', bgClass: 'bg-[#5A4AD2]', textClass: 'text-white' },
    { name: 'Purple Hover', hex: '#4B3DB5', rgb: 'rgb(75, 61, 181)', bgClass: 'bg-[#4B3DB5]', textClass: 'text-white' },
    { name: 'Purple Light / Accent Tint', hex: '#EEF0FD', rgb: 'rgb(238, 240, 253)', bgClass: 'bg-violet-100 dark:bg-violet-950/60', textClass: 'text-violet-900 dark:text-violet-200' },
    { name: 'Success / WhatsApp Green', hex: '#25D366', rgb: 'rgb(37, 211, 102)', bgClass: 'bg-emerald-500', textClass: 'text-white' },
    { name: 'Warning / Amber', hex: '#F59E0B', rgb: 'rgb(245, 158, 11)', bgClass: 'bg-amber-500', textClass: 'text-white' },
    { name: 'Danger / Rose', hex: '#E11D48', rgb: 'rgb(225, 29, 72)', bgClass: 'bg-rose-500', textClass: 'text-white' },
    { name: 'Information / Blue', hex: '#3B82F6', rgb: 'rgb(59, 130, 246)', bgClass: 'bg-blue-500', textClass: 'text-white' }
  ];

  return (
    <section id="brand" className={`p-6 rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-[#5A4AD2]" />
        <h2 className="text-lg font-bold">Brand Design Tokens</h2>
      </div>
      <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Core color tokens, interactive states, and surface tokens governing the Agamagizh Clinical CRM presentation.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {brandColors.map((color) => (
          <div 
            key={color.name} 
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50/50'
            }`}
          >
            <div className={`h-16 w-full rounded-lg ${color.bgClass} flex items-center justify-center mb-3 shadow-inner`}>
              <span className={`text-xs font-mono font-bold ${color.textClass}`}>{color.hex}</span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{color.name}</div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">{color.rgb}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

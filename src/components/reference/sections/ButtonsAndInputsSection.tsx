import React from 'react';
import { SquareAsterisk, Search, Send, Plus } from 'lucide-react';

interface Props {
  isDark?: boolean;
}

export const ButtonsAndInputsSection: React.FC<Props> = ({ isDark }) => {
  return (
    <section id="buttons" className={`p-6 rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <SquareAsterisk className="w-5 h-5 text-[#5A4AD2]" />
        <h2 className="text-lg font-bold">Buttons & Input Controls</h2>
      </div>
      <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Standardized interactive actions, icon buttons, states, and form inputs.
      </p>
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Button Variants</h3>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="px-4 py-2 rounded-xl bg-[#5A4AD2] hover:bg-[#4B3DB5] text-white text-xs font-bold transition-colors shadow-sm">
              Primary Button
            </button>
            <button type="button" className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors">
              Secondary Button
            </button>
            <button type="button" className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors">
              Destructive
            </button>
            <button type="button" disabled className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 text-xs font-bold cursor-not-allowed">
              Disabled State
            </button>
            <button type="button" className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Plus className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Input Fields</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                readOnly
                value="Search contacts or records..."
                className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              />
            </div>
            <div>
              <input
                type="text"
                readOnly
                value="Standard text input"
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

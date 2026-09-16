import React from 'react';
import { Table as TableIcon, Filter, Download } from 'lucide-react';

interface Props {
  isDark?: boolean;
}

export const TablesAndToolbarSection: React.FC<Props> = ({ isDark }) => {
  return (
    <section id="tables" className={`p-6 rounded-2xl border transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <TableIcon className="w-5 h-5 text-[#5A4AD2]" />
        <h2 className="text-lg font-bold">Tables, Ledgers & Toolbars</h2>
      </div>
      <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Clean high-density data tables and operational ledger rows.
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2 p-3 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <div className="text-xs font-bold">Toolbar Example</div>
          <div className="flex items-center gap-2">
            <button type="button" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold hover:bg-white dark:hover:bg-slate-800">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
            <button type="button" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold hover:bg-white dark:hover:bg-slate-800">
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className={`border-b ${isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <tr>
                <th className="px-4 py-2.5 font-bold">Contact</th>
                <th className="px-4 py-2.5 font-bold">Phone Number</th>
                <th className="px-4 py-2.5 font-bold">Status</th>
                <th className="px-4 py-2.5 font-bold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="px-4 py-2.5 font-semibold">Suresh Ramanathan</td>
                <td className="px-4 py-2.5 font-mono">+91 98401 92831</td>
                <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 text-[10px] font-bold">Delivered</span></td>
                <td className="px-4 py-2.5 text-slate-400">10:14 AM</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-semibold">Meenakshi Sundaram</td>
                <td className="px-4 py-2.5 font-mono">+91 97910 44821</td>
                <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 text-[10px] font-bold">Read</span></td>
                <td className="px-4 py-2.5 text-slate-400">10:18 AM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

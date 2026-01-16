import React from 'react';
import { getIconUrl } from '../utils/icons';

export const AboutThisMac: React.FC = () => {
  return (
    // Inner window content matching the requested design
    // The outer window frame (dragging, shadow, positioning) is handled by Window.tsx
    // The Traffic Lights are also overlaid by Window.tsx
    <div className="w-full h-full bg-white/90 dark:bg-black/40 backdrop-blur-2xl flex flex-col items-center pb-6 select-none text-black dark:text-gray-100">

      {/* Header Placeholder (Traffic lights mapped by Window.tsx) */}
      <div className="w-full h-[52px] flex items-center justify-start px-4 shrink-0" data-window-drag-handle>
        {/* No visual circles here, Window.tsx provides the functional ones */}
      </div>

      {/* Device Image */}
      <div className="mb-4 relative group cursor-default">
        <img
          src={getIconUrl('computer-old')}
          alt="Computer"
          className="w-28 h-28 object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight drop-shadow-sm">Portfolio Pro</h1>
      <p className="text-[11px] text-gray-500 dark:text-gray-300 font-medium mb-6">2025 Web Edition</p>

      {/* Specs List */}
      <div className="w-full px-6 space-y-2 mb-6 text-[11px]">
        <div className="flex justify-between items-center group">
          <span className="text-gray-500 dark:text-gray-300 font-medium text-right w-20">Chip</span>
          <span className="text-gray-900 dark:text-white font-semibold text-left flex-1 ml-4 bg-white/50 dark:bg-white/10 px-2 py-0.5 rounded border border-black/5 dark:border-white/10 shadow-sm backdrop-blur-sm">React + Tailwind CSS</span>
        </div>
        <div className="flex justify-between items-center group">
          <span className="text-gray-500 dark:text-gray-300 font-medium text-right w-20">Memory</span>
          <span className="text-gray-900 dark:text-white font-medium text-left flex-1 ml-4">128 GB (Cloud)</span>
        </div>
        <div className="flex justify-between items-center group">
          <span className="text-gray-500 dark:text-gray-300 font-medium text-right w-20">Serial</span>
          <span className="text-gray-900 dark:text-white font-medium text-left flex-1 ml-4">P0RTF0L10-25</span>
        </div>
        <div className="flex justify-between items-center group">
          <span className="text-gray-500 dark:text-gray-300 font-medium text-right w-20">OS</span>
          <span className="text-gray-900 dark:text-white font-medium text-left flex-1 ml-4">PortfolioOS 1.0</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col w-full px-8 space-y-2">
        <button className="w-full py-1 bg-white/80 dark:bg-white/10 border border-white/60 dark:border-white/10 rounded-[6px] text-[11px] font-medium text-gray-800 dark:text-gray-100 shadow-sm hover:bg-white dark:hover:bg-white/20 active:bg-gray-50 dark:active:bg-white/25 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 backdrop-blur-md">
          More Info...
        </button>
      </div>

      {/* Footer Trademark */}
      <div className="mt-4 text-[9px] text-gray-500 dark:text-gray-400">
        © Prashanth 2026
      </div>

    </div>
  );
};
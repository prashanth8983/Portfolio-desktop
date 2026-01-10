import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaApple } from 'react-icons/fa';

export const AboutThisMac: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Displays', 'Storage', 'Support', 'Resources'];

  const systemInfo = {
    modelName: 'MacBook Pro',
    modelDetail: '14-inch, Nov 2024',
    chip: 'Apple M4 Max',
    memory: '128 GB',
    startupDisk: 'Macintosh HD',
    serialNumber: 'X9F2K1L0P',
    macosVersion: 'macOS Sequoia',
    versionNumber: '15.2'
  };

  return (
    <div className={`w-full h-full flex flex-col ${isDark ? 'bg-[#1e1e1e] text-white' : 'bg-[#e8e8e8] text-black'} overflow-hidden`}>

      {/* Toolbar / Tabs */}
      <div className={`w-full h-12 flex items-center justify-center border-b border-black/10 px-2 select-none ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-black/5'}`}>
        <div className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-[13px] rounded-md font-medium transition-all ${activeTab === tab
                ? (isDark ? 'bg-white/20 text-white shadow-sm' : 'bg-white text-black shadow-sm')
                : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black')}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 flex flex-row items-start space-x-8">

        {/* Left Side: Icon */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00C6FB] to-[#005BEA] shadow-xl flex items-center justify-center relative overflow-hidden ring-4 ring-white/10">
            <FaApple className="text-white drop-shadow-md" size={72} />
            {/* Glass Shine */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-60"></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight">{systemInfo.macosVersion}</h2>
            <p className={`text-[13px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Version {systemInfo.versionNumber}</p>
          </div>
        </div>

        {/* Right Side: Specs */}
        <div className="flex-1 pt-1">
          <div className="space-y-3">
            <div className="space-y-0.5">
              <h3 className="text-[15px] font-bold">{systemInfo.modelName}</h3>
              <p className={`text-[12px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{systemInfo.modelDetail}</p>
            </div>

            <div className="pt-2 space-y-2 text-[13px]">
              <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                <span className={`font-medium text-right ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Chip</span>
                <span className="font-medium">{systemInfo.chip}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                <span className={`font-medium text-right ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Memory</span>
                <span className="font-medium">{systemInfo.memory}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                <span className={`font-medium text-right ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Startup Disk</span>
                <span className="font-medium">{systemInfo.startupDisk}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                <span className={`font-medium text-right ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Serial</span>
                <span className="font-medium">{systemInfo.serialNumber}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex space-x-3">
            <button className={`px-4 py-1.5 rounded-md text-[13px] font-medium shadow-sm active:scale-95 transition-all ${isDark ? 'bg-[#333] border border-white/20 hover:bg-[#444]' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}>
              System Report...
            </button>
            <button className={`px-4 py-1.5 rounded-md text-[13px] font-medium shadow-sm active:scale-95 transition-all ${isDark ? 'bg-[#333] border border-white/20 hover:bg-[#444]' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}>
              Software Update...
            </button>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className={`px-6 py-3 text-[10px] text-center border-t ${isDark ? 'border-white/10 text-gray-500' : 'border-black/5 text-gray-400'}`}>
        ™ and © 1983-{new Date().getFullYear()} Apple Inc. All Rights Reserved.
      </div>
    </div>
  );
};
import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useProcesses, AppProcess } from '../contexts/ProcessContext';
import {
  FaMicrochip, FaCube,
  FaStopCircle
} from 'react-icons/fa';
import {
  MagnifyingGlassIcon,
  InfoCircledIcon,
  DotsHorizontalIcon,
  ChevronDownIcon,
  ActivityLogIcon
} from '@radix-ui/react-icons';
import { getIconUrl } from '../utils/icons';

type Tab = 'CPU' | 'Memory' | 'Energy' | 'Disk' | 'Network';

// Icon mapping for processes
const getProcessIcon = (process: AppProcess): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    'Safari': <img src={getIconUrl('safari')} alt="" className="w-4 h-4 object-contain" />,
    'Finder': <img src={getIconUrl('finder')} alt="" className="w-4 h-4 object-contain" />,
    'Terminal': <img src={getIconUrl('terminal')} alt="" className="w-4 h-4 object-contain" />,
    'Mail': <img src={getIconUrl('mail')} alt="" className="w-4 h-4 object-contain" />,
    'Photos': <img src={getIconUrl('photos')} alt="" className="w-4 h-4 object-contain" />,
    'Calculator': <img src={getIconUrl('calculator')} alt="" className="w-4 h-4 object-contain" />,
    'Activity Monitor': <ActivityLogIcon className="w-4 h-4 text-green-500" />,
    'TextEdit': <span className="w-4 h-4 flex items-center justify-center text-xs">📝</span>,
    'System Settings': <img src={getIconUrl('system-settings')} alt="" className="w-4 h-4 object-contain" />,
    'Preview': <span className="w-4 h-4 flex items-center justify-center text-xs">📄</span>,
    'Music': <span className="w-4 h-4 flex items-center justify-center text-xs">🎵</span>,
    'Calendar': <img src={getIconUrl('calendar')} alt="" className="w-4 h-4 object-contain" />,
    'Bin': <img src={getIconUrl('bin')} alt="" className="w-4 h-4 object-contain" />,
  };

  if (iconMap[process.name]) {
    return iconMap[process.name];
  }

  // System process icons
  if (process.type === 'system') {
    if (process.name === 'kernel_task') return <FaMicrochip className="w-3.5 h-3.5 text-gray-400" />;
    if (process.name === 'WindowServer') return <FaCube className="w-3.5 h-3.5 text-blue-400" />;
    if (process.name === 'Dock') return <span className="w-3.5 h-3.5 bg-gray-500 rounded block" />;
    return <span className="w-3.5 h-3.5 bg-gray-400 rounded-sm block opacity-60" />;
  }

  if (process.type === 'background') {
    if (process.name === 'Spotlight') return <MagnifyingGlassIcon className="w-3.5 h-3.5 text-blue-400" />;
    return <span className="w-3.5 h-3.5 bg-gray-500 rounded-full block opacity-50" />;
  }

  // Default user app icon
  return <span className="w-3.5 h-3.5 bg-blue-500 rounded block" />;
};

// Format memory for display
const formatMemory = (mb: number): string => {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`;
  }
  return `${mb.toFixed(1)} MB`;
};

// Get user for process
const getProcessUser = (process: AppProcess): string => {
  if (process.type === 'system') {
    if (process.name === 'kernel_task' || process.name === 'launchd') return 'root';
    if (process.name === 'WindowServer') return '_windowserver';
    return 'root';
  }
  return 'User';
};

export const ActivityMonitor: React.FC = () => {
  const { isDark } = useTheme();
  const { processes } = useProcesses();
  const [activeTab, setActiveTab] = useState<Tab>('CPU');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'cpu', direction: 'desc' });

  // CPU History Graph Data
  const [cpuHistory, setCpuHistory] = useState<number[]>(new Array(40).fill(10));

  // Update CPU history graph
  useEffect(() => {
    const interval = setInterval(() => {
      const totalCpu = processes.reduce((sum, p) => sum + p.cpu, 0);
      const normalizedCpu = Math.min(100, totalCpu / 2); // Normalize for display
      setCpuHistory(prev => [...prev.slice(1), normalizedCpu]);
    }, 1000);

    return () => clearInterval(interval);
  }, [processes]);

  // Calculate totals
  const totals = useMemo(() => {
    const systemCpu = processes.filter(p => p.type === 'system').reduce((sum, p) => sum + p.cpu, 0);
    const userCpu = processes.filter(p => p.type === 'user').reduce((sum, p) => sum + p.cpu, 0);
    const totalCpu = processes.reduce((sum, p) => sum + p.cpu, 0);
    const totalMemory = processes.reduce((sum, p) => sum + p.memory, 0);
    const threadCount = processes.length * 4 + Math.floor(Math.random() * 50); // Simulated thread count

    return {
      systemCpu: systemCpu.toFixed(2),
      userCpu: userCpu.toFixed(2),
      idleCpu: Math.max(0, 100 - totalCpu).toFixed(2),
      totalMemory: formatMemory(totalMemory),
      threads: threadCount,
      processCount: processes.length,
    };
  }, [processes]);

  // Sort & Filter Logic
  const sortedProcesses = useMemo(() => {
    let sortable = [...processes];

    if (searchQuery) {
      sortable = sortable.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    sortable.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortConfig.key) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'cpu':
          aVal = a.cpu;
          bVal = b.cpu;
          break;
        case 'memory':
          aVal = a.memory;
          bVal = b.memory;
          break;
        case 'energy':
          aVal = a.energy;
          bVal = b.energy;
          break;
        case 'pid':
          aVal = a.pid;
          bVal = b.pid;
          break;
        case 'user':
          aVal = getProcessUser(a);
          bVal = getProcessUser(b);
          break;
        default:
          aVal = a.cpu;
          bVal = b.cpu;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortConfig.direction === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return sortable;
  }, [processes, sortConfig, searchQuery]);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className={`flex flex-col h-full font-sans select-none ${isDark ? 'bg-[#1e1e1e] text-white' : 'bg-[#f6f6f6] text-gray-800'}`}>

      {/* Toolbar */}
      <div className={`h-12 flex items-center justify-between px-3 pb-2 pt-2 space-x-4 border-b shrink-0
          ${isDark ? 'border-white/10' : 'border-[#D6D6D6]'}`}>
        {/* Action Buttons */}
        <div className={`flex space-x-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <ToolButton
            icon={<FaStopCircle className="w-4 h-4" />}
            disabled={!selectedPid || selectedPid < 1000}
            isDark={isDark}
            title="Force Quit"
          />
          <ToolButton
            icon={<InfoCircledIcon className="w-4 h-4" />}
            disabled={!selectedPid}
            isDark={isDark}
            title="Inspect"
          />
          <ToolButton
            icon={<DotsHorizontalIcon className="w-4 h-4" />}
            isDark={isDark}
            title="More"
          />
        </div>

        {/* Tabs */}
        <div className={`flex p-0.5 rounded-lg border ${isDark ? 'bg-white/10 border-white/5' : 'bg-gray-200/50 border-black/5'}`}>
          {(['CPU', 'Memory', 'Energy', 'Disk', 'Network'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs font-medium rounded-[5px] transition-all
                  ${activeTab === tab
                  ? isDark ? 'bg-gray-600 text-white shadow-sm' : 'bg-white text-black shadow-sm'
                  : isDark ? 'bg-transparent text-gray-400 hover:text-gray-200' : 'bg-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className={`absolute left-2 top-1.5 w-3.5 h-3.5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-7 pr-2 py-1 text-xs border rounded-md w-40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all
                ${isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-gray-300'}`}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className={`flex-1 overflow-hidden flex flex-col relative ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>

        {/* Header */}
        <div className={`h-7 border-b flex text-[11px] font-semibold uppercase tracking-wide sticky top-0 z-10 w-full
            ${isDark ? 'bg-[#2d2d2d] border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
          <HeaderCell label="Process Name" width="flex-[3]" sortKey="name" currentSort={sortConfig} onSort={handleSort} align="left" isDark={isDark} />
          <HeaderCell label="% CPU" width="flex-1" sortKey="cpu" currentSort={sortConfig} onSort={handleSort} isDark={isDark} />
          <HeaderCell label="Memory" width="flex-1" sortKey="memory" currentSort={sortConfig} onSort={handleSort} isDark={isDark} />
          <HeaderCell label="Energy Impact" width="flex-1" sortKey="energy" currentSort={sortConfig} onSort={handleSort} isDark={isDark} />
          <HeaderCell label="User" width="flex-1" sortKey="user" currentSort={sortConfig} onSort={handleSort} align="left" isDark={isDark} />
          <HeaderCell label="PID" width="w-16" sortKey="pid" currentSort={sortConfig} onSort={handleSort} isDark={isDark} />
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {sortedProcesses.map((process, idx) => (
            <div
              key={process.pid}
              onClick={() => setSelectedPid(process.pid)}
              className={`h-6 flex items-center text-[12px] border-b cursor-default px-2
                  ${isDark ? 'border-white/5' : 'border-gray-50'}
                  ${selectedPid === process.pid
                  ? 'bg-[#0058D0] text-white'
                  : idx % 2 === 0
                    ? isDark ? 'bg-[#1e1e1e]' : 'bg-white'
                    : isDark ? 'bg-[#252525] text-gray-300' : 'bg-[#F5F8FA] text-gray-800'
                }
                `}
            >
              <div className={`flex-[3] flex items-center pl-2 truncate font-medium ${selectedPid === process.pid ? 'text-white' : isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                <span className={`w-5 flex justify-center mr-1.5 ${selectedPid === process.pid ? 'text-white opacity-90' : 'opacity-80'}`}>
                  {getProcessIcon(process)}
                </span>
                {process.name}
                {process.type === 'system' && (
                  <span className={`ml-1.5 text-[9px] px-1 py-0.5 rounded ${selectedPid === process.pid ? 'bg-white/20' : isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                    System
                  </span>
                )}
              </div>
              <div className={`flex-1 text-right pr-4 font-mono ${process.cpu > 20 ? 'text-orange-500 font-semibold' : ''}`}>
                {process.cpu.toFixed(1)}
              </div>
              <div className="flex-1 text-right pr-4">{formatMemory(process.memory)}</div>
              <div className={`flex-1 text-right pr-4 ${process.energy > 30 ? 'text-red-500' : ''}`}>
                {process.energy.toFixed(1)}
              </div>
              <div className={`flex-1 pl-2 truncate ${selectedPid === process.pid ? 'text-white opacity-90' : 'opacity-70'}`}>
                {getProcessUser(process)}
              </div>
              <div className={`w-16 text-right pr-4 ${selectedPid === process.pid ? 'text-white opacity-90' : 'opacity-70'}`}>
                {process.pid}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Graph Panel */}
      <div className={`h-32 border-t flex p-4 shrink-0
          ${isDark ? 'bg-[#2d2d2d] border-white/10' : 'bg-[#F6F6F6] border-[#D6D6D6]'}`}>

        {/* Left Info */}
        <div className={`w-1/3 flex flex-col space-y-1.5 pr-4 border-r ${isDark ? 'border-white/10' : 'border-gray-300'}`}>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-medium">System:</span>
            <span className={`font-mono font-bold text-red-500`}>{totals.systemCpu} %</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-medium">User:</span>
            <span className={`font-mono font-bold text-blue-500`}>{totals.userCpu} %</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-medium">Idle:</span>
            <span className={`font-mono font-bold text-green-500`}>{totals.idleCpu} %</span>
          </div>
          <div className={`flex justify-between text-xs pt-1.5 mt-1.5 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <span className="text-gray-500 font-medium">Processes:</span>
            <span className={`font-mono ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{totals.processCount}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-medium">Threads:</span>
            <span className={`font-mono ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{totals.threads}</span>
          </div>
        </div>

        {/* Right Graph */}
        <div className="flex-1 pl-4 flex flex-col relative">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">CPU Load</span>
            <div className="flex items-center gap-3 text-[9px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-sm" /> System
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-sm" /> User
              </span>
            </div>
          </div>
          <div className={`flex-1 rounded border overflow-hidden relative ${isDark ? 'bg-black border-gray-700' : 'bg-black border-gray-400'}`}>
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-rows-4">
              <div className="border-b border-gray-800/50" />
              <div className="border-b border-gray-800/50" />
              <div className="border-b border-gray-800/50" />
            </div>

            {/* Percentage Labels */}
            <div className="absolute right-1 top-0 text-[8px] text-gray-600">100%</div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] text-gray-600">50%</div>
            <div className="absolute right-1 bottom-0 text-[8px] text-gray-600">0%</div>

            {/* The Bars (User - Blue) */}
            <div className="absolute inset-0 flex items-end justify-between px-0.5">
              {cpuHistory.map((val, i) => (
                <div
                  key={i}
                  className="w-[2%] bg-[#007AFF] transition-all duration-300 ease-linear rounded-t-[1px]"
                  style={{ height: `${Math.min(100, val)}%`, opacity: 0.7 + (i / 100) }}
                />
              ))}
            </div>

            {/* Secondary "System" load overlay bars (Red) */}
            <div className="absolute inset-0 flex items-end justify-between px-0.5 pointer-events-none">
              {cpuHistory.map((val, i) => (
                <div
                  key={i}
                  className="w-[2%] bg-[#FF3B30] transition-all duration-300 ease-linear rounded-t-[1px]"
                  style={{ height: `${Math.min(100, val * 0.35)}%`, opacity: 0.8 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const ToolButton = ({ icon, disabled, isDark, title }: { icon: React.ReactNode; disabled?: boolean; isDark: boolean; title?: string }) => (
  <button
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded-md border border-transparent transition-all flex items-center justify-center ${disabled
      ? 'opacity-30 cursor-default'
      : isDark
        ? 'hover:bg-white/10 hover:border-white/5 active:bg-white/20'
        : 'hover:bg-black/5 hover:border-black/5 active:bg-black/10'
      }`}
  >
    {icon}
  </button>
);

const HeaderCell = ({ label, width, sortKey, currentSort, onSort, align = 'right', isDark }: {
  label: string;
  width: string;
  sortKey: string;
  currentSort: { key: string; direction: 'asc' | 'desc' };
  onSort: (key: string) => void;
  align?: 'left' | 'right';
  isDark: boolean;
}) => (
  <div
    onClick={() => onSort(sortKey)}
    className={`${width} px-2 h-full flex items-center ${align === 'right' ? 'justify-end' : 'justify-start'} cursor-pointer transition-colors border-r last:border-0 select-none
       ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-100'}`}
  >
    <span className="truncate">{label}</span>
    {currentSort.key === sortKey && (
      <ChevronDownIcon className={`ml-1 w-3 h-3 transition-transform ${currentSort.direction === 'asc' ? 'rotate-180' : ''}`} />
    )}
  </div>
);

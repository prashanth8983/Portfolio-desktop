import React, { useState, useEffect } from 'react';
import { FaChartLine, FaEye, FaGlobe, FaClock, FaDesktop, FaMobile } from 'react-icons/fa';

interface ProcessInfo {
  name: string;
  cpu: number;
  memory: number;
  status: 'running' | 'idle';
}

interface VisitStats {
  totalVisits: number;
  uniqueVisitors: number;
  avgSessionTime: string;
  bounceRate: number;
  desktopUsers: number;
  mobileUsers: number;
}

export const ActivityMonitor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'processes' | 'stats' | 'performance'>('stats');
  const [stats, setStats] = useState<VisitStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    avgSessionTime: '0:00',
    bounceRate: 0,
    desktopUsers: 0,
    mobileUsers: 0,
  });

  const [processes] = useState<ProcessInfo[]>([
    { name: 'Browser.app', cpu: 12.5, memory: 256, status: 'running' },
    { name: 'Terminal.app', cpu: 3.2, memory: 128, status: 'running' },
    { name: 'Mail.app', cpu: 1.8, memory: 94, status: 'running' },
    { name: 'Music.app', cpu: 5.4, memory: 186, status: 'running' },
    { name: 'TextEdit.app', cpu: 0.9, memory: 64, status: 'running' },
    { name: 'Calculator.app', cpu: 0.3, memory: 32, status: 'idle' },
    { name: 'Photos.app', cpu: 2.1, memory: 142, status: 'running' },
    { name: 'ProjectViewer.app', cpu: 4.6, memory: 178, status: 'running' },
    { name: 'Finder', cpu: 8.7, memory: 212, status: 'running' },
    { name: 'WindowServer', cpu: 15.3, memory: 324, status: 'running' },
  ]);

  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(20).fill(0));
  const [memoryHistory, setMemoryHistory] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    // Simulate real-time CPU and memory usage
    const interval = setInterval(() => {
      setCpuHistory((prev) => [...prev.slice(1), Math.random() * 40 + 20]);
      setMemoryHistory((prev) => [...prev.slice(1), Math.random() * 30 + 50]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate loading visitor stats from localStorage or analytics
    const sessionStart = Date.now();
    const isReturningVisitor = localStorage.getItem('portfolio_visited') === 'true';

    // Increment visit count
    const totalVisits = parseInt(localStorage.getItem('portfolio_total_visits') || '0') + 1;
    const uniqueVisitors = parseInt(localStorage.getItem('portfolio_unique_visitors') || '0') + (isReturningVisitor ? 0 : 1);

    localStorage.setItem('portfolio_visited', 'true');
    localStorage.setItem('portfolio_total_visits', totalVisits.toString());
    localStorage.setItem('portfolio_unique_visitors', uniqueVisitors.toString());

    const isMobile = window.innerWidth < 768;
    const desktopUsers = parseInt(localStorage.getItem('portfolio_desktop_users') || '0') + (isMobile ? 0 : 1);
    const mobileUsers = parseInt(localStorage.getItem('portfolio_mobile_users') || '0') + (isMobile ? 1 : 0);

    if (!isMobile) {
      localStorage.setItem('portfolio_desktop_users', desktopUsers.toString());
    } else {
      localStorage.setItem('portfolio_mobile_users', mobileUsers.toString());
    }

    setStats({
      totalVisits,
      uniqueVisitors,
      avgSessionTime: '2:34',
      bounceRate: 32,
      desktopUsers,
      mobileUsers,
    });

    // Track session time
    const sessionInterval = setInterval(() => {
      const sessionTime = Math.floor((Date.now() - sessionStart) / 1000);
      const minutes = Math.floor(sessionTime / 60);
      const seconds = sessionTime % 60;
      setStats((prev) => ({
        ...prev,
        avgSessionTime: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      }));
    }, 1000);

    return () => clearInterval(sessionInterval);
  }, []);

  const renderStatsTab = () => (
    <div className="p-4 space-y-4 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-lg text-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FaEye size={28} className="opacity-80" />
            <span className="text-3xl font-bold">{stats.totalVisits}</span>
          </div>
          <div className="text-sm opacity-90">Total Visits</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-lg text-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FaGlobe size={32} className="opacity-80" />
            <span className="text-3xl font-bold">{stats.uniqueVisitors}</span>
          </div>
          <div className="text-sm opacity-90">Unique Visitors</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-lg text-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FaClock size={28} className="opacity-80" />
            <span className="text-3xl font-bold">{stats.avgSessionTime}</span>
          </div>
          <div className="text-sm opacity-90">Avg Session Time</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-lg text-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FaChartLine size={32} className="opacity-80" />
            <span className="text-3xl font-bold">{stats.bounceRate}%</span>
          </div>
          <div className="text-sm opacity-90">Bounce Rate</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 rounded-lg text-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FaDesktop size={32} className="opacity-80" />
            <span className="text-3xl font-bold">{stats.desktopUsers}</span>
          </div>
          <div className="text-sm opacity-90">Desktop Users</div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-5 rounded-lg text-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FaMobile size={32} className="opacity-80" />
            <span className="text-3xl font-bold">{stats.mobileUsers}</span>
          </div>
          <div className="text-sm opacity-90">Mobile Users</div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Device Distribution</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Desktop</span>
              <span className="font-medium">
                {stats.desktopUsers + stats.mobileUsers > 0
                  ? Math.round((stats.desktopUsers / (stats.desktopUsers + stats.mobileUsers)) * 100)
                  : 0}%
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all"
                style={{
                  width: `${
                    stats.desktopUsers + stats.mobileUsers > 0
                      ? (stats.desktopUsers / (stats.desktopUsers + stats.mobileUsers)) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Mobile</span>
              <span className="font-medium">
                {stats.desktopUsers + stats.mobileUsers > 0
                  ? Math.round((stats.mobileUsers / (stats.desktopUsers + stats.mobileUsers)) * 100)
                  : 0}%
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-pink-600 transition-all"
                style={{
                  width: `${
                    stats.desktopUsers + stats.mobileUsers > 0
                      ? (stats.mobileUsers / (stats.desktopUsers + stats.mobileUsers)) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This is a demo analytics dashboard using localStorage for tracking.
          For production, integrate with Google Analytics, Plausible, or your analytics service of choice.
        </p>
      </div>
    </div>
  );

  const renderProcessesTab = () => (
    <div className="p-4 bg-gray-50">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="text-left p-3 font-semibold text-gray-700">Process Name</th>
              <th className="text-right p-3 font-semibold text-gray-700">CPU %</th>
              <th className="text-right p-3 font-semibold text-gray-700">Memory (MB)</th>
              <th className="text-center p-3 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {processes
              .sort((a, b) => b.cpu - a.cpu)
              .map((process, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 font-medium text-gray-800">{process.name}</td>
                  <td className="p-3 text-right">
                    <span
                      className={`font-semibold ${
                        process.cpu > 10 ? 'text-red-600' : process.cpu > 5 ? 'text-orange-600' : 'text-green-600'
                      }`}
                    >
                      {process.cpu.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3 text-right text-gray-700">{process.memory} MB</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        process.status === 'running'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {process.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total CPU Usage</div>
          <div className="text-2xl font-bold text-gray-800">
            {processes.reduce((sum, p) => sum + p.cpu, 0).toFixed(1)}%
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Memory</div>
          <div className="text-2xl font-bold text-gray-800">
            {(processes.reduce((sum, p) => sum + p.memory, 0) / 1024).toFixed(2)} GB
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="p-4 space-y-4 bg-gray-50">
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">CPU Usage History</h3>
        <div className="h-32 flex items-end gap-1">
          {cpuHistory.map((value, index) => (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all"
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
        <div className="text-center text-sm text-gray-600 mt-2">Last 40 seconds</div>
      </div>

      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Memory Usage History</h3>
        <div className="h-32 flex items-end gap-1">
          {memoryHistory.map((value, index) => (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all"
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
        <div className="text-center text-sm text-gray-600 mt-2">Last 40 seconds</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-lg text-white shadow-sm">
          <div className="text-sm opacity-90 mb-1">Current CPU</div>
          <div className="text-3xl font-bold">
            {cpuHistory[cpuHistory.length - 1]?.toFixed(1) || 0}%
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-lg text-white shadow-sm">
          <div className="text-sm opacity-90 mb-1">Current Memory</div>
          <div className="text-3xl font-bold">
            {memoryHistory[memoryHistory.length - 1]?.toFixed(1) || 0}%
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      {/* Toolbar with Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'stats'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('processes')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'processes'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Processes
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'performance'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Performance
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'processes' && renderProcessesTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
      </div>
    </div>
  );
};

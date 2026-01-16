import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Process type for Activity Monitor
export interface AppProcess {
  pid: number;
  name: string;
  type: 'system' | 'user' | 'background';
  cpu: number;
  memory: number; // in MB
  energy: number;
  startTime: number;
  icon?: string;
}

interface ProcessContextType {
  processes: AppProcess[];
  registerProcess: (name: string, type: 'system' | 'user' | 'background', icon?: string) => number;
  unregisterProcess: (pid: number) => void;
  updateProcessCpu: (pid: number, cpu: number) => void;
}

const ProcessContext = createContext<ProcessContextType | null>(null);

// System processes that always run
const SYSTEM_PROCESSES: Omit<AppProcess, 'startTime'>[] = [
  { pid: 0, name: 'kernel_task', type: 'system', cpu: 1.2, memory: 512, energy: 0.5, icon: 'system' },
  { pid: 1, name: 'launchd', type: 'system', cpu: 0.1, memory: 12, energy: 0.1, icon: 'system' },
  { pid: 102, name: 'WindowServer', type: 'system', cpu: 8.5, memory: 380, energy: 15.0, icon: 'system' },
  { pid: 231, name: 'Dock', type: 'system', cpu: 0.3, memory: 85, energy: 0.5, icon: 'dock' },
  { pid: 122, name: 'loginwindow', type: 'system', cpu: 0.1, memory: 35, energy: 0.2, icon: 'system' },
  { pid: 441, name: 'mds_stores', type: 'background', cpu: 0.5, memory: 120, energy: 2.0, icon: 'system' },
  { pid: 442, name: 'Spotlight', type: 'background', cpu: 0.2, memory: 95, energy: 1.0, icon: 'spotlight' },
  { pid: 551, name: 'coreaudiod', type: 'system', cpu: 0.4, memory: 25, energy: 0.8, icon: 'system' },
  { pid: 661, name: 'bluetoothd', type: 'system', cpu: 0.1, memory: 15, energy: 0.3, icon: 'system' },
  { pid: 771, name: 'WiFiAgent', type: 'system', cpu: 0.2, memory: 18, energy: 0.4, icon: 'system' },
];

let nextPid = 1000;

export const ProcessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [processes, setProcesses] = useState<AppProcess[]>(() =>
    SYSTEM_PROCESSES.map(p => ({ ...p, startTime: Date.now() - Math.random() * 3600000 }))
  );

  // Register a new process (when a window opens)
  const registerProcess = useCallback((name: string, type: 'system' | 'user' | 'background', icon?: string): number => {
    const pid = nextPid++;
    const newProcess: AppProcess = {
      pid,
      name,
      type,
      cpu: 5 + Math.random() * 10, // Initial CPU
      memory: 50 + Math.random() * 200, // Initial memory 50-250 MB
      energy: 5 + Math.random() * 15,
      startTime: Date.now(),
      icon,
    };
    setProcesses(prev => [...prev, newProcess]);
    return pid;
  }, []);

  // Unregister a process (when a window closes)
  const unregisterProcess = useCallback((pid: number) => {
    setProcesses(prev => prev.filter(p => p.pid !== pid));
  }, []);

  // Update CPU usage for a process
  const updateProcessCpu = useCallback((pid: number, cpu: number) => {
    setProcesses(prev => prev.map(p => p.pid === pid ? { ...p, cpu } : p));
  }, []);

  // Simulate CPU fluctuations for all processes
  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(p => {
        // Different fluctuation based on process type
        const baseFluctuation = p.type === 'system' ? 0.5 : p.type === 'user' ? 2 : 1;
        const fluctuation = (Math.random() - 0.5) * baseFluctuation * 2;
        const newCpu = Math.max(0.1, Math.min(100, p.cpu + fluctuation));

        // Memory can slowly increase for user processes
        const memFluctuation = p.type === 'user' ? (Math.random() - 0.4) * 5 : (Math.random() - 0.5) * 2;
        const newMemory = Math.max(10, p.memory + memFluctuation);

        return {
          ...p,
          cpu: parseFloat(newCpu.toFixed(1)),
          memory: parseFloat(newMemory.toFixed(1)),
          energy: parseFloat((newCpu * 0.8 + Math.random() * 5).toFixed(1)),
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ProcessContext.Provider value={{ processes, registerProcess, unregisterProcess, updateProcessCpu }}>
      {children}
    </ProcessContext.Provider>
  );
};

export const useProcesses = () => {
  const context = useContext(ProcessContext);
  if (!context) {
    throw new Error('useProcesses must be used within a ProcessProvider');
  }
  return context;
};

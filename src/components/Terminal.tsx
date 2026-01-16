import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

type Line = {
  type: 'input' | 'output' | 'error';
  content: string | React.ReactNode;
  cwd?: string;
};

export const Terminal: React.FC = () => {
  const { } = useTheme();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Line[]>([
    { type: 'output', content: 'Last login: ' + new Date().toString().split(' GMT')[0] + ' on ttys000' }
  ]);
  const [cwd] = useState('~');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Focus input on click anywhere
  const handleFocus = () => {
    inputRef.current?.focus();
  };

  // Scroll to bottom on history change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Command Parser
  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    const newHistory = [...history, { type: 'input', content: cmd, cwd } as Line];

    // Add to command history
    if (cmd.trim()) {
      setCommandHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
    }

    switch (command) {
      case 'help':
        newHistory.push({ type: 'output', content: 'Available commands: help, clear, ls, pwd, whoami, date, echo, exit' });
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return; // Early return to avoid adding history
      case 'ls':
        newHistory.push({ type: 'output', content: 'Desktop  Documents  Downloads  Library  Movies  Music  Pictures  Public  resume.pdf' });
        break;
      case 'pwd':
        newHistory.push({ type: 'output', content: cwd === '~' ? '/Users/prashanth' : cwd });
        break;
      case 'whoami':
        newHistory.push({ type: 'output', content: 'prashanth' });
        break;
      case 'date':
        newHistory.push({ type: 'output', content: new Date().toString() });
        break;
      case 'echo':
        newHistory.push({ type: 'output', content: args.slice(1).join(' ') });
        break;
      case 'exit':
        newHistory.push({ type: 'output', content: '[Process completed]' });
        break;
      case '':
        break;
      default:
        newHistory.push({ type: 'error', content: `zsh: command not found: ${command}` });
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div
      className="w-full h-full font-mono text-sm overflow-hidden flex flex-col cursor-text select-text bg-[#1e1e1e] text-gray-200"
      onClick={handleFocus}
    >
      <div className="flex-1 p-3 overflow-y-auto scrollbar-hide" ref={scrollRef}>
        {history.map((line, i) => (
          <div key={i} className="mb-1 leading-relaxed break-words">
            {line.type === 'input' ? (
              <div className="flex flex-wrap">
                <span className="text-green-500 font-bold mr-2">prashanth@MacBook-Pro</span>
                <span className="text-blue-500 font-bold mr-2">{line.cwd || '~'} %</span>
                <span className="text-white">{line.content}</span>
              </div>
            ) : (
              <div className={`${line.type === 'error' ? 'text-red-500' : 'text-[#D4D4D4]'}`}>
                {line.content}
              </div>
            )}
          </div>
        ))}

        {/* Active Input Line */}
        <div className="flex flex-wrap items-center">
          <span className="text-green-500 font-bold mr-2">prashanth@MacBook-Pro</span>
          <span className="text-blue-500 font-bold mr-2">{cwd} %</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none p-0 text-white caret-transparent"
              autoFocus
              autoComplete="off"
              spellCheck="false"
            />
            {/* Custom Block Cursor */}
            <span
              className="absolute top-0 pointer-events-none bg-gray-500/50 text-transparent"
              style={{ left: `${input.length}ch` }}
            >
              &nbsp;
            </span>
            {/* Blinking Block Cursor Animation */}
            <div
              className="absolute top-0 w-2.5 h-5 opacity-60 animate-pulse bg-gray-400"
              style={{ left: `${input.length * 8.5}px` }} // Monospace char width estimate
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

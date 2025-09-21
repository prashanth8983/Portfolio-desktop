import React, { useState, useEffect, useRef } from 'react';
import { IoSearch, IoDocument, IoFolder, IoCalculator, IoGlobe } from 'react-icons/io5';
import { FaApple } from 'react-icons/fa';

interface SpotlightItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'app' | 'file' | 'folder' | 'calculation' | 'web' | 'system';
  icon: React.ReactNode;
  action?: () => void;
}

interface SpotlightProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenApp?: (appId: string) => void;
}

export const Spotlight: React.FC<SpotlightProps> = ({ isVisible, onClose, onOpenApp }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotlightItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allItems: SpotlightItem[] = [
    {
      id: 'browser',
      title: 'Chrome',
      subtitle: 'Application',
      type: 'app',
      icon: <IoGlobe className="text-blue-500" />,
      action: () => onOpenApp?.('chrome')
    },
    {
      id: 'safari',
      title: 'Safari',
      subtitle: 'Application',
      type: 'app',
      icon: <IoGlobe className="text-blue-600" />,
      action: () => onOpenApp?.('safari')
    },
    {
      id: 'calculator',
      title: 'Calculator',
      subtitle: 'Application',
      type: 'app',
      icon: <IoCalculator className="text-orange-500" />,
      action: () => onOpenApp?.('calculator')
    },
    {
      id: 'textedit',
      title: 'TextEdit',
      subtitle: 'Application',
      type: 'app',
      icon: <IoDocument className="text-blue-500" />,
      action: () => onOpenApp?.('textedit')
    },
    {
      id: 'finder',
      title: 'Finder',
      subtitle: 'Application',
      type: 'app',
      icon: <IoFolder className="text-blue-500" />,
      action: () => onOpenApp?.('finder-dock')
    },
    {
      id: 'system-prefs',
      title: 'System Preferences',
      subtitle: 'Application',
      type: 'system',
      icon: <FaApple className="text-gray-500" />,
      action: () => onOpenApp?.('preferences')
    },
    {
      id: 'resume',
      title: 'Prashanth Kumar.pdf',
      subtitle: 'PDF Document',
      type: 'file',
      icon: <IoDocument className="text-red-500" />,
      action: () => onOpenApp?.('preview')
    }
  ];

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(allItems.slice(0, 5));
      setSelectedIndex(0);
      return;
    }

    // Check if it's a calculation
    const mathExpression = query.replace(/[^0-9+\-*/().\s]/g, '');
    if (mathExpression && mathExpression !== query) {
      try {
        // Simple math evaluation (be careful with eval in production)
        const result = Function(`"use strict"; return (${mathExpression})`)();
        if (typeof result === 'number' && !isNaN(result)) {
          setResults([
            {
              id: 'calculation',
              title: `${mathExpression} = ${result}`,
              subtitle: 'Calculation',
              type: 'calculation',
              icon: <IoCalculator className="text-orange-500" />
            }
          ]);
          setSelectedIndex(0);
          return;
        }
      } catch {
        // Not a valid calculation
      }
    }

    // Search through items
    const filtered = allItems.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(query.toLowerCase())
    );

    // Add web search option
    if (query.trim()) {
      filtered.push({
        id: 'web-search',
        title: `Search for "${query}"`,
        subtitle: 'Search the web',
        type: 'web',
        icon: <IoSearch className="text-blue-500" />,
        action: () => {
          onOpenApp?.('chrome');
          // You could pass the search query to the browser here
        }
      });
    }

    setResults(filtered.slice(0, 8));
    setSelectedIndex(0);
  }, [query, onOpenApp]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]?.action) {
          results[selectedIndex].action!();
          onClose();
        }
        break;
    }
  };

  const handleItemClick = (item: SpotlightItem) => {
    if (item.action) {
      item.action();
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-32 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-600">
          <IoSearch size={20} className="text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Spotlight Search"
            className="flex-1 bg-transparent text-lg outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {results.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center p-3 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
              }`}
              onClick={() => handleItemClick(item)}
            >
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${index === selectedIndex ? 'text-white' : ''}`}>
                  {item.title}
                </div>
                {item.subtitle && (
                  <div className={`text-sm ${
                    index === selectedIndex ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {item.subtitle}
                  </div>
                )}
              </div>
              <div className={`text-xs px-2 py-1 rounded ${
                index === selectedIndex ? 'bg-blue-400' : 'bg-gray-200 dark:bg-gray-600'
              }`}>
                {item.type === 'app' ? 'App' :
                 item.type === 'file' ? 'File' :
                 item.type === 'calculation' ? 'Calc' :
                 item.type === 'web' ? 'Web' : 'System'}
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <IoSearch size={32} className="mx-auto mb-2 opacity-50" />
              <div>No results found</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <div>↑↓ to navigate • ⏎ to select • ⎋ to close</div>
          <div>Spotlight</div>
        </div>
      </div>
    </div>
  );
};
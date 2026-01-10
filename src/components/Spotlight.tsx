import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, FileTextIcon } from '@radix-ui/react-icons';
import { FaCalculator } from 'react-icons/fa'; // Keep Fa for Calc if Radix doesn't have it
import { projects } from '../data/portfolio';
import { getIconUrl } from '../utils/icons';

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

  const renderAppIcon = (id: string) => (
    <img src={getIconUrl(id)} alt={id} className="w-8 h-8 object-contain" />
  );

  const allItems: SpotlightItem[] = [
    {
      id: 'browser',
      title: 'Chrome',
      subtitle: 'Application',
      type: 'app',
      icon: renderAppIcon('chrome'),
      action: () => onOpenApp?.('chrome')
    },
    {
      id: 'safari',
      title: 'Safari',
      subtitle: 'Application',
      type: 'app',
      icon: renderAppIcon('safari'),
      action: () => onOpenApp?.('safari')
    },
    {
      id: 'calculator',
      title: 'Calculator',
      subtitle: 'Application',
      type: 'app',
      icon: renderAppIcon('calculator'),
      action: () => onOpenApp?.('calculator')
    },
    {
      id: 'textedit',
      title: 'TextEdit',
      subtitle: 'Application',
      type: 'app',
      icon: renderAppIcon('textedit'),
      action: () => onOpenApp?.('textedit')
    },
    {
      id: 'finder',
      title: 'Finder',
      subtitle: 'Application',
      type: 'app',
      icon: renderAppIcon('finder'),
      action: () => onOpenApp?.('finder-dock')
    },
    {
      id: 'system-prefs',
      title: 'System Preferences',
      subtitle: 'Application',
      type: 'system',
      icon: renderAppIcon('preferences'),
      action: () => onOpenApp?.('preferences')
    },
    {
      id: 'resume',
      title: 'Prashanth Kumar.pdf',
      subtitle: 'PDF Document',
      type: 'file',
      icon: <FileTextIcon className="w-6 h-6 text-gray-500" />,
      action: () => onOpenApp?.('preview')
    },
    ...projects.map(p => ({
      id: `project-${p.id}`,
      title: p.title,
      subtitle: 'Project',
      type: 'file' as const,
      icon: renderAppIcon('folder'),
      action: () => onOpenApp?.('projects')
    }))
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
              icon: <FaCalculator className="text-orange-500" />
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
        icon: <MagnifyingGlassIcon className="text-blue-500 w-6 h-6" />,
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

    <div className="fixed inset-0 bg-transparent z-[9999] flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 dark:border-white/10"
        onClick={e => e.stopPropagation()} // Prevent close on click inside
      >
        {/* Search Input */}
        <div className="flex items-center p-4">
          <MagnifyingGlassIcon className="text-gray-500 dark:text-gray-400 mr-4 w-6 h-6" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Spotlight Search"
            autoFocus
            className="flex-1 bg-transparent text-2xl outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 font-light"
          />
        </div>

        {/* Separator */}
        {(results.length > 0 || query) && (
          <div className="h-[1px] bg-gray-200 dark:bg-gray-700 mx-4"></div>
        )}

        {/* Results */}
        {(results.length > 0 || query) && (
          <div className="max-h-[60vh] overflow-y-auto py-2">
            {results.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center px-4 py-2 mx-2 rounded-lg cursor-pointer transition-colors ${index === selectedIndex
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-100'
                  }`}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="w-8 h-8 flex items-center justify-center mr-3 text-xl">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-base truncate ${index === selectedIndex ? 'text-white' : 'font-medium'}`}>
                    {item.title}
                  </div>
                  {item.subtitle && (
                    <div className={`text-xs truncate ${index === selectedIndex ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                      {item.subtitle}
                    </div>
                  )}
                </div>
                {index === selectedIndex && (
                  <div className="text-xs opacity-70">Returns</div>
                )}
              </div>
            ))}

            {query && results.length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <MagnifyingGlassIcon className="mx-auto mb-4 opacity-20 w-12 h-12" />
                <div>No results found</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState, useCallback } from 'react';
import {
  IoChevronBack,
  IoChevronForward,
  IoReloadOutline,
  IoShareOutline,
  IoAdd,
  IoShieldCheckmark,
  IoLockClosed,
  IoClose
} from 'react-icons/io5';
import { HiOutlineViewGrid } from 'react-icons/hi';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isActive: boolean;
}

interface Favorite {
  id: string;
  title: string;
  url: string;
  color: string;
  icon: React.ReactNode;
}

interface BrowserProps {
  initialUrl?: string;
}

export const Browser: React.FC<BrowserProps> = ({ initialUrl = 'about:blank' }) => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'Start Page',
      url: initialUrl,
      favicon: '🧭',
      isActive: true,
    },
  ]);

  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showStartPage, setShowStartPage] = useState<boolean>(true);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [iframeError, setIframeError] = useState<boolean>(false);
  const [isUrlFocused, setIsUrlFocused] = useState<boolean>(false);

  // Mock Favorites Data
  const favorites: Favorite[] = [
    { id: '1', title: 'Portfolio', url: 'https://prashanth8983.github.io/Portfolio-desktop', color: 'bg-gradient-to-br from-blue-500 to-purple-600', icon: <span className="text-white text-2xl">🏠</span> },
    { id: '2', title: 'GitHub', url: 'https://github.com/prashanth8983', color: 'bg-gray-800', icon: <span className="text-white font-bold text-xl">gh</span> },
    { id: '3', title: 'LinkedIn', url: 'https://linkedin.com', color: 'bg-blue-600', icon: <span className="text-white font-bold text-xl">in</span> },
    { id: '4', title: 'Google', url: 'https://google.com', color: 'bg-white border border-gray-200', icon: <span className="font-bold text-xl text-blue-500">G</span> },
    { id: '5', title: 'Wikipedia', url: 'https://en.wikipedia.org', color: 'bg-gray-100', icon: <span className="font-serif text-xl font-bold text-gray-800">W</span> },
    { id: '6', title: 'Apple', url: 'https://apple.com', color: 'bg-black', icon: <span className="text-white text-xl"></span> },
    { id: '7', title: 'NYU', url: 'https://nyu.edu', color: 'bg-purple-700', icon: <span className="text-white font-bold">NYU</span> },
    { id: '8', title: 'React', url: 'https://react.dev', color: 'bg-[#20232a]', icon: <span className="text-[#61dafb] text-2xl">⚛️</span> },
  ];

  const navigateTo = useCallback((url: string, addToHistory = true) => {
    let processedUrl = url.trim();

    if (!processedUrl) return;

    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      if (processedUrl.includes('.')) {
        processedUrl = `https://${processedUrl}`;
      } else {
        processedUrl = `https://www.google.com/search?q=${encodeURIComponent(processedUrl)}`;
      }
    }

    setIsLoading(true);
    setIframeError(false);
    setShowStartPage(false);
    setCurrentUrl(processedUrl);
    setInputUrl(processedUrl);

    if (addToHistory) {
      const newHistory = [...history.slice(0, historyIndex + 1), processedUrl];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }

    // Update tab
    setTabs(tabs.map(tab =>
      tab.isActive
        ? { ...tab, url: processedUrl, title: getDomain(processedUrl) }
        : tab
    ));

    // Timeout for iframe blocking detection
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [history, historyIndex, tabs]);

  const getDomain = (url: string): string => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
    setIsUrlFocused(false);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const url = history[newIndex];
      setCurrentUrl(url);
      setInputUrl(url);
      setShowStartPage(false);
      setTabs(tabs.map(tab =>
        tab.isActive ? { ...tab, url, title: getDomain(url) } : tab
      ));
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const url = history[newIndex];
      setCurrentUrl(url);
      setInputUrl(url);
      setShowStartPage(false);
      setTabs(tabs.map(tab =>
        tab.isActive ? { ...tab, url, title: getDomain(url) } : tab
      ));
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const createNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'Start Page',
      url: 'about:blank',
      favicon: '🧭',
      isActive: true,
    };

    setTabs([
      ...tabs.map(tab => ({ ...tab, isActive: false })),
      newTab
    ]);
    setCurrentUrl('about:blank');
    setInputUrl('');
    setShowStartPage(true);
    setIframeError(false);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;

    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);

    if (tabs[tabIndex].isActive && newTabs.length > 0) {
      const nextActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      newTabs[nextActiveIndex].isActive = true;
      const activeTab = newTabs[nextActiveIndex];
      setCurrentUrl(activeTab.url);
      setInputUrl(activeTab.url === 'about:blank' ? '' : activeTab.url);
      setShowStartPage(activeTab.url === 'about:blank');
    }

    setTabs(newTabs);
  };

  const switchTab = (tabId: string) => {
    const newTabs = tabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    }));

    const activeTab = newTabs.find(tab => tab.isActive);
    if (activeTab) {
      setCurrentUrl(activeTab.url);
      setInputUrl(activeTab.url === 'about:blank' ? '' : activeTab.url);
      setShowStartPage(activeTab.url === 'about:blank');
    }

    setTabs(newTabs);
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  // Safari Start Page
  const StartPage = () => (
    <div className="flex-1 h-full bg-[#F9F9F9] overflow-y-auto relative w-full">
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h20v20H0z" fill="none"/%3E%3Cpath d="M10 10h1v1h-1z" fill="%23000"/%3E%3C/svg%3E")' }}
      />

      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col items-center">

        {/* Hero Title */}
        <div className="mb-10 select-none">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-300 tracking-tight">
            Favorites
          </h1>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-4 gap-x-4 gap-y-6 md:gap-x-10 md:gap-y-8 w-full max-w-xl">
          {favorites.map((fav) => (
            <button
              key={fav.id}
              onClick={() => navigateTo(fav.url)}
              className="group flex flex-col items-center space-y-2 focus:outline-none"
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${fav.color} shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 flex items-center justify-center overflow-hidden relative`}>
                {/* Glossy reflection effect */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                {fav.icon}
              </div>
              <span className="text-[11px] md:text-xs font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                {fav.title}
              </span>
            </button>
          ))}
        </div>

        {/* Privacy Report Section */}
        <div className="mt-12 w-full max-w-xl">
          <h2 className="text-sm font-semibold text-gray-800 mb-3 px-1">Privacy Report</h2>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow cursor-default">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                <IoShieldCheckmark className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-900">In the last 7 days</div>
                <div className="text-[11px] text-gray-500">Safari prevented 42 trackers from profiling you.</div>
              </div>
            </div>
            <div className="hidden md:flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[8px] text-gray-400 font-bold">
                  ?
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reading List Preview */}
        <div className="mt-6 w-full max-w-xl">
          <h2 className="text-sm font-semibold text-gray-800 mb-3 px-1">Reading List</h2>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
            <div className="text-center py-4 text-gray-400">
              <span className="text-2xl mb-1 block">📚</span>
              <p className="text-xs">Your reading list is empty</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error page when iframe is blocked
  const ErrorPage = () => (
    <div className="h-full flex flex-col items-center justify-center bg-[#F9F9F9]">
      <div className="text-center max-w-md px-4">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Cannot Open Page</h2>
        <p className="text-gray-500 text-sm mb-5">
          Safari cannot open "{getDomain(currentUrl)}" because the website restricts embedding.
        </p>
        <button
          onClick={() => {
            setShowStartPage(true);
            setIframeError(false);
            setCurrentUrl('about:blank');
            setInputUrl('');
          }}
          className="px-5 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
        >
          Go to Start Page
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F3F4F6]/85 backdrop-blur-2xl">
      {/* Safari Toolbar - integrated with traffic lights from Window.tsx */}
      <div className="h-[52px] flex items-center pl-[72px] pr-3 space-x-2 border-b border-gray-300/40 bg-[#e8e8e8]/90 backdrop-blur-md flex-shrink-0">

        {/* Sidebar Toggle */}
        <button className="p-1.5 rounded hover:bg-black/5 text-gray-500 transition-colors z-50">
          <HiOutlineViewGrid className="w-4 h-4" />
        </button>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-0.5 text-gray-600 z-50">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className="p-1.5 rounded hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <IoChevronBack className="w-4 h-4" />
          </button>
          <button
            onClick={goForward}
            disabled={!canGoForward}
            className="p-1.5 rounded hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <IoChevronForward className="w-4 h-4" />
          </button>
        </div>

        {/* Shield / Privacy */}
        <div className="text-gray-500 z-50">
          <IoShieldCheckmark className="w-4 h-4" />
        </div>

        {/* Address Bar */}
        <form onSubmit={handleUrlSubmit} className="flex-1 max-w-xl mx-auto z-50">
          <div className={`h-8 bg-white/70 hover:bg-white/90 transition-all rounded-lg flex items-center justify-center relative group cursor-text border ${isUrlFocused ? 'border-blue-400/50 bg-white shadow-sm ring-2 ring-blue-400/20' : 'border-gray-300/60'}`}>

            {/* Left Icon (Lock/Loading) */}
            <div className="absolute left-2.5 text-gray-400">
              {isLoading ? (
                <div className="w-3 h-3 border-[1.5px] border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <IoLockClosed className="w-3 h-3" />
              )}
            </div>

            {/* Input */}
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onFocus={() => setIsUrlFocused(true)}
              onBlur={() => setIsUrlFocused(false)}
              placeholder="Search or enter website name"
              className={`bg-transparent border-none outline-none text-[13px] w-full px-8 text-gray-700 placeholder-gray-400 ${isUrlFocused ? 'text-left' : 'text-center'}`}
              spellCheck={false}
            />

            {/* Right Icon (Refresh) */}
            <button
              type="button"
              onClick={handleRefresh}
              className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-black/5 transition-all opacity-0 group-hover:opacity-100"
            >
              <IoReloadOutline className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </form>

        {/* Share & New Tab */}
        <div className="flex items-center space-x-1 text-gray-500 z-50">
          <button className="p-1.5 rounded hover:bg-black/5 transition-colors">
            <IoShareOutline className="w-4 h-4" />
          </button>
          <button
            onClick={createNewTab}
            className="p-1.5 rounded hover:bg-black/5 transition-colors"
          >
            <IoAdd className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Tab Bar (if multiple tabs) */}
      {tabs.length > 1 && (
        <div className="h-8 flex items-center px-2 bg-[#dcdcdc] border-b border-gray-300/40 gap-1 overflow-x-auto flex-shrink-0">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-md cursor-pointer min-w-[80px] max-w-[150px] transition-all ${
                tab.isActive
                  ? 'bg-white shadow-sm'
                  : 'hover:bg-white/50'
              }`}
            >
              <span className="text-[10px] flex-shrink-0">{tab.favicon}</span>
              <span className="text-[10px] text-gray-700 truncate flex-1">{tab.title}</span>
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 rounded transition-opacity"
              >
                <IoClose className="w-2.5 h-2.5 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {showStartPage ? (
          <StartPage />
        ) : iframeError ? (
          <ErrorPage />
        ) : (
          <iframe
            src={currentUrl}
            className="w-full h-full border-0"
            title="Safari Content"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setIframeError(true);
            }}
            referrerPolicy="no-referrer"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
          />
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { IoArrowBack, IoArrowForward, IoRefresh, IoHome, IoSearch, IoLockClosed } from 'react-icons/io5';
import { HiPlus, HiX } from 'react-icons/hi';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isActive: boolean;
}

interface BrowserProps {
  initialUrl?: string;
}

export const Browser: React.FC<BrowserProps> = ({ initialUrl = 'https://prashanth8983.github.io/Portfolio-desktop' }) => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'Portfolio Desktop',
      url: initialUrl,
      favicon: '🏠',
      isActive: true,
    },
  ]);

  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl);
  const [inputUrl, setInputUrl] = useState<string>(initialUrl);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [canGoForward, setCanGoForward] = useState<boolean>(false);
  const [iframeError, setIframeError] = useState<boolean>(false);
  const [loadTimeout, setLoadTimeout] = useState<number | null>(null);

  const defaultSites = [
    { title: 'Portfolio', url: 'https://prashanth8983.github.io/Portfolio-desktop', favicon: '🏠' },
    { title: 'GitHub', url: 'https://github.com/prashanth8983', favicon: '📱' },
    { title: 'Wikipedia', url: 'https://en.wikipedia.org', favicon: '📖' },
    { title: 'Example.com', url: 'https://example.com', favicon: '🌐' },
  ];


  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = inputUrl.trim();

    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.')) {
        url = `https://${url}`;
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }

    setIsLoading(true);
    setIframeError(false);
    setCurrentUrl(url);

    // Clear any existing timeout
    if (loadTimeout) {
      clearTimeout(loadTimeout);
    }

    // Set a timeout to detect if iframe fails to load (e.g., blocked by X-Frame-Options)
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setIframeError(true);
    }, 5000); // 5 second timeout

    setLoadTimeout(timeout);

    setTabs(tabs.map(tab =>
      tab.isActive
        ? { ...tab, url, title: new URL(url).hostname }
        : tab
    ));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
  };

  const handleInputFocus = () => {
    setInputUrl(currentUrl);
  };

  const createNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'https://google.com',
      favicon: '🌐',
      isActive: true,
    };

    setTabs([
      ...tabs.map(tab => ({ ...tab, isActive: false })),
      newTab
    ]);
    setCurrentUrl(newTab.url);
    setInputUrl(newTab.url);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (tabs.length === 1) return;

    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);

    if (tabs[tabIndex].isActive && newTabs.length > 0) {
      const nextActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      newTabs[nextActiveIndex].isActive = true;
      setCurrentUrl(newTabs[nextActiveIndex].url);
      setInputUrl(newTabs[nextActiveIndex].url);
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
      setInputUrl(activeTab.url);
    }

    setTabs(newTabs);
  };

  const goBack = () => {
    // Simulate browser back functionality
    setCanGoForward(true);
    if (canGoBack) {
      setCanGoBack(false);
    }
  };

  const goForward = () => {
    // Simulate browser forward functionality
    setCanGoBack(true);
    if (canGoForward) {
      setCanGoForward(false);
    }
  };

  const refresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const goHome = () => {
    const homeUrl = defaultSites[0].url;
    setCurrentUrl(homeUrl);
    setInputUrl(homeUrl);
    setTabs(tabs.map(tab =>
      tab.isActive
        ? { ...tab, url: homeUrl, title: defaultSites[0].title }
        : tab
    ));
  };

  const getDisplayUrl = () => {
    try {
      const url = new URL(currentUrl);
      return url.hostname + url.pathname;
    } catch {
      return currentUrl;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tab Bar */}
      <div className="flex items-center bg-gray-100 border-b border-gray-200">
        <div className="flex-1 flex items-center overflow-hidden">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 border-r border-gray-200 cursor-pointer min-w-0 max-w-xs group relative ${
                tab.isActive
                  ? 'bg-white border-b-2 border-blue-500'
                  : 'bg-gray-100 hover:bg-gray-50'
              }`}
              onClick={() => switchTab(tab.id)}
            >
              <span className="text-sm mr-2">{tab.favicon}</span>
              <span className="text-sm truncate flex-1">{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  className="ml-2 p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => closeTab(tab.id, e)}
                >
                  <HiX size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          className="p-2 hover:bg-gray-200 rounded m-1"
          onClick={createNewTab}
          title="New Tab"
        >
          <HiPlus size={16} />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center p-2 bg-gray-50 border-b border-gray-200 space-x-2">
        <div className="flex space-x-1">
          <button
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              !canGoBack ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={goBack}
            disabled={!canGoBack}
            title="Back"
          >
            <IoArrowBack size={16} />
          </button>
          <button
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              !canGoForward ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={goForward}
            disabled={!canGoForward}
            title="Forward"
          >
            <IoArrowForward size={16} />
          </button>
          <button
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            onClick={refresh}
            title="Refresh"
          >
            <IoRefresh size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            onClick={goHome}
            title="Home"
          >
            <IoHome size={16} />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 relative">
          <form onSubmit={handleUrlSubmit} className="w-full">
            <div className="relative flex items-center">
              <IoLockClosed size={14} className="absolute left-3 text-green-500" />
              <input
                type="text"
                value={inputUrl}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="w-full pl-8 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                placeholder="Search or enter web address"
              />
              <IoSearch size={16} className="absolute right-3 text-gray-400" />
            </div>
          </form>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse z-10"></div>
        )}

        {iframeError ? (
          <div className="h-full flex flex-col items-center justify-center bg-gray-50">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Site Blocked Embedding</h2>
            <p className="text-gray-500 mb-2">This website (like Google, Facebook, etc.) blocks iframe embedding for security.</p>
            <p className="text-sm text-gray-400 mb-6">URL: {getDisplayUrl()}</p>
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
              <h3 className="text-lg font-semibold mb-4">Try These Instead:</h3>
              <div className="space-y-2">
                {defaultSites.map((site, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentUrl(site.url);
                      setInputUrl(site.url);
                      setIframeError(false);
                      setTabs(tabs.map(tab =>
                        tab.isActive
                          ? { ...tab, url: site.url, title: site.title }
                          : tab
                      ));
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">{site.favicon}</span>
                    <span className="text-left">{site.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={currentUrl}
            className="w-full h-full border-0"
            title="Browser Content"
            onLoad={() => {
              setIsLoading(false);
              if (loadTimeout) {
                clearTimeout(loadTimeout);
                setLoadTimeout(null);
              }
            }}
            onError={() => {
              setIsLoading(false);
              setIframeError(true);
              if (loadTimeout) {
                clearTimeout(loadTimeout);
                setLoadTimeout(null);
              }
            }}
            onLoadStart={() => setIsLoading(true)}
            referrerPolicy="no-referrer"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
          />
        )}
      </div>
    </div>
  );
};
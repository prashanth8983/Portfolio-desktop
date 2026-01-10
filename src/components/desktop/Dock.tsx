import React, { useState, useEffect } from 'react';
import { FaExpand, FaCompress } from 'react-icons/fa';
import { DockItem, Window } from '../../types/interfaces';

interface DockProps {
  dockItems: DockItem[];
  windows: Window[];
  onDockItemClick: (id: string) => void;
  onRestoreWindow: (id: string) => void;
  onMinimizeAll: () => void;
}

export const Dock: React.FC<DockProps> = ({
  dockItems,
  windows,
  onDockItemClick,
  onRestoreWindow,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) await elem.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="fixed bottom-3 left-0 right-0 flex justify-center items-end z-[100] h-[70px] pointer-events-none">
      <div
        className="
          bg-white/20 backdrop-blur-2xl rounded-2xl pb-1.5 pt-1.5 px-2.5
          flex items-end space-x-1.5 shadow-2xl
          border border-white/20 pointer-events-auto
          transition-all duration-300 ease-out
          hover:bg-white/30
        "
      >
        {dockItems.map((item) => (
          <div
            key={item.id}
            className="relative group cursor-pointer flex flex-col items-center justify-end transition-all duration-200 ease-out hover:-translate-y-2 hover:mx-2"
            onClick={() => onDockItemClick(item.id)}
          >
            {/* Tooltip */}
            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                           px-3 py-1 bg-[#1e1e1e]/80 text-[#f5f5f5] text-xs font-medium rounded-lg shadow-xl backdrop-blur-md whitespace-nowrap mb-2 border border-white/10">
              {item.name}
            </div>

            {/* Icon */}
            <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center transition-transform duration-200
                           ease-[cubic-bezier(0.25, 1, 0.5, 1)] group-hover:scale-125 origin-bottom">
              {/* Fallback container style if iconElement is text, though mostly it's SVG */}
              <div className="w-full h-full flex items-center justify-center drop-shadow-xl filter">
                {item.iconElement}
              </div>
            </div>

            {/* Active Indicator */}
            <div className={`mt-1 w-1 h-1 rounded-full transition-opacity duration-300 ${windows.some((w) => ((item.id === 'finder-dock' && w.type === 'finder') || w.title === item.name) && !w.isMinimized)
                ? 'bg-black/60 dark:bg-white/90 opacity-100' // Dark dot in light mode, white in dark
                : 'bg-transparent opacity-0'
              }`}></div>
          </div>
        ))}

        {/* Separator */}
        <div className="w-[1px] h-8 bg-white/20 mx-1 self-center mb-1.5"></div>

        {/* Minimized Windows Section */}
        {windows.some((w) => w.isMinimized) && (
          windows
            .filter((w) => w.isMinimized)
            .map((window) => (
              <div
                key={window.id + '-minimized'}
                className="relative group cursor-pointer flex flex-col items-center justify-end transition-all duration-200 ease-out hover:-translate-y-2"
                onClick={() => onRestoreWindow(window.id)}
              >
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                                 px-3 py-1 bg-[#1e1e1e]/80 text-[#f5f5f5] text-xs font-medium rounded-lg shadow-xl backdrop-blur-md whitespace-nowrap mb-2 border border-white/10">
                  {window.title}
                </div>
                <div className="w-11 h-11 md:w-12 md:h-12 p-1 transition-transform duration-200
                                 ease-out mb-0.5 rounded-xl
                                 bg-white/10 overflow-hidden shadow-lg flex items-center justify-center
                                 backdrop-blur-sm hover:bg-white/20 group-hover:scale-110">
                  <span className="opacity-50 text-xs">{window.title[0]}</span>
                </div>
              </div>
            ))
        )}

        {/* Fullscreen Toggle */}
        <div
          className="relative group cursor-pointer flex flex-col items-center justify-end ml-1 transition-all duration-200 ease-out hover:-translate-y-2"
          onClick={toggleFullscreen}
        >
          <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                          px-3 py-1 bg-[#1e1e1e]/80 text-[#f5f5f5] text-xs font-medium rounded-lg shadow-xl backdrop-blur-md whitespace-nowrap mb-2 border border-white/10">
            {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          </div>
          <div className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 origin-bottom">
            {isFullscreen ? <FaCompress size={20} className="text-gray-600 dark:text-gray-300 drop-shadow-md" /> : <FaExpand size={20} className="text-gray-600 dark:text-gray-300 drop-shadow-md" />}
          </div>
          <div className="w-1 h-1 mt-1 bg-transparent"></div>
        </div>
      </div>
    </div>
  );
};
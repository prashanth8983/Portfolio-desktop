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
  const [isHovered, setIsHovered] = useState<boolean>(false);

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
    <div className="fixed bottom-2 left-0 right-0 flex justify-center items-end z-40 h-[60px] pointer-events-none">
      <div 
        className={`
          bg-white/20 backdrop-blur-lg rounded-xl p-1.5 
          flex items-end space-x-1 shadow-lg 
          border border-white/15 pointer-events-auto
          transition-all duration-300 ease-in-out
          ${isHovered ? 'bg-white/10' : 'bg-white/10'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {dockItems.map((item) => (
          <div
            key={item.id}
            className="relative group cursor-pointer flex flex-col items-center"
            onClick={() => onDockItemClick(item.id)}
            title={item.name}
          >
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                           px-2 py-1 bg-black/80 text-white text-xs rounded shadow-lg z-50 whitespace-nowrap">
              {item.name}
            </div>
            <div className="w-12 h-12 p-1 flex items-center justify-center transition-opacity transition-colors duration-150 
                           ease-in-out hover:bg-white/10 rounded-md mb-0.5">
              {item.iconElement}
            </div>
            {windows.some(
              (w) => ((item.id === 'finder-dock' && w.type === 'finder') || w.title === item.name) && !w.isMinimized
            ) && (
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mx-auto shadow-sm"></div>
            )}
          </div>
        ))}
        {windows.some((w) => w.isMinimized) && (
          <>
            <div className="border-l border-white/20 h-10 mx-2 self-center"></div>
            {windows
              .filter((w) => w.isMinimized)
              .map((window) => (
                <div
                  key={window.id + '-minimized'}
                  className="relative group cursor-pointer flex flex-col items-center"
                  onClick={() => onRestoreWindow(window.id)}
                  title={`Restore ${window.title}`}
                >
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                                 px-2 py-1 bg-black/80 text-white text-xs rounded shadow-lg z-50 whitespace-nowrap">
                    {window.title}
                  </div>
                  <div className="w-12 h-12 p-1 transition-opacity transition-colors duration-150 
                                 ease-in-out mb-0.5 border border-gray-400/30 rounded-md 
                                 bg-gray-300/10 overflow-hidden shadow flex items-center justify-center
                                 backdrop-blur-sm hover:bg-white/10">
                    {dockItems.find((di) => di.name === window.title)?.iconElement || <span>{window.title[0]}</span>}
                  </div>
                </div>
              ))}
          </>
        )}
        <div
          className="relative group cursor-pointer flex flex-col items-center ml-2"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
        >
          <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                         px-2 py-1 bg-black/80 text-white text-xs rounded shadow-lg z-50 whitespace-nowrap">
            {isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
          </div>
          <div className="w-12 h-12 p-1 flex items-center justify-center transition-opacity transition-colors duration-150 
                         ease-in-out mb-0.5 rounded-md hover:bg-white/10">
            {isFullscreen ? <FaCompress size={32} className="text-gray-500" /> : <FaExpand size={32} className="text-gray-500" />}
          </div>
        </div>
      </div>
    </div>
  );
};
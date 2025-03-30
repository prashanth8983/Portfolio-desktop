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
  //onMinimizeAll,
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
    <div className="fixed bottom-2 left-0 right-0 flex justify-center items-end z-40 h-[60px] pointer-events-none">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-1.5 flex items-end space-x-1 shadow-lg border border-white/10 pointer-events-auto">
        {dockItems.map((item) => (
          <div
            key={item.id}
            className="relative group cursor-pointer flex flex-col items-center"
            onClick={() => onDockItemClick(item.id)}
            title={item.name}
          >
            <div className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded shadow-lg z-50 whitespace-nowrap">
              {item.name}
            </div>
            <div className="w-12 h-12 p-1 flex items-center justify-center transition-transform duration-150 ease-in-out hover:scale-[1.4] hover:-translate-y-2.5 mb-0.5">
              {item.iconElement}
            </div>
            {windows.some(
              (w) => ((item.id === 'finder-dock' && w.type === 'finder') || w.title === item.name) && !w.isMinimized
            ) && (
              <div className="w-1 h-1 bg-gray-600 dark:bg-gray-300 rounded-full mx-auto shadow-sm"></div>
            )}
          </div>
        ))}
        {windows.some((w) => w.isMinimized) && (
          <>
            <div className="border-l border-white/30 h-10 mx-2 self-center"></div>
            {windows
              .filter((w) => w.isMinimized)
              .map((window) => (
                <div
                  key={window.id + '-minimized'}
                  className="relative group cursor-pointer flex flex-col items-center"
                  onClick={() => onRestoreWindow(window.id)}
                  title={`Restore ${window.title}`}
                >
                  <div className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded shadow-lg z-50 whitespace-nowrap">
                    {window.title}
                  </div>
                  <div className="w-12 h-12 p-1 transition-transform duration-150 ease-in-out hover:scale-[1.4] hover:-translate-y-2.5 mb-0.5 border border-gray-400/30 rounded-md bg-gray-300/20 overflow-hidden shadow flex items-center justify-center">
                    {dockItems.find((di) => di.name === window.title)?.iconElement || <span>{window.title[0]}</span>}
                  </div>
                </div>
              ))}
          </>
        )}
        {/* {windows.some((w) => !w.isMinimized) && (
          <div
            className="relative group cursor-pointer flex flex-col items-center"
            onClick={onMinimizeAll}
            title="Minimize All"
          >
            <div className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded shadow-lg z-50 whitespace-nowrap">
              Minimize All
            </div>
            <div className="w-12 h-12 p-1 flex items-center justify-center transition-transform duration-150 ease-in-out hover:scale-[1.4] hover:-translate-y-2.5 mb-0.5">
              <FaMinus size={32} className="text-gray-400" />
            </div>
          </div>
        )} */}
        <div
          className="relative group cursor-pointer flex flex-col items-center"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
        >
          <div className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded shadow-lg z-50 whitespace-nowrap">
            {isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
          </div>
          <div className="w-12 h-12 p-1 flex items-center justify-center transition-transform duration-150 ease-in-out hover:scale-[1.4] hover:-translate-y-2.5 mb-0.5">
            {isFullscreen ? <FaCompress size={32} className="text-gray-400" /> : <FaExpand size={32} className="text-gray-400" />}
          </div>
        </div>
      </div>
    </div>
  );
};
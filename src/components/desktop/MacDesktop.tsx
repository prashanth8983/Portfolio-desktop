import React, { useState, useEffect } from 'react';
import { DesktopIcon as DesktopIconType, DockItem, Window } from '../../types/interfaces';
import { Dock } from './Dock';
import { PdfViewer } from '../PdfViewer';
import { DesktopIcon } from './DesktopIcon';
import { FaApple } from 'react-icons/fa';

interface MacDesktopProps {
  apps: DesktopIconType[];
  dockItems: DockItem[];
}

export const MacDesktop: React.FC<MacDesktopProps> = ({ apps, dockItems }) => {
  
  const [icons, setIcons] = useState<DesktopIconType[]>(apps);
  const [windows, setWindows] = useState<Window[]>([]);
  const [nextZIndex, setNextZIndex] = useState<number>(1);
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggingWindow, setDraggingWindow] = useState<string | null>(null);
  const [resizingWindow, setResizingWindow] = useState<string | null>(null);
  const [windowDragOffset, setWindowDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10);
    return () => clearInterval(timer);
  }, []);

  const handleIconMouseDown = (id: string, e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const icon = icons.find((i) => i.id === id);
    if (!icon || !icon.position) return;
    setDraggingIcon(id);
    const iconElement = e.currentTarget as HTMLDivElement;
    const rect = iconElement.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingIcon) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    setIcons(
      icons.map((icon) =>
        icon.id === draggingIcon && icon.position
          ? { ...icon, position: { x: newX, y: newY } }
          : icon
      )
    );
  };

  const handleMouseUp = () => {
    if (draggingIcon) setDraggingIcon(null);
  };

  const openWindow = (type: 'browser' | 'finder' | 'pdf' | 'other', title: string, pdfPath?: string, dockId?: string) => {
    const newWindow: Window = {
      id: `window-${Date.now()}`,
      title,
      type,
      position: { x: 100, y: 100 },
      size: { width: 800, height: 600 },
      isMinimized: false,
      isFullscreen: false,
      zIndex: nextZIndex,
      pdfPath,
      dockId,
      content: type === 'pdf' && pdfPath ? <PdfViewer pdfPath={pdfPath} /> : <div>Content for {title}</div>,
    };
    setWindows([...windows, newWindow]);
    setNextZIndex(nextZIndex + 1);
  };
  
  const handleIconDoubleClick = (icon: DesktopIconType) => {
    if (icon.type === 'pdf' && icon.content) openWindow('pdf', icon.name, icon.content);
    else if (icon.type === 'app' && icon.id === 'finder') openWindow('finder', 'Finder', undefined, 'finder-dock');
  };

  const handleDockItemClick = (id: string) => {
    const fullscreenWindow = windows.find((w) => w.dockId === id && w.isFullscreen);
    if (fullscreenWindow) {
      setWindows(windows.map((w) => (w.id === fullscreenWindow.id ? { ...w, isFullscreen: false } : w)));
    } else if (windows.some((w) => w.dockId === id && !w.isMinimized)) {
      const windowToFocus = windows.find((w) => w.dockId === id && !w.isMinimized);
      if (windowToFocus) focusWindow(windowToFocus.id);
    } else {
      if (id === 'chrome') openWindow('browser', 'Chrome', undefined, 'chrome');
      else if (id === 'finder-dock') openWindow('finder', 'Finder', undefined, 'finder-dock');
      else if (id === 'preview') openWindow('pdf', 'resume.pdf', '/resume.pdf', 'preview');
      else openWindow('other', dockItems.find((item) => item.id === id)?.name || 'Window', undefined, id);
    }
  };

  const handleRestoreWindow = (id: string) => {
    setWindows(
      windows.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w))
    );
    setNextZIndex(nextZIndex + 1);
  };

  const handleMinimizeAll = () => {
    setWindows(windows.map((w) => ({ ...w, isMinimized: true })));
  };

  const focusWindow = (id: string) => {
    setWindows(windows.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w)));
    setNextZIndex(nextZIndex + 1);
  };

  const handleWindowMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const window = windows.find((w) => w.id === id);
    if (!window) return;
    focusWindow(id);
    setDraggingWindow(id);
    setWindowDragOffset({ x: e.clientX - window.position.x, y: e.clientY - window.position.y });
  };

  const handleResizeMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const window = windows.find((w) => w.id === id);
    if (!window) return;
    focusWindow(id);
    setResizingWindow(id);
    setResizeStart({ x: e.clientX, y: e.clientY, width: window.size.width, height: window.size.height });
  };

  const handleWindowMouseMove = (e: React.MouseEvent) => {
    if (draggingWindow) {
      setWindows(
        windows.map((w) =>
          w.id === draggingWindow
            ? { ...w, position: { x: e.clientX - windowDragOffset.x, y: e.clientY - windowDragOffset.y } }
            : w
        )
      );
    }
    if (resizingWindow) {
      setWindows(
        windows.map((w) =>
          w.id === resizingWindow
            ? {
                ...w,
                size: {
                  width: Math.max(300, resizeStart.width + (e.clientX - resizeStart.x)),
                  height: Math.max(200, resizeStart.height + (e.clientY - resizeStart.y)),
                },
              }
            : w
        )
      );
    }
  };

  const handleWindowMouseUp = () => {
    setDraggingWindow(null);
    setResizingWindow(null);
  };

  const closeWindow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWindows(windows.filter((w) => w.id !== id));
  };

  const minimizeWindow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWindows(windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));
  };

  const toggleFullscreen = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWindows(windows.map((w) => (w.id === id ? { ...w, isFullscreen: !w.isFullscreen } : w)));
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center relative overflow-hidden font-sans"
      style={{ backgroundImage: "url('./wallpaper.jpg')" }}
      onMouseMove={(e) => {
        if (draggingIcon) handleMouseMove(e);
        if (draggingWindow || resizingWindow) handleWindowMouseMove(e);
      }}
      onMouseUp={() => {
        if (draggingIcon) handleMouseUp();
        if (draggingWindow || resizingWindow) handleWindowMouseUp();
      }}
      onMouseLeave={() => {
        if (draggingIcon) handleMouseUp();
        if (draggingWindow || resizingWindow) handleWindowMouseUp();
      }}
    >
      <div className="flex justify-between items-center h-6 bg-white bg-opacity-30 backdrop-blur-md text-black px-5 p-2 text-xs fixed top-0 left-0 right-0 z-50 shadow">
        <div className="flex items-center space-x-4 font-medium">
          <div className="cursor-default "><FaApple size={16} /></div>
          <div className="font-semibold cursor-default">Finder</div>
          <div className="cursor-default">File</div>
          <div className="cursor-default">Edit</div>
          <div className="cursor-default">View</div>
          <div className="cursor-default">Go</div>
          <div className="cursor-default">Window</div>
          <div className="cursor-default">Help</div>
        </div>
        <div className="cursor-default text-xs font-medium">{currentTime}</div>
      </div>
      <div className="pt-8 relative h-[calc(100vh-80px)]">
        {icons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon}
            onMouseDown={handleIconMouseDown}
            onDoubleClick={handleIconDoubleClick}
          />
        ))}
      </div>

      {windows.map(
        (window) =>
          !window.isMinimized && (
            <div
              key={window.id}
              className="absolute bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
              style={{
                left: window.isFullscreen ? 0 : `${window.position.x}px`,
                top: window.isFullscreen ? '24px' : `${window.position.y}px`,
                width: window.isFullscreen ? '100%' : `${window.size.width}px`,
                height: window.isFullscreen ? 'calc(100vh - 24px - 66px)' : `${window.size.height}px`,
                zIndex: window.zIndex,
              }}
              onClick={() => focusWindow(window.id)}
            >
              <div className="h-8 bg-gray-100 flex items-center px-2" onMouseDown={(e) => handleWindowMouseDown(window.id, e)}>
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full cursor-pointer" onClick={(e) => closeWindow(window.id, e)}></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer" onClick={(e) => minimizeWindow(window.id, e)}></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full cursor-pointer" onClick={(e) => toggleFullscreen(window.id, e)}></div>
                </div>
                <div className="flex-1 text-center text-sm">{window.title}</div>
              </div>
              <div className="flex-1 overflow-hidden">{window.content}</div>
              {!window.isFullscreen && (
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
                  onMouseDown={(e) => handleResizeMouseDown(window.id, e)}
                ></div>
              )}
            </div>
          )
      )}

      <Dock
        dockItems={dockItems}
        windows={windows}
        onDockItemClick={handleDockItemClick}
        onRestoreWindow={handleRestoreWindow}
        onMinimizeAll={handleMinimizeAll}
      />
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { DesktopIcon as DesktopIconType, DockItem, Window } from '../../types/interfaces';
import { Dock } from './Dock';
import { PdfViewer } from '../PdfViewer';
import { DesktopIcon } from './DesktopIcon';
import { Browser } from '../Browser';
import { Spotlight } from '../Spotlight';
import { Calculator } from '../Calculator';
import { TextEditor } from '../TextEditor';
import { AboutThisMac } from '../AboutThisMac';
import { useTheme } from '../../contexts/ThemeContext';
import { ContextMenu, getDesktopContextMenu, getFileContextMenu, ContextMenuItem } from '../ContextMenu';
import { FaApple } from 'react-icons/fa';
import { IoSunny, IoMoon } from 'react-icons/io5';

interface MacDesktopProps {
  apps: DesktopIconType[];
  dockItems: DockItem[];
}

export const MacDesktop: React.FC<MacDesktopProps> = ({ apps, dockItems }) => {
  const { toggleTheme, isDark } = useTheme();
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
  const [snapZone, setSnapZone] = useState<'left' | 'right' | 'top' | null>(null);
  const [isSpotlightVisible, setIsSpotlightVisible] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<{
    isVisible: boolean;
    position: { x: number; y: number };
    items: ContextMenuItem[];
  }>({
    isVisible: false,
    position: { x: 0, y: 0 },
    items: []
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const focusedWindow = windows.find(w => w.zIndex === Math.max(...windows.map(win => win.zIndex)));
        if (!focusedWindow) return;

        switch (e.key) {
          case 'w':
            e.preventDefault();
            setWindows(windows.filter(w => w.id !== focusedWindow.id));
            break;
          case 'm':
            e.preventDefault();
            setWindows(windows.map((w) => (w.id === focusedWindow.id ? { ...w, isMinimized: true } : w)));
            break;
          case 'f':
            e.preventDefault();
            setWindows(windows.map((w) => (w.id === focusedWindow.id ? { ...w, isFullscreen: !w.isFullscreen } : w)));
            break;
        }
      }

      // Spotlight search
      if (e.metaKey && e.key === ' ') {
        e.preventDefault();
        setIsSpotlightVisible(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [windows, setWindows]);

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
    // Calculate window position with offset for multiple windows
    const existingWindows = windows.filter(w => !w.isMinimized);
    const offset = existingWindows.length * 30;
    const maxX = Math.max(0, window.innerWidth - 800 - 50);
    const maxY = Math.max(0, window.innerHeight - 600 - 150);

    const newWindow: Window = {
      id: `window-${Date.now()}`,
      title,
      type,
      position: {
        x: Math.min(100 + offset, maxX),
        y: Math.min(100 + offset, maxY)
      },
      size: { width: 800, height: 600 },
      isMinimized: false,
      isFullscreen: false,
      zIndex: nextZIndex,
      pdfPath,
      dockId,
      content: type === 'pdf' && pdfPath ? <PdfViewer pdfPath={pdfPath} /> :
               type === 'browser' ? <Browser /> :
               title === 'Calculator' ? <Calculator /> :
               title === 'TextEdit' ? <TextEditor /> :
               title === 'About This Mac' ? <AboutThisMac /> :
               <div>Content for {title}</div>,
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
      openAppById(id);
    }
  };

  const openAppById = (id: string) => {
    if (id === 'chrome') openWindow('browser', 'Chrome', undefined, 'chrome');
    else if (id === 'safari') openWindow('browser', 'Safari', undefined, 'safari');
    else if (id === 'finder-dock') openWindow('finder', 'Finder', undefined, 'finder-dock');
    else if (id === 'preview') openWindow('pdf', 'resume.pdf', '/Resume.pdf', 'preview');
    else if (id === 'calculator') openWindow('other', 'Calculator', undefined, 'calculator');
    else if (id === 'textedit') openWindow('other', 'TextEdit', undefined, 'textedit');
    else openWindow('other', dockItems.find((item) => item.id === id)?.name || 'Window', undefined, id);
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
      const newX = e.clientX - windowDragOffset.x;
      const newY = e.clientY - windowDragOffset.y;

      // Detect snap zones
      const screenWidth = window.innerWidth;
      const snapThreshold = 20;

      if (e.clientX < snapThreshold) {
        setSnapZone('left');
      } else if (e.clientX > screenWidth - snapThreshold) {
        setSnapZone('right');
      } else if (e.clientY < snapThreshold + 24) { // Account for menu bar
        setSnapZone('top');
      } else {
        setSnapZone(null);
      }

      // Constrain window within screen bounds
      const draggedWindow = windows.find(w => w.id === draggingWindow);
      if (draggedWindow) {
        const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - draggedWindow.size.width));
        const constrainedY = Math.max(24, Math.min(newY, window.innerHeight - draggedWindow.size.height - 66));

        setWindows(
          windows.map((w) =>
            w.id === draggingWindow
              ? { ...w, position: { x: constrainedX, y: constrainedY } }
              : w
          )
        );
      }
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
    if (draggingWindow && snapZone) {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const menuBarHeight = 24;
      const dockHeight = 66;

      let newWindow = windows.find(w => w.id === draggingWindow);
      if (newWindow) {
        switch (snapZone) {
          case 'left':
            newWindow = {
              ...newWindow,
              position: { x: 0, y: menuBarHeight },
              size: { width: screenWidth / 2, height: screenHeight - menuBarHeight - dockHeight },
              isFullscreen: false
            };
            break;
          case 'right':
            newWindow = {
              ...newWindow,
              position: { x: screenWidth / 2, y: menuBarHeight },
              size: { width: screenWidth / 2, height: screenHeight - menuBarHeight - dockHeight },
              isFullscreen: false
            };
            break;
          case 'top':
            newWindow = {
              ...newWindow,
              position: { x: 0, y: menuBarHeight },
              size: { width: screenWidth, height: screenHeight - menuBarHeight - dockHeight },
              isFullscreen: true
            };
            break;
        }

        setWindows(windows.map(w => w.id === draggingWindow ? newWindow! : w));
      }
    }

    setDraggingWindow(null);
    setResizingWindow(null);
    setSnapZone(null);
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

  const handleTitleBarDoubleClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFullscreen(id, e);
  };

  const handleDesktopRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      isVisible: true,
      position: { x: e.clientX, y: e.clientY },
      items: getDesktopContextMenu(
        () => {
          // Refresh desktop - could trigger a re-render or reset
          setIcons([...icons]);
        },
        () => {
          // Open About This Mac window
          openWindow('other', 'About This Mac', undefined, 'about-mac');
        }
      )
    });
  };

  const handleIconRightClick = (icon: DesktopIconType, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isVisible: true,
      position: { x: e.clientX, y: e.clientY },
      items: getFileContextMenu(
        icon.name,
        () => handleIconDoubleClick(icon),
        () => {
          // Delete icon
          setIcons(icons.filter(i => i.id !== icon.id));
        },
        () => {
          // Get info
          alert(`Name: ${icon.name}\nType: ${icon.type}\nID: ${icon.id}`);
        }
      )
    });
  };

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div
      className={`w-screen h-screen bg-cover bg-center relative overflow-hidden font-sans transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-blue-100'
      }`}
      style={{
        backgroundImage: isDark
          ? "linear-gradient(135deg, #1a1a2e, #16213e)"
          : "url('./wallpaper.jpg')"
      }}
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
      onContextMenu={handleDesktopRightClick}
    >
      <div className={`flex justify-between items-center h-6 backdrop-blur-md px-5 p-2 text-xs fixed top-0 left-0 right-0 z-50 shadow transition-colors duration-300 ${
        isDark
          ? 'bg-gray-800 bg-opacity-80 text-white'
          : 'bg-white bg-opacity-30 text-black'
      }`}>
        <div className="flex items-center space-x-4 font-medium">
          <div
            className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-1 rounded transition-colors"
            onClick={() => openWindow('other', 'About This Mac', undefined, 'about-mac')}
            title="About This Mac"
          >
            <FaApple size={16} />
          </div>
          <div className="font-semibold cursor-default">Finder</div>
          <div className="cursor-default">File</div>
          <div className="cursor-default">Edit</div>
          <div className="cursor-default">View</div>
          <div className="cursor-default">Go</div>
          <div className="cursor-default">Window</div>
          <div className="cursor-default">Help</div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors"
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <IoSunny size={14} /> : <IoMoon size={14} />}
          </button>
          <div className="cursor-default text-xs font-medium">{currentTime}</div>
        </div>
      </div>
      {/* Snap Zone Overlays */}
      {snapZone && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {snapZone === 'left' && (
            <div className="absolute left-0 top-6 w-1/2 h-[calc(100vh-90px)] bg-blue-500 bg-opacity-30 border-2 border-blue-500 border-dashed" />
          )}
          {snapZone === 'right' && (
            <div className="absolute right-0 top-6 w-1/2 h-[calc(100vh-90px)] bg-blue-500 bg-opacity-30 border-2 border-blue-500 border-dashed" />
          )}
          {snapZone === 'top' && (
            <div className="absolute left-0 top-6 w-full h-[calc(100vh-90px)] bg-blue-500 bg-opacity-30 border-2 border-blue-500 border-dashed" />
          )}
        </div>
      )}

      <div className="pt-8 relative h-[calc(100vh-80px)]">
        {icons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon}
            onMouseDown={handleIconMouseDown}
            onDoubleClick={handleIconDoubleClick}
            onRightClick={handleIconRightClick}
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
              <div
                className="h-8 bg-gray-100 flex items-center px-2"
                onMouseDown={(e) => handleWindowMouseDown(window.id, e)}
                onDoubleClick={(e) => handleTitleBarDoubleClick(window.id, e)}
              >
                <div className="flex space-x-2 mr-4">
                  <div
                    className="w-3 h-3 bg-red-500 rounded-full cursor-pointer hover:bg-red-600 transition-colors flex items-center justify-center group"
                    onClick={(e) => closeWindow(window.id, e)}
                    title="Close"
                  >
                    <span className="text-red-800 text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                  </div>
                  <div
                    className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-600 transition-colors flex items-center justify-center group"
                    onClick={(e) => minimizeWindow(window.id, e)}
                    title="Minimize"
                  >
                    <span className="text-yellow-800 text-xs opacity-0 group-hover:opacity-100 transition-opacity">−</span>
                  </div>
                  <div
                    className="w-3 h-3 bg-green-500 rounded-full cursor-pointer hover:bg-green-600 transition-colors flex items-center justify-center group"
                    onClick={(e) => toggleFullscreen(window.id, e)}
                    title={window.isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    <span className="text-green-800 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {window.isFullscreen ? "⌄" : "⌃"}
                    </span>
                  </div>
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

      <Spotlight
        isVisible={isSpotlightVisible}
        onClose={() => setIsSpotlightVisible(false)}
        onOpenApp={openAppById}
      />

      <ContextMenu
        isVisible={contextMenu.isVisible}
        position={contextMenu.position}
        items={contextMenu.items}
        onClose={closeContextMenu}
      />
    </div>
  );
};
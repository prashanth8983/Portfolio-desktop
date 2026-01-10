import React, { useState, useEffect } from 'react';
import { DesktopIcon as DesktopIconType, DockItem, Window as WindowType } from '../../types/interfaces';
import { Dock } from './Dock';
import { PdfViewer } from '../PdfViewer';
import { DesktopIcon } from './DesktopIcon';
import { Browser } from '../Browser';
import { Spotlight } from '../Spotlight';
import { Calculator } from '../Calculator';
import { TextEditor } from '../TextEditor';
import { AboutThisMac } from '../AboutThisMac';
import { Terminal } from '../Terminal';
import { ProjectViewer } from '../ProjectViewer';
import { Gallery } from '../Gallery';
import { Mail } from '../Mail';
import { Music } from '../Music';
import { ActivityMonitor } from '../ActivityMonitor';
import { Window } from './Window'; // Import new component
import { Finder } from '../Finder';
import ProfileCard from '../ProfileCard';
import { useTheme } from '../../contexts/ThemeContext';
import { ContextMenu, getDesktopContextMenu, getFileContextMenu, ContextMenuItem } from '../ContextMenu';
import { FaApple, FaWifi, FaBatteryFull } from 'react-icons/fa';
import { IoBluetooth } from 'react-icons/io5';
import { MagnifyingGlassIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons'; // Radix Icons


interface MacDesktopProps {
  apps: DesktopIconType[];
  dockItems: DockItem[];
}

export const MacDesktop: React.FC<MacDesktopProps> = ({ apps, dockItems }) => {
  const { toggleTheme, isDark } = useTheme();
  const [icons, setIcons] = useState<DesktopIconType[]>(apps);
  const [windows, setWindows] = useState<WindowType[]>([]);
  const [nextZIndex, setNextZIndex] = useState<number>(1);
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggingWindow, setDraggingWindow] = useState<string | null>(null);
  const [resizingWindow, setResizingWindow] = useState<string | null>(null);
  const [windowDragOffset, setWindowDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number; windowX: number; windowY: number }>({ x: 0, y: 0, width: 0, height: 0, windowX: 0, windowY: 0 });
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
  );
  const [snapZone, setSnapZone] = useState<'left' | 'right' | 'top' | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
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
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    }, 1000);
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
        setIsSpotlightVisible((prev) => !prev);
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

  const openWindow = (type: 'browser' | 'finder' | 'pdf' | 'terminal' | 'projects' | 'photos' | 'mail' | 'music' | 'activity-monitor' | 'profile' | 'other', title: string, pdfPath?: string, dockId?: string) => {
    // Calculate window position with offset for multiple windows
    const existingWindows = windows.filter(w => !w.isMinimized);
    const offset = existingWindows.length * 30;
    const maxX = Math.max(0, window.innerWidth - 800 - 50);
    const maxY = Math.max(0, window.innerHeight - 600 - 150);

    const newWindow: WindowType = {
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
          type === 'finder' ? <Finder initialDirectory={
            dockId === 'projects-folder' ? 'projects' :
              dockId === 'documents' ? 'documents' :
                dockId === 'mac-hd' ? 'mac-hd' :
                  'recents'
          } /> :
            type === 'terminal' ? <Terminal /> :
              type === 'projects' ? <ProjectViewer /> :
                type === 'photos' ? <Gallery /> :
                  type === 'mail' ? <Mail /> :
                    type === 'music' ? <Music /> :
                      type === 'activity-monitor' ? <ActivityMonitor /> :
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
    else if (icon.type === 'app' && icon.id === 'profile') setIsProfileOpen(true);
    else if (icon.type === 'folder' && icon.id === 'projects') openWindow('finder', 'Projects', undefined, 'projects-folder');
    else if (icon.type === 'folder' && icon.id === 'documents') openWindow('finder', 'Documents', undefined, 'documents'); // Add documents if needed in future
    else if (icon.type === 'drive') openWindow('finder', 'Macintosh HD', undefined, 'mac-hd');
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
    else if (id === 'terminal') openWindow('terminal', 'Terminal', undefined, 'terminal');
    else if (id === 'mail') openWindow('mail', 'Mail', undefined, 'mail');
    else if (id === 'music') openWindow('music', 'Music', undefined, 'music');
    else if (id === 'photos') openWindow('photos', 'Photos', undefined, 'photos');
    else if (id === 'activity-monitor') openWindow('activity-monitor', 'Activity Monitor', undefined, 'activity-monitor');
    else if (id === 'projects-folder') openWindow('projects', 'Projects', undefined, 'projects-folder');
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

  const handleResizeMouseDown = (id: string, e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    const win = windows.find((w) => w.id === id);
    if (!win) return;
    focusWindow(id);
    setResizingWindow(id);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: win.size.width,
      height: win.size.height,
      windowX: win.position.x,
      windowY: win.position.y
    });
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
    if (resizingWindow && resizeDirection) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const minWidth = 300;
      const minHeight = 200;

      setWindows(
        windows.map((w) => {
          if (w.id !== resizingWindow) return w;

          let newWidth = w.size.width;
          let newHeight = w.size.height;
          let newX = w.position.x;
          let newY = w.position.y;

          // Handle horizontal resizing
          if (resizeDirection.includes('e')) {
            newWidth = Math.max(minWidth, resizeStart.width + deltaX);
          }
          if (resizeDirection.includes('w')) {
            const proposedWidth = resizeStart.width - deltaX;
            if (proposedWidth >= minWidth) {
              newWidth = proposedWidth;
              newX = resizeStart.windowX + deltaX;
            }
          }

          // Handle vertical resizing
          if (resizeDirection.includes('s')) {
            newHeight = Math.max(minHeight, resizeStart.height + deltaY);
          }
          if (resizeDirection.includes('n')) {
            const proposedHeight = resizeStart.height - deltaY;
            if (proposedHeight >= minHeight) {
              newHeight = proposedHeight;
              newY = resizeStart.windowY + deltaY;
            }
          }

          return {
            ...w,
            position: { x: newX, y: newY },
            size: { width: newWidth, height: newHeight },
          };
        })
      );
    }
  };

  const handleWindowMouseUp = () => {
    if (draggingWindow && snapZone) {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const menuBarHeight = 32; // Updated to match new height
      const dockHeight = 70;

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
    setResizeDirection('');
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
      className={`w-screen h-screen bg-cover bg-center relative overflow-hidden font-sans transition-colors duration-300 select-none ${isDark ? 'bg-gray-900' : 'bg-blue-100'
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
      {/* Top Menu Bar - macOS Tahoe style: transparent with white text */}
      <div
        className="flex justify-between items-center h-8 px-4 text-sm fixed top-0 left-0 right-0 z-50 text-white"
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5), 0 0 1px rgba(0,0,0,0.3)' }}
      >
        <div className="flex items-center space-x-5 font-medium">
          <div
            className="cursor-pointer hover:bg-white/10 p-1 rounded-sm transition-colors"
            onClick={() => openWindow('other', 'About This Mac', undefined, 'about-mac')}
            title="About This Mac"
          >
            <FaApple size={18} />
          </div>
          <div className="font-bold cursor-default">Finder</div>
          <div className="cursor-default hover:bg-white/10 px-2 py-0.5 rounded">File</div>
          <div className="cursor-default hover:bg-white/10 px-2 py-0.5 rounded">Edit</div>
          <div className="cursor-default hover:bg-white/10 px-2 py-0.5 rounded">View</div>
          <div className="cursor-default hover:bg-white/10 px-2 py-0.5 rounded">Go</div>
          <div className="cursor-default hover:bg-white/10 px-2 py-0.5 rounded">Window</div>
          <div className="cursor-default hover:bg-white/10 px-2 py-0.5 rounded">Help</div>
        </div>

        {/* Right Menu Items */}
        <div className="flex items-center space-x-4">
          {/* System Icons */}
          <div className="flex items-center space-x-3 px-2">
            <FaBatteryFull className="cursor-default text-white/90" />
            <FaWifi className="cursor-default text-white/90" />
            <IoBluetooth className="cursor-default text-white/90" />
            <div onClick={() => setIsSpotlightVisible(!isSpotlightVisible)}>
              <MagnifyingGlassIcon className="cursor-pointer w-4 h-4 text-white/90" />
            </div>
          </div>

          {/* Toggle Theme */}
          <button
            onClick={toggleTheme}
            className="p-1 rounded hover:bg-white/10 transition-colors focus:outline-none text-white/90"
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
          </button>

          {/* Clock */}
          <div className="cursor-default text-xs font-medium flex items-center gap-2">
            <span>{currentDate}</span>
            <span>{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Snap Zone Overlays */}
      {snapZone && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {snapZone === 'left' && (
            <div className="absolute left-0 top-6 w-1/2 h-[calc(100vh-90px)] bg-blue-500/20 backdrop-blur-sm border-2 border-blue-500/50 rounded-xl m-2" />
          )}
          {snapZone === 'right' && (
            <div className="absolute right-0 top-6 w-1/2 h-[calc(100vh-90px)] bg-blue-500/20 backdrop-blur-sm border-2 border-blue-500/50 rounded-xl m-2" />
          )}
          {snapZone === 'top' && (
            <div className="absolute left-0 top-6 w-full h-[calc(100vh-90px)] bg-blue-500/20 backdrop-blur-sm border-2 border-blue-500/50 rounded-xl m-2" />
          )}
        </div>
      )}

      {/* Desktop Icons */}
      <div className="pt-10 relative h-[calc(100vh-80px)]">
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

      {/* Windows Layer */}
      {windows.map((win) => {
        if (win.isMinimized) return null;
        const maxZIndex = Math.max(...windows.filter(w => !w.isMinimized).map(w => w.zIndex));
        const isActive = win.zIndex === maxZIndex;
        return (
          <Window
            key={win.id}
            window={win}
            isActive={isActive}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={toggleFullscreen}
            onFocus={focusWindow}
            onDragStart={handleWindowMouseDown}
            onResizeStart={handleResizeMouseDown}
          />
        );
      })}

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

      {/* Profile Card Overlay */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsProfileOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ProfileCard />
          </div>
        </div>
      )}
    </div>
  );
};
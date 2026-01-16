import React, { useState, useEffect, useCallback } from 'react';
import { MacDesktop } from './desktop/MacDesktop';
import { IOSMobileView } from './mobile/IOSMobileView';
import { LockScreen } from './LockScreen';
import { DesktopIcon, DockItem } from '../types/interfaces';
import { getIconUrl } from '../utils/icons';
import { isSessionUnlocked, setUnlocked, setLocked } from '../utils/session';

const ResponsiveView: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  // Check session on initial load to determine if user should see lock screen
  const [isLocked, setIsLocked] = useState<boolean>(() => !isSessionUnlocked());

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Initial Icon Placement Logic */
  const getInitialApps = (): DesktopIcon[] => {
    const screenWidth = window.innerWidth;
    const rightMargin = 120; // Distance from right edge
    const topMargin = 50;   // Distance from top
    const gridGap = 95;     // Vertical spacing (reduced for more icons)

    const colX = screenWidth - rightMargin;

    return [
      { id: 'macintosh-hd', name: 'Macintosh HD', icon: 'hard-disk', type: 'drive', position: { x: colX, y: topMargin } },
      { id: 'projects', name: 'Projects', icon: 'projects', type: 'folder', position: { x: colX, y: topMargin + gridGap } },
      { id: 'documents', name: 'Documents', icon: 'documents', type: 'folder', position: { x: colX, y: topMargin + gridGap * 2 } },
      { id: 'profile', name: 'Education', icon: 'education', type: 'app', position: { x: colX, y: topMargin + gridGap * 3 } },
      { id: 'work-experience', name: 'Experience', icon: 'work-experience', type: 'app', position: { x: colX, y: topMargin + gridGap * 4 } },
      { id: 'feedback', name: 'Feedback.txt', icon: 'txt', type: 'app', position: { x: colX, y: topMargin + gridGap * 5 } },
      { id: 'resume', name: 'Prashanth Kumar.pdf', icon: 'pdf', type: 'pdf', position: { x: colX, y: topMargin + gridGap * 6 }, content: './Resume.pdf' },
    ];
  };

  const [apps, setApps] = useState<DesktopIcon[]>(getInitialApps());

  // Update positions on resize if needed, or just leave them relative? 
  // macOS keeps icons in place relative to top-left usually, but defaults to right.
  // For this simple web-desktop, we can re-calculate or just let them stick.
  // Let's re-calculate on resize to keep them reachable.
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setApps(prev => {
        // Only update X, keep Y (unless we want full reflow)
        const newX = window.innerWidth - 120;
        return prev.map(app => ({
          ...app,
          position: { x: newX, y: app.position?.y ?? 50 }
        }));
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dockItems: DockItem[] = [
    {
      id: 'finder-dock',
      name: 'Finder',
      iconElement: <img src={getIconUrl('finder')} alt="Finder" className="w-full h-full object-contain drop-shadow-md" />,
    },
    {
      id: 'safari',
      name: 'Safari',
      iconElement: <img src={getIconUrl('safari')} alt="Safari" className="w-full h-full object-contain drop-shadow-md" />,
    },
    {
      id: 'mail',
      name: 'Mail',
      iconElement: <img src={getIconUrl('mail')} alt="Mail" className="w-full h-full object-contain drop-shadow-md" />,
    },
    {
      id: 'terminal',
      name: 'Terminal',
      iconElement: <img src={getIconUrl('terminal')} alt="Terminal" className="w-full h-full object-contain drop-shadow-md" />,
    },
    {
      id: 'photos',
      name: 'Photos',
      iconElement: <img src={getIconUrl('photos')} alt="Photos" className="w-full h-full object-contain drop-shadow-md" />,
    },
    {
      id: 'music',
      name: 'Music',
      iconElement: <img src={getIconUrl('music')} alt="Music" className="w-full h-full object-contain drop-shadow-md" />,
    },
    {
      id: 'activity-monitor',
      name: 'Activity Monitor',
      iconElement: <img src={getIconUrl('activity-monitor')} alt="Activity Monitor" className="w-full h-full object-contain drop-shadow-md" />,
    },
    {
      id: 'calendar',
      name: 'Calendar',
      iconElement: <img src={getIconUrl('calendar')} alt="Calendar" className="w-full h-full object-contain drop-shadow-md" />,
    },
    {
      id: 'stickynotes',
      name: 'Sticky Notes',
      iconElement: <img src={getIconUrl('stickynotes')} alt="Sticky Notes" className="w-full h-full object-contain drop-shadow-md" />,
    },
    {
      id: 'system-settings',
      name: 'System Settings',
      iconElement: <img src={getIconUrl('system-settings')} alt="System Settings" className="w-full h-full object-contain drop-shadow-md" />,
    },
    {
      id: 'bin',
      name: 'Bin',
      iconElement: <img src={getIconUrl('bin')} alt="Bin" className="w-full h-full object-contain drop-shadow-md" />,
    },
  ];

  // Handle unlock with session persistence
  const handleUnlock = useCallback((userId: string, userName: string) => {
    setUnlocked(userId, userName);
    setIsLocked(false);
  }, []);

  // Handle lock with session update
  const handleLock = useCallback(() => {
    setLocked();
    setIsLocked(true);
  }, []);

  return (
    <>
      <LockScreen isLocked={isLocked} onUnlock={handleUnlock} />
      {isMobile ? <IOSMobileView apps={apps} /> : <MacDesktop apps={apps} dockItems={dockItems} onLock={handleLock} />}
    </>
  );
};

export default ResponsiveView;
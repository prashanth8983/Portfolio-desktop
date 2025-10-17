import React, { useState, useEffect } from 'react';
import { MacDesktop } from './desktop/MacDesktop';
import { IOSMobileView } from './mobile/IOSMobileView';
import { DesktopIcon, DockItem } from '../types/interfaces';
import { SiGooglechrome, SiSafari, SiApplemusic } from 'react-icons/si';
//import { FaChrome, FaCog, FaComment, FaEnvelope, FaEye, FaFolderOpen, FaMusic, FaSafari, FaShoppingBag, FaTrash } from 'react-icons/fa';
import {
  IoFolderOpenOutline, // Finder approximation
  IoMail,             // Mail
  IoImagesOutline,    // Preview approximation / Photos
  IoSettingsSharp,    // System Preferences/Settings
  IoTrashBin,         // Trash
  IoTerminal,         // Terminal
  IoStatsChart,       // Activity Monitor
} from 'react-icons/io5';

const ResponsiveView: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const apps: DesktopIcon[] = [
    { id: 'finder', name: 'Finder', icon: 'folder', type: 'app', position: { x: 20, y: 20 } },
    { id: 'trash', name: 'Trash', icon: 'trash', type: 'app', position: { x: 20, y: 100 } },
    { id: 'projects', name: 'Projects', icon: 'folder', type: 'folder', position: { x: 20, y: 180 } },
    { id: 'documents', name: 'Documents', icon: 'folder', type: 'folder', position: { x: 20, y: 260 } },
    { id: 'sample-pdf', name: 'Prashanth Kumar.pdf', icon: 'pdf', type: 'pdf', position: { x: 20, y: 340 }, content: './Resume.pdf'  },
  ];

  const dockIconSize = 32;
  const dockItems: DockItem[] = [
    {
      id: 'finder-dock',
      name: 'Finder',
      iconElement: <IoFolderOpenOutline size={dockIconSize} className="text-sky-500" />,
    },
    {
      id: 'chrome',
      name: 'Chrome',
      iconElement: <SiGooglechrome size={dockIconSize} className="text-red-500" />,
    },
    {
      id: 'safari',
      name: 'Safari',
      iconElement: <SiSafari size={dockIconSize} className="text-blue-600" />,
    },
    {
      id: 'mail',
      name: 'Mail',
      iconElement: <IoMail size={dockIconSize} className="text-blue-500" />,
    },
    {
      id: 'terminal',
      name: 'Terminal',
      iconElement: <IoTerminal size={dockIconSize} className="text-gray-800" />,
    },
    {
      id: 'photos',
      name: 'Photos',
      iconElement: <IoImagesOutline size={dockIconSize} className="text-yellow-500" />,
    },
    {
      id: 'music',
      name: 'Music',
      iconElement: <SiApplemusic size={dockIconSize} className="text-red-500" />,
    },
    {
      id: 'activity-monitor',
      name: 'Activity Monitor',
      iconElement: <IoStatsChart size={dockIconSize} className="text-green-500" />,
    },
    {
      id: 'preferences',
      name: 'System Preferences',
      iconElement: <IoSettingsSharp size={dockIconSize} className="text-gray-500" />,
    },
    {
      id: 'trash-dock',
      name: 'Trash',
      iconElement: <IoTrashBin size={dockIconSize} className="text-gray-600" />,
    },
  ];

  return isMobile ? <IOSMobileView apps={apps} /> : <MacDesktop apps={apps} dockItems={dockItems} />;
};

export default ResponsiveView;
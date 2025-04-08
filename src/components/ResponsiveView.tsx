import React, { useState, useEffect } from 'react';
import { MacDesktop } from './desktop/MacDesktop';
import { IOSMobileView } from './mobile/IOSMobileView';
import { DesktopIcon, DockItem } from '../types/interfaces';
import { FaChrome, FaCog, FaComment, FaEnvelope, FaEye, FaFolderOpen, FaMusic, FaSafari, FaShoppingBag, FaTrash } from 'react-icons/fa';

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
    { id: 'documents', name: 'Documents', icon: 'folder', type: 'folder', position: { x: 20, y: 180 } },
    { id: 'sample-pdf', name: 'Prashanth Kumar.pdf', icon: 'pdf', type: 'pdf', position: { x: 20, y: 260 }, content: './resume.pdf'  },
  ];

  const dockIconSize = 32;
  const dockItems: DockItem[] = [
    { id: 'finder-dock', name: 'Finder', iconElement: <FaFolderOpen size={dockIconSize} className="text-blue-500" /> },
    { id: 'chrome', name: 'Chrome', iconElement: <FaChrome size={dockIconSize} className="text-orange-500" /> },
    { id: 'safari', name: 'Safari', iconElement: <FaSafari size={dockIconSize} className="text-blue-600" /> },
    { id: 'mail', name: 'Mail', iconElement: <FaEnvelope size={dockIconSize} className="text-sky-500" /> },
    { id: 'preview', name: 'Preview', iconElement: <FaEye size={dockIconSize} className="text-gray-700" /> },
    { id: 'messages', name: 'Messages', iconElement: <FaComment size={dockIconSize} className="text-green-500" /> },
    { id: 'music', name: 'Music', iconElement: <FaMusic size={dockIconSize} className="text-red-500" /> },
    { id: 'appstore', name: 'App Store', iconElement: <FaShoppingBag size={dockIconSize} className="text-indigo-500" /> },
    { id: 'preferences', name: 'System Preferences', iconElement: <FaCog size={dockIconSize} className="text-gray-600" /> },
    { id: 'trash-dock', name: 'Trash', iconElement: <FaTrash size={dockIconSize} className="text-gray-500" /> },
  ];

  return isMobile ? <IOSMobileView apps={apps} /> : <MacDesktop apps={apps} dockItems={dockItems} />;
};

export default ResponsiveView;
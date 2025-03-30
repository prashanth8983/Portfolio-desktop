export interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
  type: 'folder' | 'pdf' | 'app';
  position?: { x: number; y: number };
  content?: string;
}

export interface DockItem {
  id: string;
  name: string;
  iconElement?: React.ReactNode;
}

export interface Window {
  id: string;
  title: string;
  type: 'browser' | 'finder' | 'pdf' | 'other';
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isFullscreen: boolean;
  zIndex: number;
  content?: React.ReactNode;
  pdfPath?: string;
  dockId?: string;
}

export interface Screen {
  id: string;
  title: string;
  type: 'home' | 'pdf' | 'browser' | 'other';
  content?: React.ReactNode;
  pdfPath?: string;
}
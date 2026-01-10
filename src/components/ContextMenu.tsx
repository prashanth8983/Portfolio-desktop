import React, { useEffect, useRef } from 'react';
import {
  ReloadIcon,
  InfoCircledIcon,
  TrashIcon,
  OpenInNewWindowIcon,
  CopyIcon,
  ScissorsIcon,
  ClipboardIcon,
  EyeOpenIcon
} from '@radix-ui/react-icons';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
}

interface ContextMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isVisible,
  position,
  items,
  onClose
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  useEffect(() => {
    if (isVisible && menuRef.current) {
      // Adjust position if menu goes off screen
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = position.x;
      let adjustedY = position.y;

      if (position.x + rect.width > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }

      if (position.y + rect.height > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }

      menuRef.current.style.left = `${adjustedX}px`;
      menuRef.current.style.top = `${adjustedY}px`;
    }
  }, [isVisible, position]);

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className={`fixed z-[9999] bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] py-1.5 min-w-48 overflow-hidden`}
      style={{ left: position.x, top: position.y }}
    >
      {items.map((item) => (
        <div key={item.id}>
          {item.separator && (
            <div className="h-[1px] bg-gray-200/50 dark:bg-gray-700/50 my-1 mx-3" />
          )}
          <button
            className={`w-full flex items-center px-4 py-1.5 text-sm text-left transition-colors font-medium ${item.disabled
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white'
              }`}
            onClick={() => {
              if (!item.disabled) {
                item.action();
                onClose();
              }
            }}
            disabled={item.disabled}
          >
            {item.icon && (
              <span className="mr-3 w-4 h-4 flex items-center justify-center">
                {item.icon}
              </span>
            )}
            <span className="flex-1">{item.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

// Predefined context menu configurations
export const getDesktopContextMenu = (onRefresh: () => void, onAbout: () => void): ContextMenuItem[] => [
  {
    id: 'refresh',
    label: 'Refresh Desktop',
    icon: <ReloadIcon />,
    action: onRefresh
  },
  {
    id: 'separator1',
    label: '',
    action: () => { },
    separator: true
  },
  {
    id: 'about',
    label: 'About This Mac',
    icon: <InfoCircledIcon />,
    action: onAbout
  }
];

export const getFileContextMenu = (
  fileName: string,
  onOpen: () => void,
  onDelete: () => void,
  onGetInfo: () => void
): ContextMenuItem[] => [
    {
      id: 'open',
      label: 'Open',
      icon: <OpenInNewWindowIcon />,
      action: onOpen
    },
    {
      id: 'preview',
      label: 'Quick Look',
      icon: <EyeOpenIcon />,
      action: onOpen
    },
    {
      id: 'separator1',
      label: '',
      action: () => { },
      separator: true
    },
    {
      id: 'copy',
      label: 'Copy',
      icon: <CopyIcon />,
      action: () => {
        navigator.clipboard.writeText(fileName);
      }
    },
    {
      id: 'cut',
      label: 'Cut',
      icon: <ScissorsIcon />,
      action: () => {
        navigator.clipboard.writeText(fileName);
      }
    },
    {
      id: 'paste',
      label: 'Paste',
      icon: <ClipboardIcon />,
      action: () => { },
      disabled: true
    },
    {
      id: 'separator2',
      label: '',
      action: () => { },
      separator: true
    },
    {
      id: 'delete',
      label: 'Move to Trash',
      icon: <TrashIcon />,
      action: onDelete
    },
    {
      id: 'separator3',
      label: '',
      action: () => { },
      separator: true
    },
    {
      id: 'info',
      label: 'Get Info',
      icon: <InfoCircledIcon />,
      action: onGetInfo
    }
  ];

export const getWindowContextMenu = (
  onMinimize: () => void,
  onMaximize: () => void,
  onClose: () => void
): ContextMenuItem[] => [
    {
      id: 'minimize',
      label: 'Minimize',
      action: onMinimize
    },
    {
      id: 'maximize',
      label: 'Maximize',
      action: onMaximize
    },
    {
      id: 'separator1',
      label: '',
      action: () => { },
      separator: true
    },
    {
      id: 'close',
      label: 'Close',
      action: onClose
    }
  ];
import React, { useEffect, useRef } from 'react';
import { IoRefresh, IoInformationCircle, IoTrash, IoFolderOpen, IoCopy, IoCut, IoClipboard, IoEye } from 'react-icons/io5';

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
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-2xl py-2 min-w-48"
      style={{ left: position.x, top: position.y }}
    >
      {items.map((item) => (
        <div key={item.id}>
          {item.separator && (
            <div className="h-px bg-gray-200 dark:bg-gray-600 my-1 mx-2" />
          )}
          <button
            className={`w-full flex items-center px-4 py-2 text-sm text-left transition-colors ${
              item.disabled
                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white'
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
    icon: <IoRefresh size={16} />,
    action: onRefresh
  },
  {
    id: 'separator1',
    label: '',
    action: () => {},
    separator: true
  },
  {
    id: 'about',
    label: 'About This Mac',
    icon: <IoInformationCircle size={16} />,
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
    icon: <IoFolderOpen size={16} />,
    action: onOpen
  },
  {
    id: 'preview',
    label: 'Quick Look',
    icon: <IoEye size={16} />,
    action: onOpen
  },
  {
    id: 'separator1',
    label: '',
    action: () => {},
    separator: true
  },
  {
    id: 'copy',
    label: 'Copy',
    icon: <IoCopy size={16} />,
    action: () => {
      navigator.clipboard.writeText(fileName);
    }
  },
  {
    id: 'cut',
    label: 'Cut',
    icon: <IoCut size={16} />,
    action: () => {
      navigator.clipboard.writeText(fileName);
    }
  },
  {
    id: 'paste',
    label: 'Paste',
    icon: <IoClipboard size={16} />,
    action: () => {},
    disabled: true
  },
  {
    id: 'separator2',
    label: '',
    action: () => {},
    separator: true
  },
  {
    id: 'delete',
    label: 'Move to Trash',
    icon: <IoTrash size={16} />,
    action: onDelete
  },
  {
    id: 'separator3',
    label: '',
    action: () => {},
    separator: true
  },
  {
    id: 'info',
    label: 'Get Info',
    icon: <IoInformationCircle size={16} />,
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
    action: () => {},
    separator: true
  },
  {
    id: 'close',
    label: 'Close',
    action: onClose
  }
];
import React from 'react';
import { DesktopIcon as DesktopIconType } from '../../types/interfaces';
import { getIconUrl } from '../../utils/icons';

interface DesktopIconProps {
  icon: DesktopIconType;
  onMouseDown: (id: string, e: React.MouseEvent) => void;
  onDoubleClick: (icon: DesktopIconType) => void;
  onRightClick?: (icon: DesktopIconType, e: React.MouseEvent) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, onMouseDown, onDoubleClick, onRightClick }) => {
  const renderIconImage = () => {
    // Check if icon.icon is a generic name that mapping handles, or if we should pass it directly.
    // getIconUrl handles generic mapping.
    const iconUrl = getIconUrl(icon.icon);

    return (
      <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ease-in-out filter drop-shadow-lg">
        <img src={iconUrl} alt={icon.name} className="w-full h-full object-contain pointer-events-none" />
      </div>
    );
  };

  return (
    <div
      className="absolute w-28 flex flex-col items-center cursor-pointer group select-none"
      style={{ left: `${icon.position?.x ?? 20}px`, top: `${icon.position?.y ?? 20}px` }}
      onMouseDown={(e) => onMouseDown(icon.id, e)}
      onDoubleClick={() => onDoubleClick(icon)}
      onContextMenu={(e) => onRightClick?.(icon, e)}
    >
      {renderIconImage()}
      <span
        className={`mt-1 px-2.5 py-0.5 rounded-[4px] text-[12px] leading-tight text-center w-[100px] font-medium text-white select-none ${
          /* Use a subtle hover effect or selection state if we had one */
          'group-hover:bg-white/10'
          }`}
        style={{
          textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 1px rgba(0,0,0,0.5)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {icon.name}
      </span>
    </div>
  );
};
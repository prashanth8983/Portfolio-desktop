import React from 'react';
import { FaFolder, FaFilePdf, FaTrash, FaFolderOpen } from 'react-icons/fa';
import { DesktopIcon as DesktopIconType } from '../../types/interfaces';

interface DesktopIconProps {
  icon: DesktopIconType;
  onMouseDown: (id: string, e: React.MouseEvent) => void;
  onDoubleClick: (icon: DesktopIconType) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, onMouseDown, onDoubleClick }) => {
  const renderIconImage = () => {
    const iconContainerStyle = "w-16 h-16 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-100 ease-in-out";
    if (icon.icon === 'folder') return <div className={iconContainerStyle}><FaFolder className="text-blue-500 drop-shadow-md" /></div>;
    if (icon.icon === 'pdf') return <div className={iconContainerStyle}><FaFilePdf className="text-red-600 drop-shadow-md" /></div>;
    if (icon.icon === 'trash') return <div className={iconContainerStyle}><FaTrash className="text-gray-600 drop-shadow-md" /></div>;
    if (icon.icon === 'finder') return <div className={iconContainerStyle}><FaFolderOpen className="text-sky-500 drop-shadow-md" /></div>;
    return <div className={`${iconContainerStyle} bg-gray-400 text-white rounded-lg shadow-md`}>{icon.name[0]}</div>;
  };

  return (
    <div
      className="absolute w-24 flex flex-col items-center cursor-pointer group"
      style={{ left: `${icon.position?.x ?? 20}px`, top: `${icon.position?.y ?? 20}px` }}
      onMouseDown={(e) => onMouseDown(icon.id, e)}
      onDoubleClick={() => onDoubleClick(icon)}
    >
      {renderIconImage()}
      <div className="mt-1 bg-black bg-opacity-30 text-white px-1.5 py-0.5 rounded text-xs text-center w-full max-w-[90px] truncate shadow backdrop-blur-sm">
        {icon.name}
      </div>
    </div>
  );
};
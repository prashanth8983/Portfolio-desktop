import React from 'react';
import { FaFolder, FaFilePdf, FaTrash, FaFolderOpen } from 'react-icons/fa';
import { DesktopIcon, Screen as ScreenType } from '../../types/interfaces';

interface MobileScreenProps {
  currentScreen: ScreenType;
  screens: ScreenType[];
  apps: DesktopIcon[];
  onAppTap: (app: DesktopIcon) => void;
  onGoBack: () => void;
}

export const MobileScreen: React.FC<MobileScreenProps> = ({
  currentScreen,
  screens,
  apps,
  onAppTap,
  onGoBack
}) => {
  const renderAppIcon = (app: DesktopIcon) => {
    const baseStyle = "w-16 h-16 flex items-center justify-center rounded-xl text-white text-3xl shadow-lg";
    let iconElement: React.ReactNode;
    let bgColor = 'bg-gray-400';

    switch(app.icon) {
      case 'folder': iconElement = <FaFolder />; bgColor = 'bg-blue-400'; break;
      case 'pdf': iconElement = <FaFilePdf />; bgColor = 'bg-red-500'; break;
      case 'trash': iconElement = <FaTrash />; bgColor = 'bg-gray-500'; break;
      case 'finder': iconElement = <FaFolderOpen />; bgColor = 'bg-sky-400'; break;
      case 'app-generic': iconElement = app.name[0]; bgColor = 'bg-gradient-to-br from-purple-400 to-pink-500'; break;
      default: iconElement = app.name[0]; bgColor = 'bg-gradient-to-br from-green-400 to-blue-500';
    }

    return <div className={`${baseStyle} ${bgColor}`}>{iconElement}</div>;
  };

  return (
    <>
      {currentScreen.type === 'home' ? (
        <div className="p-4 grid grid-cols-4 gap-y-6 gap-x-4 mt-2">
          {apps.slice(0, 16).map((app) => (
            <div key={app.id} className="flex flex-col items-center text-center group" onClick={() => onAppTap(app)}>
              <div className="transform transition-transform group-active:scale-90">
                {renderAppIcon(app)}
              </div>
              <span className="text-xs mt-1.5 text-white font-medium shadow-black/50 text-shadow-sm w-16 truncate">{app.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col h-full bg-white rounded-t-2xl shadow-xl overflow-hidden mt-1">
          <div className="flex items-center h-11 bg-gray-50 border-b border-gray-200 px-2 flex-shrink-0">
            {screens.length > 1 ? (
              <button onClick={onGoBack} className="text-blue-500 text-sm px-2 py-1 rounded hover:bg-gray-200 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back
              </button>
            ) : <div className="w-16"></div>}
            <span className="flex-1 text-center font-semibold text-sm truncate px-2">{currentScreen.title}</span>
            <div className="w-16"></div>
          </div>
          <div className="flex-1 overflow-auto">{currentScreen.content}</div>
        </div>
      )}
    </>
  );
};
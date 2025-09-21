import React from 'react';
import { FaSafari, FaEnvelope, FaComment, FaMusic } from 'react-icons/fa';

interface MobileDockProps {
  onOpenScreen: (type: 'pdf' | 'browser' | 'other', title: string, pdfPath?: string) => void;
}

export const MobileDock: React.FC<MobileDockProps> = ({ onOpenScreen }) => {
  const mobileDockItems = [
    { id: 'safari', icon: <FaSafari className="w-7 h-7"/>, name: 'Safari' },
    { id: 'mail', icon: <FaEnvelope className="w-7 h-7"/>, name: 'Mail' },
    { id: 'messages', icon: <FaComment className="w-7 h-7"/>, name: 'Messages' },
    { id: 'music', icon: <FaMusic className="w-7 h-7"/>, name: 'Music' },
  ];

  return (
    <div className="h-24 flex justify-center items-center px-2 flex-shrink-0">
      <div className="bg-white/30 backdrop-blur-lg rounded-2xl p-2 flex justify-around items-center w-full max-w-xs shadow-lg space-x-2">
        {mobileDockItems.map((item) => (
          <button
            key={item.id}
            className="flex flex-col items-center justify-center text-gray-800 w-14 h-14 rounded-lg transform transition-transform active:scale-90 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={() => item.id === 'safari' ? onOpenScreen('browser', item.name) : onOpenScreen('other', item.name)}
            title={item.name}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
};
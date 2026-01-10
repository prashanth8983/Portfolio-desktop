import React, { useState } from 'react';
import { Cross2Icon, InfoCircledIcon } from '@radix-ui/react-icons';

interface NotificationData {
  id: number;
  title: string;
  message: string;
}

const defaultNotifications: NotificationData[] = [
  {
    id: 1,
    title: "Welcome to Prashanth's Portfolio",
    message: "Click on Guest User to explore the desktop.",
  },
  {
    id: 2,
    title: "macOS Inspired Web App",
    message: "Use fullscreen for the best experience (top-right).",
  },
];

export default function Notification() {
  const [notifications, setNotifications] = useState<NotificationData[]>(defaultNotifications);
  const [visible, setVisible] = useState(false);

  // Trigger animation after mount
  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-10 right-6 z-50 flex flex-col gap-3 items-end pointer-events-none">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`
            pointer-events-auto transition-all duration-700 ease-out transform
            ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-32'}
          `}
          style={{ transitionDelay: `${index * 150 + 200}ms` }}
        >
          {/* Lock Screen Style Message Pill */}
          <div className="relative group bg-black/20 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl px-6 py-3 flex flex-col items-start space-y-0.5 select-none hover:bg-black/30 transition-colors cursor-default w-80 md:w-96">

            {/* Title Line */}
            <p className="text-white/90 text-sm font-medium tracking-wide drop-shadow-md flex items-center gap-2">
              <InfoCircledIcon width={14} height={14} className="text-white/80" />
              {notification.title}
            </p>

            {/* Message Line */}
            <p className="text-white/60 text-xs drop-shadow-md pl-6 leading-relaxed">
              {notification.message}
            </p>

            {/* Subtle Close Button (Top Right) */}
            <button
              onClick={() => handleClose(notification.id)}
              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <div className="bg-white/10 hover:bg-white/20 rounded-full p-0.5 backdrop-blur-sm">
                <Cross2Icon width={10} height={10} className="text-white/80" />
              </div>
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}

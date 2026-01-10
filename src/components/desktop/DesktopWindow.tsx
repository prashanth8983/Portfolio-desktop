import React from 'react';
import { Window as WindowType } from '../../types/interfaces';

interface DesktopWindowProps {
  window: WindowType;
  onMouseDown: (id: string, e: React.MouseEvent) => void;
  onResizeMouseDown: (id: string, e: React.MouseEvent) => void;
  onClose: (id: string, e: React.MouseEvent) => void;
  onMinimize: (id: string, e: React.MouseEvent) => void;
  onToggleFullscreen: (id: string, e: React.MouseEvent) => void;
  draggingWindow: string | null;
  resizingWindow: string | null;
}

export const DesktopWindow: React.FC<DesktopWindowProps> = ({
  window,
  onMouseDown,
  onResizeMouseDown,
  onClose,
  onMinimize,
  onToggleFullscreen,
  draggingWindow,
  resizingWindow
}) => {
  if (window.isMinimized) return null;

  // Special styling for "About This Mac" to mimic native look
  const isAboutWindow = window.id === 'about';

  return (
    <div
      className={`
        absolute rounded-lg shadow-2xl overflow-hidden flex flex-col
        ${isAboutWindow
          ? ((React.isValidElement(window.content) && (window.content as any).props?.isDark) ? 'bg-[#1e1e1e] border border-black/50' : 'bg-[#e8e8e8] border border-gray-300')
          : 'bg-gray-200 border border-gray-400/50'}
        transition-transform duration-100 ease-out
        ${window.isFullscreen ? 'left-0 top-6 w-full h-[calc(100vh-12px-66px)] rounded-none border-none !transform-none' : ''}
        ${(draggingWindow === window.id || resizingWindow === window.id) ? 'transition-none' : ''}
      `}
      style={{
        left: window.isFullscreen ? undefined : `${window.position.x}px`,
        top: window.isFullscreen ? undefined : `${window.position.y}px`,
        width: window.isFullscreen ? undefined : `${window.size.width}px`,
        height: window.isFullscreen ? undefined : `${window.size.height}px`,
        zIndex: window.zIndex,
      }}
      onMouseDown={() => onMouseDown(window.id, {} as React.MouseEvent)}
    >
      {/* Title Bar or Traffic Lights Area */}
      <div
        className={`
          flex items-center px-2 cursor-grab active:cursor-grabbing shrink-0 z-50
          ${isAboutWindow ? 'absolute top-0 left-0 w-full h-12 bg-transparent' : 'h-7 bg-gradient-to-b from-gray-300 to-gray-200 border-b border-gray-400/60 relative'}
        `}
        onMouseDown={(e) => onMouseDown(window.id, e)}
        onDoubleClick={(e) => !window.isFullscreen && onToggleFullscreen(window.id, e)}
      >
        <div className={`flex space-x-1.5 mr-3 flex-shrink-0 ${isAboutWindow ? 'mt-0 ml-2' : ''}`}>
          <button className="w-3 h-3 bg-red-500 rounded-full border border-red-600/50 hover:bg-red-600 focus:outline-none shadow-sm" onClick={(e) => onClose(window.id, e)} onMouseDown={e => e.stopPropagation()} />
          <button className="w-3 h-3 bg-yellow-500 rounded-full border border-yellow-600/50 hover:bg-yellow-600 focus:outline-none shadow-sm" onClick={(e) => onMinimize(window.id, e)} onMouseDown={e => e.stopPropagation()} />
          <button className="w-3 h-3 bg-green-500 rounded-full border border-green-600/50 hover:bg-green-600 focus:outline-none shadow-sm" onClick={(e) => onToggleFullscreen(window.id, e)} onMouseDown={e => e.stopPropagation()} />
        </div>

        {!isAboutWindow && (
          <div className="flex-1 text-center text-xs font-medium text-gray-700 truncate select-none">
            {window.title}
          </div>
        )}
        {!isAboutWindow && <div className="w-12 flex-shrink-0"></div>}
      </div>

      <div className={`flex-1 overflow-hidden ${isAboutWindow ? 'bg-transparent pt-0' : 'bg-white'}`}>
        {window.content}
      </div>

      {!window.isFullscreen && (
        <div
          className="absolute bottom-2 right-0 w-4 h-4 cursor-nwse-resize z-10 group"
          onMouseDown={(e) => onResizeMouseDown(window.id, e)}
        >
          <svg className="w-full h-full opacity-30 group-hover:opacity-60 transition-opacity" fill="gray" viewBox="0 0 10 10"><path d="M 0 10 L 10 10 L 10 0 Z" /></svg>
        </div>
      )}
    </div>
  );
};
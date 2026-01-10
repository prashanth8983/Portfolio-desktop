import React, { useState } from 'react';
import { Window as WindowType } from '../../types/interfaces';
import { useTheme } from '../../contexts/ThemeContext';
import { IoClose, IoRemove, IoExpand, IoContract } from 'react-icons/io5';

interface WindowProps {
    window: WindowType;
    isActive: boolean;
    onClose: (id: string, e: React.MouseEvent) => void;
    onMinimize: (id: string, e: React.MouseEvent) => void;
    onMaximize: (id: string, e: React.MouseEvent) => void;
    onFocus: (id: string) => void;
    onDragStart: (id: string, e: React.MouseEvent) => void;
    onResizeStart: (id: string, e: React.MouseEvent, direction: string) => void;
}

export const Window: React.FC<WindowProps> = ({
    window,
    isActive,
    onClose,
    onMinimize,
    onMaximize,
    onFocus,
    onDragStart,
    onResizeStart,
}) => {
    const [isHoveringControls, setIsHoveringControls] = useState(false);
    const { isDark } = useTheme();

    // Check for special window types that need different styling
    const isTerminal = window.type === 'terminal';
    const isFinder = window.type === 'finder';
    const isBrowser = window.type === 'browser';
    const isPreview = window.type === 'preview';
    const isTextEdit = window.type === 'textedit';
    const isCalculator = window.title === 'Calculator';

    // Traffic Lights Component with react-icons
    const TrafficLights = ({ className = '', size = 'normal' }: { className?: string; size?: 'normal' | 'large' }) => {
        const buttonSize = size === 'large' ? 'w-[14px] h-[14px]' : 'w-3 h-3';
        const iconSize = size === 'large' ? 8 : 6;

        return (
            <div
                className={`traffic-lights flex gap-2 z-50 ${className}`}
                onMouseEnter={() => setIsHoveringControls(true)}
                onMouseLeave={() => setIsHoveringControls(false)}
            >
                <button
                    className={`${buttonSize} rounded-full flex items-center justify-center transition-all duration-150 border
                        ${!isActive && !isHoveringControls
                            ? isDark ? 'bg-[#4a4a4a] border-[#3a3a3a]' : 'bg-[#d1d1d1] border-[#c1c1c1]'
                            : 'bg-[#FF5F57] border-[#E0443E] hover:bg-[#FF4136]'
                        }
                    `}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose(window.id, e);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label="Close"
                >
                    {isHoveringControls && (
                        <IoClose className="text-black/60" style={{ width: iconSize, height: iconSize }} />
                    )}
                </button>
                <button
                    className={`${buttonSize} rounded-full flex items-center justify-center transition-all duration-150 border
                        ${!isActive && !isHoveringControls
                            ? isDark ? 'bg-[#4a4a4a] border-[#3a3a3a]' : 'bg-[#d1d1d1] border-[#c1c1c1]'
                            : 'bg-[#FFBD2E] border-[#DEA123] hover:bg-[#FFB000]'
                        }
                    `}
                    onClick={(e) => {
                        e.stopPropagation();
                        onMinimize(window.id, e);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label="Minimize"
                >
                    {isHoveringControls && (
                        <IoRemove className="text-black/60" style={{ width: iconSize, height: iconSize }} />
                    )}
                </button>
                <button
                    className={`${buttonSize} rounded-full flex items-center justify-center transition-all duration-150 border
                        ${!isActive && !isHoveringControls
                            ? isDark ? 'bg-[#4a4a4a] border-[#3a3a3a]' : 'bg-[#d1d1d1] border-[#c1c1c1]'
                            : isCalculator
                                ? 'bg-[#4a4a4a] border-[#3a3a3a]' // Disabled for Calculator
                                : 'bg-[#28C940] border-[#1AAB29] hover:bg-[#1DB954]'
                        }
                    `}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isCalculator) return; // Calculator has fixed size
                        onMaximize(window.id, e);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label={window.isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    disabled={isCalculator}
                >
                    {isHoveringControls && !isCalculator && (
                        window.isFullscreen
                            ? <IoContract className="text-black/60" style={{ width: iconSize, height: iconSize }} />
                            : <IoExpand className="text-black/60" style={{ width: iconSize, height: iconSize }} />
                    )}
                </button>
            </div>
        );
    };

    // For Finder windows - render with integrated traffic lights (Tahoe style)
    if (isFinder) {
        return (
            <div
                className="absolute flex flex-col overflow-hidden rounded-xl"
                style={{
                    left: window.isFullscreen ? 4 : `${window.position.x}px`,
                    top: window.isFullscreen ? '32px' : `${window.position.y}px`,
                    width: window.isFullscreen ? 'calc(100% - 8px)' : `${window.size.width}px`,
                    height: window.isFullscreen ? 'calc(100vh - 32px - 84px)' : `${window.size.height}px`,
                    zIndex: window.zIndex,
                    boxShadow: isActive
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.1)'
                        : '0 10px 40px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                }}
                onMouseDown={() => onFocus(window.id)}
            >
                {/* Finder Content - Finder handles its own layout */}
                <div className="flex-1 overflow-hidden relative">
                    {window.content}
                </div>

                {/* Draggable area - covers sidebar top and main content top */}
                <div
                    className="absolute top-0 left-0 right-0 h-[52px] cursor-grab active:cursor-grabbing z-40"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onDragStart(window.id, e);
                    }}
                    onDoubleClick={(e) => onMaximize(window.id, e)}
                />

                {/* Traffic Lights - Positioned in sidebar area, higher z-index to be clickable */}
                <div className="absolute top-[17px] left-[18px] z-[60]">
                    <TrafficLights size="large" />
                </div>

                {/* Resize Handles */}
                {!window.isFullscreen && (
                    <>
                        <div className="absolute top-0 left-2 right-2 h-1 cursor-ns-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'n')} />
                        <div className="absolute bottom-0 left-2 right-2 h-1 cursor-ns-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 's')} />
                        <div className="absolute left-0 top-2 bottom-2 w-1 cursor-ew-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'w')} />
                        <div className="absolute right-0 top-2 bottom-2 w-1 cursor-ew-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'e')} />
                        <div className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'nw')} />
                        <div className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'ne')} />
                        <div className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'sw')} />
                        <div className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'se')} />
                    </>
                )}
            </div>
        );
    }

    // For Browser windows - render with integrated traffic lights in toolbar (Safari style)
    if (isBrowser) {
        return (
            <div
                className="absolute flex flex-col overflow-hidden rounded-xl"
                style={{
                    left: window.isFullscreen ? 4 : `${window.position.x}px`,
                    top: window.isFullscreen ? '32px' : `${window.position.y}px`,
                    width: window.isFullscreen ? 'calc(100% - 8px)' : `${window.size.width}px`,
                    height: window.isFullscreen ? 'calc(100vh - 32px - 84px)' : `${window.size.height}px`,
                    zIndex: window.zIndex,
                    boxShadow: isActive
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.1)'
                        : '0 10px 40px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                }}
                onMouseDown={() => onFocus(window.id)}
            >
                {/* Browser Content - Browser handles its own layout with traffic lights */}
                <div className="flex-1 overflow-hidden relative">
                    {window.content}
                </div>

                {/* Draggable area - covers toolbar area */}
                <div
                    className="absolute top-0 left-0 right-0 h-[52px] cursor-grab active:cursor-grabbing z-40"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onDragStart(window.id, e);
                    }}
                    onDoubleClick={(e) => onMaximize(window.id, e)}
                />

                {/* Traffic Lights - Positioned in toolbar area, higher z-index to be clickable */}
                <div className="absolute top-[18px] left-[14px] z-[60]">
                    <TrafficLights />
                </div>

                {/* Resize Handles */}
                {!window.isFullscreen && (
                    <>
                        <div className="absolute top-0 left-2 right-2 h-1 cursor-ns-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'n')} />
                        <div className="absolute bottom-0 left-2 right-2 h-1 cursor-ns-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 's')} />
                        <div className="absolute left-0 top-2 bottom-2 w-1 cursor-ew-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'w')} />
                        <div className="absolute right-0 top-2 bottom-2 w-1 cursor-ew-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'e')} />
                        <div className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'nw')} />
                        <div className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'ne')} />
                        <div className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'sw')} />
                        <div className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'se')} />
                    </>
                )}
            </div>
        );
    }

    // For Preview windows - render with integrated traffic lights in toolbar (macOS Preview style)
    if (isPreview) {
        return (
            <div
                className="absolute flex flex-col overflow-hidden rounded-xl border border-black/10"
                style={{
                    left: window.isFullscreen ? 4 : `${window.position.x}px`,
                    top: window.isFullscreen ? '32px' : `${window.position.y}px`,
                    width: window.isFullscreen ? 'calc(100% - 8px)' : `${window.size.width}px`,
                    height: window.isFullscreen ? 'calc(100vh - 32px - 84px)' : `${window.size.height}px`,
                    zIndex: window.zIndex,
                    boxShadow: isActive
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.1)'
                        : '0 10px 40px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                }}
                onMouseDown={() => onFocus(window.id)}
            >
                {/* Draggable toolbar area - only the center portion between traffic lights and buttons */}
                <div
                    className="absolute top-0 left-[72px] right-[180px] h-12 cursor-grab active:cursor-grabbing z-[100]"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onDragStart(window.id, e);
                    }}
                    onDoubleClick={(e) => onMaximize(window.id, e)}
                />

                {/* Preview Content - Preview handles its own layout */}
                <div className="flex-1 overflow-hidden relative">
                    {window.content}
                </div>

                {/* Traffic Lights - Positioned in toolbar area */}
                <div className="absolute top-[15px] left-[14px] z-[60]">
                    <TrafficLights />
                </div>

                {/* Resize Handles */}
                {!window.isFullscreen && (
                    <>
                        <div className="absolute top-0 left-2 right-2 h-1 cursor-ns-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'n')} />
                        <div className="absolute bottom-0 left-2 right-2 h-1 cursor-ns-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 's')} />
                        <div className="absolute left-0 top-2 bottom-2 w-1 cursor-ew-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'w')} />
                        <div className="absolute right-0 top-2 bottom-2 w-1 cursor-ew-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'e')} />
                        <div className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'nw')} />
                        <div className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'ne')} />
                        <div className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'sw')} />
                        <div className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'se')} />
                    </>
                )}
            </div>
        );
    }

    // For TextEdit windows - render with its own custom title bar (macOS TextEdit style)
    // TextEdit handles its own traffic lights, title bar, and styling
    if (isTextEdit) {
        return (
            <div
                className="absolute flex flex-col overflow-hidden"
                style={{
                    left: window.isFullscreen ? 4 : `${window.position.x}px`,
                    top: window.isFullscreen ? '32px' : `${window.position.y}px`,
                    width: window.isFullscreen ? 'calc(100% - 8px)' : `${window.size.width}px`,
                    height: window.isFullscreen ? 'calc(100vh - 32px - 84px)' : `${window.size.height}px`,
                    zIndex: window.zIndex,
                    boxShadow: isActive
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.1)'
                        : '0 10px 40px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                }}
                onMouseDown={() => onFocus(window.id)}
            >
                {/* TextEdit Content - TextEdit handles its own layout with custom title bar and traffic lights */}
                <div className="flex-1 overflow-hidden relative">
                    {window.content}
                </div>

                {/* Draggable area - covers title bar area, but allows traffic lights clicks through */}
                <div
                    className="absolute top-0 left-[72px] right-0 h-12 cursor-grab active:cursor-grabbing z-40"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onDragStart(window.id, e);
                    }}
                    onDoubleClick={(e) => onMaximize(window.id, e)}
                />

                {/* Resize Handles */}
                {!window.isFullscreen && (
                    <>
                        <div className="absolute top-0 left-2 right-2 h-1 cursor-ns-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'n')} />
                        <div className="absolute bottom-0 left-2 right-2 h-1 cursor-ns-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 's')} />
                        <div className="absolute left-0 top-2 bottom-2 w-1 cursor-ew-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'w')} />
                        <div className="absolute right-0 top-2 bottom-2 w-1 cursor-ew-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'e')} />
                        <div className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'nw')} />
                        <div className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'ne')} />
                        <div className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'sw')} />
                        <div className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-20" onMouseDown={(e) => onResizeStart(window.id, e, 'se')} />
                    </>
                )}
            </div>
        );
    }

    // Default window styling for other apps
    const getWindowBackground = () => {
        if (isTerminal) return 'bg-[#1e1e1e]';
        if (isCalculator) return 'bg-[#1c1c1c]';
        if (isDark) return isActive ? 'bg-[#292929]' : 'bg-[#323232]';
        return isActive ? 'bg-[#f6f6f6]' : 'bg-[#e8e8e8]';
    };

    const getTitleBarBackground = () => {
        if (isTerminal) return 'bg-[#323232]';
        if (isCalculator) return 'bg-[#1c1c1c]';
        if (isDark) return isActive ? 'bg-[#3d3d3d]' : 'bg-[#404040]';
        return isActive ? 'bg-[#e8e8e8]' : 'bg-[#dcdcdc]';
    };

    // Check if window needs dark text styling
    const needsDarkWindowStyle = isTerminal || isCalculator;

    return (
        <div
            className={`absolute flex flex-col overflow-hidden rounded-[10px]
                ${getWindowBackground()}
                ${needsDarkWindowStyle ? 'text-white' : isDark ? 'text-white' : 'text-black'}
                ${needsDarkWindowStyle || isDark ? 'border border-white/10' : 'border border-black/10'}
            `}
            style={{
                left: window.isFullscreen ? 4 : `${window.position.x}px`,
                top: window.isFullscreen ? '32px' : `${window.position.y}px`,
                width: window.isFullscreen ? 'calc(100% - 8px)' : `${window.size.width}px`,
                height: window.isFullscreen ? 'calc(100vh - 32px - 84px)' : `${window.size.height}px`,
                zIndex: window.zIndex,
                boxShadow: isActive
                    ? '0 22px 70px 4px rgba(0, 0, 0, 0.35), 0 0 0 0.5px rgba(0, 0, 0, 0.15)'
                    : '0 8px 30px 2px rgba(0, 0, 0, 0.2), 0 0 0 0.5px rgba(0, 0, 0, 0.1)',
            }}
            onMouseDown={() => onFocus(window.id)}
        >
            {/* Title Bar */}
            <div
                className={`h-[52px] flex items-center px-4 select-none relative w-full flex-shrink-0
                    ${getTitleBarBackground()}
                    ${!needsDarkWindowStyle && (isDark
                        ? 'border-b border-white/10'
                        : 'border-b border-black/10'
                    )}
                `}
                onMouseDown={(e) => {
                    if ((e.target as HTMLElement).closest('.traffic-lights')) return;
                    e.preventDefault();
                    onDragStart(window.id, e);
                }}
                onDoubleClick={(e) => {
                    if ((e.target as HTMLElement).closest('.traffic-lights')) return;
                    if (isCalculator) return; // Calculator has fixed size
                    onMaximize(window.id, e);
                }}
            >
                <TrafficLights />

                {/* Window Title - centered */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className={`text-[13px] font-medium truncate max-w-[60%]
                        ${needsDarkWindowStyle
                            ? 'text-gray-300'
                            : isDark
                                ? (isActive ? 'text-gray-200' : 'text-gray-400')
                                : (isActive ? 'text-gray-700' : 'text-gray-400')
                        }
                    `}>
                        {window.title}
                    </span>
                </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
                {window.content}
            </div>

            {/* Resize Handles - disabled for Calculator (fixed size) */}
            {!window.isFullscreen && !isCalculator && (
                <>
                    <div className="absolute top-0 left-2 right-2 h-1 cursor-ns-resize" onMouseDown={(e) => onResizeStart(window.id, e, 'n')} />
                    <div className="absolute bottom-0 left-2 right-2 h-1 cursor-ns-resize" onMouseDown={(e) => onResizeStart(window.id, e, 's')} />
                    <div className="absolute left-0 top-2 bottom-2 w-1 cursor-ew-resize" onMouseDown={(e) => onResizeStart(window.id, e, 'w')} />
                    <div className="absolute right-0 top-2 bottom-2 w-1 cursor-ew-resize" onMouseDown={(e) => onResizeStart(window.id, e, 'e')} />
                    <div className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize" onMouseDown={(e) => onResizeStart(window.id, e, 'nw')} />
                    <div className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize" onMouseDown={(e) => onResizeStart(window.id, e, 'ne')} />
                    <div className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize" onMouseDown={(e) => onResizeStart(window.id, e, 'sw')} />
                    <div className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize" onMouseDown={(e) => onResizeStart(window.id, e, 'se')} />
                </>
            )}
        </div>
    );
};

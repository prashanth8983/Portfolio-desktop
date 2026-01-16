import React from 'react';
import { Window as WindowType } from '../../types/interfaces';
import { useTheme } from '../../contexts/ThemeContext';


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
    const { isDark } = useTheme();

    // Check for special window types that need different styling
    const isTerminal = window.type === 'terminal';
    const isFinder = window.type === 'finder';
    const isBrowser = window.type === 'browser';
    const isPreview = window.type === 'preview';
    const isTextEdit = window.type === 'textedit' || window.type === 'feedback';
    const isCalculator = window.title === 'Calculator';

    // Traffic Lights Component with custom SVGs
    const TrafficLights = ({ className = '', size = 'normal' }: { className?: string; size?: 'normal' | 'large' }) => {
        const buttonSize = size === 'large' ? 'w-[14px] h-[14px]' : 'w-3 h-3';
        const iconSize = size === 'large' ? 'w-2 h-2' : 'w-1.5 h-1.5';

        // Custom icons for the buttons
        const CloseIcon = () => (
            <svg className={`${iconSize} text-[#4c0002] opacity-0 group-hover:opacity-100 transition-opacity`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        );

        const MinimizeIcon = () => (
            <svg className={`${iconSize} text-[#5c4002] opacity-0 group-hover:opacity-100 transition-opacity`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        );

        const MaximizeIcon = () => {
            // If window is resizable/maximizable but not calculator
            if (isCalculator) return null; // Or show nothing

            // Expand/Contract arrows (diagonal top-left to bottom-right)
            return (
                <svg className={`${iconSize} text-[#004d05] opacity-0 group-hover:opacity-100 transition-opacity`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    {window.isFullscreen ? (
                        /* Arrows pointing inward (Contract) - Top-Left and Bottom-Right meeting center */
                        <>
                            <polyline points="4 10 10 10 10 4"></polyline>
                            <polyline points="20 14 14 14 14 20"></polyline>
                            <line x1="10" y1="10" x2="3" y2="3"></line>
                            <line x1="14" y1="14" x2="21" y2="21"></line>
                        </>
                    ) : (
                        /* Arrows pointing outward (Expand) - Top-Left and Bottom-Right moving away */
                        <>
                            <polyline points="9 3 3 3 3 9"></polyline>
                            <polyline points="15 21 21 21 21 15"></polyline>
                            <line x1="3" y1="3" x2="10" y2="10"></line>
                            <line x1="21" y1="21" x2="14" y2="14"></line>
                        </>
                    )}
                </svg>
            );
        };

        // Plus Icon for non-expanding windows (About etc), but user asked for "same kind of traffic light but with outward arrow...". 
        // Wait, request says: "use this kind of traffic light [with x, -, +] in all windows which are not supposed to expland like about, other info, settings etc."
        // AND "same kind of traffic light but with outward arrow chevero left and right kind but diagonal from top left and bittom right [for regular windows]"

        const ZoomIcon = () => (
            <svg className={`${iconSize} text-[#004d05] opacity-0 group-hover:opacity-100 transition-opacity`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        );

        // Determine which icon to show for green button
        const isStandardWindow = isBrowser || isFinder || isTerminal || isPreview || isTextEdit;
        const GreenButtonIcon = isStandardWindow && !isCalculator ? MaximizeIcon : ZoomIcon;

        return (
            <div
                className={`traffic-lights flex gap-2 z-50 group ${className}`}
            >
                {/* Close (Red) */}
                <button
                    className={`${buttonSize} rounded-full flex items-center justify-center transition-all duration-150 border bg-[#FF5F57] border-[#E0443E] active:bg-[#BF4C46] focus:outline-none`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose(window.id, e);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label="Close"
                >
                    <CloseIcon />
                </button>

                {/* Minimize (Yellow) */}
                <button
                    className={`${buttonSize} rounded-full flex items-center justify-center transition-all duration-150 border bg-[#FEBC2E] border-[#D3A125] active:bg-[#C69424] focus:outline-none`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onMinimize(window.id, e);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label="Minimize"
                >
                    <MinimizeIcon />
                </button>

                {/* Zoom/Maximize (Green) */}
                <button
                    className={`${buttonSize} rounded-full flex items-center justify-center transition-all duration-150 border 
                        ${isCalculator ? 'bg-[#28C840] border-[#1AAB29] opacity-50 cursor-default' : 'bg-[#28C840] border-[#1AAB29] active:bg-[#1D9730]'} focus:outline-none`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isCalculator) return;
                        onMaximize(window.id, e);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label="Maximize"
                    disabled={isCalculator}
                >
                    <GreenButtonIcon />
                </button>
            </div>
        );
    };

    // --- Unified Window Rendering Logic ---

    // 1. Determine Window Characteristics
    const isSpecialWindow = window.title === 'About This Mac';
    const isStickyNotes = false; // Deprecated window type logic
    const hasIntegratedTitleBar = isFinder || isBrowser || isPreview || isTextEdit || isSpecialWindow;

    // 2. Determine Styles
    const getWindowClasses = () => {
        const baseClasses = "absolute flex flex-col overflow-hidden rounded-xl transition-shadow duration-200";

        // Special case: About This Mac (custom styling handled purely by props/inner content interaction, but we apply frame here)
        if (isSpecialWindow) {
            // For About This Mac: No background on container (inner has it), specific borders/shadows
            return `${baseClasses} border border-white/20 shadow-2xl ring-1 ring-black/10`;
        }

        // Special case: Sticky Notes
        if (isStickyNotes) {
            return `${baseClasses} shadow-xl`;
        }

        // Standard Apps (Finder, Browser, etc)
        const bgClass = (() => {
            if (isTerminal) return 'bg-[#1e1e1e]';
            if (isCalculator) return 'bg-[#1c1c1c]';
            if (isDark) return isActive ? 'bg-[#292929]' : 'bg-[#323232]';
            return isActive ? 'bg-[#f6f6f6]' : 'bg-[#e8e8e8]';
        })();

        const textClass = (isTerminal || isCalculator || isDark) ? 'text-white' : 'text-black';
        const borderClass = (isTerminal || isCalculator || isDark) ? 'border border-white/10' : 'border border-black/10';

        return `${baseClasses} ${bgClass} ${textClass} ${borderClass}`;
    };

    const getWindowStyle = () => {
        const baseStyle = {
            left: window.isFullscreen ? 4 : `${window.position.x}px`,
            top: window.isFullscreen ? '32px' : `${window.position.y}px`,
            width: window.isFullscreen ? 'calc(100% - 8px)' : `${window.size.width}px`,
            height: window.isFullscreen ? 'calc(100vh - 32px - 84px)' : `${window.size.height}px`,
            zIndex: window.zIndex,
        };

        if (isSpecialWindow || isStickyNotes) {
            // Special styling overrides if needed, but standard position/size logic applies.
            // About This Mac prevents fullscreen usually, but we handle that via inputs.
            return {
                ...baseStyle,
                // Ensure transparent bg so inner glass component works
                background: 'transparent'
            };
        }

        return {
            ...baseStyle,
            boxShadow: isActive
                ? '0 22px 70px 4px rgba(0, 0, 0, 0.35), 0 0 0 0.5px rgba(0, 0, 0, 0.15)'
                : '0 8px 30px 2px rgba(0, 0, 0, 0.2), 0 0 0 0.5px rgba(0, 0, 0, 0.1)',
        };
    };

    // 3. Determine Traffic Light Position
    const getTrafficLightPosition = () => {
        if (isSpecialWindow || isStickyNotes) return "top-[13px] left-[13px]";
        // Integrated title bars (Finder, Browser, etc)
        if (hasIntegratedTitleBar) return "top-[18px] left-[20px]";
        // Standard title bars - relative div handling, this is absolute fallback if needed
        return "top-[18px] left-[20px]";
    };

    return (
        <div
            className={getWindowClasses()}
            style={getWindowStyle()}
            onMouseDown={() => onFocus(window.id)}
        >
            {/* A) Integrated Title Bar (Overlay Traffic Lights + Drag Area) */}
            {hasIntegratedTitleBar && (
                <>
                    {/* Draggable Area */}
                    <div
                        className={`absolute top-0 left-0 right-0 z-40 cursor-grab active:cursor-grabbing
                            ${(isSpecialWindow || isStickyNotes) ? 'h-10' : 'h-[52px]'}
                            ${isPreview ? 'left-[72px] right-[180px]' : '' /* Preview special drag area to preserve toolbar space */}
                        `}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onDragStart(window.id, e);
                        }}
                        onDoubleClick={(e) => {
                            if (!isSpecialWindow) onMaximize(window.id, e);
                        }}
                    />

                    {/* Traffic Lights Overlay */}
                    <div className={`absolute z-[60] ${getTrafficLightPosition()}`}>
                        <TrafficLights size={isFinder ? "large" : "normal"} />
                    </div>
                </>
            )}

            {/* B) Standard Title Bar (Flex container with lights inside) */}
            {!hasIntegratedTitleBar && (
                <div
                    className={`h-[52px] flex items-center px-4 select-none relative w-full flex-shrink-0
                        ${(() => {
                            if (isTerminal) return 'bg-[#323232]';
                            if (isCalculator) return 'bg-[#1c1c1c]';
                            if (isDark) return isActive ? 'bg-[#3d3d3d]' : 'bg-[#404040]';
                            return isActive ? 'bg-[#e8e8e8]' : 'bg-[#dcdcdc]';
                        })()}
                        ${(!(isTerminal || isCalculator) && (isDark ? 'border-b border-white/10' : 'border-b border-black/10'))}
                    `}
                    onMouseDown={(e) => {
                        if ((e.target as HTMLElement).closest('.traffic-lights')) return;
                        e.preventDefault();
                        onDragStart(window.id, e);
                    }}
                    onDoubleClick={(e) => {
                        if ((e.target as HTMLElement).closest('.traffic-lights')) return;
                        if (isCalculator) return;
                        onMaximize(window.id, e);
                    }}
                >
                    <TrafficLights />
                    {/* Title Text */}
                    <span className={`ml-4 text-[13px] font-semibold flex-1 text-center -translate-x-6
                        ${isDark || isTerminal || isCalculator ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                        {window.title}
                    </span>
                </div>
            )}

            {/* C) Content Area */}
            <div className={`flex-1 overflow-hidden relative ${isSpecialWindow ? 'rounded-xl' : ''}`}>
                {window.content}
            </div>

            {/* D) Resize Handles (Only if not fullscreen and not fixed size like Calculator) */}
            {!window.isFullscreen && !isCalculator && (
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
};

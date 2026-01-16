import React, { useState, useEffect } from 'react';
import { IoClose, IoRemove, IoExpand } from 'react-icons/io5';

// --- Types ---
export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'gray';

export type StickyNoteData = {
    id: string;
    content: string;
    color: NoteColor;
    x: number;
    y: number;
    width: number;
    height: number;
    isCollapsed: boolean;
    zIndex: number;
    lastModified: string;
};

export const COLORS: Record<NoteColor, { bg: string; header: string }> = {
    yellow: { bg: 'bg-[#FEFF9C]', header: 'bg-[#EFED85]' },
    blue: { bg: 'bg-[#ADF4FF]', header: 'bg-[#91D6E3]' },
    green: { bg: 'bg-[#B4F8C8]', header: 'bg-[#98DBC6]' },
    pink: { bg: 'bg-[#FFC3D7]', header: 'bg-[#E5A8BD]' },
    purple: { bg: 'bg-[#E6C9FF]', header: 'bg-[#CBAEE3]' },
    gray: { bg: 'bg-[#E0E0E0]', header: 'bg-[#C7C7C7]' },
};

interface DesktopStickyNoteProps {
    note: StickyNoteData;
    onUpdate: (id: string, updates: Partial<StickyNoteData>) => void;
    onDelete: (id: string) => void;
    onFocus: (id: string) => void;
}

export const DesktopStickyNote: React.FC<DesktopStickyNoteProps> = ({ note, onUpdate, onDelete, onFocus }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<string>('');
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, noteX: 0, noteY: 0 });

    useEffect(() => {
        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
            setResizeDirection('');
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                onUpdate(note.id, {
                    x: e.clientX - dragOffset.x,
                    y: e.clientY - dragOffset.y
                });
            }
            if (isResizing && resizeDirection) {
                const deltaX = e.clientX - resizeStart.x;
                const deltaY = e.clientY - resizeStart.y;
                const minWidth = 180;
                const minHeight = 120;

                let newWidth = note.width;
                let newHeight = note.height;
                let newX = note.x;
                let newY = note.y;

                // Handle horizontal resizing
                if (resizeDirection.includes('e')) {
                    newWidth = Math.max(minWidth, resizeStart.width + deltaX);
                }
                if (resizeDirection.includes('w')) {
                    const proposedWidth = resizeStart.width - deltaX;
                    if (proposedWidth >= minWidth) {
                        newWidth = proposedWidth;
                        newX = resizeStart.noteX + deltaX;
                    }
                }

                // Handle vertical resizing
                if (resizeDirection.includes('s')) {
                    newHeight = Math.max(minHeight, resizeStart.height + deltaY);
                }
                if (resizeDirection.includes('n')) {
                    const proposedHeight = resizeStart.height - deltaY;
                    if (proposedHeight >= minHeight) {
                        newHeight = proposedHeight;
                        newY = resizeStart.noteY + deltaY;
                    }
                }

                onUpdate(note.id, { x: newX, y: newY, width: newWidth, height: newHeight });
            }
        };

        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, resizeDirection, dragOffset, resizeStart, note.id, note.x, note.y, note.width, note.height, onUpdate]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent desktop drag
        onFocus(note.id);
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - note.x,
            y: e.clientY - note.y
        });
    };

    const toggleCollapse = () => {
        onUpdate(note.id, { isCollapsed: !note.isCollapsed });
    };

    const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
        e.stopPropagation();
        e.preventDefault();
        onFocus(note.id);
        setIsResizing(true);
        setResizeDirection(direction);
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: note.width,
            height: note.height,
            noteX: note.x,
            noteY: note.y
        });
    };

    return (
        <div
            className={`absolute flex flex-col shadow-xl rounded-[4px] overflow-hidden transition-shadow duration-200 group ${COLORS[note.color].bg} ${isDragging ? 'cursor-grabbing shadow-2xl scale-[1.01]' : ''}`}
            style={{
                left: note.x,
                top: note.y,
                width: note.width,
                height: note.isCollapsed ? 'auto' : note.height,
                zIndex: note.zIndex,
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")'
            }}
            onMouseDown={() => onFocus(note.id)}
        >
            {/* Header / Drag Handle */}
            <div
                className={`h-6 ${COLORS[note.color].header} flex items-center justify-between px-1.5 cursor-grab active:cursor-grabbing border-b border-black/5 shrink-0 group`}
                onMouseDown={handleMouseDown}
                onDoubleClick={toggleCollapse}
            >
                {/* Left Controls */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                        className="w-4 h-4 flex items-center justify-center rounded-[2px] hover:bg-black/10 text-black/60 transition-colors focus:outline-none"
                        title="Close Note"
                    >
                        <IoClose size={12} />
                    </button>
                </div>

                {/* Right Controls (Collapse) */}
                <div className="flex items-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleCollapse(); }}
                        className="w-4 h-4 flex items-center justify-center rounded hover:bg-black/10 text-black/50 transition-colors focus:outline-none"
                    >
                        {note.isCollapsed ? <IoExpand size={10} /> : <IoRemove size={10} />}
                    </button>
                </div>
            </div>

            {/* Note Content */}
            {!note.isCollapsed && (
                <div className="flex-1 flex flex-col min-h-0 relative group">
                    {/* Text Area */}
                    <div
                        className="flex-1 p-4 outline-none text-gray-800 font-medium font-sans text-lg leading-relaxed overflow-y-auto custom-scrollbar cursor-text selection:bg-black/10"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => onUpdate(note.id, { content: e.currentTarget.innerHTML })}
                        dangerouslySetInnerHTML={{ __html: note.content }}
                        style={{ fontFamily: '"Noteworthy", "Comic Sans MS", sans-serif' }}
                        onMouseDown={(e) => e.stopPropagation()} // Allow text selection
                    />

                    {/* Footer / Tools (Visible on Hover) */}
                    <div className="h-8 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/10 to-transparent flex items-end justify-between px-2 pb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="flex space-x-1 pointer-events-auto">
                            {(Object.keys(COLORS) as NoteColor[]).map(c => (
                                <button
                                    key={c}
                                    onClick={(e) => { e.stopPropagation(); onUpdate(note.id, { color: c }); }}
                                    className={`w-4 h-4 rounded-full border border-black/10 shadow-sm hover:scale-110 transition-transform ${COLORS[c].bg}`}
                                />
                            ))}
                        </div>
                        <div className="text-[10px] text-black/40 font-medium select-none">
                            {note.lastModified}
                        </div>
                    </div>
                </div>
            )}
            {/* Resize Handles (only when not collapsed) */}
            {!note.isCollapsed && (
                <>
                    {/* Corner handles */}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 cursor-se-resize opacity-0 group-hover:opacity-100" onMouseDown={(e) => handleResizeMouseDown(e, 'se')} />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 cursor-sw-resize opacity-0 group-hover:opacity-100" onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />
                    <div className="absolute -top-1 -right-1 w-3 h-3 cursor-ne-resize opacity-0 group-hover:opacity-100" onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} />
                    <div className="absolute -top-1 -left-1 w-3 h-3 cursor-nw-resize opacity-0 group-hover:opacity-100" onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} />
                    {/* Edge handles */}
                    <div className="absolute top-0 left-3 right-3 h-1 cursor-n-resize opacity-0 group-hover:opacity-100" onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
                    <div className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize opacity-0 group-hover:opacity-100" onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
                    <div className="absolute left-0 top-6 bottom-3 w-1 cursor-w-resize opacity-0 group-hover:opacity-100" onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
                    <div className="absolute right-0 top-6 bottom-3 w-1 cursor-e-resize opacity-0 group-hover:opacity-100" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
                </>
            )}

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.2);
        }
      `}</style>
        </div>
    );
};

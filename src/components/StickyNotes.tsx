import React, { useState, useEffect } from 'react';
import { IoClose, IoAdd, IoRemove, IoExpand } from 'react-icons/io5';

// --- Types ---
type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'gray';

type StickyNote = {
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

const COLORS: Record<NoteColor, { bg: string; header: string }> = {
    yellow: { bg: 'bg-[#FEFF9C]', header: 'bg-[#EFED85]' },
    blue: { bg: 'bg-[#ADF4FF]', header: 'bg-[#91D6E3]' },
    green: { bg: 'bg-[#B4F8C8]', header: 'bg-[#98DBC6]' },
    pink: { bg: 'bg-[#FFC3D7]', header: 'bg-[#E5A8BD]' },
    purple: { bg: 'bg-[#E6C9FF]', header: 'bg-[#CBAEE3]' },
    gray: { bg: 'bg-[#E0E0E0]', header: 'bg-[#C7C7C7]' },
};

export const StickyNotes: React.FC = () => {
    const [notes, setNotes] = useState<StickyNote[]>(() => {
        const saved = localStorage.getItem('sticky-notes-data');
        if (saved) {
            return JSON.parse(saved);
        }
        return [
            { id: '1', content: '<b>Welcome to Stickies!</b><br><br>• Click the + button to add a new note.<br>• Drag the title bar to move notes.<br>• Double-click the title bar to collapse.', color: 'yellow', x: 20, y: 50, width: 260, height: 240, isCollapsed: false, zIndex: 1, lastModified: new Date().toLocaleTimeString() },
        ];
    });

    const [dragState, setDragState] = useState<{ id: string, startX: number, startY: number, initialX: number, initialY: number } | null>(null);

    useEffect(() => {
        localStorage.setItem('sticky-notes-data', JSON.stringify(notes));
    }, [notes]);

    // --- Handlers ---

    const addNote = () => {
        const newNote: StickyNote = {
            id: Date.now().toString(),
            content: '',
            color: 'yellow',
            x: 20 + ((notes.length * 20) % 200),
            y: 50 + ((notes.length * 20) % 200),
            width: 280,
            height: 250,
            isCollapsed: false,
            zIndex: Math.max(...notes.map(n => n.zIndex), 0) + 1,
            lastModified: new Date().toLocaleTimeString()
        };
        setNotes([...notes, newNote]);
    };

    const deleteNote = (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    const updateNote = (id: string, updates: Partial<StickyNote>) => {
        setNotes(notes.map(n => n.id === id ? { ...n, ...updates, lastModified: new Date().toLocaleTimeString() } : n));
    };

    const bringToFront = (id: string) => {
        const maxZ = Math.max(...notes.map(n => n.zIndex), 0);
        setNotes(notes.map(n => n.id === id ? { ...n, zIndex: maxZ + 1 } : n));
    };

    const toggleCollapse = (id: string) => {
        const note = notes.find(n => n.id === id);
        if (note) updateNote(id, { isCollapsed: !note.isCollapsed });
    };

    // --- Drag Logic ---
    const handleMouseDown = (e: React.MouseEvent, id: string) => {
        // Only drag if clicking the header
        const note = notes.find(n => n.id === id);
        if (!note) return;

        bringToFront(id);
        setDragState({
            id,
            startX: e.clientX,
            startY: e.clientY,
            initialX: note.x,
            initialY: note.y
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragState) return;

        const dx = e.clientX - dragState.startX;
        const dy = e.clientY - dragState.startY;

        updateNote(dragState.id, {
            x: dragState.initialX + dx,
            y: dragState.initialY + dy
        });
    };

    const handleMouseUp = () => {
        setDragState(null);
    };

    return (
        <div
            className="w-full h-full relative overflow-hidden font-sans select-none bg-transparent"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >

            {/* Menu Bar Simulation */}
            <div className="absolute top-0 w-full h-8 bg-white/40 backdrop-blur-md border-b border-white/20 flex items-center px-4 justify-between z-50 text-gray-800 text-xs font-medium shadow-sm">
                <div className="flex items-center space-x-4 ml-14"> {/* ml-14 to clear traffic lights */}
                    <span className="font-bold">Stickies</span>
                    <button onClick={addNote} className="hover:text-black transition-colors focus:outline-none">File</button>
                    <button className="hover:text-black transition-colors focus:outline-none">Edit</button>
                    <button className="hover:text-black transition-colors focus:outline-none">Note</button>
                    <button className="hover:text-black transition-colors focus:outline-none">Window</button>
                    <button className="hover:text-black transition-colors focus:outline-none">Help</button>
                </div>
                <div>
                    <span>{notes.length} Active</span>
                </div>
            </div>

            {/* Workspace */}
            <div className="absolute inset-0 top-8">
                {notes.map(note => (
                    <div
                        key={note.id}
                        className={`absolute flex flex-col shadow-xl rounded-[4px] overflow-hidden transition-shadow duration-200 ${COLORS[note.color].bg} ${dragState?.id === note.id ? 'cursor-grabbing shadow-2xl scale-[1.01]' : ''}`}
                        style={{
                            left: note.x,
                            top: note.y,
                            width: note.width,
                            height: note.isCollapsed ? 'auto' : note.height,
                            zIndex: note.zIndex,
                            // Paper texture effect overlay
                            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")'
                        }}
                        onClick={() => bringToFront(note.id)}
                    >
                        {/* Header / Drag Handle */}
                        <div
                            className={`h-6 ${COLORS[note.color].header} flex items-center justify-between px-1.5 cursor-grab active:cursor-grabbing border-b border-black/5 shrink-0`}
                            onMouseDown={(e) => handleMouseDown(e, note.id)}
                            onDoubleClick={() => toggleCollapse(note.id)}
                        >
                            {/* Left Controls */}
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                                    className="w-4 h-4 flex items-center justify-center rounded-[2px] hover:bg-black/10 text-black/60 transition-colors focus:outline-none"
                                    title="Close Note"
                                >
                                    <IoClose size={12} />
                                </button>
                            </div>

                            {/* Right Controls (Collapse) */}
                            <div className="flex items-center">
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleCollapse(note.id); }}
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
                                    onInput={(e) => updateNote(note.id, { content: e.currentTarget.innerHTML })}
                                    dangerouslySetInnerHTML={{ __html: note.content }}
                                    style={{ fontFamily: '"Noteworthy", "Comic Sans MS", sans-serif' }}
                                />

                                {/* Footer / Tools (Visible on Hover) */}
                                <div className="h-8 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/10 to-transparent flex items-end justify-between px-2 pb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <div className="flex space-x-1 pointer-events-auto">
                                        {(Object.keys(COLORS) as NoteColor[]).map(c => (
                                            <button
                                                key={c}
                                                onClick={() => updateNote(note.id, { color: c })}
                                                className={`w-4 h-4 rounded-full border border-black/10 shadow-sm hover:scale-110 transition-transform ${COLORS[c].bg}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-[10px] text-black/40 font-medium">
                                        {note.lastModified}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Floating Add Button */}
                <button
                    onClick={addNote}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-yellow-400 rounded-full shadow-2xl border border-white/20 flex items-center justify-center text-white hover:bg-yellow-500 hover:scale-105 transition-all z-[100] active:scale-95 focus:outline-none"
                >
                    <IoAdd size={24} />
                </button>
            </div>

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

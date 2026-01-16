import React from 'react';
import { IoAdd, IoTrash } from 'react-icons/io5';
import { StickyNoteData, NoteColor, COLORS } from './desktop/DesktopStickyNote';

interface StickyNotesManagerProps {
    notes: StickyNoteData[];
    onAddNote: () => void;
    onDeleteNote: (id: string) => void;
    onUpdateNote: (id: string, updates: Partial<StickyNoteData>) => void;
    onFocusNote: (id: string) => void;
    onDeleteAllNotes: () => void;
}

export const StickyNotesManager: React.FC<StickyNotesManagerProps> = ({
    notes,
    onAddNote,
    onDeleteNote,
    onUpdateNote,
    onFocusNote,
    onDeleteAllNotes,
}) => {
    const sortedNotes = [...notes].sort((a, b) =>
        new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );

    const getPlainText = (html: string) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    const truncateText = (text: string, maxLength: number = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="flex flex-col h-full bg-[#f5f5f5]">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-b from-[#e8e8e8] to-[#d8d8d8] border-b border-[#b8b8b8]">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onAddNote}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-white to-[#f0f0f0] border border-[#c0c0c0] rounded-md shadow-sm hover:from-[#f8f8f8] hover:to-[#e8e8e8] active:from-[#e0e0e0] active:to-[#d0d0d0] text-sm font-medium text-gray-700"
                    >
                        <IoAdd size={16} />
                        New Note
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                        {notes.length} note{notes.length !== 1 ? 's' : ''}
                    </span>
                    {notes.length > 0 && (
                        <button
                            onClick={onDeleteAllNotes}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Close All Notes"
                        >
                            <IoTrash size={12} />
                            Close All
                        </button>
                    )}
                </div>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-3">
                {notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="text-4xl mb-3">📝</div>
                        <p className="text-sm">No sticky notes yet</p>
                        <button
                            onClick={onAddNote}
                            className="mt-3 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-lg text-sm font-medium transition-colors"
                        >
                            Create your first note
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {sortedNotes.map((note) => (
                            <div
                                key={note.id}
                                className={`relative rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group ${COLORS[note.color].bg}`}
                                style={{
                                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
                                    minHeight: '120px'
                                }}
                                onClick={() => onFocusNote(note.id)}
                            >
                                {/* Header */}
                                <div className={`h-5 ${COLORS[note.color].header} flex items-center justify-between px-2`}>
                                    <span className="text-[10px] text-black/50 font-medium">
                                        {note.lastModified}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                                        className="w-4 h-4 flex items-center justify-center rounded hover:bg-black/10 text-black/40 hover:text-black/70 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete Note"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Content Preview */}
                                <div className="p-3 text-sm text-gray-700" style={{ fontFamily: '"Noteworthy", "Comic Sans MS", sans-serif' }}>
                                    {truncateText(getPlainText(note.content), 80) || <span className="text-gray-400 italic">Empty note</span>}
                                </div>

                                {/* Color Picker (on hover) */}
                                <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {(Object.keys(COLORS) as NoteColor[]).map(c => (
                                        <button
                                            key={c}
                                            onClick={(e) => { e.stopPropagation(); onUpdateNote(note.id, { color: c }); }}
                                            className={`w-4 h-4 rounded-full border border-black/20 shadow-sm hover:scale-125 transition-transform ${COLORS[c].bg} ${note.color === c ? 'ring-2 ring-black/30' : ''}`}
                                            title={c.charAt(0).toUpperCase() + c.slice(1)}
                                        />
                                    ))}
                                </div>

                                {/* Collapsed indicator */}
                                {note.isCollapsed && (
                                    <div className="absolute top-5 right-2 text-[10px] text-black/40 bg-white/50 px-1.5 py-0.5 rounded">
                                        collapsed
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-[#e8e8e8] border-t border-[#c8c8c8] text-xs text-gray-500 flex items-center justify-between">
                <span>Click a note to bring it to front</span>
                <span>Double-click title bar to collapse</span>
            </div>
        </div>
    );
};

export default StickyNotesManager;

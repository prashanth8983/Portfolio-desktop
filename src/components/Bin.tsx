import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
    IoTrashOutline,
    IoGridOutline,
    IoListOutline,
    IoSearch,
    IoDocumentTextOutline,
    IoImageOutline,
    IoVideocamOutline
} from 'react-icons/io5';

interface TrashItem {
    id: string;
    name: string;
    type: 'file' | 'image' | 'video' | 'folder';
    size: string;
    deletedDate: string;
    originalLocation: string;
}

const initialTrashItems: TrashItem[] = [
    { id: '1', name: 'old_resume.pdf', type: 'file', size: '1.2 MB', deletedDate: 'Yesterday, 10:30 AM', originalLocation: 'Documents' },
    { id: '2', name: 'failed_design.png', type: 'image', size: '4.5 MB', deletedDate: 'Today, 9:15 AM', originalLocation: 'Desktop' },
    { id: '3', name: 'unused_clip.mov', type: 'video', size: '125 MB', deletedDate: 'Jan 8, 2026', originalLocation: 'Movies' },
    { id: '4', name: 'Drafts', type: 'folder', size: '--', deletedDate: 'Jan 5, 2026', originalLocation: 'Documents' },
];

export const Bin: React.FC = () => {
    const { isDark } = useTheme();
    const [items, setItems] = useState<TrashItem[]>(initialTrashItems);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleEmptyBin = () => {
        setItems([]);
        setSelectedId(null);
    };

    const handleRestore = () => {
        if (selectedId) {
            setItems(items.filter(i => i.id !== selectedId));
            setSelectedId(null);
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderIcon = (type: string) => {
        switch (type) {
            case 'image': return <IoImageOutline className="w-8 h-8 text-pink-500" />;
            case 'video': return <IoVideocamOutline className="w-8 h-8 text-blue-500" />;
            case 'folder': return <IoTrashOutline className="w-8 h-8 text-blue-400" />; // simplistic folder icon
            default: return <IoDocumentTextOutline className="w-8 h-8 text-slate-500" />;
        }
    };

    return (
        <div className={`flex flex-col h-full w-full font-sans ${isDark ? 'bg-[#1e1e1e] text-slate-100' : 'bg-white text-slate-800'}`}>

            {/* Toolbar */}
            <div className={`h-12 flex items-center justify-between px-4 border-b shrink-0 ${isDark ? 'border-white/10' : 'border-black/5'}`}>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg tracking-tight">Bin</span>
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {items.length} item{items.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleEmptyBin}
                        disabled={items.length === 0}
                        className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors
                            ${items.length === 0
                                ? 'opacity-50 cursor-not-allowed border-transparent'
                                : isDark
                                    ? 'bg-white/10 border-white/5 hover:bg-white/20'
                                    : 'bg-black/5 border-black/5 hover:bg-black/10'
                            }`}
                    >
                        Empty
                    </button>

                    {/* View Switcher */}
                    <div className={`flex p-0.5 rounded-lg border ${isDark ? 'bg-white/10 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                        <button onClick={() => setViewMode('grid')} className={`p-1 rounded-[6px] ${viewMode === 'grid' ? (isDark ? 'bg-gray-600 shadow-sm text-white' : 'bg-white shadow-sm text-black') : ''}`}>
                            <IoGridOutline className="w-4 h-4" />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-1 rounded-[6px] ${viewMode === 'list' ? (isDark ? 'bg-gray-600 shadow-sm text-white' : 'bg-white shadow-sm text-black') : ''}`}>
                            <IoListOutline className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <IoSearch className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-8 pr-3 py-1 rounded-md text-xs w-32 focus:w-48 transition-all outline-none border
                                ${isDark
                                    ? 'bg-white/10 border-white/5 focus:bg-white/15'
                                    : 'bg-slate-100 border-slate-200 focus:bg-white'
                                }`}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4" onClick={() => setSelectedId(null)}>
                {filteredItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                        <IoTrashOutline className="w-16 h-16 mb-2" />
                        <span className="text-sm font-medium">Bin is empty</span>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="flex flex-wrap gap-4">
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
                                className={`w-24 h-28 flex flex-col items-center justify-between p-2 rounded-lg border cursor-pointer transition-all
                                    ${selectedId === item.id
                                        ? 'bg-blue-500/20 border-blue-500/50'
                                        : isDark ? 'border-transparent hover:bg-white/5' : 'border-transparent hover:bg-black/5'
                                    }`}
                            >
                                <div className="flex-1 flex items-center justify-center pointer-events-none">
                                    {renderIcon(item.type)}
                                </div>
                                <span className="text-[11px] text-center w-full truncate px-1 pointer-events-none">{item.name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className={`grid grid-cols-12 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            <div className="col-span-5">Name</div>
                            <div className="col-span-3">Date Deleted</div>
                            <div className="col-span-2">Size</div>
                            <div className="col-span-2">Kind</div>
                        </div>
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
                                className={`grid grid-cols-12 items-center px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors
                                    ${selectedId === item.id
                                        ? 'bg-blue-500 text-white'
                                        : isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'
                                    }`}
                            >
                                <div className="col-span-5 flex items-center gap-2">
                                    <div className="scale-75">{renderIcon(item.type)}</div>
                                    <span className="truncate">{item.name}</span>
                                </div>
                                <div className="col-span-3 opacity-70">{item.deletedDate}</div>
                                <div className="col-span-2 opacity-70 font-mono">{item.size}</div>
                                <div className="col-span-2 opacity-70 capitalize">{item.type}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Bar */}
            {selectedId && (
                <div className={`h-10 border-t flex items-center justify-between px-4 shrink-0 animate-in slide-in-from-bottom-2
                    ${isDark ? 'bg-[#2d2d2d] border-white/10' : 'bg-[#f6f6f6] border-black/5'}`}>
                    <span className="text-xs opacity-60">{items.find(i => i.id === selectedId)?.originalLocation}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={handleRestore}
                            className="text-xs font-medium px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Put Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

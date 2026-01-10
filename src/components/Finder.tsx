import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
    FaFolder,
    FaHdd,
    FaWifi,
    FaGlobe
} from 'react-icons/fa';
import {
    IoChevronBack,
    IoChevronForward,
    IoSearch,
    IoGridOutline,
    IoListOutline,
    IoTimeOutline,
    IoDesktopOutline,
    IoDocumentTextOutline,
    IoDownloadOutline,
    IoCloudOutline,
    IoAppsOutline,
    IoImageOutline,
    IoMusicalNotesOutline,
    IoVideocamOutline,
    IoStarOutline
} from 'react-icons/io5';
import { getIconUrl } from '../utils/icons';
import { projects } from '../data/portfolio';

interface FileItem {
    id: string;
    name: string;
    type: 'folder' | 'file' | 'app' | 'image' | 'pdf' | 'project' | 'audio' | 'video';
    size?: string;
    date?: string;
    icon?: string;
    image?: string;
    color?: string;
    emoji?: string;
}

// Helper to convert projects to FileItems
const projectFiles: FileItem[] = projects.map(p => ({
    id: `project-${p.id}`,
    name: p.title,
    type: 'project',
    size: '--',
    date: 'Oct 2025',
    image: p.image
}));

const initialMockFiles: Record<string, FileItem[]> = {
    'recents': [
        { id: 'resume', name: 'Prashanth Kumar.pdf', type: 'pdf', size: '2.4 MB', date: 'Today, 10:30 AM' },
        { id: 'projects-link', name: 'Projects', type: 'folder', size: '--', date: 'Yesterday', color: 'blue', emoji: '🚀' },
        { id: 'notes', name: 'Meeting Notes.txt', type: 'file', size: '5 KB', date: 'Yesterday' },
        { id: 'design', name: 'Design Assets', type: 'folder', size: '--', date: 'Jan 8, 2026', color: 'purple', emoji: '🎨' },
    ],
    'desktop': [
        { id: 'projects', name: 'Projects', type: 'folder', size: '--', date: 'Oct 24, 2025', color: 'blue', emoji: '🚀' },
        { id: 'documents', name: 'Documents', type: 'folder', size: '--', date: 'Nov 01, 2025', color: 'green', emoji: '📁' },
        { id: 'screenshot', name: 'Screenshot 2025-10-24.png', type: 'image', size: '4.2 MB', date: 'Oct 24, 2025' }
    ],
    'documents': [
        { id: 'resume-doc', name: 'Resume_Draft_v2.docx', type: 'file', size: '1.2 MB', date: 'Nov 01, 2025' },
        { id: 'budget', name: 'Q4 Budget.xlsx', type: 'file', size: '45 KB', date: 'Oct 15, 2025' },
        { id: 'personal', name: 'Personal', type: 'folder', size: '--', date: 'Dec 28, 2025', color: 'green', emoji: '🏠' },
    ],
    'downloads': [
        { id: 'chrome', name: 'googlechrome.dmg', type: 'file', size: '240 MB', date: 'Just now' },
        { id: 'image', name: 'wallpaper.jpg', type: 'image', size: '4.8 MB', date: '1 hour ago' },
        { id: 'video', name: 'WWDC 2026 Keynote.mov', type: 'video', size: '2.4 GB', date: 'Jan 2, 2026' },
        { id: 'audio', name: 'Voice Memo.m4a', type: 'audio', size: '3.5 MB', date: 'Dec 24, 2025' },
    ],
    'applications': [
        { id: 'chrome-app', name: 'Google Chrome', type: 'app', icon: 'chrome' },
        { id: 'safari-app', name: 'Safari', type: 'app', icon: 'safari' },
        { id: 'finder-app', name: 'Finder', type: 'app', icon: 'finder' },
        { id: 'mail-app', name: 'Mail', type: 'app', icon: 'mail' },
        { id: 'photos-app', name: 'Photos', type: 'app', icon: 'photos' },
        { id: 'music-app', name: 'Music', type: 'app', icon: 'music' },
        { id: 'terminal-app', name: 'Terminal', type: 'app', icon: 'terminal' },
    ],
    'projects': projectFiles,
    'icloud': [
        { id: 'cloud-docs', name: 'Cloud Documents', type: 'folder', size: '--', date: 'Dec 15, 2025', color: 'blue', emoji: '☁️' },
    ],
    'mac-hd': [
        { id: 'applications-hd', name: 'Applications', type: 'folder', size: '--', date: '--' },
        { id: 'library', name: 'Library', type: 'folder', size: '--', date: '--' },
        { id: 'system', name: 'System', type: 'folder', size: '--', date: '--', color: 'gray', emoji: '⚙️' },
        { id: 'users', name: 'Users', type: 'folder', size: '--', date: '--' },
    ]
};

interface FinderProps {
    initialDirectory?: string;
}

export const Finder: React.FC<FinderProps> = ({ initialDirectory = 'recents' }) => {
    const { isDark } = useTheme();
    const [currentDirectory, setCurrentDirectory] = useState<string>(initialDirectory);
    const [history, setHistory] = useState<string[]>([initialDirectory]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchFocused, setSearchFocused] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>(initialDirectory);

    const navigateTo = (dirId: string) => {
        if (dirId === currentDirectory) return;
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(dirId);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setCurrentDirectory(dirId);
        setActiveTab(dirId);
    };

    const goBack = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setCurrentDirectory(history[historyIndex - 1]);
            setActiveTab(history[historyIndex - 1]);
        }
    };

    const goForward = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setCurrentDirectory(history[historyIndex + 1]);
            setActiveTab(history[historyIndex + 1]);
        }
    };

    const handleItemDoubleClick = (item: FileItem) => {
        if (item.type === 'folder' && initialMockFiles[item.id]) {
            navigateTo(item.id);
        } else if (item.id === 'projects-link') {
            navigateTo('projects');
        } else if (item.id === 'applications-hd') {
            navigateTo('applications');
        }
    };

    const getDirectoryLabel = (dir: string): string => {
        const labels: Record<string, string> = {
            'recents': 'Recents',
            'applications': 'Applications',
            'desktop': 'Desktop',
            'documents': 'Documents',
            'downloads': 'Downloads',
            'projects': 'Projects',
            'icloud': 'iCloud Drive',
            'mac-hd': 'Macintosh HD',
        };
        return labels[dir] || dir.charAt(0).toUpperCase() + dir.slice(1);
    };

    // Tahoe-style colored folder with flap and emoji
    const FolderIcon = ({ item, size = 'normal' }: { item: FileItem; size?: 'normal' | 'small' }) => {
        const colorMap: Record<string, string> = {
            blue: 'bg-blue-400',
            purple: 'bg-purple-400',
            green: 'bg-emerald-400',
            gray: 'bg-slate-400',
            default: 'bg-blue-400'
        };
        const bgColor = colorMap[item.color || 'default'];
        const isSmall = size === 'small';

        return (
            <div className={`relative ${isSmall ? 'w-12 h-9' : 'w-16 h-12'} ${bgColor} rounded-lg shadow-md flex items-center justify-center transition-transform hover:scale-105`}>
                {/* Folder Flap */}
                <div className={`absolute ${isSmall ? '-top-1 left-0 w-4 h-2' : '-top-2 left-0 w-6 h-3'} ${bgColor} rounded-t-md opacity-80 brightness-90`} />
                {/* Emoji Badge (Tahoe Feature) */}
                {item.emoji && <span className={`${isSmall ? 'text-base' : 'text-xl'} drop-shadow-sm z-10`}>{item.emoji}</span>}
                {!item.emoji && <FaFolder className={`${isSmall ? 'w-5 h-5' : 'w-8 h-8'} opacity-50 text-white`} />}
            </div>
        );
    };

    const renderFileIcon = (item: FileItem, size: 'normal' | 'small' = 'normal') => {
        const isSmall = size === 'small';
        const sizeClass = isSmall ? 'w-10 h-10' : 'w-14 h-16';
        const iconSize = isSmall ? 18 : 24;

        if (item.type === 'folder') {
            return <FolderIcon item={item} size={size} />;
        }

        if (item.type === 'project' && item.image) {
            return <img src={item.image} alt={item.name} className={`${sizeClass} object-cover rounded-lg shadow-md`} />;
        }

        if (item.type === 'app' && item.icon) {
            return <img src={getIconUrl(item.icon)} alt={item.name} className={`${sizeClass} object-contain drop-shadow-md`} />;
        }

        // File type icons - matching the reference style
        const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
            pdf: {
                color: 'text-slate-500',
                icon: <IoDocumentTextOutline size={iconSize + 10} />
            },
            image: {
                color: 'text-pink-500',
                icon: <IoImageOutline size={iconSize + 10} />
            },
            video: {
                color: 'text-blue-500',
                icon: <IoVideocamOutline size={iconSize + 10} />
            },
            audio: {
                color: 'text-purple-500',
                icon: <IoMusicalNotesOutline size={iconSize + 10} />
            },
            file: {
                color: 'text-slate-500',
                icon: <IoDocumentTextOutline size={iconSize + 10} />
            },
            project: {
                color: 'text-indigo-500',
                icon: <IoStarOutline size={iconSize + 10} />
            }
        };

        const config = typeConfig[item.type] || typeConfig.file;

        return (
            <div className={`${sizeClass} bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                <span className={config.color}>{config.icon}</span>
            </div>
        );
    };

    // Sidebar item - compact macOS style
    const SidebarItem = ({
        id,
        icon,
        label,
    }: {
        id: string;
        icon: React.ReactNode;
        label: string;
    }) => {
        const isActive = activeTab === id;
        return (
            <button
                onClick={() => navigateTo(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors
                    ${isActive
                        ? isDark
                            ? 'bg-white/10 text-white'
                            : 'bg-black/8 text-slate-900'
                        : isDark
                            ? 'hover:bg-white/5 text-slate-300'
                            : 'hover:bg-black/5 text-slate-600'
                    }`}
            >
                <span className={`w-4 h-4 flex items-center justify-center ${isActive ? 'opacity-90' : 'opacity-60'}`}>
                    {icon}
                </span>
                {label}
            </button>
        );
    };

    const currentFiles = initialMockFiles[currentDirectory] || [];
    const filteredFiles = searchQuery
        ? currentFiles.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : currentFiles;

    return (
        <div className={`flex h-full w-full font-sans overflow-hidden ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>

            {/* Sidebar - Glass Effect */}
            <div className={`w-[200px] flex-shrink-0 flex flex-col relative
                ${isDark
                    ? 'bg-black/40 backdrop-blur-xl'
                    : 'bg-white/50 backdrop-blur-xl'
                }`}
            >
                {/* Traffic lights space - matches Window.tsx h-14 drag area */}
                <div className="h-[52px] flex-shrink-0" />

                {/* Scrollable sidebar content - z-50 to be above Window drag area */}
                <div className="flex-1 overflow-y-auto px-2 pb-3 relative z-50">
                    {/* Sidebar items */}
                    <div className="space-y-px">
                        <SidebarItem id="recents" icon={<IoTimeOutline className="w-4 h-4" />} label="Recents" />
                        <SidebarItem id="applications" icon={<IoAppsOutline className="w-4 h-4" />} label="Applications" />
                        <SidebarItem id="desktop" icon={<IoDesktopOutline className="w-4 h-4" />} label="Desktop" />
                        <SidebarItem id="documents" icon={<IoDocumentTextOutline className="w-4 h-4" />} label="Documents" />
                        <SidebarItem id="downloads" icon={<IoDownloadOutline className="w-4 h-4" />} label="Downloads" />
                        <SidebarItem id="projects" icon={<IoStarOutline className="w-4 h-4" />} label="Projects" />
                    </div>

                    {/* iCloud Section */}
                    <div className="mt-6 mb-2 px-3">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                            iCloud
                        </span>
                    </div>
                    <div className="space-y-px">
                        <SidebarItem id="icloud" icon={<IoCloudOutline className="w-4 h-4" />} label="iCloud Drive" />
                    </div>

                    {/* Locations Section */}
                    <div className="mt-6 mb-2 px-3">
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                            Locations
                        </span>
                    </div>
                    <div className="space-y-px">
                        <SidebarItem id="mac-hd" icon={<FaHdd className="w-4 h-4" />} label="Macintosh HD" />
                        <button className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors
                            ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-black/5 text-slate-600'}`}
                        >
                            <span className="w-4 h-4 flex items-center justify-center opacity-60"><FaGlobe className="w-3.5 h-3.5" /></span>
                            Network
                        </button>
                        <button className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors
                            ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-black/5 text-slate-600'}`}
                        >
                            <span className="w-4 h-4 flex items-center justify-center opacity-60"><FaWifi className="w-3.5 h-3.5" /></span>
                            AirDrop
                        </button>
                    </div>
                </div>

                {/* Sidebar right border */}
                <div className={`absolute right-0 top-0 bottom-0 w-px ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col overflow-hidden min-w-0
                ${isDark
                    ? 'bg-[#1e1e1e]'
                    : 'bg-white'
                }`}
            >
                {/* Toolbar - matches sidebar header height, z-50 to be above Window drag area */}
                <div className={`h-[52px] px-4 flex items-center justify-between border-b flex-shrink-0 relative z-50
                    ${isDark ? 'border-white/5' : 'border-black/5'}`}
                >
                    <div className="flex items-center gap-6">
                        {/* Navigation */}
                        <div className={`flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            <button
                                onClick={goBack}
                                disabled={historyIndex <= 0}
                                className={`w-5 h-5 flex items-center justify-center transition-colors
                                    ${historyIndex <= 0
                                        ? 'opacity-50 cursor-not-allowed'
                                        : isDark
                                            ? 'hover:text-white cursor-pointer'
                                            : 'hover:text-slate-800 cursor-pointer'
                                    }`}
                            >
                                <IoChevronBack className="w-5 h-5" />
                            </button>
                            <button
                                onClick={goForward}
                                disabled={historyIndex >= history.length - 1}
                                className={`w-5 h-5 flex items-center justify-center transition-colors
                                    ${historyIndex >= history.length - 1
                                        ? 'opacity-50 cursor-not-allowed'
                                        : isDark
                                            ? 'hover:text-white cursor-pointer'
                                            : 'hover:text-slate-800 cursor-pointer'
                                    }`}
                            >
                                <IoChevronForward className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Directory Title */}
                        <span className={`font-bold text-base tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {getDirectoryLabel(currentDirectory)}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Switcher - Segmented Control */}
                        <div className={`flex p-0.5 rounded-lg border
                            ${isDark
                                ? 'bg-white/10 border-white/5'
                                : 'bg-slate-100 border-slate-200'
                            }`}
                        >
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1 rounded-[6px] transition-all
                                    ${viewMode === 'grid'
                                        ? isDark
                                            ? 'bg-gray-600 shadow-sm text-white'
                                            : 'bg-white shadow-sm text-black'
                                        : isDark
                                            ? 'hover:bg-white/10 text-slate-500'
                                            : 'hover:bg-slate-200 text-slate-500'
                                    }`}
                            >
                                <IoGridOutline className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1 rounded-[6px] transition-all
                                    ${viewMode === 'list'
                                        ? isDark
                                            ? 'bg-gray-600 shadow-sm text-white'
                                            : 'bg-white shadow-sm text-black'
                                        : isDark
                                            ? 'hover:bg-white/10 text-slate-500'
                                            : 'hover:bg-slate-200 text-slate-500'
                                    }`}
                            >
                                <IoListOutline className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative group">
                            <IoSearch className={`w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className={`pl-9 pr-3 py-1 rounded-lg border text-sm transition-all duration-300 outline-none
                                    ${searchFocused ? 'w-56' : 'w-40'}
                                    ${isDark
                                        ? 'bg-white/10 border-white/5 text-slate-200 placeholder:text-slate-400 focus:bg-white/15 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                                        : 'bg-slate-100 border-slate-200 text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                                    }`}
                            />
                        </div>
                    </div>
                </div>

                {/* Files View */}
                <div className="flex-1 overflow-y-auto p-5">
                    {filteredFiles.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            <div className={`text-5xl mb-4 ${isDark ? 'grayscale opacity-30' : 'grayscale opacity-40'}`}>
                                📂
                            </div>
                            <div className={`text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {searchQuery ? 'No matching items' : 'Folder is empty'}
                            </div>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="flex flex-wrap content-start gap-2">
                            {filteredFiles.map((file) => (
                                <div
                                    key={file.id}
                                    onDoubleClick={() => handleItemDoubleClick(file)}
                                    className={`group flex flex-col items-center p-2 rounded-xl transition-colors cursor-pointer active:scale-95 duration-100 border border-transparent w-[100px] flex-shrink-0
                                        ${isDark
                                            ? 'hover:bg-blue-500/20 hover:border-blue-500/20'
                                            : 'hover:bg-blue-500/10 hover:border-blue-500/20'
                                        }`}
                                >
                                    <div className="mb-1">
                                        {renderFileIcon(file)}
                                    </div>
                                    <span className={`mt-1 text-[11px] font-medium text-center line-clamp-2 w-full px-1 leading-tight
                                        ${isDark
                                            ? 'text-slate-200 group-hover:text-blue-300'
                                            : 'text-slate-700 group-hover:text-blue-600'
                                        }`}
                                    >
                                        {file.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {/* List Header */}
                            <div className={`grid grid-cols-12 px-4 py-2 text-xs font-semibold border-b mb-1
                                ${isDark
                                    ? 'text-slate-500 border-white/5'
                                    : 'text-slate-400 border-slate-100'
                                }`}
                            >
                                <div className="col-span-6">Name</div>
                                <div className="col-span-3">Date Modified</div>
                                <div className="col-span-2">Size</div>
                                <div className="col-span-1">Kind</div>
                            </div>
                            {filteredFiles.map((file) => (
                                <div
                                    key={file.id}
                                    onDoubleClick={() => handleItemDoubleClick(file)}
                                    className={`grid grid-cols-12 items-center px-4 py-2 rounded-md transition-colors cursor-pointer group
                                        ${isDark
                                            ? 'hover:bg-blue-500/20'
                                            : 'hover:bg-blue-500/10'
                                        } ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                                >
                                    <div className="col-span-6 flex items-center gap-3">
                                        <div className="scale-75 origin-left">{renderFileIcon(file, 'small')}</div>
                                        <span className={`text-[13px] font-medium ${isDark ? 'group-hover:text-blue-300' : 'group-hover:text-blue-600'}`}>
                                            {file.name}
                                        </span>
                                    </div>
                                    <div className={`col-span-3 text-[13px] opacity-70`}>{file.date}</div>
                                    <div className={`col-span-2 text-[13px] opacity-70 font-mono`}>{file.size}</div>
                                    <div className={`col-span-1 text-[13px] opacity-70 capitalize`}>{file.type}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Status Bar */}
                <div className={`h-6 px-4 flex items-center text-[11px] border-t flex-shrink-0
                    ${isDark
                        ? 'text-slate-500 border-white/5'
                        : 'text-slate-400 border-black/5'
                    }`}
                >
                    <span>{filteredFiles.length} item{filteredFiles.length !== 1 ? 's' : ''}</span>
                </div>
            </div>
        </div>
    );
};

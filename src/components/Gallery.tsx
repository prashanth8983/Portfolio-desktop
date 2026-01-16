import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  IoHeart,
  IoHeartOutline,
  IoSearch,
  IoChevronBack,
  IoChevronForward,
  IoImageOutline,
  IoPlayCircleOutline,
  IoLocationOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoShareOutline,
  IoAddOutline,
} from 'react-icons/io5';
import { BsLayoutSidebar, BsGrid3X3Gap, BsAspectRatio } from 'react-icons/bs';

// --- Types ---
type Photo = {
  id: string;
  url: string;
  location: string;
  date: string;
  time: string;
  isFavorite: boolean;
  aspect: 'landscape' | 'portrait';
};

export const Gallery: React.FC = () => {
  const { isDark } = useTheme();
  const [view, setView] = useState<'grid' | 'detail'>('grid');
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('library');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['1', '4', '6']));

  // --- Mock Data ---
  const photos: Photo[] = [
    { id: '1', url: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=1000&auto=format&fit=crop', location: 'Yosemite Valley, CA', date: 'October 24, 2026', time: '5:42 PM', isFavorite: true, aspect: 'landscape' },
    { id: '2', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop', location: 'Highlands, Scotland', date: 'September 12, 2026', time: '2:15 PM', isFavorite: false, aspect: 'landscape' },
    { id: '3', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop', location: 'Alps, Switzerland', date: 'August 5, 2026', time: '10:30 AM', isFavorite: false, aspect: 'portrait' },
    { id: '4', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c7dd1?q=80&w=1000&auto=format&fit=crop', location: 'Glacier Point', date: 'July 20, 2026', time: '6:00 PM', isFavorite: true, aspect: 'landscape' },
    { id: '5', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop', location: 'Malibu, CA', date: 'June 15, 2026', time: '7:45 PM', isFavorite: false, aspect: 'landscape' },
    { id: '6', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop', location: 'Kyoto, Japan', date: 'April 10, 2026', time: '11:20 AM', isFavorite: true, aspect: 'portrait' },
    { id: '7', url: 'https://images.unsplash.com/photo-1533052733633-8c46447814b7?q=80&w=1000&auto=format&fit=crop', location: 'Iceland', date: 'March 22, 2026', time: '3:30 PM', isFavorite: false, aspect: 'landscape' },
    { id: '8', url: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1000&auto=format&fit=crop', location: 'Hurricane Ridge, WA', date: 'February 14, 2026', time: '4:15 PM', isFavorite: false, aspect: 'landscape' },
  ];

  const selectedPhoto = photos.find(p => p.id === selectedPhotoId);
  const currentIdx = selectedPhotoId ? photos.findIndex(p => p.id === selectedPhotoId) : -1;

  // --- Handlers ---
  const openPhoto = (id: string) => {
    setSelectedPhotoId(id);
    setView('detail');
  };

  const nextPhoto = () => {
    if (currentIdx < photos.length - 1) setSelectedPhotoId(photos[currentIdx + 1].id);
  };

  const prevPhoto = () => {
    if (currentIdx > 0) setSelectedPhotoId(photos[currentIdx - 1].id);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const displayPhotos = activeSection === 'favorites'
    ? photos.filter(p => favorites.has(p.id))
    : photos;

  return (
    <div className={`flex flex-col h-full w-full font-sans select-none overflow-hidden ${isDark ? 'bg-[#1e1e1e]' : 'bg-[#F5F5F5]'}`}>

      {/* ========== TOOLBAR (macOS Photos Style) ========== */}
      <div className={`h-[52px] flex items-center px-4 shrink-0 relative
        ${isDark
          ? 'bg-[#2d2d2d]/80 backdrop-blur-xl border-b border-white/10'
          : 'bg-[#F5F5F5]/80 backdrop-blur-xl border-b border-black/10'}`}
      >
        {/* Left Section - Sidebar Toggle & Navigation */}
        <div className="flex items-center gap-3 pl-[56px] relative z-50">
          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-md transition-all ${sidebarOpen
              ? (isDark ? 'bg-white/15 text-white' : 'bg-black/10 text-gray-700')
              : (isDark ? 'text-gray-400 hover:bg-white/10 hover:text-gray-200' : 'text-gray-500 hover:bg-black/5 hover:text-gray-700')}`}
          >
            <BsLayoutSidebar size={16} />
          </button>

          {/* Divider */}
          <div className={`h-4 w-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />

          {/* Navigation Arrows (in detail view) */}
          {view === 'detail' && (
            <div className="flex items-center gap-1">
              <button
                onClick={prevPhoto}
                disabled={currentIdx <= 0}
                className={`p-1 rounded transition-colors disabled:opacity-30 ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5'}`}
              >
                <IoChevronBack size={18} />
              </button>
              <button
                onClick={nextPhoto}
                disabled={currentIdx >= photos.length - 1}
                className={`p-1 rounded transition-colors disabled:opacity-30 ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-black/5'}`}
              >
                <IoChevronForward size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Center - View Tabs (macOS Segmented Control) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <div className={`flex p-0.5 rounded-lg ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
            {['Years', 'Months', 'Days', 'All Photos'].map((tab, i) => (
              <button
                key={tab}
                className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all
                  ${i === 3
                    ? (isDark ? 'bg-[#3d3d3d] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                    : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 ml-auto relative z-50">
          {view === 'detail' && (
            <>
              <button
                onClick={() => selectedPhotoId && toggleFavorite(selectedPhotoId)}
                className={`p-1.5 rounded-md transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
              >
                {selectedPhotoId && favorites.has(selectedPhotoId) ? (
                  <IoHeart size={18} className="text-red-500" />
                ) : (
                  <IoHeartOutline size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                )}
              </button>
              <button className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-black/5'}`}>
                <IoShareOutline size={18} />
              </button>
              <div className={`h-4 w-px mx-1 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
            </>
          )}

          {/* Aspect Ratio / View Toggle */}
          <button className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-black/5'}`}>
            <BsAspectRatio size={16} />
          </button>

          {/* Search */}
          <div className="relative">
            <IoSearch size={14} className={`absolute left-2 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search"
              className={`pl-7 pr-2 py-1 text-xs rounded-md w-28 focus:w-36 transition-all outline-none
                ${isDark
                  ? 'bg-white/10 text-gray-200 placeholder:text-gray-500 focus:bg-white/15 focus:ring-1 focus:ring-blue-500/50'
                  : 'bg-black/5 text-gray-700 placeholder:text-gray-400 focus:bg-white focus:ring-1 focus:ring-blue-500/50'}`}
            />
          </div>
        </div>
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex flex-1 overflow-hidden">

        {/* ========== SIDEBAR ========== */}
        <div
          className={`flex flex-col overflow-hidden shrink-0 transition-all duration-300 ease-in-out
            ${isDark
              ? 'bg-[#252525]/80 backdrop-blur-xl'
              : 'bg-[#F0F0F0]/80 backdrop-blur-xl'}
            ${sidebarOpen ? 'w-[180px] border-r' : 'w-0 border-r-0'}
            ${isDark ? 'border-white/5' : 'border-black/5'}`}
        >
          {/* Spacer for traffic lights area */}
          <div className="h-0 shrink-0" />

          {/* Sidebar Content */}
          <div className={`flex-1 overflow-y-auto px-2 py-3 ${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
            {/* Library Section */}
            <div className="mb-4">
              <h3 className={`text-[10px] font-semibold uppercase tracking-wider px-3 mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Library
              </h3>
              <SidebarItem
                icon={<IoImageOutline size={16} />}
                label="Library"
                active={activeSection === 'library'}
                onClick={() => { setActiveSection('library'); setView('grid'); }}
                isDark={isDark}
              />
              <SidebarItem
                icon={<IoHeartOutline size={16} />}
                label="Favorites"
                active={activeSection === 'favorites'}
                onClick={() => { setActiveSection('favorites'); setView('grid'); }}
                isDark={isDark}
              />
              <SidebarItem
                icon={<IoTimeOutline size={16} />}
                label="Recents"
                active={activeSection === 'recents'}
                onClick={() => { setActiveSection('recents'); setView('grid'); }}
                isDark={isDark}
              />
            </div>

            {/* Media Types Section */}
            <div className="mb-4">
              <h3 className={`text-[10px] font-semibold uppercase tracking-wider px-3 mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Media Types
              </h3>
              <SidebarItem icon={<IoPlayCircleOutline size={16} />} label="Videos" isDark={isDark} />
              <SidebarItem icon={<BsGrid3X3Gap size={14} />} label="Screenshots" isDark={isDark} />
            </div>

            {/* Albums Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between px-3 mb-1">
                <h3 className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Albums
                </h3>
                <button className={`p-0.5 rounded ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                  <IoAddOutline size={14} />
                </button>
              </div>
              <SidebarItem icon={<IoLocationOutline size={16} />} label="Places" isDark={isDark} />
            </div>
          </div>

          {/* Footer Stats */}
          <div className={`px-3 py-3 border-t text-center shrink-0 ${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity
            ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {displayPhotos.length} Photos
            </div>
          </div>
        </div>

        {/* ========== PHOTO CANVAS ========== */}
        <div className={`flex-1 relative overflow-hidden ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>

          {view === 'grid' ? (
            /* ========== GRID VIEW ========== */
            <div className="h-full overflow-y-auto p-4">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {activeSection === 'favorites' ? 'Favorites' : 'All Photos'}
                </h2>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {displayPhotos.length} items
                </span>
              </div>

              {/* Photo Grid */}
              {displayPhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
                  {displayPhotos.map(photo => (
                    <div
                      key={photo.id}
                      onClick={() => openPhoto(photo.id)}
                      className={`group relative aspect-square cursor-pointer overflow-hidden rounded-sm
                        ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.location}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                      {/* Favorite Badge */}
                      {favorites.has(photo.id) && (
                        <div className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-black/40 backdrop-blur-sm">
                          <IoHeart size={12} className="text-white" />
                        </div>
                      )}

                      {/* Selection Ring on Hover */}
                      <div className="absolute inset-0 ring-2 ring-blue-500 ring-inset opacity-0 group-hover:opacity-100 transition-opacity rounded-sm" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <IoHeartOutline size={48} className={isDark ? 'text-gray-600' : 'text-gray-300'} />
                  <p className={`mt-3 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No favorites yet</p>
                </div>
              )}

              {/* Footer */}
              <div className={`py-8 text-center text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                Synced with iCloud
              </div>
            </div>
          ) : (
            /* ========== DETAIL VIEW ========== */
            <div className="h-full flex flex-col bg-black">

              {/* Back to Grid Button */}
              <button
                onClick={() => setView('grid')}
                className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-medium transition-colors backdrop-blur-sm"
              >
                <IoChevronBack size={14} />
                <span>Library</span>
              </button>

              {/* Main Image Container */}
              <div className="flex-1 flex items-center justify-center p-8 relative group">
                {selectedPhoto && (
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.location}
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                    style={{
                      animation: 'fadeIn 0.2s ease-out',
                    }}
                  />
                )}

                {/* Navigation Arrows (Large, on sides) */}
                <button
                  onClick={prevPhoto}
                  disabled={currentIdx <= 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                >
                  <IoChevronBack size={24} />
                </button>
                <button
                  onClick={nextPhoto}
                  disabled={currentIdx >= photos.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                >
                  <IoChevronForward size={24} />
                </button>

                {/* Info Overlay (Bottom) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1.5">
                    <IoLocationOutline size={14} className="text-gray-400" />
                    <span className="text-xs text-white font-medium">{selectedPhoto?.location}</span>
                  </div>
                  <div className="w-px h-3 bg-white/20" />
                  <div className="flex items-center gap-1.5">
                    <IoCalendarOutline size={14} className="text-gray-400" />
                    <span className="text-xs text-white font-medium">{selectedPhoto?.date}</span>
                  </div>
                </div>
              </div>

              {/* Filmstrip (Bottom) */}
              <div className="h-[72px] bg-[#1a1a1a] border-t border-white/5 flex items-center justify-center gap-1 px-4 shrink-0 overflow-x-auto">
                {photos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhotoId(photo.id)}
                    className={`h-12 w-12 shrink-0 rounded-sm overflow-hidden transition-all
                      ${photo.id === selectedPhotoId
                        ? 'ring-2 ring-white scale-110 z-10'
                        : 'opacity-40 hover:opacity-70 hover:scale-105'}`}
                  >
                    <img src={photo.url} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline keyframes for animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ========== SIDEBAR ITEM COMPONENT ==========
const SidebarItem = ({
  icon,
  label,
  active = false,
  onClick,
  isDark
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isDark: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] transition-colors mb-0.5
      ${active
        ? (isDark ? 'bg-white/15 text-white font-medium' : 'bg-blue-500 text-white font-medium')
        : (isDark ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200' : 'text-gray-600 hover:bg-black/5 hover:text-gray-800')}`}
  >
    <span className={active ? '' : 'opacity-70'}>{icon}</span>
    <span>{label}</span>
  </button>
);

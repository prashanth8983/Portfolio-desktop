import React, { useState, useEffect, useCallback } from 'react';
import { IoClose, IoChevronBack, IoChevronForward, IoHeart, IoHeartOutline, IoShareOutline, IoTrashOutline, IoGridOutline, IoSquareOutline } from 'react-icons/io5';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: 'project' | 'certification' | 'memory';
  date: string;
  gradient?: string;
  icon?: string;
  favorite?: boolean;
}

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Portfolio Desktop',
    description: 'Interactive macOS/iOS simulator portfolio with functional applications, window management, and responsive design.',
    category: 'project',
    date: 'January 2024',
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    icon: '💻'
  },
  {
    id: '2',
    title: 'AWS Certified Developer',
    description: 'Amazon Web Services certification for cloud development and architecture.',
    category: 'certification',
    date: 'December 2023',
    gradient: 'from-orange-400 via-amber-500 to-yellow-500',
    icon: '🏆'
  },
  {
    id: '3',
    title: 'Full Stack Journey',
    description: 'Started my journey as a full-stack developer, learning React, Node.js, and modern web technologies.',
    category: 'memory',
    date: 'June 2023',
    gradient: 'from-green-400 via-emerald-500 to-teal-500',
    icon: '🚀'
  },
  {
    id: '4',
    title: 'E-Commerce Platform',
    description: 'Built a complete e-commerce solution with payment processing, inventory management, and analytics dashboard.',
    category: 'project',
    date: 'October 2023',
    gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
    icon: '🛒'
  },
  {
    id: '5',
    title: 'First Tech Role',
    description: 'Joined an amazing team as a software engineer, working on enterprise applications.',
    category: 'memory',
    date: 'August 2023',
    gradient: 'from-rose-400 via-pink-500 to-fuchsia-500',
    icon: '💼'
  },
  {
    id: '6',
    title: 'React Advanced Patterns',
    description: 'Completed advanced React course covering hooks, context, performance optimization, and testing.',
    category: 'certification',
    date: 'September 2023',
    gradient: 'from-cyan-400 via-sky-500 to-blue-500',
    icon: '⚛️'
  },
];

const SIDEBAR_ITEMS = [
  { id: 'all', label: 'Library', icon: '📷' },
  { id: 'favorites', label: 'Favorites', icon: '❤️' },
  { id: 'project', label: 'Projects', icon: '💻' },
  { id: 'certification', label: 'Certifications', icon: '🎓' },
  { id: 'memory', label: 'Memories', icon: '✨' },
];

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>(galleryItems);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');

  const filteredItems = activeFilter === 'all'
    ? items
    : activeFilter === 'favorites'
      ? items.filter(item => item.favorite)
      : items.filter(item => item.category === activeFilter);

  const handlePrevious = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    setSelectedImage(filteredItems[prevIndex]);
  }, [selectedImage, filteredItems]);

  const handleNext = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    const nextIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(filteredItems[nextIndex]);
  }, [selectedImage, filteredItems]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setItems(items.map(item =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    ));
    if (selectedImage?.id === id) {
      setSelectedImage(prev => prev ? { ...prev, favorite: !prev.favorite } : null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'Escape') setSelectedImage(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, handlePrevious, handleNext]);

  const currentIndex = selectedImage
    ? filteredItems.findIndex(item => item.id === selectedImage.id) + 1
    : 0;

  return (
    <div className="flex h-full bg-[#1e1e1e]">
      {/* Sidebar */}
      <div className="w-48 bg-[#2d2d2d] border-r border-white/10 flex flex-col">
        <div className="p-3 pt-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
            Photos
          </h2>
          <nav className="space-y-0.5">
            {SIDEBAR_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveFilter(item.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                  activeFilter === item.id
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.id === 'favorites' && (
                  <span className="ml-auto text-xs text-gray-500">
                    {items.filter(i => i.favorite).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-12 bg-[#2d2d2d] border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300 font-medium">
              {activeFilter === 'all' ? 'Library' :
                activeFilter === 'favorites' ? 'Favorites' :
                  activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1) + 's'}
            </span>
            <span className="text-xs text-gray-500">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Grid view"
            >
              <IoGridOutline className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('large')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'large' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Large view"
            >
              <IoSquareOutline className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-auto p-4">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-5xl mb-4">
                {activeFilter === 'favorites' ? '❤️' : '📷'}
              </span>
              <p className="text-sm">
                {activeFilter === 'favorites'
                  ? 'No favorites yet'
                  : 'No items in this category'}
              </p>
            </div>
          ) : (
            <div className={`grid gap-2 ${
              viewMode === 'grid'
                ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                : 'grid-cols-2 md:grid-cols-3'
            }`}>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className={`group relative rounded-lg overflow-hidden cursor-pointer bg-[#333] ${
                    viewMode === 'grid' ? 'aspect-square' : 'aspect-[4/3]'
                  }`}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${item.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
                      <span className={viewMode === 'grid' ? 'text-4xl' : 'text-6xl'}>
                        {item.icon}
                      </span>
                    </div>
                  )}

                  {/* Favorite indicator */}
                  {item.favorite && (
                    <div className="absolute top-2 right-2">
                      <IoHeart className="w-4 h-4 text-red-500 drop-shadow-lg" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium truncate">{item.title}</p>
                      <p className="text-gray-300 text-xs">{item.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col"
          onClick={() => setSelectedImage(null)}
        >
          {/* Lightbox Toolbar */}
          <div
            className="h-14 flex items-center justify-between px-4 bg-black/50"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              <IoClose className="w-6 h-6" />
            </button>
            <div className="text-sm text-gray-400">
              {currentIndex} of {filteredItems.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => toggleFavorite(selectedImage.id, e)}
                className="p-2 text-white/70 hover:text-white transition-colors"
              >
                {selectedImage.favorite
                  ? <IoHeart className="w-5 h-5 text-red-500" />
                  : <IoHeartOutline className="w-5 h-5" />
                }
              </button>
              <button className="p-2 text-white/70 hover:text-white transition-colors">
                <IoShareOutline className="w-5 h-5" />
              </button>
              <button className="p-2 text-white/70 hover:text-white transition-colors">
                <IoTrashOutline className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex items-center justify-center relative min-h-0">
            {/* Previous button */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
              className="absolute left-4 p-3 text-white/50 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-all z-10"
            >
              <IoChevronBack className="w-8 h-8" />
            </button>

            {/* Image */}
            <div
              className="max-w-[85%] max-h-[80vh] flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              {selectedImage.image ? (
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <div className={`w-[500px] h-[400px] bg-gradient-to-br ${selectedImage.gradient} rounded-lg shadow-2xl flex items-center justify-center`}>
                  <span className="text-9xl">{selectedImage.icon}</span>
                </div>
              )}
            </div>

            {/* Next button */}
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 p-3 text-white/50 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-all z-10"
            >
              <IoChevronForward className="w-8 h-8" />
            </button>
          </div>

          {/* Info panel */}
          <div
            className="bg-black/50 px-6 py-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">
                    {selectedImage.title}
                  </h2>
                  <p className="text-sm text-gray-400 mb-2">{selectedImage.date}</p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedImage.description}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedImage.category === 'project'
                    ? 'bg-blue-500/20 text-blue-400'
                    : selectedImage.category === 'certification'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-pink-500/20 text-pink-400'
                }`}>
                  {selectedImage.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

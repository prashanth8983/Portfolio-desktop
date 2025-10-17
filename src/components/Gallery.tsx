import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaAward, FaBriefcase, FaCode } from 'react-icons/fa';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: 'project' | 'certification' | 'timeline';
  date?: string;
  placeholder?: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Portfolio Desktop',
    description: 'Interactive macOS/iOS simulator portfolio with functional applications',
    category: 'project',
    date: '2024',
    placeholder: '🖥️'
  },
  {
    id: '2',
    title: '[Your Certification]',
    description: 'Description of your certification or achievement',
    category: 'certification',
    date: '2024',
    placeholder: '🎓'
  },
  {
    id: '3',
    title: 'Started Development Career',
    description: 'Began my journey as a full-stack developer',
    category: 'timeline',
    date: '2023',
    placeholder: '🚀'
  },
  {
    id: '4',
    title: '[Another Project]',
    description: 'Screenshot or description of another project',
    category: 'project',
    date: '2024',
    placeholder: '💻'
  },
  {
    id: '5',
    title: 'Work Experience',
    description: 'Key milestone in professional journey',
    category: 'timeline',
    date: '2023',
    placeholder: '💼'
  },
  {
    id: '6',
    title: '[Add Your Content]',
    description: 'You can add project screenshots, certifications, or timeline events here',
    category: 'project',
    date: '2024',
    placeholder: '📸'
  },
];

export const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'project' | 'certification' | 'timeline'>('all');

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const handlePrevious = () => {
    if (!selectedImage) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    setSelectedImage(filteredItems[prevIndex]);
  };

  const handleNext = () => {
    if (!selectedImage) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    const nextIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(filteredItems[nextIndex]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'project':
        return <FaCode />;
      case 'certification':
        return <FaAward />;
      case 'timeline':
        return <FaBriefcase />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full overflow-auto bg-white">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold text-gray-800">Photos</h1>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory('project')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeCategory === 'project'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaCode size={12} /> Projects
          </button>
          <button
            onClick={() => setActiveCategory('certification')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeCategory === 'certification'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaAward size={12} /> Certifications
          </button>
          <button
            onClick={() => setActiveCategory('timeline')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeCategory === 'timeline'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaBriefcase size={12} /> Timeline
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="p-4 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="relative aspect-square bg-white rounded-md overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow group border border-gray-200"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-6xl">{item.placeholder}</span>
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded-full flex items-center gap-1">
                {getCategoryIcon(item.category)}
                <span className="capitalize">{item.category}</span>
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
                <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="font-semibold text-sm">{item.title}</div>
                  {item.date && <div className="text-xs">{item.date}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-gray-500 text-lg">No items in this category</p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-medium text-blue-900 mb-1 text-sm">💡 Tip: Customize Your Gallery</h3>
          <p className="text-blue-800 text-xs leading-relaxed">
            Add your own project screenshots, certification images, and timeline events by editing the
            <code className="bg-blue-100 px-1 py-0.5 rounded mx-1">Gallery.tsx</code> component.
            You can upload images to the <code className="bg-blue-100 px-1 py-0.5 rounded mx-1">public</code> folder
            and reference them here.
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <FaTimes size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <FaChevronLeft size={48} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <FaChevronRight size={48} />
          </button>

          <div
            className="max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImage.image ? (
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-9xl">{selectedImage.placeholder}</span>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                {getCategoryIcon(selectedImage.category)}
                <span className="text-sm text-gray-500 capitalize">{selectedImage.category}</span>
                {selectedImage.date && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{selectedImage.date}</span>
                  </>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedImage.title}</h2>
              <p className="text-gray-600">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

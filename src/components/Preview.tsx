import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {
  IoChevronDown,
  IoSearch,
  IoShareOutline,
  IoRemove,
  IoAdd,
} from 'react-icons/io5';
import { BsPencil, BsSquare, BsType, BsHighlighter, BsLayoutSidebar } from 'react-icons/bs';
import { FiFileText, FiEdit2 } from 'react-icons/fi';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PreviewProps {
  pdfPath?: string;
  fileName?: string;
}

export const Preview: React.FC<PreviewProps> = ({
  pdfPath = '/Resume.pdf',
  fileName = 'Prashanth Kumar.pdf'
}) => {
  const [zoom, setZoom] = useState(100);
  const [activePage, setActivePage] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isMarkupOpen, setIsMarkupOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setError('Failed to load PDF');
    setIsLoading(false);
  };

  const handleZoomIn = () => setZoom(Math.min(200, zoom + 10));
  const handleZoomOut = () => setZoom(Math.max(25, zoom - 10));

  // Calculate scaled width based on zoom - base width of 800px like reference
  const baseWidth = 800;
  const scaleStyle = { transform: `scale(${zoom / 100})` };

  return (
    <div className="flex flex-col h-full bg-[#F6F6F6]">
      {/* Title Bar / Toolbar - space for traffic lights on left */}
      <div className="h-12 bg-[#F6F6F6] border-b border-[#D1D1D1] flex items-center pl-[72px] pr-4 justify-between shrink-0 select-none relative">

        {/* Left Section: Sidebar Toggle & Zoom Controls */}
        <div className="flex items-center space-x-1 text-[#4F4F4F] relative z-[110]">
          {/* Sidebar Toggle - Using sidebar icon with active state styling */}
          <button
            className={`p-1 rounded transition-colors cursor-pointer ${isSidebarOpen ? 'bg-black/10 shadow-inner' : 'hover:bg-black/5'}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsSidebarOpen(!isSidebarOpen);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            title={isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          >
            <BsLayoutSidebar size={18} />
          </button>

          {/* Divider */}
          <div className="h-4 w-px bg-gray-300 mx-2"></div>

          {/* Zoom Controls */}
          <button
            className="p-1 rounded hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomOut();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={zoom <= 25}
          >
            <IoRemove size={16} />
          </button>
          <button
            className="p-1 rounded hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleZoomIn();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={zoom >= 200}
          >
            <IoAdd size={16} />
          </button>
        </div>

        {/* Center: File Name (Absolute Center) - pointer-events-none to allow dragging through */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2 pointer-events-none">
          <div className="w-4 h-5 bg-red-500 rounded-[2px] relative flex items-center justify-center">
            <span className="text-[6px] text-white font-bold">PDF</span>
          </div>
          <span className="text-sm font-semibold text-gray-700 tracking-tight flex items-center group cursor-default">
            {fileName}
            <IoChevronDown size={10} className="ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
          </span>
        </div>

        {/* Right Section: Tools */}
        <div className="flex items-center space-x-3 text-[#4F4F4F] relative z-[110]">
          <button
            className="p-1 rounded hover:bg-black/5 transition-colors cursor-pointer"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <IoShareOutline size={18} />
          </button>
          <button
            className={`p-1 rounded transition-colors cursor-pointer ${isMarkupOpen ? 'bg-blue-500 text-white shadow-inner' : 'hover:bg-black/5'}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsMarkupOpen(!isMarkupOpen);
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <FiEdit2 size={16} />
          </button>
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <IoSearch size={16} className="absolute left-2 top-1.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search"
              className="pl-7 pr-2 py-1 text-xs bg-white/50 border border-gray-300/50 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </div>

      {/* Markup Toolbar (Conditional) */}
      {isMarkupOpen && (
        <div className="h-10 bg-[#EBEBEB] border-b border-[#D1D1D1] flex items-center justify-center space-x-6 shrink-0">
          <button className="p-1.5 hover:bg-black/5 rounded text-gray-600"><FiFileText size={16} /></button>
          <div className="h-4 w-px bg-gray-300"></div>
          <button className="p-1.5 hover:bg-black/5 rounded text-gray-600"><BsSquare size={16} /></button>
          <button className="p-1.5 hover:bg-black/5 rounded text-gray-600"><BsType size={16} /></button>
          <button className="p-1.5 hover:bg-black/5 rounded text-gray-600"><BsHighlighter size={16} /></button>
          <button className="p-1.5 hover:bg-black/5 rounded text-gray-600"><BsPencil size={16} /></button>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 rounded-full border border-gray-300 bg-black cursor-pointer hover:scale-110 transition-transform"></div>
            <div className="w-4 h-4 rounded-full border border-gray-300 bg-red-500 cursor-pointer hover:scale-110 transition-transform"></div>
            <div className="w-4 h-4 rounded-full border border-gray-300 bg-blue-500 cursor-pointer hover:scale-110 transition-transform"></div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Sidebar - Page Thumbnails (Collapsible) */}
        <div
          className="bg-[#F2F2F2] border-r border-[#D1D1D1] flex flex-col overflow-hidden shrink-0"
          style={{
            width: isSidebarOpen ? '208px' : '0px',
            minWidth: isSidebarOpen ? '208px' : '0px',
            borderRightWidth: isSidebarOpen ? '1px' : '0px',
            transition: 'width 0.25s ease-in-out, min-width 0.25s ease-in-out, border-right-width 0.25s ease-in-out'
          }}
        >
          <div
            className="p-4 space-y-6 overflow-y-auto h-full"
            style={{
              opacity: isSidebarOpen ? 1 : 0,
              transition: 'opacity 0.15s ease-in-out',
              transitionDelay: isSidebarOpen ? '0.1s' : '0s'
            }}
          >
            {/* Actual PDF page thumbnails */}
            {numPages && Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
              <div
                key={page}
                onClick={() => setActivePage(page)}
                className={`group cursor-pointer flex flex-col items-center space-y-2 ${activePage === page ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
              >
                <div className={`w-full bg-white shadow-sm relative transition-all overflow-hidden ${activePage === page ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#F2F2F2]' : 'ring-1 ring-black/5'}`}>
                  {/* Actual PDF thumbnail */}
                  <Document file={pdfPath} loading={null} error={null}>
                    <Page
                      pageNumber={page}
                      width={176}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={
                        <div className="w-full aspect-[0.77] bg-white flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                        </div>
                      }
                    />
                  </Document>
                </div>
                <span className={`text-[11px] font-medium whitespace-nowrap ${activePage === page ? 'text-white bg-blue-500 px-2 rounded-full' : 'text-gray-500'}`}>
                  {page}
                </span>
              </div>
            ))}
            {/* Loading state - show skeleton thumbnails */}
            {!numPages && !error && (
              Array.from({ length: 2 }, (_, i) => i + 1).map((page) => (
                <div key={page} className="flex flex-col items-center space-y-2 opacity-70">
                  <div className="w-full aspect-[0.77] bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                  </div>
                  <span className="text-[11px] font-medium text-gray-500">{page}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-[#333333] overflow-auto flex justify-center p-8 shadow-inner min-w-0">
          {error ? (
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl mb-4">📄</div>
              <p className="text-white/70 text-sm">{error}</p>
            </div>
          ) : (
            <Document
              file={pdfPath}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4" />
                  <p className="text-white/70 text-sm">Loading PDF...</p>
                </div>
              }
            >
              {!isLoading && (
                <div
                  className="bg-white shadow-2xl transition-transform duration-200 ease-out origin-top shrink-0"
                  style={{
                    width: `${baseWidth}px`,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.1)',
                    ...scaleStyle
                  }}
                >
                  <Page
                    pageNumber={activePage}
                    width={baseWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={
                      <div
                        className="flex items-center justify-center bg-white"
                        style={{ width: baseWidth, height: baseWidth * 1.294 }}
                      >
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      </div>
                    }
                  />
                </div>
              )}
            </Document>
          )}
        </div>
      </div>
    </div>
  );
};

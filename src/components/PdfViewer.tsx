import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set the worker source correctly - using the https protocol and without the ?import parameter
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  pdfPath: string;
  width?: number;
  isMobile?: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  pdfPath,
  width = 600,
  isMobile = false
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewWidth, setViewWidth] = useState<number>(width);
  const [scale, setScale] = useState<number>(100);

  // Reset loading state when PDF path changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setPageNumber(1);
  }, [pdfPath]);

  // Handle responsive width
  useEffect(() => {
    const calculateWidth = () => {
      if (isMobile) {
        setViewWidth(Math.min(window.innerWidth - 40, 600));
      } else {
        setViewWidth(width);
      }
    };

    calculateWidth();

    const handleResize = () => {
      if (isMobile) {
        calculateWidth();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, width]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF Loading Error:', error.message);
    setError(`Failed to load PDF: ${error.message}`);
    setIsLoading(false);
  };

  const changePage = (offset: number) => {
    if (!numPages) return;
    setPageNumber((prev) => {
      const newPage = prev + offset;
      return Math.max(1, Math.min(numPages, newPage));
    });
  };

  const handleZoom = (delta: number) => {
    setScale((prev) => Math.max(50, Math.min(200, prev + delta)));
  };

  const scaledWidth = (viewWidth * scale) / 100;

  return (
    <div className="flex flex-col h-full bg-[#f6f6f6]">
      {/* macOS-style toolbar - matching window header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#e8e8e8] border-b border-black/10">
        {/* Left: Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1 || isLoading}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-black/5 active:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => changePage(1)}
            disabled={!numPages || pageNumber >= numPages || isLoading}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-black/5 active:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Center: Page indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 font-medium">
            {pageNumber} of {numPages || '-'}
          </span>
        </div>

        {/* Right: Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleZoom(-10)}
            disabled={scale <= 50}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-black/5 active:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Zoom out"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-xs text-gray-600 font-medium w-10 text-center">
            {scale}%
          </span>
          <button
            onClick={() => handleZoom(10)}
            disabled={scale >= 200}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-black/5 active:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Zoom in"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* PDF Content Area - light gray background like Preview */}
      <div className="flex-1 overflow-auto bg-[#8e8e93] p-6">
        <div className="flex justify-center">
          {error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-white/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
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
              noData={
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="w-16 h-16 text-white/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-white/70 text-sm">No PDF data found</p>
                </div>
              }
              className="pdf-document"
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4" />
                  <p className="text-white/70 text-sm">Loading PDF...</p>
                </div>
              ) : (
                <div
                  className="shadow-2xl rounded-sm overflow-hidden"
                  style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Page
                    pageNumber={pageNumber}
                    width={scaledWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={
                      <div
                        className="flex items-center justify-center bg-white"
                        style={{ width: scaledWidth, height: scaledWidth * 1.4 }}
                      >
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      </div>
                    }
                    className="pdf-page"
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
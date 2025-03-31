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
  width = 600, // Default width
  isMobile = false 
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewWidth, setViewWidth] = useState<number>(width);

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
    console.log('PDF loaded successfully with', numPages, 'pages');
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between bg-gray-100 p-2 border-b">
        <button
          onClick={() => changePage(-1)}
          disabled={pageNumber <= 1 || isLoading}
          className="px-3 py-1 rounded text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          Previous
        </button>
        <span>
          Page {pageNumber} of {numPages || '--'}
        </span>
        <button
          onClick={() => changePage(1)}
          disabled={!numPages || pageNumber >= numPages || isLoading}
          className="px-3 py-1 rounded text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          Next
        </button>
      </div>

      {/* The key changes here with better overflow handling and padding */}
      <div className="flex-1 overflow-auto bg-gray-50 p-4">
        <div className="flex justify-center">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <Document
              file={pdfPath}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="text-center py-4">Loading PDF...</div>}
              noData={<div className="text-center py-4">No PDF data found</div>}
              className="pdf-document"
            >
              {isLoading ? (
                <div className="text-center py-4">Loading PDF...</div>
              ) : (
                <Page
                  pageNumber={pageNumber}
                  width={viewWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={<div className="text-center py-4">Loading page...</div>}
                  className="pdf-page"
                />
              )}
            </Document>
          )}
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';

interface PdfViewerProps {
  pdfPath: string;
  width?: number;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ pdfPath, width }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Measure container width for responsive scaling
  useEffect(() => {
    const updateWidth = () => {
      const container = document.querySelector('.pdf-container');
      if (container) {
        setContainerWidth(container.getBoundingClientRect().width);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleIframeLoad = () => {
    console.log('Iframe loaded successfully');
    setIsLoading(false);
  };

  // Use provided width if set, otherwise fall back to container width
  const effectiveWidth = width && width > 0 ? width : containerWidth;

  // Ensure iOS compatibility by appending #toolbar=1 for native controls
  const iosFriendlyPdfPath = `${pdfPath}#toolbar=1&navpanes=0&scrollbar=1`;

  return (
    <div className="flex flex-col h-full w-full pdf-container">
      <div className="flex-1 overflow-auto bg-gray-50 flex justify-center items-start min-h-0 relative">
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center z-10">
            <p>Loading PDF...</p>
          </div>
        )}
        <iframe
          src={iosFriendlyPdfPath}
          width={effectiveWidth > 0 ? `${effectiveWidth}px` : '100%'}
          height="100%"
          title="PDF Viewer"
          style={{
            border: 'none',
            margin: 0,
            padding: 0,
            maxWidth: '100%', // Prevent overflow
            maxHeight: '100%', // Ensure it fits container
            visibility: isLoading ? 'hidden' : 'visible', // Use visibility for iOS
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};
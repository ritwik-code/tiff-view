import React, { useState, useEffect } from 'react';
import './TiffViewer.css';

const TiffViewer: React.FC = () => {
  const [tiffPages, setTiffPages] = useState<HTMLCanvasElement[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTiff = async () => {
      try {
        console.log('Loading TIFF file...');
        const Tiff = await import('tiff.js');
        // Access the TIFF file from the public directory
        const response = await fetch('/Multi_page24bpp.tif');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('TIFF file fetched successfully');
        const arrayBuffer = await response.arrayBuffer();
        const tiff = new Tiff.default({ buffer: arrayBuffer });
        
        const pages: HTMLCanvasElement[] = [];
        for (let i = 0; i < tiff.countDirectory(); i++) {
          tiff.setDirectory(i);
          pages.push(tiff.toCanvas());
        }
        
        console.log(`Loaded ${pages.length} pages`);
        setTiffPages(pages);
        setLoading(false);
      } catch (error) {
        console.error('Error loading TIFF:', error);
        setError('Failed to load TIFF file');
        setLoading(false);
      }
    };

    loadTiff();
  }, []);

  if (loading) return <div className="loading">Loading TIFF...</div>;
  if (error) return <div className="error">{error}</div>;
  if (tiffPages.length === 0) return <div className="error">No pages found</div>;

  return (
    <div className="tiff-viewer">
      <div className="controls">
        <button 
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>Page {currentPage + 1} of {tiffPages.length}</span>
        <button 
          onClick={() => setCurrentPage(Math.min(tiffPages.length - 1, currentPage + 1))}
          disabled={currentPage === tiffPages.length - 1}
        >
          Next
        </button>
      </div>
      
      <div className="image-container">
        <div ref={(div) => {
          if (div && tiffPages[currentPage]) {
            div.innerHTML = '';
            div.appendChild(tiffPages[currentPage]);
          }
        }} />
      </div>
    </div>
  );
};

export default TiffViewer;

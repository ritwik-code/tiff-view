import React, { useRef, useState, useEffect } from 'react';
import TiffPageCanvas from './components/TiffPageCanvas';
import JpegCanvas from './components/JpegCanvas';
import ZoomControls from './components/ZoomControls';
import { useTiffJpegViewer } from './components/useTiffJpegViewer';

const TiffUploader: React.FC = () => {
  const {
    pages,
    jpegImage,
    error,
    loading,
    setError,
    setLoading,
    decodeAndSetPages,
    loadJpegImage,
    setPages,
    setJpegImage,
  } = useTiffJpegViewer();
  const [zoom, setZoom] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // File input handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setJpegImage(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      if (file.type === 'image/jpeg') {
        loadJpegImage(file);
      } else {
        const arrayBuffer = await file.arrayBuffer();
        decodeAndSetPages(arrayBuffer);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch from backend (example: JPEG or TIFF)
  const handleFetchFromBackend = async () => {
    setLoading(true);
    setError(null);
    setJpegImage(null);
    try {
      const response = await fetch('http://localhost:8080/file?mimeType=image/jpeg');
      if (!response.ok) throw new Error('Failed to fetch file from backend');
      const contentType = response.headers.get('content-type') || '';
      const blob = await response.blob();
      if (contentType.includes('image/jpeg')) {
        loadJpegImage(blob);
      } else if (contentType.includes('image/tiff') || contentType.includes('image/tif')) {
        const arrayBuffer = await blob.arrayBuffer();
        decodeAndSetPages(arrayBuffer);
      } else {
        setError('Unsupported file type from backend.');
      }
    } catch (err) {
      setError('Failed to fetch or decode file from backend.');
    } finally {
      setLoading(false);
    }
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.2, 10));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.2, 0.1));
  const handleZoomReset = () => setZoom(1);

  // Ctrl+scroll for zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if ((e.ctrlKey || e.metaKey) && (pages.length > 0 || jpegImage)) {
        e.preventDefault();
        if (e.deltaY < 0) {
          setZoom((z) => Math.min(z * 1.1, 10));
        } else if (e.deltaY > 0) {
          setZoom((z) => Math.max(z / 1.1, 0.1));
        }
      }
    };
    const el = scrollContainerRef.current;
    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener('wheel', handleWheel); };
  }, [pages.length, jpegImage]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          type="file"
          accept=".tif,.tiff,.jpeg,.jpg"
          onChange={handleFileChange}
          disabled={loading}
        />
        <button onClick={handleFetchFromBackend} disabled={loading} style={{ padding: '6px 16px' }}>
          Load TIFF from backend
        </button>
        {loading && <span style={{ marginLeft: '10px', color: '#007bff' }}>Loading...</span>}
      </div>

      <ZoomControls zoom={zoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onZoomReset={handleZoomReset} />

      {error && (
        <div style={{
          color: 'red',
          backgroundColor: '#ffebee',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <div
        ref={scrollContainerRef}
        style={{
          maxHeight: '70vh',
          overflowY: 'auto',
          margin: '0 auto',
          padding: 0,
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          boxShadow: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s',
          }}
        >
          {jpegImage ? (
            <JpegCanvas img={jpegImage} />
          ) : (
            pages.map((ifd, idx) => (
              <TiffPageCanvas key={idx} ifd={ifd} idx={idx} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TiffUploader;
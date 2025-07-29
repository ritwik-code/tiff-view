import { useState } from 'react';
import * as UTIF from 'utif';

export function useTiffJpegViewer() {
  const [pages, setPages] = useState<any[]>([]); // TODO: type for IFD
  const [jpegImage, setJpegImage] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Decode TIFF
  const decodeAndSetPages = (arrayBuffer: ArrayBuffer) => {
    setJpegImage(null);
    try {
      const ifds = UTIF.decode(arrayBuffer);
      if (ifds.length === 0) {
        setError('No images found in the TIFF file.');
        setPages([]);
        return;
      }
      for (let i = 0; i < ifds.length; i++) {
        try {
          UTIF.decodeImage(arrayBuffer, ifds[i]);
        } catch {}
      }
      setPages(ifds);
      setError(null);
    } catch (err) {
      setError('Failed to decode the TIFF file.');
      setPages([]);
    }
  };

  // Load JPEG
  const loadJpegImage = (blob: Blob) => {
    setPages([]);
    setError(null);
    const img = new window.Image();
    img.onload = () => setJpegImage(img);
    img.onerror = () => setError('Failed to load JPEG image.');
    img.src = URL.createObjectURL(blob);
  };

  return {
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
  };
}

import React from 'react';
import * as UTIF from 'utif';

export interface TiffPageCanvasProps {
  ifd: any;
}

const TiffPageCanvas: React.FC<TiffPageCanvasProps> = ({ ifd }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (canvasRef.current && ifd.width && ifd.height) {
      try {
        const rgba = UTIF.toRGBA8(ifd);
        canvasRef.current.width = ifd.width;
        canvasRef.current.height = ifd.height;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const imageData = new ImageData(new Uint8ClampedArray(rgba), ifd.width, ifd.height);
          ctx.putImageData(imageData, 0, 0);
        }
      } catch {
        // ignore per-page errors
      }
    }
  }, [ifd]);
  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
        marginBottom: 16
      }}
    />
  );
};

export default TiffPageCanvas;

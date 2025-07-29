import React from 'react';

export interface JpegCanvasProps {
  img: HTMLImageElement;
}

const JpegCanvas: React.FC<JpegCanvasProps> = ({ img }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (canvasRef.current && img.complete) {
      canvasRef.current.width = img.naturalWidth;
      canvasRef.current.height = img.naturalHeight;
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.drawImage(img, 0, 0);
    }
  }, [img]);
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

export default JpegCanvas;

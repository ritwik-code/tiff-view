import React from 'react';

export interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ zoom, onZoomIn, onZoomOut, onZoomReset }) => (
  <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 8 }}>
    <button onClick={onZoomOut} style={{ fontSize: 18, width: 32 }}>-</button>
    <span
      style={{ minWidth: 60, textAlign: 'center', cursor: 'pointer', userSelect: 'none' }}
      title="Click to reset zoom"
      onClick={onZoomReset}
    >
      {Math.round(zoom * 100)}%
    </span>
    <button onClick={onZoomIn} style={{ fontSize: 18, width: 32 }}>+</button>
    <button onClick={onZoomReset} style={{ marginLeft: 12 }}>Reset</button>
  </div>
);

export default ZoomControls;

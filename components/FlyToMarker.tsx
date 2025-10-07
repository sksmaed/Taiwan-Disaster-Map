// FIX: Add React import to resolve 'Cannot find namespace React' error.
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface FlyToMarkerProps {
  position: [number, number];
  zoom: number;
}

export const FlyToMarker: React.FC<FlyToMarkerProps> = ({ position, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, zoom, {
      animate: true,
      duration: 1.5,
    });
  }, [position, zoom, map]);

  return null;
};

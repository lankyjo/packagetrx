'use client';

import { useEffect, useState } from 'react';
import { MapContainer as LeafletMapContainer } from 'react-leaflet';
import DayNightMapTheme from './DayNightMapTheme';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TrackingData {
  trackingID: string;
  packageName: string;
  weight: number;
  declaredValue: number;
  sender: {
    name: string;
    phone: string;
    email: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  recipient: {
    name: string;
    phone: string;
    email: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  dateReceived: string;
  dateDelivered: string;
  assignedDriver: string;
  driverContact: string;
  createdAt: string;
  updatedAt: string;
}

interface MapContainerProps {
  trackingData: TrackingData;
  children?: React.ReactNode;
}

const MapContainer = ({ trackingData, children }: MapContainerProps) => {
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [mapBounds, setMapBounds] = useState<[[number, number], [number, number]] | null>(null);

  useEffect(() => {
    if (trackingData?.sender && trackingData?.recipient) {
      const senderLat = trackingData.sender.latitude;
      const senderLng = trackingData.sender.longitude;
      const recipientLat = trackingData.recipient.latitude;
      const recipientLng = trackingData.recipient.longitude;

      // Calculate current position based on progress (from props)
      const now = new Date();
      const start = new Date(trackingData.dateReceived);
      const end = new Date(trackingData.dateDelivered);
      
      const totalDuration = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      let progress = elapsed / totalDuration;
      progress = Math.max(0, Math.min(1, progress));

      // Current plane position
      const currentLat = senderLat + (recipientLat - senderLat) * progress;
      const currentLng = senderLng + (recipientLng - senderLng) * progress;
      
      // Focus on current position instead of midpoint
      setMapCenter([currentLat, currentLng]);

      // Set tighter bounds focused around current position
      const latRange = Math.abs(recipientLat - senderLat);
      const lngRange = Math.abs(recipientLng - senderLng);
      
      // Create bounds with reasonable padding around the route
      const padding = Math.max(latRange, lngRange) * 0.3; // 30% padding
      
      const bounds: [[number, number], [number, number]] = [
        [Math.min(senderLat, recipientLat) - padding, Math.min(senderLng, recipientLng) - padding],
        [Math.max(senderLat, recipientLat) + padding, Math.max(senderLng, recipientLng) + padding]
      ];
      setMapBounds(bounds);
    }
  }, [trackingData]);

  if (!mapCenter || !trackingData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <LeafletMapContainer
        center={mapCenter}
        {...(mapBounds ? { bounds: mapBounds } : {})}
        boundsOptions={{ padding: [20, 20] }} // Tighter padding
        zoom={12} // Higher default zoom
        className="w-full h-full z-0"
        zoomControl={false} // We'll add custom controls
        minZoom={6}
        maxZoom={18}
      >
        <DayNightMapTheme 
          userLat={(trackingData.sender.latitude + trackingData.recipient.latitude) / 2}
          userLng={(trackingData.sender.longitude + trackingData.recipient.longitude) / 2}
        />
        
        {/* Children will be map overlays like markers, polylines, etc. */}
        {children}
      </LeafletMapContainer>
    </div>
  );
};

export default MapContainer;
'use client';

import { Polyline } from 'react-leaflet';

interface RoutePolylineProps {
  senderLat: number;
  senderLng: number;
  recipientLat: number;
  recipientLng: number;
  progress?: number; // Optional: to show completed vs remaining route
  showProgress?: boolean;
}

const RoutePolyline = ({
  senderLat,
  senderLng,
  recipientLat,
  recipientLng,
  progress = 0,
  showProgress = true
}: RoutePolylineProps) => {
  const senderPosition: [number, number] = [senderLat, senderLng];
  const recipientPosition: [number, number] = [recipientLat, recipientLng];
  
  // Full route coordinates
  const fullRoute = [senderPosition, recipientPosition];
  
  if (showProgress && progress > 0) {
    // Calculate current position based on progress
    const currentLat = senderLat + (recipientLat - senderLat) * progress;
    const currentLng = senderLng + (recipientLng - senderLng) * progress;
    const currentPosition: [number, number] = [currentLat, currentLng];
    
    // Completed route (from sender to current position)
    const completedRoute = [senderPosition, currentPosition];
    
    // Remaining route (from current position to recipient)
    const remainingRoute = [currentPosition, recipientPosition];
    
    return (
      <>
        {/* Completed route - solid line */}
        <Polyline
          positions={completedRoute}
          pathOptions={{
            color: '#8B5CF6', // Purple
            weight: 4,
            opacity: 0.9,
            dashArray: undefined, // Solid line
          }}
        />
        
        {/* Remaining route - dashed line */}
        <Polyline
          positions={remainingRoute}
          pathOptions={{
            color: '#D1D5DB', // Gray
            weight: 3,
            opacity: 0.6,
            dashArray: '10, 10', // Dashed line
          }}
        />
        
        {/* Full route background - very light */}
        <Polyline
          positions={fullRoute}
          pathOptions={{
            color: '#F3F4F6',
            weight: 6,
            opacity: 0.3,
          }}
        />
      </>
    );
  }
  
  // Simple full route when not showing progress
  return (
    <Polyline
      positions={fullRoute}
      pathOptions={{
        color: '#8B5CF6', // Purple
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 10', // Subtle dash
      }}
    />
  );
};

export default RoutePolyline;
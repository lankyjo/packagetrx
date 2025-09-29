'use client';

import { useEffect, useState } from 'react';
import { Polyline } from 'react-leaflet';
import { calculateDistance, getTransportMode } from '../../utils/transportUtils';

interface SmartRoutePolylineProps {
  senderLat: number;
  senderLng: number;
  recipientLat: number;
  recipientLng: number;
  progress: number;
  currentPosition: [number, number];
}

const SmartRoutePolyline = ({
  senderLat,
  senderLng,
  recipientLat,
  recipientLng,
  progress,
  currentPosition
}: SmartRoutePolylineProps) => {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [isRoadRoute, setIsRoadRoute] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transportMode, setTransportMode] = useState<'truck' | 'plane' | 'ship'>('truck');

  // Calculate distance and determine if we should use road routing
  useEffect(() => {
    const distance = calculateDistance(senderLat, senderLng, recipientLat, recipientLng);
    const mode = getTransportMode(distance);
    setTransportMode(mode);
    
    // Use road routing for truck transport (short distances)
    setIsRoadRoute(mode === 'truck');
  }, [senderLat, senderLng, recipientLat, recipientLng]);

  // Fetch route from OSRM (OpenStreetMap Routing Machine)
  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      
      if (isRoadRoute) {
        try {
          // Use OSRM for road routing (free and open-source)
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${senderLng},${senderLat};${recipientLng},${recipientLat}?overview=full&geometries=geojson`
          );
          
          const data = await response.json();
          
          if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            // Extract coordinates from the route
            const coordinates = data.routes[0].geometry.coordinates.map(
              (coord: [number, number]) => [coord[1], coord[0]] as [number, number] // Swap lon/lat to lat/lon
            );
            setRouteCoordinates(coordinates);
          } else {
            // Fallback to straight line if routing fails
            setRouteCoordinates([[senderLat, senderLng], [recipientLat, recipientLng]]);
          }
        } catch (error) {
          console.error('Failed to fetch road route:', error);
          // Fallback to straight line
          setRouteCoordinates([[senderLat, senderLng], [recipientLat, recipientLng]]);
        }
      } else {
        // For air/sea transport, use straight line
        setRouteCoordinates([[senderLat, senderLng], [recipientLat, recipientLng]]);
      }
      
      setLoading(false);
    };

    fetchRoute();
  }, [senderLat, senderLng, recipientLat, recipientLng, isRoadRoute]);

  // Find the index on the route based on progress
  const getCurrentRouteSegment = () => {
    if (routeCoordinates.length === 0) return { completed: [], remaining: [] };
    
    const totalPoints = routeCoordinates.length;
    const currentIndex = Math.floor(progress * (totalPoints - 1));
    
    const completed = routeCoordinates.slice(0, currentIndex + 1);
    completed.push(currentPosition); // Add current position
    
    const remaining = [currentPosition, ...routeCoordinates.slice(currentIndex + 1)];
    
    return { completed, remaining };
  };

  const { completed, remaining } = getCurrentRouteSegment();

  // Get color based on transport mode
  const getRouteColor = () => {
    switch (transportMode) {
      case 'truck':
        return '#10B981'; // green
      case 'plane':
        return '#8B5CF6'; // purple
      case 'ship':
        return '#3B82F6'; // blue
      default:
        return '#8B5CF6';
    }
  };

  if (loading || routeCoordinates.length === 0) {
    return null;
  }

  return (
    <>
      {/* Background route - very light */}
      <Polyline
        positions={routeCoordinates}
        pathOptions={{
          color: '#E5E7EB',
          weight: 8,
          opacity: 0.3,
        }}
      />
      
      {/* Completed route - solid colored */}
      {completed.length > 1 && (
        <Polyline
          positions={completed}
          pathOptions={{
            color: getRouteColor(),
            weight: 5,
            opacity: 0.8,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      )}
      
      {/* Remaining route - dashed gray */}
      {remaining.length > 1 && (
        <Polyline
          positions={remaining}
          pathOptions={{
            color: '#9CA3AF',
            weight: 4,
            opacity: 0.6,
            dashArray: '10, 10',
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      )}
      
      {/* Animated moving dots along completed route */}
      {completed.length > 1 && (
        <Polyline
          positions={completed}
          pathOptions={{
            color: '#FBBF24',
            weight: 2,
            opacity: 0.8,
            dashArray: '5, 15',
            className: 'moving-dots',
          }}
        />
      )}
      
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20px;
          }
        }
        
        .moving-dots {
          animation: dash 2s linear infinite;
        }
      `}</style>
    </>
  );
};

export default SmartRoutePolyline;
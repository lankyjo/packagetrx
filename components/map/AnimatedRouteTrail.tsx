'use client';

import { useEffect, useState } from 'react';
import { Polyline } from 'react-leaflet';

interface AnimatedRouteTrailProps {
  senderLat: number;
  senderLng: number;
  recipientLat: number;
  recipientLng: number;
  progress: number;
  currentPosition: [number, number];
}

const AnimatedRouteTrail = ({
  senderLat,
  senderLng,
  recipientLat,
  recipientLng,
  progress,
  currentPosition
}: AnimatedRouteTrailProps) => {
  const [trailPoints, setTrailPoints] = useState<[number, number][]>([]);
  
  // Generate trail points behind the plane
  useEffect(() => {
    const generateTrailPoints = () => {
      const points: [number, number][] = [];
      const trailLength = 10; // Number of trail points
      const stepSize = progress / trailLength;
      
      for (let i = 0; i < trailLength && progress > 0; i++) {
        const trailProgress = Math.max(0, progress - (stepSize * (i + 1)));
        const lat = senderLat + (recipientLat - senderLat) * trailProgress;
        const lng = senderLng + (recipientLng - senderLng) * trailProgress;
        points.push([lat, lng]);
      }
      
      // Add current position at the front
      if (points.length > 0) {
        points.unshift(currentPosition);
      }
      
      setTrailPoints(points);
    };

    generateTrailPoints();
  }, [progress, currentPosition, senderLat, senderLng, recipientLat, recipientLng]);

  // Main route line (full route in light gray)
  const fullRoute: [number, number][] = [[senderLat, senderLng], [recipientLat, recipientLng]];
  
  // Completed route (solid)
  const completedRoute: [number, number][] = [[senderLat, senderLng], currentPosition];
  
  // Remaining route (dashed)
  const remainingRoute: [number, number][] = [currentPosition, [recipientLat, recipientLng]];

  return (
    <>
      {/* Background route - very light */}
      <Polyline
        positions={fullRoute}
        pathOptions={{
          color: '#E5E7EB',
          weight: 8,
          opacity: 0.3,
        }}
      />
      
      {/* Completed route - solid purple */}
      <Polyline
        positions={completedRoute}
        pathOptions={{
          color: '#8B5CF6',
          weight: 4,
          opacity: 0.8,
        }}
      />
      
      {/* Remaining route - dashed gray */}
      <Polyline
        positions={remainingRoute}
        pathOptions={{
          color: '#9CA3AF',
          weight: 3,
          opacity: 0.6,
          dashArray: '10, 10',
        }}
      />
      
      {/* Animated trail behind the plane */}
      {trailPoints.length > 1 && trailPoints.map((_, index) => {
        if (index === 0) return null; // Skip the first point (current position)
        
        const segmentPoints = [trailPoints[index - 1], trailPoints[index]];
        const opacity = Math.max(0.1, 1 - (index * 0.15)); // Fade out as we go back
        const weight = Math.max(1, 6 - index); // Get thinner as we go back
        
        return (
          <Polyline
            key={`trail-${index}`}
            positions={segmentPoints}
            pathOptions={{
              color: '#A855F7',
              weight: weight,
              opacity: opacity,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        );
      })}
      
      {/* Animated moving dots along completed route */}
      <Polyline
        positions={completedRoute}
        pathOptions={{
          color: '#FBBF24',
          weight: 2,
          opacity: 0.8,
          dashArray: '5, 15',
          className: 'moving-dots', // We'll add CSS animation for this
        }}
      />
      
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

export default AnimatedRouteTrail;
'use client';

import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Plane, Clock, MapPin, User, Phone, Truck } from 'lucide-react';

interface PlaneTrackerProps {
  senderLat: number;
  senderLng: number;
  recipientLat: number;
  recipientLng: number;
  shipmentStart: string;
  estimatedArrival: string;
  packageName: string;
  trackingId: string;
  assignedDriver?: string;
  driverContact?: string;
}

const PlaneTracker = ({
  senderLat,
  senderLng,
  recipientLat,
  recipientLng,
  shipmentStart,
  estimatedArrival,
  packageName,
  trackingId,
  assignedDriver,
  driverContact
}: PlaneTrackerProps) => {
  const [planePosition, setPlanePosition] = useState<[number, number] | null>(null);
  const [progress, setProgress] = useState(0);
  const [bearing, setBearing] = useState(0);

  // Function to calculate bearing (direction) between two points
  const calculateBearing = (startLat: number, startLng: number, endLat: number, endLng: number) => {
    const lat1 = (Math.PI / 180) * startLat;
    const lat2 = (Math.PI / 180) * endLat;
    const lon1 = (Math.PI / 180) * startLng;
    const lon2 = (Math.PI / 180) * endLng;

    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let brng = Math.atan2(y, x);
    brng = (brng * 180) / Math.PI; // Convert to degrees
    return (brng + 360) % 360; // Normalize to 0-360
  };

  // Calculate progress based on current time
  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      const start = new Date(shipmentStart);
      const end = new Date(estimatedArrival);
      
      const totalDuration = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      
      let calculatedProgress = elapsed / totalDuration;
      
      // Clamp between 0 and 1
      calculatedProgress = Math.max(0, Math.min(1, calculatedProgress));
      
      setProgress(calculatedProgress);
      
      // Interpolate plane position
      const lat = senderLat + (recipientLat - senderLat) * calculatedProgress;
      const lng = senderLng + (recipientLng - senderLng) * calculatedProgress;
      
      setPlanePosition([lat, lng]);
      
      // Calculate bearing from current position to destination
      if (calculatedProgress < 1) {
        const currentBearing = calculateBearing(lat, lng, recipientLat, recipientLng);
        setBearing(currentBearing);
      } else {
        // When delivered, keep the last bearing
        const finalBearing = calculateBearing(senderLat, senderLng, recipientLat, recipientLng);
        setBearing(finalBearing);
      }
    };

    calculateProgress();
    
    // Update every minute
    const interval = setInterval(calculateProgress, 60000);
    
    return () => clearInterval(interval);
  }, [senderLat, senderLng, recipientLat, recipientLng, shipmentStart, estimatedArrival]);

  // Custom plane/delivery icon
  const getMarkerIcon = () => {
    if (progress >= 1) {
      // Delivered - Show green checkmark
      return L.divIcon({
        className: 'custom-delivery-marker',
        html: `
          <div class="relative">
            <div class="w-10 h-10 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-bounce">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <div class="absolute top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
              ✓ Delivered!
            </div>
          </div>
        `,
        iconSize: [40, 60],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
      });
    } else {
      // In transit - Show rotating plane
      return L.divIcon({
        className: 'custom-plane-marker',
        html: `
          <div class="relative">
            <div class="w-8 h-8 bg-purple-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center" style="transform: rotate(${bearing - 45}deg)">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
            <div class="absolute top-8 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
              ${Math.round(progress * 100)}% Complete
            </div>
          </div>
        `,
        iconSize: [32, 50],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });
    }
  };

  const getStatusText = () => {
    if (progress >= 1) return 'Delivered';
    if (progress >= 0.8) return 'Out for Delivery';
    if (progress >= 0.5) return 'In Transit (Near Destination)';
    if (progress >= 0.2) return 'In Transit';
    return 'Departed';
  };

  const getStatusColor = () => {
    if (progress >= 1) return 'text-green-600 bg-green-50 border-green-200';
    if (progress >= 0.8) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (progress >= 0.5) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-purple-600 bg-purple-50 border-purple-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!planePosition) return null;

  return (
    <Marker 
      position={planePosition} 
      icon={getMarkerIcon()}
      eventHandlers={{
        mouseover: (e) => {
          e.target.openPopup();
        },
        mouseout: (e) => {
          e.target.closePopup();
        },
      }}
    >
      <Popup className="custom-popup" maxWidth={320}>
        <div className="p-3">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Plane className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-800">Package in Transit</h3>
              <p className="text-xs text-gray-500">Tracking ID: {trackingId}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">Progress</span>
              <span className="text-xs font-medium text-gray-800">{Math.round(progress * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Status */}
          <div className={`p-2 rounded border text-xs font-medium mb-3 ${getStatusColor()}`}>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              {getStatusText()}
            </div>
          </div>

          {/* Package Details */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-700 font-medium">{packageName}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <div>
                <p className="text-gray-500 text-xs">Shipped</p>
                <p className="text-gray-700 font-medium text-xs">{formatDate(shipmentStart)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Estimated</p>
                <p className="text-gray-700 font-medium text-xs">{formatDate(estimatedArrival)}</p>
              </div>
            </div>
          </div>

          {/* Driver Information */}
          {assignedDriver && (
            <div className="mt-3 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-medium text-gray-800">Assigned Driver</h4>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-700">{assignedDriver}</span>
                </div>
                {driverContact && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-700">{driverContact}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default PlaneTracker;
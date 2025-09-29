'use client';

import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Plane, Clock, MapPin, User, Phone, Truck, Ship } from 'lucide-react';
import { calculateDistance, getTransportMode, getTransportDetails, formatDistance} from '../../utils/transportUtils';

interface DynamicTransportTrackerProps {
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

const DynamicTransportTracker = ({
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
}: DynamicTransportTrackerProps) => {
  const [vehiclePosition, setVehiclePosition] = useState<[number, number] | null>(null);
  const [progress, setProgress] = useState(0);
  const [bearing, setBearing] = useState(0);
  const [distance, setDistance] = useState(0);
  const [transportMode, setTransportMode] = useState<'truck' | 'plane' | 'ship'>('truck');

  // Calculate distance and determine transport mode
  useEffect(() => {
    const dist = calculateDistance(senderLat, senderLng, recipientLat, recipientLng);
    setDistance(dist);
    setTransportMode(getTransportMode(dist));
  }, [senderLat, senderLng, recipientLat, recipientLng]);

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
      
      // Interpolate vehicle position
      const lat = senderLat + (recipientLat - senderLat) * calculatedProgress;
      const lng = senderLng + (recipientLng - senderLng) * calculatedProgress;
      
      setVehiclePosition([lat, lng]);
      
      // Calculate bearing from current position to destination
      if (calculatedProgress < 1) {
        const currentBearing = calculateBearing(lat, lng, recipientLat, recipientLng);
        setBearing(currentBearing);
      } else {
        const finalBearing = calculateBearing(senderLat, senderLng, recipientLat, recipientLng);
        setBearing(finalBearing);
      }
    };

    calculateProgress();
    
    // Update every minute
    const interval = setInterval(calculateProgress, 60000);
    
    return () => clearInterval(interval);
  }, [senderLat, senderLng, recipientLat, recipientLng, shipmentStart, estimatedArrival]);

  // Get transport details
  const transportDetails = getTransportDetails(transportMode);

  // Custom vehicle icon based on transport mode
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
    }

    // Get vehicle SVG based on transport mode
    const getVehicleSVG = () => {
      if (transportMode === 'truck') {
        return `
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 18.5a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5m1.5-9 1.96 2.5H17V9.5m-11 9A1.5 1.5 0 0 1 4.5 17 1.5 1.5 0 0 1 6 15.5 1.5 1.5 0 0 1 7.5 17 1.5 1.5 0 0 1 6 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 0 0 3 3 3 3 0 0 0 3-3h6a3 3 0 0 0 3 3 3 3 0 0 0 3-3h2v-5z"/>
          </svg>
        `;
      } else if (transportMode === 'ship') {
        return `
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2M3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19M6 6h12v3.97L12 8 6 9.97V6z"/>
          </svg>
        `;
      } else {
        // Plane
        return `
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        `;
      }
    };

    return L.divIcon({
      className: 'custom-vehicle-marker',
      html: `
        <div class="relative">
          <div class="w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center" 
               style="background-color: ${transportDetails.color}; transform: rotate(${bearing - 45}deg)">
            ${getVehicleSVG()}
          </div>
          <div class="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg"
               style="background-color: ${transportDetails.color}">
            ${Math.round(progress * 100)}% Complete
          </div>
        </div>
      `,
      iconSize: [40, 60],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });
  };

  const getStatusText = () => {
    if (progress >= 1) return 'Delivered';
    if (progress >= 0.8) return 'Out for Delivery';
    if (progress >= 0.5) return `In Transit (Near Destination)`;
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const TransportIcon = transportMode === 'truck' ? Truck : transportMode === 'ship' ? Ship : Plane;

  if (!vehiclePosition) return null;

  return (
    <Marker 
      position={vehiclePosition} 
      icon={getMarkerIcon()}
      eventHandlers={{
        mouseover: (e) => {
          e.target.openPopup();
        },
        mouseout: (e) => {
          e.target.closePopup();
        },
      }}>
      <Popup className="custom-popup z-1000! relative" maxWidth={320}>
        <div className="p-3">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${transportDetails.color}20` }}>
              <TransportIcon className="w-5 h-5" style={{ color: transportDetails.color }} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-800">{transportDetails.label}</h3>
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
                className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${progress * 100}%`,
                  backgroundColor: transportDetails.color 
                }}
              ></div>
            </div>
          </div>

          {/* Distance Info */}
          <div className="mb-3 p-2 bg-gray-50 rounded">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Total Distance:</span>
              <span className="font-medium">{formatDistance(distance)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Transport Mode:</span>
              <span className="font-medium">{transportDetails.description}</span>
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
                <Truck className="w-4 h-4" style={{ color: transportDetails.color }} />
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

export default DynamicTransportTracker;
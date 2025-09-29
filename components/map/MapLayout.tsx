'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import CollapsiblePanel from './CollapsiblePanel';
import NotificationToasts from './NotificationToasts';

// Dynamic imports to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import('./MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
});

const MapControls = dynamic(() => import('./MapControls'), { ssr: false });
const TrackingMarkers = dynamic(() => import('./TrackingMarkers'), { ssr: false });
const DynamicTransportTracker = dynamic(() => import('./DynamicTransportTracker'), { ssr: false });
const SmartRoutePolyline = dynamic(() => import('./SmartRoutePolyline'), { ssr: false });
const OfflineMapCache = dynamic(() => import('./OfflineMapCache'), { ssr: false });

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

interface MapLayoutProps {
  trackingData: TrackingData;
}

const MapLayout = ({ trackingData }: MapLayoutProps) => {
  const [progress, setProgress] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Calculate shipment progress and current position
  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      const start = new Date(trackingData.dateReceived);
      const end = new Date(trackingData.dateDelivered);
      
      const totalDuration = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      
      let calculatedProgress = elapsed / totalDuration;
      
      // Clamp between 0 and 1
      calculatedProgress = Math.max(0, Math.min(1, calculatedProgress));
      
      setProgress(calculatedProgress);

      // Calculate current position
      const senderLat = trackingData.sender.latitude;
      const senderLng = trackingData.sender.longitude;
      const recipientLat = trackingData.recipient.latitude;
      const recipientLng = trackingData.recipient.longitude;

      const currentLat = senderLat + (recipientLat - senderLat) * calculatedProgress;
      const currentLng = senderLng + (recipientLng - senderLng) * calculatedProgress;
      
      setCurrentPosition([currentLat, currentLng]);
    };

    calculateProgress();
    
    // Update every minute
    const interval = setInterval(calculateProgress, 60000);
    
    return () => clearInterval(interval);
  }, [trackingData.dateReceived, trackingData.dateDelivered, trackingData.sender, trackingData.recipient]);

  return (
    <div className="relative w-full h-screen">
      {/* Map Container */}
      <MapContainer trackingData={trackingData}>
        {/* Smart Route (uses roads for short distances, straight for long) */}
        <SmartRoutePolyline
          senderLat={trackingData.sender.latitude}
          senderLng={trackingData.sender.longitude}
          recipientLat={trackingData.recipient.latitude}
          recipientLng={trackingData.recipient.longitude}
          progress={progress}
          currentPosition={currentPosition || [0, 0]}
        />

        {/* Location Markers */}
        <TrackingMarkers
          sender={trackingData.sender}
          recipient={trackingData.recipient}
          packageName={trackingData.packageName}
        />

        {/* Dynamic Transport Tracker (Truck/Plane/Ship based on distance) */}
        <DynamicTransportTracker
          senderLat={trackingData.sender.latitude}
          senderLng={trackingData.sender.longitude}
          recipientLat={trackingData.recipient.latitude}
          recipientLng={trackingData.recipient.longitude}
          shipmentStart={trackingData.dateReceived}
          estimatedArrival={trackingData.dateDelivered}
          packageName={trackingData.packageName}
          trackingId={trackingData.trackingID}
          assignedDriver={trackingData.assignedDriver}
          driverContact={trackingData.driverContact}
        />

        {/* Map Controls */}
        {currentPosition && (
          <MapControls
            currentPosition={currentPosition}
            senderPosition={[trackingData.sender.latitude, trackingData.sender.longitude]}
            recipientPosition={[trackingData.recipient.latitude, trackingData.recipient.longitude]}
            onTogglePanel={() => setIsPanelOpen(!isPanelOpen)}
            isPanelOpen={isPanelOpen}
          />
        )}
      </MapContainer>

      {/* Offline Map Cache */}
      <OfflineMapCache
        bounds={[
          [trackingData.sender.latitude, trackingData.sender.longitude],
          [trackingData.recipient.latitude, trackingData.recipient.longitude]
        ]}
        onCacheComplete={() => console.log('Map tiles cached successfully')}
      />

      {/* Collapsible Panel */}
      <CollapsiblePanel 
        trackingData={trackingData}
        progress={progress}
      />

      {/* Notification Toasts */}
      <NotificationToasts
        progress={progress}
        trackingId={trackingData.trackingID}
        packageName={trackingData.packageName}
      />

      {/* Optional: Branding/Logo */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-semibold text-gray-800">Package Tracking</p>
          <p className="text-xs text-gray-600">Real-time location updates</p>
        </div>
      </div>
    </div>
  );
};

export default MapLayout;
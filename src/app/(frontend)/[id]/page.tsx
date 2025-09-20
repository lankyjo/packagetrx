import { getTrackingInfo, trackingIdExists } from '@/lib/checkExistingId';
import MapLayout from '../../../../components/map/MapLayout'; 
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import TrackingNotFound from '../../../../components/TrackingNotFound';

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

// Loading component for better UX
const TrackingLoader = () => (
  <div className="w-full h-screen flex items-center justify-center ">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Tracking Information</h2>
      <p className="text-gray-500">Please wait while we fetch your package details...</p>
    </div>
  </div>
);

const MapPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  // Validate tracking ID format (optional)
  const trackingIdPattern = /^[A-Z]{3}-\d{6}-[a-zA-Z0-9-]+$/;
  if (!trackingIdPattern.test(id)) {
    notFound();
  }
  
  try {
    // Check if tracking ID exists
    const exists = await trackingIdExists(id);
    
    if (!exists) {
      // notFound();
     return <TrackingNotFound/>
    }

    // Get tracking information
    const trackingInfo = await getTrackingInfo(id);
    
    if (!trackingInfo) {
      // notFound();
      return <TrackingNotFound/>
    }

    // Ensure we have the required coordinate data
    if (!trackingInfo.sender?.latitude || !trackingInfo.sender?.longitude || 
        !trackingInfo.recipient?.latitude || !trackingInfo.recipient?.longitude) {
      
      return (
        <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Package Found!</h1>
            <p className="text-gray-600 mb-2">
              Your package <strong>{trackingInfo.packageName}</strong> exists in our system.
            </p>
            <p className="text-yellow-700 text-sm mb-6">
              However, location tracking is temporarily unavailable for this shipment.
            </p>
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Tracking ID:</strong> {id}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Status:</strong> Location data pending
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    // Transform the data to match our component interface
    const trackingData: TrackingData = {
      trackingID: trackingInfo.trackingID,
      packageName: trackingInfo.packageName,
      weight: trackingInfo.weight || 0,
      declaredValue: trackingInfo.declaredValue || 0,
      sender: {
        name: trackingInfo.sender.name,
        phone: trackingInfo.sender.phone,
        email: trackingInfo.sender.email,
        address: trackingInfo.sender.address,
        latitude: trackingInfo.sender.latitude,
        longitude: trackingInfo.sender.longitude,
      },
      recipient: {
        name: trackingInfo.recipient.name,
        phone: trackingInfo.recipient.phone,
        email: trackingInfo.recipient.email,
        address: trackingInfo.recipient.address,
        latitude: trackingInfo.recipient.latitude,
        longitude: trackingInfo.recipient.longitude,
      },
      dateReceived: trackingInfo.dateReceived,
      dateDelivered: trackingInfo.dateDelivered,
      assignedDriver: trackingInfo.assignedDriver || 'Not assigned',
      driverContact: trackingInfo.driverContact || 'Not available',
      createdAt: trackingInfo.createdAt,
      updatedAt: trackingInfo.updatedAt,
    };

    return (
      <Suspense fallback={<TrackingLoader />}>
        <MapLayout trackingData={trackingData} />
      </Suspense>
    );
    
  } catch (error) {
    console.error('Error loading tracking data:', error);
    
    // Check if it's a network error vs. not found error
    if (error instanceof Error && error.message.includes('not found')) {
      notFound();
    }
    
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Service Temporarily Unavailable</h1>
          <p className="text-gray-600 mb-6">
            We&#39;re experiencing technical difficulties loading tracking information.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.history.back()} 
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Tracking ID: {id}
          </p>
        </div>
      </div>
    );
  }
};

export default MapPage;
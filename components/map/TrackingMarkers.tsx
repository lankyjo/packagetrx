'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Package, User, Phone, Mail, MapPin } from 'lucide-react';

interface LocationData {
  name: string;
  phone: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface TrackingMarkersProps {
  sender: LocationData;
  recipient: LocationData;
  packageName: string;
}

const TrackingMarkers = ({ sender, recipient, packageName }: TrackingMarkersProps) => {
  // Custom sender marker icon (green with pulse)
  const senderIcon = L.divIcon({
    className: 'custom-marker-sender',
    html: `
      <div class="relative">
        <div class="absolute w-10 h-10 bg-green-400 rounded-full opacity-30 animate-ping"></div>
        <div class="relative w-10 h-10 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
          </svg>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-green-500"></div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });

  // Custom recipient marker icon (blue with pulse)
  const recipientIcon = L.divIcon({
    className: 'custom-marker-recipient',
    html: `
      <div class="relative">
        <div class="absolute w-10 h-10 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
        <div class="relative w-10 h-10 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
          </svg>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-blue-500"></div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });

  return (
    <>
      {/* Sender Marker */}
      <Marker 
        position={[sender.latitude, sender.longitude]} 
        icon={senderIcon}
        eventHandlers={{
          mouseover: (e) => {
            e.target.openPopup();
          },
          mouseout: (e) => {
            e.target.closePopup();
          },
        }}
      >
        <Popup className="custom-popup" maxWidth={300}>
          <div className="p-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-800">Sender</h3>
                <p className="text-xs text-gray-500">Package Origin</p>
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-gray-400" />
                <span className="text-gray-700">{sender.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-gray-400" />
                <span className="text-gray-700">{sender.phone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-gray-400" />
                <span className="text-gray-700">{sender.email}</span>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                <span className="text-gray-700 leading-tight">{sender.address}</span>
              </div>
              
              <div className="mt-3 p-2 bg-green-50 rounded border-l-2 border-green-200">
                <p className="text-xs text-green-700 font-medium">Package: {packageName}</p>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>

      {/* Recipient Marker */}
      <Marker 
        position={[recipient.latitude, recipient.longitude]} 
        icon={recipientIcon}
        eventHandlers={{
          mouseover: (e) => {
            e.target.openPopup();
          },
          mouseout: (e) => {
            e.target.closePopup();
          },
        }}
      >
        <Popup className="custom-popup" maxWidth={300}>
          <div className="p-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-800">Recipient</h3>
                <p className="text-xs text-gray-500">Delivery Destination</p>
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-gray-400" />
                <span className="text-gray-700">{recipient.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-gray-400" />
                <span className="text-gray-700">{recipient.phone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-gray-400" />
                <span className="text-gray-700">{recipient.email}</span>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                <span className="text-gray-700 leading-tight">{recipient.address}</span>
              </div>
              
              <div className="mt-3 p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                <p className="text-xs text-blue-700 font-medium">Destination for: {packageName}</p>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
};

export default TrackingMarkers;
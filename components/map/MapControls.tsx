'use client';

import { useState } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ZoomIn, 
  ZoomOut, 
  Navigation, 
  Plane,
} from 'lucide-react';

interface MapControlsProps {
  currentPosition: [number, number];
  senderPosition: [number, number];
  recipientPosition: [number, number];
  onTogglePanel?: () => void;
  isPanelOpen?: boolean;
}

const MapControls = ({ 
  currentPosition, 
  senderPosition, 
  recipientPosition,
}: MapControlsProps) => {
  const map = useMap();
  const [isFollowingPlane, setIsFollowingPlane] = useState(false);

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleResetView = () => {
    const bounds = [senderPosition, recipientPosition];
    map.fitBounds(bounds, { padding: [50, 50] });
    setIsFollowingPlane(false);
  };

  const handleCenterOnPlane = () => {
    map.setView(currentPosition, 12, { animate: true });
    setIsFollowingPlane(true);
  };

  const handleCenterOnSender = () => {
    map.setView(senderPosition, 14, { animate: true });
    setIsFollowingPlane(false);
  };

  const handleCenterOnRecipient = () => {
    map.setView(recipientPosition, 14, { animate: true });
    setIsFollowingPlane(false);
  };

  // Auto-follow plane when enabled
  useState(() => {
    if (isFollowingPlane) {
      const timer = setInterval(() => {
        map.panTo(currentPosition, { animate: true });
      }, 5000); // Update every 5 seconds

      return () => clearInterval(timer);
    }
  });

  return (
    <TooltipProvider>
      <div className="fixed left-4 top-20 z-[1000] flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="w-10 h-10 rounded-none border-b border-gray-200 text-gray-800 hover:text-gray-500"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="w-10 h-10 rounded-none border-b border-gray-200 text-gray-800 hover:text-gray-500"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Navigation Controls */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCenterOnPlane}
                className={`w-10 h-10 rounded-none border-b text-gray-700 border-gray-200 ${
                  isFollowingPlane ? 'bg-purple-100 text-purple-700' : ''
                }`}
              >
                <Plane className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Center on Package</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCenterOnSender}
                className="w-10 h-10 rounded-none border-b border-gray-200"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Center on Sender</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCenterOnRecipient}
                className="w-10 h-10 rounded-none border-b border-gray-200"
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Center on Recipient</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetView}
                className="w-10 h-10 rounded-none text-gray-800 hover:text-gray-500"
              >
                <Navigation className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Reset View</p>
            </TooltipContent>
          </Tooltip>
        </div>

      </div>
    </TooltipProvider>
  );
};

export default MapControls;
'use client';

import { CheckCircle, Plane, Package, Truck, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
  status: 'completed' | 'current' | 'upcoming';
  color: string;
}

interface ProgressTimelineProps {
  progress: number;
  shipmentStart: string;
  estimatedArrival: string;
  packageName: string;
  currentStatus: string;
}

const ProgressTimeline = ({ 
  progress, 
  shipmentStart, 
  estimatedArrival, 
  packageName,
  currentStatus 
}: ProgressTimelineProps) => {
  
  const getTimelineEvents = (): TimelineEvent[] => {
    const startDate = new Date(shipmentStart);
    const endDate = new Date(estimatedArrival);
    // const now = new Date();
    
    // Calculate intermediate timestamps
    const duration = endDate.getTime() - startDate.getTime();
    const quarter = duration / 4;
    
    const events: TimelineEvent[] = [
      {
        id: 'picked-up',
        title: 'Package Picked Up',
        description: 'Your package has been collected and is ready for transport',
        timestamp: startDate.toISOString(),
        icon: Package,
        status: progress >= 0 ? 'completed' : 'upcoming',
        color: 'text-green-600'
      },
      {
        id: 'in-transit-departure',
        title: 'Departed Origin',
        description: 'Package has left the origin facility',
        timestamp: new Date(startDate.getTime() + quarter).toISOString(),
        icon: Plane,
        status: progress >= 0.25 ? 'completed' : progress >= 0.1 ? 'current' : 'upcoming',
        color: 'text-purple-600'
      },
      {
        id: 'in-transit-midway',
        title: 'In Transit',
        description: 'Your package is on its way to the destination',
        timestamp: new Date(startDate.getTime() + quarter * 2).toISOString(),
        icon: Plane,
        status: progress >= 0.5 ? 'completed' : progress >= 0.25 ? 'current' : 'upcoming',
        color: 'text-purple-600'
      },
      {
        id: 'out-for-delivery',
        title: 'Out for Delivery',
        description: 'Package is with the delivery driver',
        timestamp: new Date(startDate.getTime() + quarter * 3).toISOString(),
        icon: Truck,
        status: progress >= 0.8 ? 'completed' : progress >= 0.7 ? 'current' : 'upcoming',
        color: 'text-blue-600'
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Package has been successfully delivered',
        timestamp: endDate.toISOString(),
        icon: CheckCircle,
        status: progress >= 1 ? 'completed' : progress >= 0.9 ? 'current' : 'upcoming',
        color: 'text-green-600'
      }
    ];

    return events;
  };

  const events = getTimelineEvents();

  const formatTimestamp = (timestamp: string, isEstimate: boolean = false) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date <= now || !isEstimate) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return `Est. ${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'current':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 animate-pulse">Current</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600">Upcoming</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Delivery Timeline</h3>
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          {Math.round(progress * 100)}% Complete
        </Badge>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div 
          className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-green-500 to-purple-500 transition-all duration-1000 ease-out"
          style={{ height: `${Math.min(progress * 100, 100)}%` }}
        ></div>

        {/* Timeline Events */}
        <div className="space-y-6">
          {events.map((event) => {
            const Icon = event.icon;
            // const isLast = index === events.length - 1;
            
            return (
              <div key={event.id} className="relative flex items-start gap-4">
                {/* Icon */}
                <div className={`
                  relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${event.status === 'completed' 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : event.status === 'current'
                    ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}>
                  {event.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${
                      event.status === 'completed' ? 'text-muted-foreground' 
                      : event.status === 'current' ? 'text-blue-900'
                      : 'text-gray-500'
                    }`}>
                      {event.title}
                    </h4>
                    {getStatusBadge(event.status)}
                  </div>
                  
                  <p className={`text-sm mt-1 ${
                    event.status === 'completed' ? 'text-gray-600' 
                    : event.status === 'current' ? 'text-blue-600'
                    : 'text-gray-400'
                  }`}>
                    {event.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className={`text-xs ${
                      event.status === 'completed' ? 'text-gray-500' 
                      : event.status === 'current' ? 'text-blue-500'
                      : 'text-gray-400'
                    }`}>
                      {formatTimestamp(event.timestamp, event.status === 'upcoming')}
                    </span>
                  </div>

                  {/* Current Status Detail */}
                  {event.status === 'current' && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-2 border-blue-200">
                      <p className="text-sm text-blue-800 font-medium">
                        Current Status: {currentStatus}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Package: {packageName}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Started: {formatTimestamp(shipmentStart)}</span>
          <span>Est. Delivery: {formatTimestamp(estimatedArrival, true)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTimeline;
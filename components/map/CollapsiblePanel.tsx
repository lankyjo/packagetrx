'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import ProgressTimeline from './ProgressTimeline';
import { 
  Package, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Weight, 
  DollarSign, 
  Truck,
  ChevronRight,
  Clock,
  CheckCircle,
  Plane
} from 'lucide-react';

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

interface CollapsiblePanelProps {
  trackingData: TrackingData;
  progress: number;
}

const CollapsiblePanel = ({ trackingData, progress }: CollapsiblePanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusInfo = () => {
    if (progress >= 1) return { status: 'Delivered', color: 'bg-green-500', icon: CheckCircle };
    if (progress >= 0.8) return { status: 'Out for Delivery', color: 'bg-blue-500', icon: Truck };
    if (progress >= 0.5) return { status: 'In Transit (Near Destination)', color: 'bg-orange-500', icon: Plane };
    if (progress >= 0.2) return { status: 'In Transit', color: 'bg-purple-500', icon: Plane };
    return { status: 'Departed', color: 'bg-purple-500', icon: Plane };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(value);
  };

  return (
    <>
      {/* Trigger Button - Fixed positioned */}
      <div className="fixed  animate-bounce top-48 left-4 z-[1000]">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="shadow-lg bg-white text-black hover:bg-gray-100 border border-gray-200"
            >
              <Package className="w-4 h-4 mr-2" />
              Package Details
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </SheetTrigger>

          <SheetContent className="w-full md:w-[600px] px-4 overflow-y-auto" side="right">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Shipment Tracking
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <StatusIcon className="w-5 h-5" />
                    Current Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className={`${statusInfo.color} text-white`}>
                        {statusInfo.status}
                      </Badge>
                      <span className="text-sm font-medium">{Math.round(progress * 100)}% Complete</span>
                    </div>
                    <Progress value={progress * 100} className="w-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Progress Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Delivery Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressTimeline
                    progress={progress}
                    shipmentStart={trackingData.dateReceived}
                    estimatedArrival={trackingData.dateDelivered}
                    packageName={trackingData.packageName}
                    currentStatus={statusInfo.status}
                  />
                </CardContent>
              </Card>

              {/* Package Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Package Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Tracking ID</p>
                    <p className="font-mono text-lg font-semibold">{trackingData.trackingID}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm text-gray-600">Package Name</p>
                    <p className="font-medium">{trackingData.packageName}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Weight</p>
                        <p className="font-medium">{trackingData.weight}g</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Declared Value</p>
                        <p className="font-medium">{formatCurrency(trackingData.declaredValue)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sender Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <User className="w-5 h-5" />
                    Sender Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{trackingData.sender.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{trackingData.sender.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{trackingData.sender.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <span className="text-sm">{trackingData.sender.address}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recipient Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <User className="w-5 h-5" />
                    Recipient Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{trackingData.recipient.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{trackingData.recipient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{trackingData.recipient.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <span className="text-sm">{trackingData.recipient.address}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Driver Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Assigned Driver
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{trackingData.assignedDriver}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{trackingData.driverContact}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Delivery Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Shipped</p>
                      <p className="font-medium">{formatDate(trackingData.dateReceived)}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-medium">{formatDate(trackingData.dateDelivered)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Close Button */}
            <SheetFooter className='sticky z-50 bottom-0 bg-background'>
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full"
                variant="outline"
              >
                Close
              </Button>
            </SheetFooter>


          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default CollapsiblePanel;
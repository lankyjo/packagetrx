'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';
import CreateTrackingForm from './CreateTrackingForm';

interface TrackingData {
  id: string;
  packageName: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  declaredValue?: number;
  sender: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  recipient: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  dateReceived: string;
  dateDelivered: string;
  assignedDriver: string;
  driverContact: string;
}

interface CreateTrackingSheetProps {
  editData?: TrackingData;
  isEditMode?: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateTrackingSheet({ 
  editData, 
  isEditMode = false, 
  trigger, 
  open, 
  onOpenChange 
}: CreateTrackingSheetProps) {
  // Use internal state only if not in edit mode (i.e., when using the default trigger button)
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Determine which open state and handler to use
  const isOpen = isEditMode ? open : internalIsOpen;
  const setIsOpen = isEditMode ? onOpenChange : setInternalIsOpen;

  useEffect(() => setMounted(true), []);

  const handleSuccess = () => {
    // Safely call the close handler
    if (setIsOpen) {
      setIsOpen(false);
    }
    router.refresh();
  };

  if (!mounted) return null;

  return (
    <Sheet 
      open={isOpen} 
      onOpenChange={setIsOpen} // This will be setShowEditSheet in the parent component
    >
      <SheetTrigger asChild>
        {/* Only render the trigger if we are NOT in controlled edit mode or if a custom trigger is passed */}
        {!isEditMode && (trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            New Tracking
          </Button>
        ))}
        {/* If in edit mode, the trigger is handled by the parent component's click handler */}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Edit Tracking Info' : 'Create New Tracking ID'}</SheetTitle>
          <SheetDescription>
            {isEditMode 
              ? 'Update the package details below' 
              : 'Fill in the package details to generate a new tracking ID'}
          </SheetDescription>
        </SheetHeader>
        <CreateTrackingForm 
          onSuccess={handleSuccess} 
          editData={editData}
          isEditMode={isEditMode}
        />
      </SheetContent>
    </Sheet>
  );
}
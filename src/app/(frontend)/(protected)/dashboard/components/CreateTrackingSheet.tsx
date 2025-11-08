'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';
import CreateTrackingForm from './CreateTrackingForm';

export function CreateTrackingSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleSuccess = () => {
    setIsOpen(false);
    router.refresh();
  };

  if (!mounted) return null; // Only render on the client

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          New Tracking
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Tracking ID</SheetTitle>
          <SheetDescription>
            Fill in the package details to generate a new tracking ID
          </SheetDescription>
        </SheetHeader>
        <CreateTrackingForm onSuccess={handleSuccess} />
      </SheetContent>
    </Sheet>
  );
}

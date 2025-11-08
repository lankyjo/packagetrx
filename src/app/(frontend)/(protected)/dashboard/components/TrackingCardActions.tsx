'use client'

import React, { useState, useMemo } from 'react' 
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CreateTrackingSheet } from './CreateTrackingSheet'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// Reusing the interface from the parent components for context
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

interface TrackingCardActionsProps {
  trackingData: TrackingData;
}

// Converts any date string (like an ISO string) into a simple 'yyyy-MM-dd' string,
// which is the format expected by the 'parse(..., "yyyy-MM-dd", ...)' function in the form.
const safeStringConvert = (dateString: string): string => {
    // Return empty string if input is null/undefined/empty
    if (!dateString) return ''; 
    try {
        const date = new Date(dateString);
        // Check for validity (new Date('invalid').getTime() returns NaN)
        if (isNaN(date.getTime())) return '';

        // Return a simple 'yyyy-MM-dd' string (first 10 characters of ISO string)
        return date.toISOString().substring(0, 10);
    } catch (e) {
        console.error(e);
        // Fallback for unexpected parsing errors
        return '';
    }
};


export function TrackingCardActions({ trackingData }: TrackingCardActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showEditSheet, setShowEditSheet] = useState(false)
  const router = useRouter()

  // Prepare the data for the form by converting date strings to the required format
  const preparedEditData = useMemo(() => {
      // Create a shallow copy to avoid mutating the prop
      const dataForForm = { ...trackingData };

      // Convert date strings to the 'yyyy-MM-dd' string format
    //   eslint-disable-next-line
      dataForForm.dateReceived = safeStringConvert(trackingData.dateReceived) as any;
    //   eslint-disable-next-line
      dataForForm.dateDelivered = safeStringConvert(trackingData.dateDelivered) as any;

      return dataForForm;
  }, [trackingData]); 

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/createTrackingID', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: trackingData.id }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to delete tracking info')

      toast.success('Tracking info deleted successfully')
      setShowDeleteDialog(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete tracking info')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => setShowEditSheet(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Pass the prepared data with clean date strings */}
      <CreateTrackingSheet
        editData={preparedEditData as TrackingData} 
        isEditMode={true}
        open={showEditSheet} 
        onOpenChange={setShowEditSheet} 
        trigger={<div style={{ display: 'none' }} />}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the tracking information for{' '}
              <span className="font-semibold">{trackingData.packageName}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver, Controller } from 'react-hook-form'
import { z } from 'zod'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { format, parse } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const formSchema = z.object({
  packageName: z.string().min(3, 'Package name must be at least 3 characters').max(200),
  weight: z.coerce.number().min(0).optional().nullable(),
  length: z.coerce.number().min(0).optional().nullable(),
  width: z.coerce.number().min(0).optional().nullable(),
  height: z.coerce.number().min(0).optional().nullable(),
  declaredValue: z.coerce.number().min(0).optional().nullable(),
  senderName: z.string().min(2, 'Sender name is required').max(100),
  senderPhone: z.string().min(10, 'Valid phone number required'),
  senderEmail: z.string().email('Valid email required'),
  senderAddress: z.string().min(10, 'Complete address required').max(500),
  recipientName: z.string().min(2, 'Recipient name is required').max(100),
  recipientPhone: z.string().min(10, 'Valid phone number required'),
  recipientEmail: z.string().email('Valid email required'),
  recipientAddress: z.string().min(10, 'Complete address required').max(500),
  dateReceived: z.date({ message: 'Date received is required' }),
  dateDelivered: z.date({ message: 'Estimated delivery date is required' }),
  assignedDriver: z.string().min(2, 'Driver name is required'),
  driverContact: z.string().min(10, 'Driver contact is required'),
})

type FormValues = z.infer<typeof formSchema>

type GeocodingState = {
  isValidating: boolean
  isValid: boolean | null
  message: string
}

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

interface CreateTrackingFormProps {
  onSuccess?: () => void;
  editData?: TrackingData;
  isEditMode?: boolean;
}

const geocodeAddress = async (address: string): Promise<boolean> => {
  try {
    const encodedAddress = encodeURIComponent(address)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          'User-Agent': 'packagetrx/1.0 (ikejijoshua69@gmail.com)',
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Geocoding service failed with status: ${response.status}`)
    }

    const data = await response.json()
    return data && data.length > 0
  } catch (error) {
    console.error('Geocoding error:', error)
    return false
  }
}

const CreateTrackingForm = ({ onSuccess, editData, isEditMode = false }: CreateTrackingFormProps) => {
  const { user } = useKindeBrowserClient()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const [senderGeoState, setSenderGeoState] = React.useState<GeocodingState>({
    isValidating: false,
    isValid: isEditMode ? true : null,
    message: isEditMode ? '✓ Address verified and can be geocoded' : '',
  })
  
  const [recipientGeoState, setRecipientGeoState] = React.useState<GeocodingState>({
    isValidating: false,
    isValid: isEditMode ? true : null,
    message: isEditMode ? '✓ Address verified and can be geocoded' : '',
  })

  const debounceTimerRef = React.useRef<{ sender: NodeJS.Timeout | null; recipient: NodeJS.Timeout | null }>({
    sender: null,
    recipient: null,
  })

  const getDefaultValues = (): Partial<FormValues> => {
    if (isEditMode && editData) {
      return {
        packageName: editData.packageName,
        weight: editData.weight ?? undefined,
        length: editData.length ?? undefined,
        width: editData.width ?? undefined,
        height: editData.height ?? undefined,
        declaredValue: editData.declaredValue ?? undefined,
        senderName: editData.sender.name,
        senderPhone: editData.sender.phone,
        senderEmail: editData.sender.email,
        senderAddress: editData.sender.address,
        recipientName: editData.recipient.name,
        recipientPhone: editData.recipient.phone,
        recipientEmail: editData.recipient.email,
        recipientAddress: editData.recipient.address,
        dateReceived: parse(editData.dateReceived, 'yyyy-MM-dd', new Date()),
        dateDelivered: parse(editData.dateDelivered, 'yyyy-MM-dd', new Date()),
        assignedDriver: editData.assignedDriver,
        driverContact: editData.driverContact,
      }
    }
    return {
      packageName: '',
      senderName: '',
      declaredValue: undefined,
      senderPhone: '',
      senderEmail: '',
      senderAddress: '',
      recipientName: '',
      recipientPhone: '',
      recipientEmail: '',
      recipientAddress: '',
      assignedDriver: '',
      driverContact: '',
    }
  }

  const { register, handleSubmit, reset, formState: { errors }, watch, control } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: getDefaultValues(),
  })

  const senderAddress = watch('senderAddress')
  const recipientAddress = watch('recipientAddress')

  const validateAddress = async (address: string, type: 'sender' | 'recipient') => {
    const setState = type === 'sender' ? setSenderGeoState : setRecipientGeoState
    
    if (!address || address.length < 10) {
      setState({ isValidating: false, isValid: null, message: '' })
      return
    }

    setState({ isValidating: true, isValid: null, message: 'Validating address...' })

    const isValid = await geocodeAddress(address)

    if (isValid) {
      setState({
        isValidating: false,
        isValid: true,
        message: '✓ Address verified and can be geocoded',
      })
    } else {
      setState({
        isValidating: false,
        isValid: false,
        message: '✗ Address could not be geocoded. Please provide a more specific address with city/state/country.',
      })
    }
  }

  const debouncedValidate = (address: string, type: 'sender' | 'recipient') => {
    if (debounceTimerRef.current[type]) {
      clearTimeout(debounceTimerRef.current[type]!)
    }

    debounceTimerRef.current[type] = setTimeout(() => {
      validateAddress(address, type)
    }, 800)
  }

  React.useEffect(() => {
    if (!isEditMode) {
      if (senderAddress && senderAddress.length >= 10) {
        debouncedValidate(senderAddress, 'sender')
      } else {
        setSenderGeoState({ isValidating: false, isValid: null, message: '' })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderAddress, isEditMode])

  React.useEffect(() => {
    if (!isEditMode) {
      if (recipientAddress && recipientAddress.length >= 10) {
        debouncedValidate(recipientAddress, 'recipient')
      } else {
        setRecipientGeoState({ isValidating: false, isValid: null, message: '' })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientAddress, isEditMode])

  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current.sender) clearTimeout(debounceTimerRef.current.sender)
        // eslint-disable-next-line
      if (debounceTimerRef.current.recipient) clearTimeout(debounceTimerRef.current.recipient)
    }
  }, [])

  const handleAddressBlur = (type: 'sender' | 'recipient') => {
    const address = type === 'sender' ? senderAddress : recipientAddress
    if (debounceTimerRef.current[type]) {
      clearTimeout(debounceTimerRef.current[type]!)
    }
    validateAddress(address, type)
  }

  const onSubmit = async (values: FormValues) => {
    if (!user?.id) {
      toast.error('You must be logged in')
      return
    }

    // Validate addresses before submission
    if (senderGeoState.isValid === null || recipientGeoState.isValid === null) {
      toast.error('Please wait for address validation to complete')
      return
    }

    if (!senderGeoState.isValid || !recipientGeoState.isValid) {
      toast.error('Please provide valid addresses that can be geocoded')
      return
    }

    setIsSubmitting(true)
    try {
      const submitData = {
        ...values,
        dateReceived: format(values.dateReceived, 'yyyy-MM-dd'),
        dateDelivered: format(values.dateDelivered, 'yyyy-MM-dd'),
      }

      const endpoint = '/api/createTrackingID'
      const method = isEditMode ? 'PATCH' : 'POST'
      const body = isEditMode 
        ? { id: editData?.id, ...submitData }
        : { userId: user.id, ...submitData }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} tracking info`)

      toast.success(
        isEditMode 
          ? 'Tracking info updated successfully' 
          : `Tracking ID created: ${data.data.trackingID}`,
        { duration: 4000 }
      )
      
      reset()
      setSenderGeoState({ isValidating: false, isValid: null, message: '' })
      setRecipientGeoState({ isValidating: false, isValid: null, message: '' })
      
      setTimeout(() => {
        onSuccess?.()
      }, 500)
      
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderGeocodingStatus = (state: GeocodingState) => {
    if (state.isValidating) {
      return (
        <div className="flex items-center gap-2 text-blue-600 text-sm mt-1">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{state.message}</span>
        </div>
      )
    }

    if (state.isValid === true) {
      return <p className="text-green-600 text-sm mt-1">{state.message}</p>
    }

    if (state.isValid === false) {
      return <p className="text-red-600 text-sm mt-1">{state.message}</p>
    }

    return <p className="text-gray-500 text-sm mt-1">Will be automatically geocoded</p>
  }

  const canSubmit = senderGeoState.isValid === true && recipientGeoState.isValid === true && !isSubmitting

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-4xl mx-auto p-6">
      {/* PACKAGE INFO */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Package Information</h2>

        <div>
          <label className="block mb-1 font-medium">Package Name *</label>
          <input
            {...register('packageName')}
            className="w-full border rounded p-2"
            placeholder="Enter package description"
          />
          {errors.packageName && <p className="text-red-500 text-sm">{errors.packageName.message}</p>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['weight', 'length', 'width', 'height'].map((field) => (
            <div key={field}>
              <label className="block mb-1 font-medium capitalize">
                {field} ({field === 'weight' ? 'kg' : 'cm'})
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                {...register(field as keyof FormValues)}
                className="w-full border rounded p-2"
              />
              {errors[field as keyof FormValues] && (
                <p className="text-red-500 text-sm">
                  {errors[field as keyof FormValues]?.message as string}
                </p>
              )}
            </div>
          ))}
        </div>

        <div>
          <label className="block mb-1 font-medium">Declared Value (₦)</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('declaredValue')}
            className="w-full border rounded p-2"
          />
          {errors.declaredValue && <p className="text-red-500 text-sm">{errors.declaredValue.message}</p>}
        </div>
      </section>

      {/* SENDER INFO */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Sender Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Full Name *</label>
            <input
              {...register('senderName')}
              placeholder="Full name of sender"
              className="w-full border rounded p-2"
            />
            {errors.senderName && <p className="text-red-500 text-sm">{errors.senderName.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone *</label>
            <input
              {...register('senderPhone')}
              placeholder="+234 800 123 4567"
              className="w-full border rounded p-2"
            />
            {errors.senderPhone && <p className="text-red-500 text-sm">{errors.senderPhone.message}</p>}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Email *</label>
          <input
            type="email"
            {...register('senderEmail')}
            placeholder="sender@example.com"
            className="w-full border rounded p-2"
          />
          {errors.senderEmail && <p className="text-red-500 text-sm">{errors.senderEmail.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Address *</label>
          <textarea
            {...register('senderAddress')}
            onBlur={() => handleAddressBlur('sender')}
            placeholder="Complete pickup address with landmarks"
            rows={3}
            className="w-full border rounded p-2 resize-none"
          />
          {renderGeocodingStatus(senderGeoState)}
          {errors.senderAddress && <p className="text-red-500 text-sm">{errors.senderAddress.message}</p>}
        </div>
      </section>

      {/* RECIPIENT INFO */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Recipient Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Full Name *</label>
            <input
              {...register('recipientName')}
              placeholder="Full name of recipient"
              className="w-full border rounded p-2"
            />
            {errors.recipientName && <p className="text-red-500 text-sm">{errors.recipientName.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone *</label>
            <input
              {...register('recipientPhone')}
              placeholder="+234 800 123 4567"
              className="w-full border rounded p-2"
            />
            {errors.recipientPhone && <p className="text-red-500 text-sm">{errors.recipientPhone.message}</p>}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Email *</label>
          <input
            type="email"
            {...register('recipientEmail')}
            placeholder="recipient@example.com"
            className="w-full border rounded p-2"
          />
          {errors.recipientEmail && <p className="text-red-500 text-sm">{errors.recipientEmail.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Address *</label>
          <textarea
            {...register('recipientAddress')}
            onBlur={() => handleAddressBlur('recipient')}
            placeholder="Complete delivery address with landmarks"
            rows={3}
            className="w-full border rounded p-2 resize-none"
          />
          {renderGeocodingStatus(recipientGeoState)}
          {errors.recipientAddress && <p className="text-red-500 text-sm">{errors.recipientAddress.message}</p>}
        </div>
      </section>

      {/* TRACKING DATES */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Tracking Dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Date Received *</label>
            <Controller
              control={control}
              name="dateReceived"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dateReceived && <p className="text-red-500 text-sm">{errors.dateReceived.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Estimated Delivery Date *</label>
            <Controller
              control={control}
              name="dateDelivered"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dateDelivered && <p className="text-red-500 text-sm">{errors.dateDelivered.message}</p>}
          </div>
        </div>
      </section>

      {/* DRIVER INFO */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Driver Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Assigned Driver *</label>
            <input {...register('assignedDriver')} placeholder="Driver name or ID" className="w-full border rounded p-2" />
            {errors.assignedDriver && <p className="text-red-500 text-sm">{errors.assignedDriver.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Driver Contact *</label>
            <input {...register('driverContact')} placeholder="+234 800 123 4567" className="w-full border rounded p-2" />
            {errors.driverContact && <p className="text-red-500 text-sm">{errors.driverContact.message}</p>}
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Tracking Info' : 'Create Tracking Info')}
      </button>
    </form>
  )
}

export default CreateTrackingForm
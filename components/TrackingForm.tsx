'use client'
import React, { useEffect } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    trackingID: z.string().min(2).max(50).startsWith("TRX-", "TrackingID must start with TRX"),
})


const TrackingForm = () => {
        const router = useRouter();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            trackingID: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.push(`/${values.trackingID}`)
    }

    useEffect(() => {
        const errors = form.formState.errors
        if (errors.trackingID) {
            // Check the error type from Zod validation
            const errorType = errors.trackingID.type
            const errorMessage = errors.trackingID.message

            if (errorType === 'too_small') {
                toast.error("Enter a valid Tracking ID.")
            } else if (errorMessage?.includes("start with TRX")) {
                toast.error("Tracking ID must start with TRX-")
            }
            else {
                toast.error(errorMessage || "Invalid tracking ID")
            }
        }
    }, [form.formState.errors])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='max-w-3xl w-full flex items-center px-1 border rounded-md'>
                <FormField
                    control={form.control}
                    name='trackingID'
                    render={({ field }) => (
                        <FormItem className='flex-1'>
                            <FormControl>
                                <Input
                                    placeholder="Enter Tracking ID e.g TRX-202509-dhl-sealed-AH1GHG"
                                    {...field}
                                    className='border-0 w-full h-full py-4 '
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className='h-11/12 cursor-pointer'>Submit</Button>
            </form>
        </Form>
    )
}

export default TrackingForm
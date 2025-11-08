import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function POST(request: NextRequest) {
    const { isAuthenticated } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();

    // 🛑 CRITICAL FIX: Add a check here
    if (!isUserAuthenticated) {
        return NextResponse.json(
            { error: 'Unauthorized: User is not logged in.' },
            { status: 401 } // 401: Unauthorized
        );
    }

    try {
        const body = await request.json()
        
        if (!body.userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        const payload = await getPayload({ config })

        const trackingInfo = await payload.create({
            collection: 'trackinginfo',
            data: {
                // ... your data fields
                userId: body.userId,
                packageName: body.packageName,
                weight: body.weight,
                length: body.length,
                width: body.width,
                height: body.height,
                declaredValue: body.declaredValue,
                sender: {
                    name: body.senderName,
                    phone: body.senderPhone,
                    email: body.senderEmail,
                    address: body.senderAddress,
                },
                recipient: {
                    name: body.recipientName,
                    phone: body.recipientPhone,
                    email: body.recipientEmail,
                    address: body.recipientAddress,
                },
                dateReceived: body.dateReceived,
                dateDelivered: body.dateDelivered,
                assignedDriver: body.assignedDriver,
                driverContact: body.driverContact,
                trackingID: ''
            },
        })

        return NextResponse.json({
            success: true,
            data: trackingInfo,
        })
    } catch (error) {
        console.error('Error creating tracking info:', error)
        return NextResponse.json(
            { 
                error: 'Failed to create tracking info',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
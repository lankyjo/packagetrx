import { getPayload } from 'payload'

import config from '@/payload.config'

const payloadConfig = await config
const payload = await getPayload({ config: payloadConfig })
/**
 * Check if a tracking ID exists in the database
 * @param trackingID - The tracking ID to check
 * @returns Promise<boolean> - true if exists, false if not
 */
export const trackingIdExists = async (trackingID: string): Promise<boolean> => {

  try {
    const result = await payload.find({
      collection: 'trackinginfo',
      where: {
        trackingID: {
          equals: trackingID,
        },
      },
      limit: 1,
    })


    return result.docs.length > 0
  } catch (error) {
    console.error('Error checking tracking ID existence:', error)
    throw new Error('Database query failed')
  }
}

/**
 * Get tracking information by tracking ID
 * @param trackingID - The tracking ID to find
 * @returns Promise<TrackingInfo | null> - the tracking info or null if not found
 */
export const getTrackingInfo = async (trackingID: string) => {
  try {
    const result = await payload.find({
      collection: 'trackinginfo',
      where: {
        trackingID: {
          equals: trackingID,
        },
      },
      limit: 1,
    })

    return result.docs.length > 0 ? result.docs[0] : null
  } catch (error) {
    console.error('Error fetching tracking info:', error)
    throw new Error('Database query failed')
  }
}

export const getLong = async (trackingID: string) => {
  try {
    const result = await payload.find({
      collection: 'trackinginfo',
      where: {
        trackingID: {
          equals: trackingID,
        },
      },
      limit: 1,
    })
    if (result?.docs.length > 0) {
      const senderLong = result?.docs[0]?.sender?.longitude
      const recipientLong = result?.docs[0]?.recipient?.longitude
      return {
        senderLong,
        recipientLong
      }
    }
    return null
  }
  catch (error) {
    console.error('Error fetching tracking info:', error)
    throw new Error('Database query failed')
  }
}
export const getLat = async (trackingID: string) => {
  try {
    const result = await payload.find({
      collection: 'trackinginfo',
      where: {
        trackingID: {
          equals: trackingID,
        },
      },
      limit: 1,
    })

    if (result?.docs.length > 0) {
      const senderLat = result?.docs[0]?.sender?.latitude
      const recipientLat = result?.docs[0]?.recipient?.latitude
      return {
        senderLat,
        recipientLat
      }
    }
    return null
  }
  catch (error) {
    console.error('Error fetching tracking info:', error)
    throw new Error('Database query failed')
  }
}

/**
 * Validate and get tracking information (combined function)
 * @param trackingID - The tracking ID to validate and fetch
 * @returns Promise<{exists: boolean, data?: any}> - existence status and data if found
 */
export const validateTrackingId = async (trackingID: string) => {
  try {
    if (!trackingID || trackingID.trim() === '') {
      return { exists: false, error: 'Tracking ID is required' }
    }

    const result = await payload.find({
      collection: 'trackinginfo',
      where: {
        trackingID: {
          equals: trackingID.trim().toUpperCase(), // Normalize to uppercase
        },
      },
      limit: 1,
    })

    if (result.docs.length > 0) {
      return {
        exists: true,
        data: result.docs[0],
      }
    } else {
      return {
        exists: false,
        error: 'Tracking ID not found',
      }
    }
  } catch (error) {
    console.error('Error validating tracking ID:', error)
    return {
      exists: false,
      error: 'Database query failed',
    }
  }
}


// Usage examples:

/*
// Simple existence check


// Get full tracking information
const trackingInfo = await getTrackingInfo('TRX-202412-package-ABC123')
if (trackingInfo) {
  console.log('Package name:', trackingInfo.packageName)
  console.log('Status:', trackingInfo.status)
}

// Validate with error handling
const validation = await validateTrackingId('TRX-202412-package-ABC123')
if (validation.exists) {
  console.log('Found:', validation.data.packageName)
} else {
  console.log('Error:', validation.error)
}

// In a Next.js API route
// pages/api/check-tracking/[id].js
export default async function handler(req, res) {
  const { id } = req.query
  return await checkTrackingIdHandler({ query: { trackingID: id } }, res)
}

// In a Payload hook
beforeChange: [
  async ({ data, req }) => {
    if (data.relatedTrackingID) {
      const check = await checkTrackingIdInHook(data.relatedTrackingID, req)
      if (!check.exists) {
        throw new Error('Related tracking ID does not exist')
      }
    }
    return data
  }
]
*/
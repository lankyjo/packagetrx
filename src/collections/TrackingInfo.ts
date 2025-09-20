import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

/**
 * Geocodes an address string to latitude and longitude using the free Nominatim API.
 * NOTE: Nominatim requires a custom User-Agent header for all requests.
 * @param {string} address - The address to geocode.
 * @returns {Promise<{latitude: number; longitude: number} | null>}
 */
const geocodeAddress = async (address: string) => {
  try {
    // Using Nominatim (OpenStreetMap) as a free geocoding service
    const encodedAddress = encodeURIComponent(address)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        // THIS HEADER IS CRUCIAL FOR THE API CALL TO WORK
        headers: {
          'User-Agent': 'packagetrx/1.0 (ikejijoshua69@gmail.com)',
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Geocoding service failed with status: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      }
    }
    console.warn('No geocoding results found for address:', address)
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

export const TrackingInfo: CollectionConfig = {
  slug: 'trackinginfo',
  admin: {
    useAsTitle: 'trackingID',
    defaultColumns: ['trackingID', 'packageName', 'status', 'dateReceived', 'dateDelivered'],
    group: 'Courier Management',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc }) => {
        // 1. Generate tracking ID on create
        if (operation === 'create' && !data.trackingID) {
          const date = new Date(data.dateReceived || new Date())
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')

          const nameSlug = slugify(data.packageName?.substring(0, 10) || 'package', {
            lower: true,
            strict: true,
          })

          const uniqueSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
          data.trackingID = `TRX-${year}${month}-${nameSlug}-${uniqueSuffix}`
        }

        // 2. Reusable geocoding logic
        const geocodeField = async (fieldKey: 'sender' | 'recipient') => {
          const fieldData = data[fieldKey]
          const originalFieldData = originalDoc?.[fieldKey]

          const shouldGeocode =
            fieldData?.address &&
            (!originalDoc || // Always geocode on create
            originalFieldData?.address !== fieldData.address || // Or if address changed
              !fieldData?.latitude || // Or if latitude is missing
              !fieldData?.longitude) // Or if longitude is missing

          if (shouldGeocode) {
            console.log(`Geocoding ${fieldKey} address:`, fieldData.address)
            const coords = await geocodeAddress(fieldData.address)
            if (coords) {
              // Ensure data[fieldKey] exists before assigning to it
              if (!data[fieldKey]) {
                data[fieldKey] = {};
              }
              data[fieldKey].latitude = coords.latitude
              data[fieldKey].longitude = coords.longitude
              console.log(`Updated ${fieldKey} coordinates:`, coords)
            }
          }
        }

        // 3. Call the geocoder for both sender and recipient
        await geocodeField('sender')
        await geocodeField('recipient')

        return data
      },
    ],
  },
  fields: [
    // Auto-generated Tracking ID
    {
      name: 'trackingID',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated unique tracking identifier',
        position: 'sidebar',
      },
    },

    // Package Information
    {
      name: 'packageName',
      type: 'text',
      required: true,
      maxLength: 200,
      admin: {
        placeholder: 'Enter package description',
      },
    },

    // Package Details (Optional fields)
    {
      type: 'collapsible',
      label: 'Package Details',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'weight',
              type: 'number',
              min: 0,
              admin: {
                width: '25%',
                placeholder: '0.0',
                description: 'Weight in kg',
              },
            },
            {
              name: 'length',
              type: 'number',
              min: 0,
              admin: {
                width: '25%',
                placeholder: '0',
                description: 'Length in cm',
              },
            },
            {
              name: 'width',
              type: 'number',
              min: 0,
              admin: {
                width: '25%',
                placeholder: '0',
                description: 'Width in cm',
              },
            },
            {
              name: 'height',
              type: 'number',
              min: 0,
              admin: {
                width: '25%',
                placeholder: '0',
                description: 'Height in cm',
              },
            },
          ],
        },
        {
          name: 'declaredValue',
          type: 'number',
          min: 0,
          admin: {
            placeholder: '0.00',
            description: 'Declared value in Naira',
          },
        },
      ],
    },

    // Sender Information
    {
      type: 'group',
      name: 'sender',
      label: 'Sender Information',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              maxLength: 100,
              admin: {
                width: '50%',
                placeholder: 'Full name of sender',
              },
            },
            {
              name: 'phone',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
                placeholder: '+234 800 123 4567',
              },
            },
          ],
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: {
            placeholder: 'sender@example.com',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          required: true,
          maxLength: 500,
          admin: {
            placeholder: 'Complete pickup address with landmarks',
            rows: 3,
          },
        },
        // Sender coordinates (auto-populated)
        {
          type: 'row',
          fields: [
            {
              name: 'latitude',
              type: 'number',
              admin: {
                width: '50%',
                readOnly: true,
                description: 'Auto-updated when address changes',
                placeholder: 'Latitude',
              },
            },
            {
              name: 'longitude',
              type: 'number',
              admin: {
                width: '50%',
                readOnly: true,
                description: 'Auto-updated when address changes',
                placeholder: 'Longitude',
              },
            },
          ],
        },
      ],
    },

    // Recipient Information
    {
      type: 'group',
      name: 'recipient',
      label: 'Recipient Information',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              maxLength: 100,
              admin: {
                width: '50%',
                placeholder: 'Full name of recipient',
              },
            },
            {
              name: 'phone',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
                placeholder: '+234 800 123 4567',
              },
            },
          ],
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: {
            placeholder: 'recipient@example.com (optional)',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          required: true,
          maxLength: 500,
          admin: {
            placeholder: 'Complete delivery address with landmarks',
            rows: 3,
          },
        },
        // Recipient coordinates (auto-populated)
        {
          type: 'row',
          fields: [
            {
              name: 'latitude',
              type: 'number',
              admin: {
                width: '50%',
                readOnly: true,
                description: 'Auto-updated when address changes',
                placeholder: 'Latitude',
              },
            },
            {
              name: 'longitude',
              type: 'number',
              admin: {
                width: '50%',
                readOnly: true,
                description: 'Auto-updated when address changes',
                placeholder: 'Longitude',
              },
            },
          ],
        },
      ],
    },

    // Tracking Dates
    {
      type: 'row',
      fields: [
        {
          name: 'dateReceived',
          type: 'date',
          required: true,
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
            },
            description: 'When package was received and processed',
          },
        },
        {
          name: 'dateDelivered',
          type: 'date',
          required: true,
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
            },
            description: 'Estimated delivery date',
          },
        },
      ],
    },

    // Internal Information
    {
      type: 'collapsible',
      label: 'Internal Information',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'assignedDriver',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
                placeholder: 'Driver name or ID',
              },
            },
            {
              name: 'driverContact',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
                placeholder: '+234 800 123 4567',
              },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
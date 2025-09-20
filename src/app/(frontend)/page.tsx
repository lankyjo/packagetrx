// import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Marque from '../../../components/Marquee'
import Image from 'next/image'
import { Highlighter } from '@/components/magicui/highlighter'
import TrackingForm from '../../../components/TrackingForm'
import AnimatedHomepage from '../../../components/AnimatedHomepage'

export default async function HomePage() {
  // const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
 
  const track = await payload.find({
    collection: 'trackinginfo',
  })
 
  const trackDoc = track.docs.length

  return <AnimatedHomepage trackDoc={trackDoc} />
}
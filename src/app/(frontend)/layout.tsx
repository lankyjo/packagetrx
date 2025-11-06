import React from 'react'
import './globals.css'
import Header2 from '../../../components/mvpblocks/header-2'
import { ThemeProvider } from '../../../components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import 'leaflet/dist/leaflet.css';
import { Metadata } from 'next'
import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs'

export const metadata: Metadata = {
  // Basic Metadata
  title: {
    default: 'PackageTrx - Real-Time Package Tracking & Delivery Management',
    template: '%s | PackageTrx'
  },
  description: 'Track your packages in real-time with interactive maps, live updates, and AI-powered delivery predictions. Monitor shipments globally with our advanced tracking system featuring road routing, air freight tracking, and instant notifications.',

  // Keywords for SEO
  keywords: [
    'package tracking',
    'shipment tracking',
    'delivery tracking',
    'real-time tracking',
    'parcel tracking',
    'freight tracking',
    'logistics tracking',
    'cargo tracking',
    'courier tracking',
    'order tracking',
    'track my package',
    'where is my package',
    'delivery status',
    'shipping updates',
    'live map tracking',
    'GPS tracking',
    'international shipping',
    'domestic shipping',
    'express delivery',
    'package location'
  ],

  // Authors
  authors: [
    { name: 'Ikeji Joshua', }
  ],

  creator: 'Ikeji Joshua',

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'PackageTrx',
    title: 'PackageTrx - Real-Time Package Tracking & Delivery Management',
    description: 'Track your packages anywhere in the world with real-time GPS tracking, interactive maps, and instant delivery notifications. Experience next-generation logistics tracking.',
    images: [
      {
        url: '/fullImage.png', // 1200x630px recommended
        width: 1200,
        height: 630,
        alt: 'PackageTrx - Package Tracking Dashboard',
      },
      {
        url: '/fullImage.png', // 1200x630px recommended
        width: 1200,
        height: 1200,
        alt: 'PackageTrx Logo',
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'PackageTrx - Real-Time Package Tracking',
    description: 'Track packages globally with live GPS, interactive maps, and instant updates. Your complete delivery tracking solution.',
    site: '@PackageTrx',
    creator: '@PackageTrx',
    images: ['/fullImage.png'], // 1200x675px recommended
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PackageTrx',
  },

  // Application Name
  applicationName: 'PackageTrx',

  // Referrer

  // Category
  category: 'technology',

  // Classification
  classification: 'Logistics & Delivery',

  // Other Metadata
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },

}


export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <KindeProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="apple-mobile-web-app-title" content="PackageTrx" />
        </head>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen w-full  isolate relative">
              {/* Bottom Fade Grid Background */}
              {/* <div
              className="absolute inset-0 dark:opacity-5 -z-1"
              style={{
                backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
                backgroundSize: "20px 30px",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
                maskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
              }}
            /> */}
              {/* Your Content/Components */}
              <Header2 />
              <main>{children}</main>
              <Toaster />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </KindeProvider>
  )
}


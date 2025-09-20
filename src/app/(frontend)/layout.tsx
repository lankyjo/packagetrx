import React from 'react'
import './globals.css'
import Header2 from '../../../components/mvpblocks/header-2'
import { ThemeProvider } from '../../../components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import 'leaflet/dist/leaflet.css';

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
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
  )
}


import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppProvider } from '@/providers/app-provider'
import { AppSidebar } from '@/components/layouts/app-sidebar'
import './globals.css'
import { Navbar } from '@/components/common/navbar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Naviora - Next.js Boilerplate',
  description:
    'A comprehensive Next.js boilerplate with shadcn/ui, react-hook-form, zod, tailwind, framer-motion, axios, and tanstack query',
  icons: {
    icon: '/Naviora.svg',
    shortcut: '/Naviora.svg',
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AppProvider>
          <AppSidebar />
          <div className='w-full py-2 pr-2 bg-greyscale-25 min-h-screen'>
            <div className='flex flex-col bg-background h-full rounded-lg border-1'>
              <Navbar />
              {children}
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  )
}

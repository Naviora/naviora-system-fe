import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppProvider } from '@/providers/app-provider'
import './globals.css'

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
    'A comprehensive Next.js boilerplate with shadcn/ui, react-hook-form, zod, tailwind, framer-motion, axios, and tanstack query'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}

'use client'

import { type ReactNode } from 'react'
import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { SidebarProvider } from '@/components/ui/sidebar'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
        <Toaster position='top-right' richColors closeButton expand={false} visibleToasts={5} />
      </QueryProvider>
    </ThemeProvider>
  )
}

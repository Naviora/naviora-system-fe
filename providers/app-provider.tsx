'use client'

import { type ReactNode } from 'react'
import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'
import { RoleProvider } from './role-provider'
import { Toaster } from '@/components/ui/sonner'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <RoleProvider>
          {children}
          <Toaster position='top-right' richColors closeButton expand={false} visibleToasts={5} />
        </RoleProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}

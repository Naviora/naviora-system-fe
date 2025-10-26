'use client'

import { createContext, useContext, ReactNode } from 'react'

interface BreadcrumbContextType {
  label?: string
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({})

export function BreadcrumbProvider({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <BreadcrumbContext.Provider value={{ label }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumbLabel() {
  return useContext(BreadcrumbContext).label
}

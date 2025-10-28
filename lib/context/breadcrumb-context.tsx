'use client'

import { createContext, useContext, ReactNode, useState } from 'react'

interface BreadcrumbContextType {
  label?: string
  setLabel: (label?: string) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)

export function BreadcrumbProvider({ children, label: initialLabel }: { children: ReactNode; label?: string }) {
  const [label, setLabel] = useState(initialLabel)

  return <BreadcrumbContext.Provider value={{ label, setLabel }}>{children}</BreadcrumbContext.Provider>
}

export function useBreadcrumbLabel() {
  const context = useContext(BreadcrumbContext)
  return context?.label
}

export function useSetBreadcrumbLabel() {
  const context = useContext(BreadcrumbContext)
  return context?.setLabel || (() => {})
}

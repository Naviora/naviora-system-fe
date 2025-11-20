'use client'

import { createContext, useContext, ReactNode, useState } from 'react'

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbContextType {
  items: BreadcrumbItem[]
  setItems: (items: BreadcrumbItem[]) => void
  label?: string
  setLabel: (label?: string) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)

export function BreadcrumbProvider({ children, label: initialLabel }: { children: ReactNode; label?: string }) {
  const [label, setLabel] = useState(initialLabel)
  const [items, setItems] = useState<BreadcrumbItem[]>([])

  return (
    <BreadcrumbContext.Provider value={{ label, setLabel, items, setItems }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumbLabel() {
  const context = useContext(BreadcrumbContext)
  return context?.label
}

export function useSetBreadcrumbLabel() {
  const context = useContext(BreadcrumbContext)
  return context?.setLabel || (() => {})
}

export function useBreadcrumbItems() {
  const context = useContext(BreadcrumbContext)
  return context?.items || []
}

export function useSetBreadcrumbItems() {
  const context = useContext(BreadcrumbContext)
  return context?.setItems || (() => {})
}

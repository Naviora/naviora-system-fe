'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  AUTH_STORAGE_KEYS,
  getStoredUserRole,
  ROLE_CHANGE_EVENT,
  type RoleChangeEventDetail
} from '@/lib/utils/auth-storage'
import type { UserRole } from '@/lib/constants/roles'

interface RoleContextValue {
  role: UserRole | null
  permissions: string[]
  isReady: boolean
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined)

interface RoleProviderProps {
  children: ReactNode
}

const ROLE_PERMISSIONS_MAP: Partial<Record<UserRole, string[]>> = {}

const getPermissionsForRole = (role: UserRole | null) => {
  if (!role) return []
  return ROLE_PERMISSIONS_MAP[role] ?? []
}

export function RoleProvider({ children }: RoleProviderProps) {
  const [role, setRole] = useState<UserRole | null>(() => (typeof window === 'undefined' ? null : getStoredUserRole()))
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const syncRoleFromStorage = () => {
      setRole(getStoredUserRole())
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTH_STORAGE_KEYS.userRole || event.key === null) {
        syncRoleFromStorage()
      }
    }

    const handleRoleChange = (event: Event) => {
      const detail = (event as CustomEvent<RoleChangeEventDetail>).detail
      setRole(detail?.role ?? null)
    }

    syncRoleFromStorage()
    setIsReady(true)

    window.addEventListener('storage', handleStorage)
    window.addEventListener(ROLE_CHANGE_EVENT, handleRoleChange)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(ROLE_CHANGE_EVENT, handleRoleChange)
    }
  }, [])

  const permissions = useMemo(() => getPermissionsForRole(role), [role])

  const value = useMemo<RoleContextValue>(
    () => ({
      role,
      permissions,
      isReady
    }),
    [permissions, role, isReady]
  )

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export const useRoleContext = () => {
  const context = useContext(RoleContext)

  if (!context) {
    throw new Error('useRoleContext must be used within a RoleProvider')
  }

  return context
}

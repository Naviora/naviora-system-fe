'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useRoles } from '@/hooks/api/use-roles'
import { toRoleOption } from '@/lib/mappers/role'
import type { RoleDto, RoleOption } from '@/types/api/roles'
import type { ApiError } from '@/types/api/common'
import type { UseQueryResult } from '@tanstack/react-query'
import { getStoredUserRole } from '@/lib/utils/auth-storage'

interface RoleContextValue {
  roles: RoleDto[]
  roleOptions: RoleOption[]
  activeRole: RoleOption | null
  activePermissions: string[]
  query: UseQueryResult<RoleDto[], ApiError>
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined)

const EMPTY_ROLES: RoleDto[] = []

interface RoleProviderProps {
  children: ReactNode
}

export function RoleProvider({ children }: RoleProviderProps) {
  const query = useRoles({
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  const roles = query.data ?? EMPTY_ROLES

  const roleOptions = useMemo<RoleOption[]>(() => {
    return roles.reduce<RoleOption[]>((accumulator, role) => {
      const option = toRoleOption(role)
      if (option) {
        accumulator.push(option)
      }
      return accumulator
    }, [])
  }, [roles])

  const activeRole = useMemo<RoleOption | null>(() => {
    if (typeof window === 'undefined') return null
    const role = getStoredUserRole()
    if (!role) return null
    return roleOptions.find((option) => option.value === role && option.isActive) ?? null
  }, [roleOptions])

  const activePermissions = useMemo<string[]>(() => {
    if (!activeRole) return []
    return activeRole.permissions
  }, [activeRole])

  const value = useMemo<RoleContextValue>(
    () => ({
      roles,
      activeRole,
      activePermissions,
      roleOptions,
      query
    }),
    [activePermissions, activeRole, query, roleOptions, roles]
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

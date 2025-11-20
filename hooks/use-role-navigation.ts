import { useMemo } from 'react'
import { useRoleContext } from '@/providers/role-provider'
import { getNavigationConfig } from '@/lib/constants/navigation'
import type { NavigationItem } from '@/lib/constants/navigation'

interface RoleNavigationResult {
  mainNavigation: NavigationItem[]
  bottomNavigation: NavigationItem[]
  permissions: string[]
  isReady: boolean
}

export const useRoleNavigation = (): RoleNavigationResult => {
  const { role, permissions, isReady } = useRoleContext()

  const navigation = useMemo(() => getNavigationConfig(role), [role])

  return {
    mainNavigation: navigation.main,
    bottomNavigation: navigation.bottom,
    permissions,
    isReady
  }
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn } from '@/hooks/api/use-auth'
import { LoadingSpinner } from '@/components/ui'
import { useRoleContext } from '@/providers/role-provider'
import { getStoredUserRole } from '@/lib/utils/auth-storage'
import type { UserRole } from '@/lib/constants/roles'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  fallback?: React.ReactNode
}

export function AuthGuard({ children, allowedRoles, fallback }: AuthGuardProps) {
  const router = useRouter()
  const { roleOptions } = useRoleContext()
  const [isReady, setIsReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState<UserRole | null>(null)

  useEffect(() => {
    setIsAuthenticated(isLoggedIn())
    setRole(getStoredUserRole())
    setIsReady(true)
  }, [])

  const activeRole = useMemo(
    () => (role ? (roleOptions.find((option) => option.value === role && option.isActive) ?? null) : null),
    [role, roleOptions]
  )

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isReady, router])

  if (!isReady) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  const requiresSpecificRole = Array.isArray(allowedRoles) && allowedRoles.length > 0
  const isAuthorized = requiresSpecificRole ? !!activeRole && allowedRoles.includes(activeRole.value) : true

  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <LoadingSpinner size='md' className='mx-auto mb-4' />
          <p className='text-sm text-muted-foreground'>You don&apos;t have permission to access this area.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

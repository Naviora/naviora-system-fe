'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRoleContext } from '@/providers/role-provider'
import { getDefaultRouteForRole } from '@/lib/constants/navigation'
import { isLoggedIn } from '@/hooks/api/use-auth'
import { LoadingSpinner } from '@/components/ui/loading'

export default function HomePage() {
  const router = useRouter()
  const { role, isReady } = useRoleContext()

  useEffect(() => {
    if (isReady) {
      // Check if user is logged in
      if (!isLoggedIn()) {
        router.replace('/login')
        return
      }

      // Redirect to default route based on role
      const defaultRoute = getDefaultRouteForRole(role)
      router.replace(defaultRoute)
    }
  }, [role, isReady, router])

  // Show loading while checking authentication and role
  return (
    <div className='min-h-screen w-full flex items-center justify-center'>
      <LoadingSpinner />
    </div>
  )
}

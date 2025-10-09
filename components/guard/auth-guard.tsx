'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn } from '@/hooks/api/use-auth'
import { LoadingSpinner } from '@/components/ui'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login')
    }
  }, [router])

  if (!isLoggedIn()) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  return <>{children}</>
}
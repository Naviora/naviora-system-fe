'use client'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getStoredHasParticipatedEntryTest } from '@/lib/utils/auth-storage'

export function EntryTestGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (
      pathname.startsWith('/student') &&
      !getStoredHasParticipatedEntryTest()
    ) {
      router.replace('/entry-test')
    }
  }, [pathname, router])

  return <>{children}</>
}
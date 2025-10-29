'use client'
import { AuthGuard } from '@/components/guard/auth-guard'

export default function EntryTestLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  )
}
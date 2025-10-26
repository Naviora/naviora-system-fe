import type { Metadata } from 'next'

import { PrincipalModulesPageClient } from '@/components/principal/modules'

export const metadata: Metadata = {
  title: 'Quản lý chuyên đề'
}

export default function PrincipalModulesPage() {
  return <PrincipalModulesPageClient />
}

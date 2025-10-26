import type { Metadata } from 'next'

import { ModuleDetailPageClient } from '@/components/principal/modules/detail'

interface ModuleDetailPageProps {
  params: Promise<{ moduleId: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: ModuleDetailPageProps): Promise<Metadata> {
  const { moduleId } = await params
  return {
    title: `Chi tiết chuyên đề ${moduleId} | Ban giám hiệu`
  }
}

export default async function PrincipalModuleDetailPage({ params }: ModuleDetailPageProps) {
  const { moduleId } = await params
  return <ModuleDetailPageClient moduleId={moduleId} />
}

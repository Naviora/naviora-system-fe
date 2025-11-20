import type { Metadata } from 'next'

import { ModuleDetailPageClient } from '@/components/principal/modules/detail'

interface ModuleDetailPageProps {
  params: { moduleId: string }
}

export const dynamic = 'force-dynamic'

export function generateMetadata({ params }: ModuleDetailPageProps): Metadata {
  const { moduleId } = params
  return {
    title: `Chi tiết chuyên đề ${moduleId} | Giảng viên`
  }
}

export default function LecturerModuleDetailPage({ params }: ModuleDetailPageProps) {
  const { moduleId } = params
  return <ModuleDetailPageClient moduleId={moduleId} />
}

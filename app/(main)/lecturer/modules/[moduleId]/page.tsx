import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ModuleDetailView } from '@/components/lecturer/modules'
import { getLecturerModuleById, getLecturerModuleSummaries } from '@/lib/data/lecturer-modules'

interface ModuleDetailPageProps {
  params: { moduleId: string }
}

export async function generateStaticParams() {
  const modules = getLecturerModuleSummaries()

  return modules.map((module) => ({ moduleId: module.id }))
}

export async function generateMetadata({ params }: ModuleDetailPageProps): Promise<Metadata> {
  const { moduleId } = params
  const moduleDetail = getLecturerModuleById(moduleId)

  if (!moduleDetail) {
    return {
      title: 'Module không tồn tại'
    }
  }

  return {
    title: `${moduleDetail.title} | Giảng viên`
  }
}

export default async function LecturerModuleDetailPage({ params }: ModuleDetailPageProps) {
  const { moduleId } = params
  const moduleDetail = getLecturerModuleById(moduleId)

  if (!moduleDetail) {
    notFound()
  }

  return <ModuleDetailView module={moduleDetail} />
}

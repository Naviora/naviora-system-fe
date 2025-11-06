'use client'

import { useParams, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { ModuleDetailSidebar } from '@/components/student/modules/detail'
import { useModuleLessons } from '@/hooks/api/use-modules'
import { useSetBreadcrumbItems } from '@/lib/context/breadcrumb-context'
import { useRoleContext } from '@/providers/role-provider'

export default function ModuleDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const moduleId = params.id as string
  const setBreadcrumbItems = useSetBreadcrumbItems()
  const { role } = useRoleContext()

  const { data: moduleData } = useModuleLessons(moduleId)

  const lessonIdMatch = pathname.match(/\/lessons\/([^\/]+)/)
  const selectedLessonId = lessonIdMatch ? lessonIdMatch[1] : undefined
  const isLessonPage = !!selectedLessonId

  useEffect(() => {
    if (moduleData?.module_name && !isLessonPage) {
      setBreadcrumbItems([
        { label: 'Chuyên đề', href: `/${role?.toLowerCase()}/modules` },
        { label: moduleData.module_name, href: `/${role?.toLowerCase()}/modules/${moduleId}` }
      ])
    }
    return () => {
      setBreadcrumbItems([])
    }
  }, [moduleData?.module_name, moduleId, role, isLessonPage, setBreadcrumbItems])

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
      <ModuleDetailSidebar moduleId={moduleId} selectedLessonId={selectedLessonId} />
      <main className='flex-1 overflow-hidden'>{children}</main>
    </div>
  )
}

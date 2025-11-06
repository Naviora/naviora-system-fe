'use client'

import { useParams, usePathname } from 'next/navigation'
import { ModuleDetailSidebar } from '@/components/student/modules/detail'

export default function ModuleDetailLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const moduleId = params.id as string

  const lessonIdMatch = pathname.match(/\/lessons\/([^\/]+)/)
  const selectedLessonId = lessonIdMatch ? lessonIdMatch[1] : undefined

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
      <ModuleDetailSidebar moduleId={moduleId} selectedLessonId={selectedLessonId} />
      <main className='flex-1 overflow-hidden'>{children}</main>
    </div>
  )
}

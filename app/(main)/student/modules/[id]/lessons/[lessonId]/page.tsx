'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { LessonContentViewer } from '@/components/student/modules/detail'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { useLessonDetail } from '@/hooks/api/use-lessons'
import { useModuleLessons } from '@/hooks/api/use-modules'
import { useSetBreadcrumbItems } from '@/lib/context/breadcrumb-context'
import { useRoleContext } from '@/providers/role-provider'

// Transform API lesson response to Lesson interface
interface MaterialFile {
  name: string
  type: string
  size: string
}

interface TransformedLesson {
  id: string
  name: string
  description: string
  duration: string
  completed: boolean
  content: {
    title: string
    body: string
  }
  materials?: {
    title: string
    files: MaterialFile[]
  }
}

const transformLessonResponse = (apiLesson: Record<string, unknown>): TransformedLesson => {
  const materials = apiLesson.materials as Array<Record<string, unknown>> | undefined
  return {
    id: String(apiLesson.lesson_id),
    name: String(apiLesson.lesson_name),
    description: String(apiLesson.lesson_description || ''),
    duration: '00:00', // API doesn't provide duration
    completed: false, // API doesn't provide completion status
    content: {
      title: String(apiLesson.lesson_name),
      body: String(apiLesson.lesson_content || 'Nội dung bài học sẽ được cập nhật sớm')
    },
    materials:
      materials && materials.length > 0
        ? {
            title: 'Tài liệu Hỗ trợ',
            files: materials.map((m) => ({
              name: String(m.material_name || 'Tài liệu'),
              type:
                String(m.material_name || 'FILE')
                  .split('.')
                  .pop()
                  ?.toUpperCase() || 'FILE',
              size: String(m.material_size || '0 KB')
            }))
          }
        : undefined
  }
}

export default function LessonPage() {
  const params = useParams()
  const moduleId = params.id as string
  const lessonId = params.lessonId as string
  const setBreadcrumbItems = useSetBreadcrumbItems()
  const { role } = useRoleContext()

  const { data: apiLesson, isLoading } = useLessonDetail(lessonId)
  const { data: moduleData } = useModuleLessons(moduleId)

  useEffect(() => {
    if (apiLesson?.data?.lesson_name && moduleData?.module_name) {
      setBreadcrumbItems([
        { label: 'Chuyên đề', href: `/${role?.toLowerCase()}/modules` },
        { label: moduleData.module_name, href: `/${role?.toLowerCase()}/modules/${moduleId}` },
        { label: apiLesson.data.lesson_name, href: `/${role?.toLowerCase()}/modules/${moduleId}/lessons/${lessonId}` }
      ])
    }
  }, [apiLesson?.data?.lesson_name, moduleData?.module_name, moduleId, lessonId, role, setBreadcrumbItems])

  const lesson = apiLesson?.data ? transformLessonResponse(apiLesson.data as Record<string, unknown>) : null

  if (isLoading) {
    return (
      <div className='flex flex-col h-full items-center justify-center p-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>Đang tải bài học...</h2>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className='flex flex-col h-full items-center justify-center p-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>Không tìm thấy bài học</h2>
          <Link href={`/modules/${moduleId}`}>
            <Button variant='outline'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Quay lại mô-đun
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full'>
      <LessonContentViewer lesson={lesson} />
    </div>
  )
}

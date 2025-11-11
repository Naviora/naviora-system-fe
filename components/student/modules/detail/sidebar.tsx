'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Book, Menu, Circle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useModuleLessons } from '@/hooks/api/use-modules'
import { Progress } from '@/components/ui/progress'

type Lesson = {
  lesson_id: string
  lesson_name: string
  lesson_description?: string | null
  lesson_content?: string | null
  created_at?: string
  updated_at?: string
  is_completed?: boolean
  materials?: Array<{
    material_id?: string
    material_name?: string
    material_size?: string
  }>
}

type Module = {
  module_id: string
  module_name: string
  module_description?: string
  progress_percent?: number
  lessons?: Lesson[]
}

// Components
const ModuleInfoHeader = ({ module }: { module: Module }) => {
  const totalLessons = module.lessons?.length || 0
  const completedLessons = module.lessons?.filter((l) => l.is_completed).length || 0
  const progressPercent = module.progress_percent ?? 0

  return (
    <div className='p-3 space-y-3'>
      <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>{module.module_name}</h2>
      <p className='text-sm text-gray-600 dark:text-gray-400'>{module.module_description}</p>

      <div className='space-y-2'>
        <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400'>
          <div className='flex items-center'>
            <Book className='mr-2 h-4 w-4' />
            <span>
              {completedLessons}/{totalLessons} bài học
            </span>
          </div>
          <span className='font-medium'>{progressPercent.toFixed(0)}%</span>
        </div>
        <Progress value={progressPercent} className='h-2' />
      </div>
    </div>
  )
}

interface ModuleLessonsListProps {
  module: Module
  moduleId: string
  selectedLessonId?: string
}

const ModuleLessonsList = ({ module, moduleId, selectedLessonId }: ModuleLessonsListProps) => {
  return (
    <div className='space-y-2'>
      {module.lessons?.map((lesson) => {
        const isCompleted = lesson.is_completed ?? false

        return (
          <Link
            key={lesson.lesson_id}
            href={`/student/modules/${moduleId}/lessons/${lesson.lesson_id}`}
            className={cn(
              'w-full text-left p-3 rounded-lg transition-colors duration-200 block',
              selectedLessonId === lesson.lesson_id
                ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-600'
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
            )}
          >
            <div className='flex items-center gap-2'>
              {isCompleted ? (
                <CheckCircle2 className='h-4 w-4 text-green-500 shrink-0' />
              ) : (
                <Circle className='h-4 w-4 text-gray-400 shrink-0' />
              )}
              <div className='flex-1'>
                <p
                  className={cn(
                    'font-medium text-sm',
                    isCompleted ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'
                  )}
                >
                  {lesson.lesson_name}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{lesson.lesson_description}</p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

interface ModuleDetailSidebarProps {
  moduleId: string
  selectedLessonId?: string
}

export const ModuleDetailSidebar = ({ moduleId, selectedLessonId }: ModuleDetailSidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { data: moduleData, isLoading } = useModuleLessons(moduleId)

  const moduleInfo = moduleData as Module

  return (
    <div
      className={cn(
        'relative h-screen border-r dark:bg-gray-900 transition-all duration-300 p-3',
        isSidebarOpen ? 'w-[400px]' : 'w-10'
      )}
    >
      {isSidebarOpen ? (
        <div className='flex flex-col gap-2'>
          <button
            className='flex justify-end items-center gap-2 rounded-sm p-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'
            onClick={() => setIsSidebarOpen(false)}
          >
            <Menu className='h-4 w-4' />
          </button>
          <div className='rounded-xl bg-white dark:bg-gray-800 overflow-hidden max-h-[calc(100vh-80px)] flex flex-col'>
            {isLoading ? (
              <div className='p-3 text-center text-gray-500'>Đang tải...</div>
            ) : (
              <>
                <ModuleInfoHeader module={moduleInfo} />
                <div className='border-t border-gray-200 dark:border-gray-700 flex-1 overflow-y-auto px-3 py-3'>
                  <ModuleLessonsList module={moduleInfo} moduleId={moduleId} selectedLessonId={selectedLessonId} />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-4'>
          <button
            className='flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800'
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className='h-4 w-4' />
          </button>
        </div>
      )}
    </div>
  )
}

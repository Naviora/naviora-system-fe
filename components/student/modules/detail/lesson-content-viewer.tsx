'use client'

import { useState } from 'react'
import { FileText, HelpCircle, Paperclip, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useToggleLessonCompletion } from '@/hooks/api/use-modules'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants/config'
import { useParams } from 'next/navigation'

type LessonTab = 'content' | 'quiz' | 'materials'

type Lesson = {
  id: string
  name: string
  description: string
  duration: string
  completed: boolean
  content: {
    title: string
    body: string
  }
  quiz?: {
    title: string
    questions: number
    timeLimit: string
  }
  materials?: {
    title: string
    files: Array<{
      name: string
      type: string
      size: string
      path?: string
    }>
  }
}

interface LessonContentViewerProps {
  lesson: Lesson
}

export const LessonContentViewer = ({ lesson }: LessonContentViewerProps) => {
  const [activeTab, setActiveTab] = useState<LessonTab>('content')
  const queryClient = useQueryClient()
  const toggleCompletion = useToggleLessonCompletion()
  const params = useParams()
  const moduleId = params.id as string
  const [isCompleting, setIsCompleting] = useState(false)

  const availableTabs: LessonTab[] = [
    'content',
    ...(lesson.quiz ? ['quiz'] : []),
    ...(lesson.materials ? ['materials'] : [])
  ] as LessonTab[]

  const handleToggleCompletion = async () => {
    setIsCompleting(true)
    try {
      await toggleCompletion.mutateAsync(lesson.id, {
        onSuccess: () => {
          // Invalidate module lessons query to refresh sidebar
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.MODULE_LESSONS(moduleId)
          })
          toast.success('Cập nhật trạng thái bài học thành công')
        }
      })
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái bài học')
      console.error('Toggle lesson completion error:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className='flex flex-col h-full bg-white dark:bg-gray-800'>
      {/* Header */}
      <div className='border-b border-gray-200 dark:border-gray-700 p-6'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>{lesson.name}</h1>
        <p className='text-gray-600 dark:text-gray-400'>{lesson.description}</p>
      </div>

      {/* Tab Navigation */}
      <div className='flex gap-2 border-b border-gray-200 dark:border-gray-700 px-6 py-4'>
        {availableTabs.includes('content') && (
          <button
            onClick={() => setActiveTab('content')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
              activeTab === 'content'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
            )}
          >
            <FileText className='h-4 w-4' />
            Nội dung
          </button>
        )}

        {availableTabs.includes('quiz') && (
          <button
            onClick={() => setActiveTab('quiz')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
              activeTab === 'quiz'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
            )}
          >
            <HelpCircle className='h-4 w-4' />
            Bài kiểm tra
          </button>
        )}

        {availableTabs.includes('materials') && (
          <button
            onClick={() => setActiveTab('materials')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
              activeTab === 'materials'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
            )}
          >
            <Paperclip className='h-4 w-4' />
            Tài liệu
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className='flex-1 overflow-y-auto p-6'>
        {activeTab === 'content' && (
          <div className='space-y-6'>
            <div>
              <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>{lesson.content.title}</h2>
              <div className='htmlContent max-w-none' dangerouslySetInnerHTML={{ __html: lesson.content.body }} />
            </div>
            <div className='border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end'>
              <Button
                onClick={handleToggleCompletion}
                disabled={isCompleting}
                variant={lesson.completed ? 'destructive' : 'default'}
                className='w-full sm:w-auto'
              >
                <Check className='mr-2 h-4 w-4' />
                {lesson.completed ? 'Bỏ hoàn thành' : 'Hoàn thành bài học'}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && lesson.quiz && (
          <div className='max-w-4xl'>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>{lesson.quiz.title}</h2>
            <div className='space-y-4'>
              <div className='bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg'>
                <p className='text-gray-700 dark:text-gray-300'>
                  <span className='font-semibold'>📝 Số lượng câu hỏi:</span> {lesson.quiz.questions}
                </p>
                <p className='text-gray-700 dark:text-gray-300 mt-2'>
                  <span className='font-semibold'>⏱️ Thời gian giới hạn:</span> {lesson.quiz.timeLimit}
                </p>
              </div>
              <Button className='w-full sm:w-auto'>Bắt đầu bài kiểm tra</Button>
            </div>
          </div>
        )}

        {activeTab === 'materials' && lesson.materials && (
          <div className='max-w-4xl'>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>{lesson.materials.title}</h2>
            <div className='space-y-3'>
              {lesson.materials.files.map((file, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow'
                >
                  <div className='flex items-center gap-3 flex-1'>
                    <div className='p-2 bg-blue-100 dark:bg-blue-900 rounded-lg'>
                      <Paperclip className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                    </div>
                    <div>
                      <p className='font-medium text-gray-900 dark:text-gray-100'>{file.name}</p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>{file.size}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded'>
                      {file.type}
                    </span>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        if (file.path) {
                          // Add Cloudinary attachment flag to force download
                          const downloadUrl = file.path.includes('cloudinary')
                            ? `${file.path}?fl_attachment`
                            : file.path

                          const link = document.createElement('a')
                          link.href = downloadUrl
                          link.download = file.name || 'download'
                          link.target = '_blank'
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }
                      }}
                      disabled={!file.path}
                    >
                      Tải xuống
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

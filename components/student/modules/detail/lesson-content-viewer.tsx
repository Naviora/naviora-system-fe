'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, HelpCircle, Paperclip, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useToggleLessonCompletion } from '@/hooks/api/use-modules'
import { useStartReviewedExercise } from '@/hooks/api/use-reviewed-exercises'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants/config'
import { useParams } from 'next/navigation'

// Status mapping
const statusVietnamMap: Record<string, string> = {
  ACTIVE: 'Đang mở',
  DRAFT: 'Nháp',
  CLOSED: 'Đã đóng',
  PENDING: 'Chờ kích hoạt',
  ENDED: 'Đã kết thúc',
  ARCHIVED: 'Đã lưu trữ',
  COMPLETED: 'Đã hoàn thành'
}

type LessonTab = 'content' | 'quiz' | 'materials' | 'review-exercise'

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
  reviewExercises?: Array<{
    id: string
    title?: string
    description?: string
    questionCount?: number
    status?: string
    isSubmitted?: boolean
    studentSubmissions?: Array<Record<string, unknown>>
    questionSets?: Array<{
      question_set_id: string
      title: string
      description: string
    }>
  }>
}

interface LessonContentViewerProps {
  lesson: Lesson
}

export const LessonContentViewer = ({ lesson }: LessonContentViewerProps) => {
  const [activeTab, setActiveTab] = useState<LessonTab>('content')
  const [startingExerciseId, setStartingExerciseId] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const toggleCompletion = useToggleLessonCompletion()
  const startReviewedExercise = useStartReviewedExercise()
  const params = useParams()
  const router = useRouter()
  const moduleId = params.id as string
  const lessonId = params.lessonId as string
  const [isCompleting, setIsCompleting] = useState(false)

  const availableTabs: LessonTab[] = [
    'content',
    ...(lesson.quiz ? ['quiz'] : []),
    ...(lesson.reviewExercises && lesson.reviewExercises.length > 0 ? ['review-exercise'] : []),
    ...(lesson.materials ? ['materials'] : [])
  ] as LessonTab[]

  const handleStartReviewedExercise = async (exerciseId: string) => {
    // Prevent multiple calls
    if (startingExerciseId !== null) {
      return
    }

    setStartingExerciseId(exerciseId)
    try {
      await startReviewedExercise.mutateAsync(exerciseId)
      toast.success('Bắt đầu bài tập thành công')
      // Redirect to the exercise taking page
      router.push(
        `/student/modules/${moduleId}/lessons/${lessonId}/reviewed-exercise/${exerciseId}`
      )
    } catch (error) {
      toast.error('Lỗi khi bắt đầu bài tập')
      console.error('Error starting reviewed exercise:', error)
      setStartingExerciseId(null)
    }
  }

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

        {availableTabs.includes('review-exercise') && (
          <button
            onClick={() => setActiveTab('review-exercise')}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
              activeTab === 'review-exercise'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
            )}
          >
            <FileText className='h-4 w-4' />
            Bài tập ôn tập
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

        {activeTab === 'review-exercise' && lesson.reviewExercises && lesson.reviewExercises.length > 0 && (
          <div className='max-w-4xl'>
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>Bài tập ôn tập</h2>
            <div className='space-y-3'>
              {lesson.reviewExercises.map((exercise, idx) => (
                <div
                  key={exercise.id || idx}
                  className='p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>
                        {exercise.title || 'Bài tập ôn tập'}
                      </h3>
                      {exercise.description && (
                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>{exercise.description}</p>
                      )}
                      <div className='flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400'>
                        {exercise.questionCount && <span>📝 {exercise.questionCount} câu hỏi</span>}
                        {exercise.status && (
                          <span
                            className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium',
                              exercise.status === 'ACTIVE'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : exercise.status === 'DRAFT'
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                            )}
                          >
                            {statusVietnamMap[exercise.status] || exercise.status}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      className='ml-2'
                      disabled={exercise.status !== 'ACTIVE' || startingExerciseId === exercise.id}
                      onClick={() => {
                        if (exercise.status === 'ACTIVE') {
                          handleStartReviewedExercise(exercise.id)
                        }
                      }}
                      title={
                        exercise.status !== 'ACTIVE'
                          ? `Bài tập này hiện tại là ${statusVietnamMap[exercise.status || ''] || exercise.status}`
                          : 'Làm bài tập'
                      }
                    >
                      {startingExerciseId === exercise.id ? 'Đang tải...' : 'Làm bài tập'}
                    </Button>
                  </div>
                </div>
              ))}
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

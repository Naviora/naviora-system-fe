'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
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
  path?: string
}

interface ReviewExercise {
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
  reviewExercises?: ReviewExercise[]
}

const transformLessonResponse = (apiLesson: Record<string, unknown>): TransformedLesson => {
  const materials = apiLesson.materials as Array<Record<string, unknown>> | undefined
  const reviewedExercises = apiLesson.reviewed_exercises as Array<Record<string, unknown>> | undefined

  const result: TransformedLesson = {
    id: String(apiLesson.lesson_id),
    name: String(apiLesson.lesson_name),
    description: String(apiLesson.lesson_description || ''),
    duration: '00:00', // API doesn't provide duration
    completed: Boolean(apiLesson.is_completed) || false,
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
              type: String(m.material_type || 'FILE').toUpperCase(),
              size: String(m.material_size || '0 KB'),
              path: String(m.material_path || '')
            }))
          }
        : undefined,
    reviewExercises:
      reviewedExercises && reviewedExercises.length > 0
        ? reviewedExercises.map((ex) => {
            const questionSets = ex.question_sets
              ? (ex.question_sets as Array<{
                  question_set_id: string
                  title: string
                  description: string
                }>)
              : undefined
            const firstQuestionSet = questionSets && questionSets.length > 0 ? questionSets[0] : undefined

            const transformed = {
              id: String(ex.reviewed_exercise_id || ''),
              title: firstQuestionSet?.title, // Get title from first question set
              description: firstQuestionSet?.description, // Get description from first question set
              questionCount: undefined, // Will be fetched separately
              status: ex.status ? String(ex.status) : undefined,
              isSubmitted: ex.is_submitted ? Boolean(ex.is_submitted) : false,
              studentSubmissions: ex.student_submissions
                ? (ex.student_submissions as Array<Record<string, unknown>>)
                : [],
              questionSets
            }
            return transformed
          })
        : undefined
  }

  return result
}

export default function LessonPage() {
  const params = useParams()
  const moduleId = params.id as string
  const lessonId = params.lessonId as string
  const setBreadcrumbItems = useSetBreadcrumbItems()
  const { role } = useRoleContext()
  const [enrichedReviewExercises, setEnrichedReviewExercises] = useState<ReviewExercise[]>([])

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

  // Fetch details for all exercises when lesson data changes
  useEffect(() => {
    const fetchAllExerciseDetails = async () => {
      const reviewedExercises = (apiLesson?.data?.reviewed_exercises || []) as Record<string, unknown>[]

      if (reviewedExercises.length === 0) {
        setEnrichedReviewExercises([])
        return
      }

      try {
        // For now, create exercises with available data
        // Full details would require fetching each exercise individually
        const enriched: ReviewExercise[] = reviewedExercises.map((ex) => {
          const questionSets = ex.question_sets
            ? (ex.question_sets as Array<{
                question_set_id: string
                title: string
                description: string
              }>)
            : undefined
          const firstQuestionSet = questionSets && questionSets.length > 0 ? questionSets[0] : undefined

          return {
            id: String(ex.reviewed_exercise_id || ''),
            title: firstQuestionSet?.title, // Get title from first question set
            description: firstQuestionSet?.description, // Get description from first question set
            questionCount: undefined,
            status: ex.status ? String(ex.status) : undefined,
            isSubmitted: ex.is_submitted ? Boolean(ex.is_submitted) : false,
            studentSubmissions: ex.student_submissions
              ? (ex.student_submissions as Array<Record<string, unknown>>)
              : [],
            questionSets
          }
        })
        setEnrichedReviewExercises(enriched)
      } catch (error) {
        console.error('Error fetching exercise details:', error)
      }
    }

    fetchAllExerciseDetails()
  }, [apiLesson?.data?.reviewed_exercises])

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

  // Merge enriched exercises with lesson data
  const lessonWithEnrichedExercises = {
    ...lesson,
    reviewExercises: enrichedReviewExercises.length > 0 ? enrichedReviewExercises : lesson.reviewExercises
  }

  return (
    <div className='flex flex-col h-full w-full'>
      <LessonContentViewer lesson={lessonWithEnrichedExercises} />
    </div>
  )
}

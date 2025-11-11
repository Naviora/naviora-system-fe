'use client'

import React, { useEffect, useState, useRef } from 'react'
import { ExamQuestionCard } from '@/components/exam-test/exam-question-card'
import { ExamQuestionSidebar } from '@/components/exam-test/exam-question-sidebar'
import { ExamTestHeader } from '@/components/exam-test/exam-test-header'
import { useCountdown } from '@/hooks/use-count-down'
import {
  clearEXAMTestProgress,
  loadEXAMTestProgress,
  saveEXAMTestProgress,
  saveReviewedExerciseSession,
  loadReviewedExerciseSession,
  clearReviewedExerciseSession,
  type ReviewedExerciseSessionPayload
} from '@/lib/utils/exam-test-indb'
import { LoadingSpinner } from '@/components/ui'
import {
  useStartReviewedExercise,
  useSubmitReviewedExercise
} from '@/hooks/api/lecturer/exams/use-reviewed-exercise-submission'
import { useGetQuestionSetDetail } from '@/hooks/api/lecturer/exams/use-question-set'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { QUERY_KEYS } from '@/lib/constants/config'
import type { SubmitReviewedExerciseResponse } from '@/hooks/api/lecturer/exams/use-reviewed-exercise-submission'
import type { Question } from '@/lib/validations/lecturer/exams/question'

export default function ManageReviewedExercise({
  reviewedExerciseId,
  onShowResult
}: {
  reviewedExerciseId: string
  onShowResult?: (result: SubmitReviewedExerciseResponse, duration: number) => void
}) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<{ [key: number]: number }>({})
  const [flagged, setFlagged] = useState<number[]>([])
  const [initialSeconds, setInitialSeconds] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [initializationError, setInitializationError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [questionSetId, setQuestionSetId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const endTimestampRef = useRef<number | null>(null)
  const queryClient = useQueryClient()
  const params = useParams()
  const lessonIdParam = (params?.lessonId as string) || null
  const moduleIdParam = (params?.id as string) || null

  const startMutation = useStartReviewedExercise({ retry: 0 })
  const submitMutation = useSubmitReviewedExercise()
  const {
    data: questionSetDetail,
    isLoading: isQuestionSetLoading,
    isError: isQuestionSetError
  } = useGetQuestionSetDetail(questionSetId ?? '', { enabled: Boolean(questionSetId) })

  // Initialize session by reusing stored submission or starting a new one
  useEffect(() => {
    let cancelled = false

    const prepareSession = async () => {
      setIsLoaded(false)
      setInitializationError(null)

      try {
        const storedSession = await loadReviewedExerciseSession()
        if (cancelled) return

        if (storedSession && storedSession.reviewed_exercise_id === reviewedExerciseId) {
          setQuestionSetId(storedSession.question_set_id)
          return
        }

        const freshSession = await startMutation.mutateAsync({ reviewedExerciseId })
        if (cancelled) return

        await clearReviewedExerciseSession()
        await clearEXAMTestProgress()

        const payload: ReviewedExerciseSessionPayload = {
          reviewed_exercise_id: freshSession.reviewed_exercise_id,
          question_set_id: freshSession.question_set_id,
          reviewed_exercise_submission_id: freshSession.reviewed_exercise_submission_id,
          attempt_status: freshSession.attempt_status,
          student_id: freshSession.student_id,
          created_at: freshSession.created_at,
          updated_at: freshSession.updated_at
        }

        await saveReviewedExerciseSession(payload)
        if (cancelled) return

        setQuestionSetId(payload.question_set_id)
      } catch (error) {
        if (cancelled) return

        const errorMsg = error instanceof Error ? error.message : 'Không thể khởi động bài tập ôn tập'
        setInitializationError(errorMsg)
        toast.error(errorMsg)
      }
    }

    if (reviewedExerciseId) {
      void prepareSession()
    }

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewedExerciseId])

  // Prepare questions and timer once question set detail is available
  useEffect(() => {
    if (!questionSetDetail || !questionSetId) return

    let cancelled = false

    const initializeFromQuestionSet = async () => {
      const storedProgress = await loadEXAMTestProgress()
      if (cancelled) return

      const questionList = (questionSetDetail.questions as Question[]) || []
      const durationMinutes = questionSetDetail.config.general.duration_minutes

      setQuestions(questionList)

      if (
        storedProgress &&
        storedProgress.reviewed_exercise_id === reviewedExerciseId &&
        storedProgress.question_set_id === questionSetId &&
        typeof storedProgress.endTimestamp === 'number'
      ) {
        setCurrent(storedProgress.current ?? 0)
        setSelected(storedProgress.selected ?? {})
        setFlagged(storedProgress.flagged ?? [])
        endTimestampRef.current = storedProgress.endTimestamp
        setInitialSeconds(Math.max(0, Math.floor((storedProgress.endTimestamp - Date.now()) / 1000)))
      } else {
        const endTimestamp = Date.now() + durationMinutes * 60 * 1000
        setCurrent(0)
        setSelected({})
        setFlagged([])
        setInitialSeconds(durationMinutes * 60)
        endTimestampRef.current = endTimestamp

        await saveEXAMTestProgress({
          reviewed_exercise_id: reviewedExerciseId,
          question_set_id: questionSetId,
          current: 0,
          selected: {},
          flagged: [],
          endTimestamp,
          total_questions: questionList.length,
          duration_minutes: durationMinutes
        })
      }

      if (!cancelled) {
        setIsLoaded(true)
      }
    }

    void initializeFromQuestionSet()

    return () => {
      cancelled = true
    }
  }, [questionSetDetail, questionSetId, reviewedExerciseId])

  const handleSubmit = () => {
    if (!questionSetId) return

    const answered = Object.entries(selected).map(([key, idx]) => {
      const question = questions[Number(key) - 1]
      return {
        questionId: question?.question_id || '',
        answerId: question?.answers?.[idx]?.answer_id || ''
      }
    })

    submitMutation.mutate(
      { reviewedExerciseId, questionSetId, data: { answered } },
      {
        onSuccess: async (response) => {
          setIsSubmitted(true)
          await Promise.all([clearEXAMTestProgress(), clearReviewedExerciseSession()])

          const invalidations: Array<Promise<unknown>> = []

          if (lessonIdParam) {
            invalidations.push(queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LESSON_DETAIL(lessonIdParam) }))
          }

          if (moduleIdParam) {
            invalidations.push(queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULE_LESSONS(moduleIdParam) }))
          }

          if (invalidations.length > 0) {
            await Promise.allSettled(invalidations)
          }

          toast.success('Nộp bài tập ôn tập thành công!')
          if (onShowResult) {
            onShowResult(response, Math.round((initialSeconds ?? 0) - secondsLeft))
          }
        },
        onError: (error: unknown) => {
          const errorMsg = error instanceof Error ? error.message : 'Nộp bài tập ôn tập thất bại. Vui lòng thử lại.'
          toast.error(errorMsg)
        }
      }
    )
  }

  // Save progress to IndexedDB when state changes
  useEffect(() => {
    if (isLoaded && !isSubmitted && endTimestampRef.current && questionSetId) {
      saveEXAMTestProgress({
        reviewed_exercise_id: reviewedExerciseId,
        question_set_id: questionSetId,
        current,
        selected,
        flagged,
        endTimestamp: endTimestampRef.current,
        total_questions: questions.length,
        duration_minutes: Math.floor((initialSeconds ?? 0) / 60)
      })
    }
  }, [
    current,
    selected,
    flagged,
    isLoaded,
    isSubmitted,
    questionSetId,
    questions.length,
    initialSeconds,
    reviewedExerciseId
  ])

  // Prevent tab close warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const totalQuestions = questions.length
  const answeredCount = Object.keys(selected).length
  const { secondsLeft, formatTime } = useCountdown(initialSeconds ?? 10 * 60, handleSubmit, {
    enabled: isLoaded && initialSeconds !== null
  })

  if (initializationError) {
    return (
      <div className='flex items-center justify-center min-h-screen text-error text-center px-6'>
        {initializationError}
      </div>
    )
  }

  if (startMutation.isPending || !questionSetId || isQuestionSetLoading || !isLoaded) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner variant='dots' />
      </div>
    )
  }

  if (isQuestionSetError || !questionSetDetail || questions.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-screen text-error'>
        Không thể tải dữ liệu câu hỏi bài tập ôn tập.
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-greyscale-25'>
      <ExamTestHeader
        title='Bài tập ôn tập'
        description='Ôn luyện và cải thiện kỹ năng của bạn'
        progress={(answeredCount / totalQuestions) * 100}
        time={formatTime(secondsLeft)}
      />
      <div className='grid grid-cols-12 gap-5 px-40 py-10'>
        <ExamQuestionCard
          question={questions[current] as Question}
          current={current}
          selected={selected}
          onSelect={(idx) => setSelected((prev) => ({ ...prev, [current + 1]: idx }))}
          flagged={flagged}
          onFlag={() =>
            setFlagged((prev) =>
              prev.includes(current + 1) ? prev.filter((f) => f !== current + 1) : [...prev, current + 1]
            )
          }
          onPrev={() => setCurrent((prev) => Math.max(prev - 1, 0))}
          onNext={() => setCurrent((prev) => Math.min(prev + 1, totalQuestions - 1))}
          disablePrev={current === 0}
          disableNext={current === totalQuestions - 1}
        />
        <ExamQuestionSidebar
          totalQuestions={totalQuestions}
          selected={selected}
          flagged={flagged}
          current={current}
          onJump={setCurrent}
          answeredCount={answeredCount}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

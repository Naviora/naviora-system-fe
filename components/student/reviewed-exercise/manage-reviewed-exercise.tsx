'use client'

import React, { useEffect, useState, useRef } from 'react'
import { ExamQuestionCard } from '@/components/exam-test/exam-question-card'
import { ExamQuestionSidebar } from '@/components/exam-test/exam-question-sidebar'
import { ExamTestHeader } from '@/components/exam-test/exam-test-header'
import { useCountdown } from '@/hooks/use-count-down'
import { clearEXAMTestProgress, clearQuestionSet, saveEXAMTestProgress } from '@/lib/utils/exam-test-indb'
import { LoadingSpinner } from '@/components/ui'
import {
  useStartReviewedExercise,
  useSubmitReviewedExercise
} from '@/hooks/api/lecturer/exams/use-reviewed-exercise-submission'
import { toast } from 'sonner'
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
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [questionSetId, setQuestionSetId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const endTimestampRef = useRef<number | null>(null)

  const startMutation = useStartReviewedExercise()
  const submitMutation = useSubmitReviewedExercise()

  // Start the reviewed exercise
  useEffect(() => {
    const initializeReviewedExercise = () => {
      startMutation.mutate(
        { reviewedExerciseId },
        {
          onSuccess: (data) => {
            setQuestionSetId(data.question_set_id)
            setQuestions((data.question_set.questions as Question[]) || [])

            // Initialize timer and progress
            const durationMinutes = data.question_set.config.general.duration_minutes
            const endTimestamp = Date.now() + durationMinutes * 60 * 1000

            setCurrent(0)
            setSelected({})
            setFlagged([])
            setInitialSeconds(durationMinutes * 60)
            endTimestampRef.current = endTimestamp

            // Save to IndexedDB for recovery
            saveEXAMTestProgress({
              question_set_id: data.question_set_id,
              current: 0,
              selected: {},
              flagged: [],
              endTimestamp,
              total_questions: data.question_set.config.general.total_questions,
              duration_minutes: durationMinutes
            })

            setIsLoaded(true)
          },
          onError: (error: unknown) => {
            const errorMsg = error instanceof Error ? error.message : 'Không thể khởi động bài tập ôn tập'
            toast.error(errorMsg)
          }
        }
      )
    }

    if (reviewedExerciseId && !questionSetId) {
      initializeReviewedExercise()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewedExerciseId, questionSetId])

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
        onSuccess: (response) => {
          setIsSubmitted(true)
          clearEXAMTestProgress()
          clearQuestionSet()
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
        question_set_id: questionSetId,
        current,
        selected,
        flagged,
        endTimestamp: endTimestampRef.current,
        total_questions: questions.length,
        duration_minutes: Math.floor((initialSeconds ?? 0) / 60)
      })
    }
  }, [current, selected, flagged, isLoaded, isSubmitted, questionSetId, questions.length, initialSeconds])

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

  if (startMutation.isPending || !isLoaded || !questionSetId) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner variant='dots' />
      </div>
    )
  }

  if (questions.length === 0) {
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

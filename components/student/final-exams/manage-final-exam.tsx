'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ExamQuestionCard } from '@/components/exam-test/exam-question-card'
import { ExamQuestionSidebar } from '@/components/exam-test/exam-question-sidebar'
import { ExamTestHeader } from '@/components/exam-test/exam-test-header'
import { LoadingSpinner } from '@/components/ui'
import { useCountdown } from '@/hooks/use-count-down'
import { useGetQuestionSetDetail } from '@/hooks/api/lecturer/exams/use-question-set'
import {
  useStartFinalExam,
  useSubmitFinalExam,
  type SubmitFinalExamResponse
} from '@/hooks/api/student/use-final-exam-submission'
import {
  clearEXAMTestProgress,
  loadEXAMTestProgress,
  saveEXAMTestProgress,
  loadFinalExamSession,
  saveFinalExamSession,
  clearFinalExamSession,
  type FinalExamSessionPayload
} from '@/lib/utils/exam-test-indb'
import type { Question } from '@/lib/validations/lecturer/exams/question'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants/config'

interface ManageFinalExamProps {
  finalExamId: string
  examTitle?: string
  onShowResult?: (result: SubmitFinalExamResponse, duration: number) => void
}

export function ManageFinalExam({ finalExamId, examTitle = 'Bài thi cuối kỳ', onShowResult }: ManageFinalExamProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [questionSetId, setQuestionSetId] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<{ [key: number]: number }>({})
  const [flagged, setFlagged] = useState<number[]>([])
  const [initialSeconds, setInitialSeconds] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [initializationError, setInitializationError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const endTimestampRef = useRef<number | null>(null)
  const submissionInProgressRef = useRef(false)

  const startMutation = useStartFinalExam({ retry: 0 })
  const submitMutation = useSubmitFinalExam()

  const {
    data: questionSetDetail,
    isLoading: isQuestionSetLoading,
    isError: isQuestionSetError
  } = useGetQuestionSetDetail(questionSetId ?? '', { enabled: Boolean(questionSetId) })

  useEffect(() => {
    if (!finalExamId) return

    let cancelled = false

    const prepareSession = async () => {
      setIsLoaded(false)
      setInitializationError(null)

      try {
        const storedSession = await loadFinalExamSession()
        if (cancelled) return

        if (storedSession && storedSession.final_exam_id === finalExamId) {
          setQuestionSetId(storedSession.question_set_id)
          return
        }

        const freshSession = await startMutation.mutateAsync({ finalExamId })
        if (cancelled) return

        await clearFinalExamSession()
        await clearEXAMTestProgress()

        const payload: FinalExamSessionPayload = {
          final_exam_id: freshSession.final_exam_id,
          question_set_id: freshSession.question_set_id,
          final_exam_submission_id: freshSession.final_exam_submission_id,
          attempt_status: freshSession.attempt_status,
          student_id: freshSession.student_id,
          created_at: freshSession.created_at,
          updated_at: freshSession.updated_at
        }

        await saveFinalExamSession(payload)
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FINAL_EXAM_DETAIL(finalExamId) })
        if (cancelled) return

        setQuestionSetId(payload.question_set_id)
      } catch (error) {
        if (cancelled) return
        const message = error instanceof Error ? error.message : 'Không thể khởi tạo phiên làm bài thi cuối kỳ.'
        setInitializationError(message)
        toast.error(message)
      }
    }

    void prepareSession()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalExamId])

  useEffect(() => {
    if (!questionSetDetail || !questionSetId) return

    let cancelled = false

    const initializeQuestions = async () => {
      const storedProgress = await loadEXAMTestProgress()
      if (cancelled) return

      const questionList = (questionSetDetail.questions as Question[]) || []
      const durationMinutes = questionSetDetail.config.general.duration_minutes

      setQuestions(questionList)

      if (
        storedProgress &&
        storedProgress.final_exam_id === finalExamId &&
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
          final_exam_id: finalExamId,
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

    void initializeQuestions()

    return () => {
      cancelled = true
    }
  }, [questionSetDetail, questionSetId, finalExamId])

  useEffect(() => {
    if (isLoaded && !isSubmitted && endTimestampRef.current && questionSetId) {
      void saveEXAMTestProgress({
        final_exam_id: finalExamId,
        question_set_id: questionSetId,
        current,
        selected,
        flagged,
        endTimestamp: endTimestampRef.current,
        total_questions: questions.length,
        duration_minutes: Math.floor((initialSeconds ?? 0) / 60)
      })
    }
  }, [current, selected, flagged, isLoaded, isSubmitted, questionSetId, questions.length, initialSeconds, finalExamId])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const totalQuestions = questions.length
  const answeredCount = Object.keys(selected).length

  // Initialize countdown first to get secondsLeft
  const [countdownRef] = useState<{ handleSubmit?: () => void }>({})

  // Temporary countdown without handleSubmit first
  const countdownEnabled =
    isLoaded && initialSeconds !== null && !isSubmitted && !submitMutation.isPending && !submissionInProgressRef.current
  const { secondsLeft, formatTime } = useCountdown(
    initialSeconds ?? 10 * 60,
    () => {
      countdownRef.handleSubmit?.()
    },
    {
      enabled: countdownEnabled
    }
  )

  const handleSubmit = useCallback(() => {
    if (!questionSetId || !finalExamId || submitMutation.isPending || isSubmitted || submissionInProgressRef.current)
      return

    submissionInProgressRef.current = true

    const answered = Object.entries(selected)
      .map(([key, idx]) => {
        const question = questions[Number(key) - 1]
        const answer = question?.answers?.[idx]
        if (!question?.question_id || !answer?.answer_id) {
          return null
        }
        return {
          questionId: question.question_id,
          answerId: answer.answer_id
        }
      })
      .filter((item): item is { questionId: string; answerId: string } => Boolean(item))

    submitMutation.mutate(
      { finalExamId, questionSetId, data: { answered } },
      {
        onSuccess: async (response) => {
          setIsSubmitted(true)
          await Promise.all([clearEXAMTestProgress(), clearFinalExamSession()])
          await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FINAL_EXAM_DETAIL(finalExamId) })
          toast.success('Nộp bài thi cuối kỳ thành công!')
          if (onShowResult) {
            onShowResult(response, Math.round((initialSeconds ?? 0) - secondsLeft))
          } else {
            router.replace(`/student/final-exams/${finalExamId}`)
          }
        },
        onError: (error) => {
          submissionInProgressRef.current = false
          const message = error instanceof Error ? error.message : 'Nộp bài thi cuối kỳ thất bại. Vui lòng thử lại.'
          toast.error(message)
        }
      }
    )
  }, [
    questionSetId,
    finalExamId,
    selected,
    questions,
    submitMutation,
    isSubmitted,
    onShowResult,
    router,
    queryClient,
    initialSeconds,
    secondsLeft
  ])

  useEffect(() => {
    countdownRef.handleSubmit = handleSubmit
  }, [handleSubmit, countdownRef])

  if (initializationError) {
    return (
      <div className='flex min-h-screen items-center justify-center px-6 text-center text-error'>
        {initializationError}
      </div>
    )
  }

  if (startMutation.isPending || !questionSetId || isQuestionSetLoading || !isLoaded) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingSpinner variant='dots' />
      </div>
    )
  }

  if (isQuestionSetError || !questionSetDetail || questions.length === 0) {
    return (
      <div className='flex min-h-screen items-center justify-center text-error'>
        Không thể tải dữ liệu câu hỏi bài thi cuối kỳ.
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-greyscale-25'>
      <ExamTestHeader
        title={examTitle}
        description='Hoàn thành bài thi trước khi hết thời gian.'
        progress={(answeredCount / totalQuestions) * 100}
        time={formatTime(secondsLeft)}
      />
      <div className='grid grid-cols-12 gap-5 px-2 py-6 sm:px-8 lg:px-40 lg:py-10'>
        <ExamQuestionCard
          question={questions[current] as Question}
          current={current}
          selected={selected}
          onSelect={(idx) => setSelected((prev) => ({ ...prev, [current + 1]: idx }))}
          flagged={flagged}
          onFlag={() =>
            setFlagged((prev) =>
              prev.includes(current + 1) ? prev.filter((item) => item !== current + 1) : [...prev, current + 1]
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
          isSubmitting={submitMutation.isPending}
        />
      </div>
    </div>
  )
}

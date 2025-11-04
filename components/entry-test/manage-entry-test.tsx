import React, { useEffect, useState, useRef } from 'react'
import { ExamQuestionCard } from '@/components/exam-test/exam-question-card'
import { ExamQuestionSidebar } from '@/components/exam-test/exam-question-sidebar'
import { ExamTestHeader } from '@/components/exam-test/exam-test-header'
import { useCountdown } from '@/hooks/use-count-down'
import {
  clearEXAMTestProgress,
  clearQuestionSet,
  loadEXAMTestProgress,
  loadQuestionSet,
  saveEXAMTestProgress
} from '@/lib/utils/exam-test-indb'
import { LoadingSpinner } from '@/components/ui'
import { useGetQuestionSetDetail } from '@/hooks/api/lecturer/exams/use-question-set'
import { useSubmitEntryTest } from '@/hooks/api/lecturer/exams/use-entry-test'
import { toast } from 'sonner'
import { SubmitEntryTestResponse } from '@/lib/validations/lecturer/exams/entry-test'

export default function ManageEntryTest({ onShowResult }: { onShowResult?: (result: SubmitEntryTestResponse, duration: number) => void }) {
  const [questionSetId, setQuestionSetId] = useState<string | null>(null)
  const [entryTestId, setEntryTestId] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<{ [key: number]: number }>({})
  const [flagged, setFlagged] = useState<number[]>([])
  const [initialSeconds, setInitialSeconds] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const endTimestampRef = useRef<number | null>(null)
  const submitMutation = useSubmitEntryTest()

  const handleSubmit = async () => {
    if (!questionSetId || !entryTestId) return
    const answered = Object.entries(selected).map(([key, idx]) => ({
      questionId: questions[Number(key) - 1]?.question_id,
      answerId: questions[Number(key) - 1]?.answers[idx]?.answer_id
    }))
    submitMutation.mutate(
      { entryTestId, questionSetId, data: { answered } },
      {
        onSuccess: (response) => {
          setIsSubmitted(true)
          clearEXAMTestProgress()
          clearQuestionSet()
          toast.success('Nộp bài thành công!')
          if (onShowResult) {
            onShowResult(response, Math.round((initialSeconds ?? 0) - secondsLeft))
          }
        },
        onError: (error) => {
          toast.error(error.message || 'Nộp bài thất bại. Vui lòng thử lại.')
        }
      }
    )
  }

  useEffect(() => {
    loadQuestionSet().then((data) => {
      if (data?.question_set_id) setQuestionSetId(data.question_set_id)
      if (data?.entry_test_id) setEntryTestId(data.entry_test_id)
    })
  }, [])

  const { data: questionSetDetail, isLoading, isError } = useGetQuestionSetDetail(questionSetId ?? '')

  useEffect(() => {
    if (!questionSetDetail || !questionSetId) return
    loadEXAMTestProgress().then((data) => {
      if (data && typeof data.endTimestamp === 'number') {
        // Đã có dữ liệu, chỉ khôi phục lại state
        setCurrent(data.current ?? 0)
        setSelected(data.selected ?? {})
        setFlagged(data.flagged ?? [])
        endTimestampRef.current = data.endTimestamp
        setInitialSeconds(Math.max(0, Math.floor((data.endTimestamp - Date.now()) / 1000)))
        setIsLoaded(true)
      } else {
        // Chưa có dữ liệu, khởi tạo mới
        const totalQuestions = questionSetDetail.config.general.total_questions
        const durationMinutes = questionSetDetail.config.general.duration_minutes
        const endTimestamp = Date.now() + durationMinutes * 60 * 1000

        setCurrent(0)
        setSelected({})
        setFlagged([])
        setInitialSeconds(durationMinutes * 60)
        endTimestampRef.current = endTimestamp

        saveEXAMTestProgress({
          question_set_id: questionSetId,
          current: 0,
          selected: {},
          flagged: [],
          endTimestamp,
          total_questions: totalQuestions,
          duration_minutes: durationMinutes
        })
        setIsLoaded(true)
      }
    })
  }, [questionSetDetail, questionSetId])

  useEffect(() => {
    if (isLoaded && !isSubmitted && endTimestampRef.current) {
      saveEXAMTestProgress({
        question_set_id: questionSetId,
        current,
        selected,
        flagged,
        endTimestamp: endTimestampRef.current,
        total_questions: questionSetDetail?.config.general.total_questions,
        duration_minutes: questionSetDetail?.config.general.duration_minutes
      })
    }
  }, [current, selected, flagged, isLoaded, isSubmitted, questionSetId, questionSetDetail])

  //Xác nhận khi người ta tính tắt tab hoặc reload
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

  const questions = questionSetDetail?.questions ?? []
  const totalQuestions = questions.length
  const answeredCount = Object.keys(selected).length
  const { secondsLeft, formatTime } = useCountdown(initialSeconds ?? 10 * 60, handleSubmit, {
    enabled: isLoaded && initialSeconds !== null
  })

  if (!questionSetId || isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner variant='dots' />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center min-h-screen text-error'>Không thể tải dữ liệu bộ câu hỏi.</div>
    )
  }

  return (
    <div className='min-h-screen bg-greyscale-25'>
      <ExamTestHeader
        title='Bài kiểm tra đầu vào'
        description='Đánh giá học lực học sinh'
        progress={(answeredCount / totalQuestions) * 100}
        time={formatTime(secondsLeft)}
      />
      <div className='grid grid-cols-12 gap-5 px-40 py-10'>
        <ExamQuestionCard
          question={questions[current]}
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

import React, { useState, useEffect, useRef } from 'react'
import { ExamQuestionCard } from '@/components/exam-test/exam-question-card'
import { ExamQuestionSidebar } from '@/components/exam-test/exam-question-sidebar'
import { ExamTestHeader } from '@/components/exam-test/exam-test-header'
import { useCountdown } from '@/hooks/use-count-down'
import { clearEXAMTestProgress, loadEXAMTestProgress, saveEXAMTestProgress } from '@/lib/utils/exam-test-indb'
import { LoadingSpinner } from '@/components/ui'

const questions = [
  {
    id: 1,
    content: 'Trong quá trình quang hợp ở thực vật, pha sáng diễn ra tại vị trí nào của lục lạp?',
    answers: ['Chất nền (stroma)', 'Màng ngoài của lục lạp', 'Màng tilacoit', 'Khoang gian màng của lục lạp']
  },
  {
    id: 2,
    content: 'Nguyên tố nào sau đây là thành phần chính của phân tử ADN?',
    answers: ['Nitơ', 'Photpho', 'Cacbon', 'Oxi']
  },
  {
    id: 3,
    content: 'Loài động vật nào sau đây là động vật biến nhiệt?',
    answers: ['Chim', 'Cá', 'Người', 'Khỉ']
  },
  {
    id: 4,
    content: 'Quá trình quang hợp ở thực vật tạo ra sản phẩm nào?',
    answers: ['Oxi và nước', 'Oxi và đường', 'Nước và muối khoáng', 'Đường và muối khoáng']
  },
  {
    id: 5,
    content: 'Cấu trúc nào sau đây không có ở tế bào thực vật?',
    answers: ['Thành tế bào', 'Lục lạp', 'Ti thể', 'Lông chuyển']
  },
  {
    id: 6,
    content: 'Quá trình trao đổi khí ở người diễn ra chủ yếu ở đâu?',
    answers: ['Phổi', 'Tim', 'Gan', 'Thận']
  },
  {
    id: 7,
    content: 'Enzyme nào sau đây tham gia vào quá trình tiêu hóa tinh bột?',
    answers: ['Amylase', 'Lipase', 'Protease', 'Lactase']
  },
  {
    id: 8,
    content: 'Loại mô nào có chức năng nâng đỡ cơ thể thực vật?',
    answers: ['Mô mềm', 'Mô cứng', 'Mô dẫn', 'Mô biểu bì']
  },
  {
    id: 9,
    content: 'Quá trình nào sau đây giúp cây hấp thụ nước từ đất?',
    answers: ['Thoát hơi nước', 'Quang hợp', 'Hô hấp', 'Thẩm thấu']
  },
  {
    id: 10,
    content: 'Bộ phận nào của cây thực vật có chức năng sinh sản?',
    answers: ['Lá', 'Thân', 'Hoa', 'Rễ']
  }
]

const TOTAL_SECONDS = 45 * 60

export default function ManageEntryTest() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<{ [key: number]: number }>({})
  const [flagged, setFlagged] = useState<number[]>([])
  const totalQuestions = questions.length
  const answeredCount = Object.keys(selected).length
  const [initialSeconds, setInitialSeconds] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const endTimestampRef = useRef<number | null>(null)

  const handleSubmit = () => {
    setIsSubmitted(true)
    clearEXAMTestProgress()
    alert('Nộp bài thành công!')
  }

  useEffect(() => {
    loadEXAMTestProgress().then((data) => {
      if (data && typeof data.endTimestamp === 'number') {
        setCurrent(data.current ?? 0)
        setSelected(data.selected ?? {})
        setFlagged(data.flagged ?? [])
        endTimestampRef.current = data.endTimestamp
        const left = Math.max(0, Math.floor((data.endTimestamp - Date.now()) / 1000))
        setInitialSeconds(left)
      } else {
        const endTimestamp = Date.now() + TOTAL_SECONDS * 1000
        endTimestampRef.current = endTimestamp
        setInitialSeconds(TOTAL_SECONDS)
        saveEXAMTestProgress({
          current: 0,
          selected: {},
          flagged: [],
          endTimestamp
        })
      }
      setIsLoaded(true)
    })
  }, [])

  const enabledCountdown = isLoaded && initialSeconds !== null
  const { secondsLeft, formatTime } = useCountdown(initialSeconds ?? 10 * 60, handleSubmit, { enabled: enabledCountdown })

  useEffect(() => {
    if (isLoaded && !isSubmitted && endTimestampRef.current) {
      saveEXAMTestProgress({
        current,
        selected,
        flagged,
        endTimestamp: endTimestampRef.current
      })
    }
  }, [current, selected, flagged, secondsLeft, isLoaded, isSubmitted])

  if (!isLoaded || initialSeconds === null) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner variant='dots' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-neutral-900'>
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

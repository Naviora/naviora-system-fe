import React, { useState, useEffect } from 'react'
import { ExamQuestionCard } from '@/components/exam-test/exam-question-card'
import { ExamQuestionSidebar } from '@/components/exam-test/exam-question-sidebar'
import { ExamTestHeader } from '@/components/exam-test/exam-test-header'
import { useCountdown } from '@/hooks/use-count-down'

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


  const handleSubmit = () => {
    alert('Nộp bài thành công!')
  }


  const { secondsLeft, formatTime } = useCountdown(TOTAL_SECONDS, handleSubmit)

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

import type { SubmitReviewedExerciseResponse } from '@/hooks/api/lecturer/exams/use-reviewed-exercise-submission'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi'

interface ManageReviewedExerciseResultProps {
  result?: SubmitReviewedExerciseResponse
  duration?: number
}

export default function ManageReviewedExerciseResult({ result, duration }: ManageReviewedExerciseResultProps) {
  if (!result) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <FiXCircle className='text-error mb-2' size={48} />
        <div className='text-error text-lg font-semibold'>Không có dữ liệu kết quả bài tập ôn tập.</div>
      </div>
    )
  }

  const totalQuestions = result.total_questions
  const answeredCount = result.answered.length

  return (
    <div className='h-dvh flex justify-center items-center'>
      <Card className='bg-card rounded-lg shadow-lg'>
        <CardContent className='p-8'>
          <div className='flex flex-col items-center mb-6'>
            {result.passed ? (
              <FiCheckCircle className='text-green-500 mb-2' size={48} />
            ) : (
              <FiXCircle className='text-red-500 mb-2' size={48} />
            )}
            <h2 className='text-2xl font-bold mb-2 text-center'>
              {result.passed ? 'Chúc mừng bạn đã đạt yêu cầu bài tập!' : 'Bạn chưa đạt yêu cầu, hãy cố gắng hơn!'}
            </h2>
          </div>
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <div className='flex flex-col items-center'>
              <span className='text-muted-foreground text-sm mb-1'>Điểm số của bạn</span>
              <span className='font-bold text-xl'>{result.score}</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-muted-foreground text-sm mb-1'>Số câu đã trả lời</span>
              <span className='font-bold text-xl'>
                {answeredCount} / {totalQuestions}
              </span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-muted-foreground text-sm mb-1'>Tỷ lệ hoàn thành</span>
              <span className='font-bold text-xl'>{Math.round((answeredCount / totalQuestions) * 100)}%</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-muted-foreground text-sm mb-1'>Thời gian làm bài</span>
              <span className='flex items-center gap-2 font-bold text-xl'>
                <FiClock />
                {duration}s
              </span>
            </div>
          </div>
          <Button
            className='w-full mt-2'
            onClick={() => {
              window.history.back()
            }}
          >
            Quay lại
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

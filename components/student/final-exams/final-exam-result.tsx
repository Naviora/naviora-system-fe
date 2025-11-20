import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Clock, FileText, Award } from 'lucide-react'
import { SubmitFinalExamResponse } from '@/hooks/api/student/use-final-exam-submission'
import { useRouter } from 'next/navigation'

interface FinalExamResultProps {
  result: SubmitFinalExamResponse
  duration: number
  finalExamId: string
}

export function FinalExamResult({ result, duration, finalExamId }: FinalExamResultProps) {
  const router = useRouter()
  const { score, passed, total_questions, answered } = result
  const answeredCount = answered?.length ?? 0

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m} phút ${s} giây`
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-greyscale-25 p-4'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='text-center'>
          <div className='mb-4 flex justify-center'>
            {passed ? (
              <CheckCircle className='h-16 w-16 text-green-500' />
            ) : (
              <XCircle className='h-16 w-16 text-red-500' />
            )}
          </div>
          <CardTitle className='text-2xl font-bold text-greyscale-900'>
            {passed ? 'Hoàn thành bài thi!' : 'Đã nộp bài thi'}
          </CardTitle>
          <p className='text-greyscale-500'>
            {passed ? 'Chúc mừng bạn đã hoàn thành bài thi.' : 'Bạn đã hoàn thành bài thi.'}
          </p>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col items-center rounded-lg bg-greyscale-50 p-3'>
              <Award className='mb-2 h-5 w-5 text-primary' />
              <span className='text-sm text-greyscale-500'>Điểm số</span>
              <span className='text-xl font-bold text-greyscale-900'>{score}</span>
            </div>
            <div className='flex flex-col items-center rounded-lg bg-greyscale-50 p-3'>
              <Clock className='mb-2 h-5 w-5 text-primary' />
              <span className='text-sm text-greyscale-500'>Thời gian</span>
              <span className='text-xl font-bold text-greyscale-900'>{formatTime(duration)}</span>
            </div>
            <div className='flex flex-col items-center rounded-lg bg-greyscale-50 p-3'>
              <FileText className='mb-2 h-5 w-5 text-primary' />
              <span className='text-sm text-greyscale-500'>Số câu hỏi</span>
              <span className='text-xl font-bold text-greyscale-900'>{total_questions}</span>
            </div>
            <div className='flex flex-col items-center rounded-lg bg-greyscale-50 p-3'>
              <CheckCircle className='mb-2 h-5 w-5 text-primary' />
              <span className='text-sm text-greyscale-500'>Đã làm</span>
              <span className='text-xl font-bold text-greyscale-900'>{answeredCount}</span>
            </div>
          </div>

          <Button className='w-full' onClick={() => router.replace(`/student/final-exams/${finalExamId}`)}>
            Quay lại chi tiết bài thi
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { MessageSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

type FeedbackItem = {
  id: number
  student: string
  avatar?: string
  summary: string
  course: string
  submittedAt: string
}

interface FeedbackSectionProps {
  feedbackItems?: FeedbackItem[]
}

const DEFAULT_FEEDBACK: FeedbackItem[] = [
  {
    id: 1,
    student: 'Nguyễn Linh',
    avatar: 'https://i.pravatar.cc/120?img=5',
    summary: 'Cần thêm ví dụ thực tế cho phần Dynamic Programming.',
    course: 'Cấu trúc dữ liệu & giải thuật',
    submittedAt: '43 phút trước'
  },
  {
    id: 2,
    student: 'Lê Quốc Bảo',
    avatar: 'https://i.pravatar.cc/120?img=11',
    summary: 'Tài liệu tham khảo AI tuần này rất hữu ích.',
    course: 'Nhập môn AI',
    submittedAt: '2 giờ trước'
  },
  {
    id: 3,
    student: 'Phạm Gia Huy',
    summary: 'Đề xuất bổ sung phiên hỏi đáp trước buổi thi thử.',
    course: 'Quản lý dự án CNTT',
    submittedAt: 'Hôm qua'
  }
]

export function FeedbackSection({ feedbackItems = DEFAULT_FEEDBACK }: FeedbackSectionProps) {
  return (
    <Card className='border-greyscale-200'>
      <CardHeader className='px-6 pb-0'>
        <CardTitle className='text-xl text-greyscale-900'>Phản hồi mới từ sinh viên</CardTitle>
        <CardDescription>Cập nhật nhanh những góp ý nổi bật gần đây.</CardDescription>
      </CardHeader>
      <CardContent className='px-6 pt-6'>
        <div className='flex flex-col gap-5'>
          {feedbackItems.map((feedback, index) => (
            <div key={feedback.id} className='flex gap-4'>
              <div className='flex flex-col items-center'>
                <Avatar className='ring-2 ring-primary-100'>
                  {feedback.avatar ? (
                    <AvatarImage src={feedback.avatar} alt={feedback.student} />
                  ) : (
                    <AvatarFallback>{feedback.student.slice(0, 2).toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                {index < feedbackItems.length - 1 ? (
                  <Separator orientation='vertical' className='mt-2 h-14 w-px bg-greyscale-200' />
                ) : null}
              </div>
              <div className='flex-1 space-y-1 rounded-lg border border-greyscale-200/70 bg-greyscale-50/70 p-4'>
                <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
                  <p className='font-medium text-greyscale-900'>{feedback.student}</p>
                  <span className='text-xs text-muted-foreground'>{feedback.submittedAt}</span>
                </div>
                <p className='text-sm text-muted-foreground'>{feedback.summary}</p>
                <span className='inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600'>
                  <MessageSquare className='size-3.5' /> {feedback.course}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

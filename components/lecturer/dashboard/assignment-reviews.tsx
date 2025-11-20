'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'

type AssignmentReview = {
  id: number
  module: string
  submissionsPending: number
  dueDate: string
  progress: number
}

interface AssignmentReviewsProps {
  assignments?: AssignmentReview[]
}

const DEFAULT_ASSIGNMENTS: AssignmentReview[] = [
  {
    id: 1,
    module: 'Phân tích & thiết kế hệ thống',
    submissionsPending: 6,
    dueDate: 'Hạn 06/11',
    progress: 60
  },
  {
    id: 2,
    module: 'Nhập môn AI',
    submissionsPending: 4,
    dueDate: 'Hạn 07/11',
    progress: 35
  },
  {
    id: 3,
    module: 'Quản lý dự án CNTT',
    submissionsPending: 2,
    dueDate: 'Hạn 08/11',
    progress: 80
  }
]

export function AssignmentReviews({ assignments = DEFAULT_ASSIGNMENTS }: AssignmentReviewsProps) {
  return (
    <Card className='border-greyscale-200'>
      <CardHeader className='px-6 pb-0'>
        <CardTitle className='text-xl text-greyscale-900'>Bài nộp cần đánh giá</CardTitle>
        <CardDescription>Ưu tiên những bài nộp gần tới hạn để không bỏ sót.</CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-6'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[45%]'>Chuyên đề</TableHead>
              <TableHead>Số bài</TableHead>
              <TableHead>Tiến độ</TableHead>
              <TableHead className='text-right'>Hạn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell className='font-medium text-greyscale-900'>{assignment.module}</TableCell>
                <TableCell>{assignment.submissionsPending}</TableCell>
                <TableCell>
                  <div className='flex flex-col gap-1'>
                    <Progress value={assignment.progress} />
                    <span className='text-xs text-muted-foreground'>{assignment.progress}% đã chấm</span>
                  </div>
                </TableCell>
                <TableCell className='text-right'>{assignment.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Question } from '@/lib/validations/lecturer/exams/question'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline, MdOutlineRemoveRedEye } from 'react-icons/md'
import { getTypeLabel, getDifficultyLabel } from '@/lib/constants/exams'
import { timeAgo } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useDeleteQuestion } from '@/hooks/api/lecturer/exams/use-question'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface QuestionCardProps {
  question: Question
  index: number
  onEdit: (data: any) => void
  onDelete?: (id: string) => void
}

export const QuestionCard = ({ question: q, index: idx, onEdit, onDelete }: QuestionCardProps) => {
  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const deleteMutation = useDeleteQuestion()

  const handleDelete = () => {
    deleteMutation.mutate(q.question_id, {
      onSuccess: () => {
        toast.success('Xóa câu hỏi thành công')
        setOpen(false)
        if (onDelete) onDelete(q.question_id)
      },
      onError(err: any) {
        toast.error(err?.message || 'Xóa câu hỏi không thành công')
        setOpen(false)
      }
    })
  }

  return (
    <>
      <div className='rounded shadow-sm border p-4 hover:shadow-md transition-all'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-3'>
            <span className='text-lg font-semibold text-primary'>{idx + 1}.</span>
            <span className='text-base font-semibold'>{q.content}</span>
          </div>
          <div className='flex gap-2'>
            <span className='bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded'>
              {getTypeLabel(q.type)}
            </span>
            <span className='bg-yellow-50 text-yellow-700 text-xs px-2 py-0.5 rounded'>
              {getDifficultyLabel(q.difficulty)}
            </span>
          </div>
        </div>
        <div className='flex items-center justify-between text-xs text-greyscale-400 mt-2'>
          <span>Đã cập nhật: {timeAgo(q.updated_at)}</span>
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className='text-greyscale-500 hover:text-primary flex items-center gap-1'
              onClick={() => setViewOpen(true)}
            >
              <MdOutlineRemoveRedEye />
              <span>Xem</span>
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='text-greyscale-500 hover:text-primary flex items-center gap-1'
              onClick={() => onEdit(q)}
            >
              <FaRegEdit />
              <span>Sửa</span>
            </Button>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-error hover:underline flex items-center gap-1'
                >
                  <MdDeleteOutline />
                  <span>Xóa</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-56' side='top'>
                <div className='flex flex-col gap-3'>
                  <span className='text-base font-medium'>Bạn có chắc muốn xóa câu hỏi này?</span>
                  <div className='flex gap-2 justify-end'>
                    <Button variant='outline' size='sm' onClick={() => setOpen(false)}>
                      Hủy
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={handleDelete}
                    >
                      Xác nhận xóa
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      {/* Dialog xem chi tiết câu hỏi */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-lg rounded-xl bg-white dark:bg-greyscale-950">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-primary-700 dark:text-primary-300">Chi tiết câu hỏi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Nội dung:</span>
              <div className="mt-1 text-base">{q.content}</div>
            </div>
            <div className="flex gap-6">
              <div>
                <span className="font-semibold">Loại:</span>
                <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{getTypeLabel(q.type)}</span>
              </div>
              <div>
                <span className="font-semibold">Độ khó:</span>
                <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">{getDifficultyLabel(q.difficulty)}</span>
              </div>
            </div>
            <div>
              <span className="font-semibold">Đáp án:</span>
              <ul className="list-disc ml-6 mt-1 space-y-1">
                {q.answers?.map((ans: any, i: number) => (
                  <li key={ans.answer_id} className={`text-base ${ans.is_correct ? 'text-green-700 font-semibold' : ''}`}>
                    {ans.content}
                    {ans.is_correct && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Đúng</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-xs text-muted-foreground">
              Đã cập nhật: {timeAgo(q.updated_at)}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

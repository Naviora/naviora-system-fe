/* eslint-disable @typescript-eslint/no-explicit-any */
import { Question } from '@/lib/validations/lecturer/exams/question'
import React, { useState } from 'react'
import { FaRegEdit } from "react-icons/fa"
import { MdDeleteOutline } from "react-icons/md"
import { QUESTION_TYPES, DIFFICULTY_LEVELS } from '@/lib/constants/exams'
import { timeAgo } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useDeleteQuestion } from '@/hooks/api/lecturer/exams/use-question'

interface QuestionCardProps {
  question: Question
  index: number
  showAnswers: boolean
  onEdit: (data: any) => void
}

const getTypeLabel = (value: string) =>
  QUESTION_TYPES.find(t => t.value === value)?.label || value

const getDifficultyLabel = (value: string) =>
  DIFFICULTY_LEVELS.find(d => d.value === value)?.label || value

export const QuestionCard = ({ question: q, index: idx, showAnswers, onEdit }: QuestionCardProps) => {
  const [open, setOpen] = useState(false)
  const deleteMutation = useDeleteQuestion()

  const handleDelete = () => {
    deleteMutation.mutate(q.question_id)
    setOpen(false)
  }

  return (
    <div className='bg-gray-50 rounded-lg p-4 border'>
      <div className='flex gap-2 mb-2'>
        <span className='bg-gray-200 text-xs px-2 py-0.5 rounded'>{getTypeLabel(q.type)}</span>
        <span className='bg-gray-200 text-xs px-2 py-0.5 rounded'>{getDifficultyLabel(q.difficulty)}</span>
      </div>
      <div className='font-medium mb-2'>
        {idx + 1}. {q.content}
      </div>
      <ul className='mb-2'>
        {q.answers.map((opt: any) => (
          <li key={opt.answer_id} className='text-gray-700 text-sm'>
            {opt.content}
          </li>
        ))}
      </ul>
      {showAnswers && (
        <div className='mb-2 text-green-700 text-sm'>
          <span className='font-semibold'>Đáp án: </span>
          {q.answers.filter((a: any) => a.is_correct).map((a: any) => a.content).join(', ')}
        </div>
      )}
      <div className='flex items-center justify-between text-sm text-gray-400'>
        <span>Đã cập nhật: {timeAgo(q.updated_at)}</span>
        <div className='flex gap-1'>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-primary flex items-center gap-1"
            onClick={() => onEdit(q)}
          >
            <FaRegEdit />
            <span>Chỉnh sửa</span>
          </Button>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-error hover:underline flex items-center gap-1"
              >
                <MdDeleteOutline />
                <span>Xóa</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" side='top'>
              <div className="flex flex-col gap-3">
                <span className="text-base font-medium">Bạn có chắc muốn xóa câu hỏi này?</span>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
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
  )
}
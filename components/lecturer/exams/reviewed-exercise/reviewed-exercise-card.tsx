import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline, MdOutlineRemoveRedEye } from 'react-icons/md'
import { timeAgo } from '@/lib/utils'
import { ReviewedExercise } from '@/lib/validations/lecturer/exams/reviewed-exercise'

interface ReviewedExerciseCardProps {
  exercise: ReviewedExercise
  onEdit: (data: ReviewedExercise) => void
  onDelete: (id: string) => void
  onView?: (data: ReviewedExercise) => void
}

export default function ReviewedExerciseCard({ exercise, onEdit, onDelete, onView }: ReviewedExerciseCardProps) {
  const [open, setOpen] = useState(false)

  const handleView = () => {
    if (onView) {
      onView(exercise)
    }
  }

  return (
    <div className='bg-greyscale-50 rounded border p-3 hover:shadow-sm transition-all'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-semibold text-greyscale-800'>{exercise.title || 'Bài tập ôn tập'}</span>
          {exercise.status && (
            <span className='text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700'>{exercise.status}</span>
          )}
        </div>
        <div className='flex gap-2'>
          <span className='bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium'>
            {exercise.question_sets?.length || 0} bộ câu hỏi
          </span>
        </div>
      </div>

      {exercise.description && (
        <div className='mb-2 text-greyscale-600 text-xs line-clamp-1'>{exercise.description}</div>
      )}

      <div className='flex items-center justify-between text-xs text-greyscale-400'>
        <span>{exercise.updated_at ? `Cập nhật: ${timeAgo(exercise.updated_at)}` : 'Bài tập mới'}</span>
        <div className='flex gap-2'>
          <Button
            variant='ghost'
            size='sm'
            className='text-greyscale-500 hover:text-primary flex items-center gap-1 h-7 px-2'
            onClick={handleView}
          >
            <MdOutlineRemoveRedEye className='size-3' />
            <span className='text-xs'>Xem</span>
          </Button>

          <Button
            variant='ghost'
            size='sm'
            className='text-greyscale-500 hover:text-primary flex items-center gap-1 h-7 px-2'
            onClick={() => onEdit(exercise)}
          >
            <FaRegEdit className='size-3' />
            <span className='text-xs'>Sửa</span>
          </Button>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant='ghost' size='sm' className='text-error hover:underline flex items-center gap-1 h-7 px-2'>
                <MdDeleteOutline className='size-3' />
                <span className='text-xs'>Xóa</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-56' side='top'>
              <div className='flex flex-col gap-3'>
                <span className='text-sm font-medium'>Bạn có chắc muốn xóa bài tập này?</span>
                <div className='flex gap-2 justify-end'>
                  <Button variant='outline' size='sm' onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => {
                      onDelete(exercise.reviewed_exercise_id)
                      setOpen(false)
                    }}
                  >
                    Xóa
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

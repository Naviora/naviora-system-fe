/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import { timeAgo } from '@/lib/utils'

interface QuestionSetCardProps {
  questionSet: any
  index: number
  onEdit: (data: any) => void
  onDelete: (id: string) => void
}

export const QuestionSetCard = ({ questionSet: qs, index, onEdit, onDelete }: QuestionSetCardProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className='bg-white rounded shadow-sm border p-4 hover:shadow-md transition-all'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-3'>
          <span className='text-lg font-semibold text-primary'>{index + 1}.</span>
          <span className='text-base font-semibold'>{qs.title}</span>
        </div>
        <div className='flex gap-2'>
          <span className='bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium'>
            {qs.total_questions} câu
          </span>
          <span className='bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium'>
            {qs.duration_minutes} phút
          </span>
        </div>
      </div>
      <div className='mb-2 text-gray-700 text-sm line-clamp-2'>
        <strong className='text-gray-500'>Mô tả:</strong> {qs.description}
      </div>
      <div className='flex items-center justify-between text-xs text-gray-400 mt-2'>
        <span>Đã cập nhật: {timeAgo(qs.updated_at)}</span>
        <div className='flex gap-2'>
          <Button
            variant='ghost'
            size='sm'
            className='text-gray-500 hover:text-primary flex items-center gap-1'
            onClick={() => onEdit(qs)}
          >
            <FaRegEdit />
            <span>Chỉnh sửa</span>
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
                <span className='text-base font-medium'>Bạn có chắc muốn xóa bộ câu hỏi này?</span>
                <div className='flex gap-2 justify-end'>
                  <Button variant='outline' size='sm' onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => {
                      onDelete(qs.id)
                      setOpen(false)
                    }}
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

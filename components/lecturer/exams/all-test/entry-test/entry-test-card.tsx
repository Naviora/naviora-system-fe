/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
import { formatDate, timeAgo } from '@/lib/utils'
import { getEntryTestStatus } from '@/lib/constants/exams'
import { EntryTest } from '@/lib/validations/lecturer/exams/entry-test'

interface EntryTestCardProps {
  entryTest: EntryTest
  index: number
  onEdit: (data: any) => void
  onDelete: (id: string) => void
}

export const EntryTestCard = ({ entryTest: et, index, onEdit, onDelete }: EntryTestCardProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className='bg-white rounded shadow-sm border p-4 hover:shadow-md transition-all'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-3'>
          <span className='text-lg font-semibold text-primary'>{index + 1}.</span>
          <span className='text-base font-semibold'>{et.title}</span>
        </div>
        <div className='flex gap-2'>
          <span className='bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium'>
            {et.question_sets?.length || 0} bộ câu hỏi
          </span>
          <span className='bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium'>
            {formatDate(et.start_time, true)} - {formatDate(et.end_time, true)}
          </span>
        </div>
      </div>
      <div className='mb-2 text-gray-700 text-sm line-clamp-2'>
        <strong className='text-gray-500'>Mô tả:</strong> {et.description}
      </div>
      <div className='flex items-center justify-between text-xs text-gray-400 mt-2'>
        <span>
          {getEntryTestStatus(et.status)} | Đã cập nhật: {timeAgo(et.updated_at)}
        </span>
        <div className='flex gap-2'>
          <Button
            variant='ghost'
            size='sm'
            className='text-gray-500 hover:text-primary flex items-center gap-1'
            onClick={() => onEdit(et)}
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
                <span className='text-base font-medium'>Bạn có chắc muốn xóa bài kiểm tra này?</span>
                <div className='flex gap-2 justify-end'>
                  <Button variant='outline' size='sm' onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => {
                      onDelete(et.entry_test_id)
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
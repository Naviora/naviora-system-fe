import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline, MdOutlineRemoveRedEye } from 'react-icons/md'
import { formatDateTime, timeAgo } from '@/lib/utils'
import FinalExamModal from './final-exam-modal'
import { FinalExam } from '@/lib/validations/lecturer/exams/final-exam'
import { getEntryTestStatus } from '@/lib/constants/exams'

interface FinalExamCardProps {
  finalExam: FinalExam
  index: number
  onEdit: (data: FinalExam) => void
  onDelete: (id: string) => void
}

export default function FinalExamCard({ finalExam: fe, index, onEdit, onDelete }: FinalExamCardProps) {
  const [open, setOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)

  return (
    <div className='bg-greyscale-0 rounded shadow-sm border p-4 hover:shadow-md transition-all'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-3'>
          <span className='text-lg font-semibold text-primary'>{index + 1}.</span>
          <span className='text-base font-semibold'>{fe.title}</span>
        </div>
        <div className='flex gap-2'>
          <span className='bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium'>
            {fe.question_sets?.length || 0} bộ câu hỏi
          </span>
          <span className='bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium'>
            {formatDateTime(fe.start_time)} - {formatDateTime(fe.end_time)}
          </span>
        </div>
      </div>
      <div className='mb-2 text-greyscale-700 text-sm line-clamp-2'>
        <strong className='text-greyscale-500'>Mô tả:</strong> {fe.description}
      </div>
      <div className='flex items-center justify-between text-xs text-greyscale-400 mt-2'>
        <span>
          <strong className='text-primary'>{getEntryTestStatus(fe.status)}</strong> | Đã cập nhật: {timeAgo(fe.updated_at)}
        </span>
        <div className='flex gap-2'>
          {fe.status === 'ACTIVE' ? (
            <>
              <Button
                variant='ghost'
                size='sm'
                className='text-greyscale-500 hover:text-primary flex items-center gap-1'
                onClick={() => setViewModalOpen(true)}
              >
                <MdOutlineRemoveRedEye />
                <span>Xem</span>
              </Button>
              <FinalExamModal
                open={viewModalOpen}
                onOpenChange={setViewModalOpen}
                initialData={fe}
                onSubmit={undefined}
                readOnly
              />
            </>
          ) : (
            <>
              <Button
                variant='ghost'
                size='sm'
                className='text-greyscale-500 hover:text-primary flex items-center gap-1'
                onClick={() => onEdit(fe)} 
              >
                <FaRegEdit />
                <span>Sửa</span>
              </Button>
            </>
          )}
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
                <span className='text-base font-medium'>Bạn có chắc muốn xóa bài thi này?</span>
                <div className='flex gap-2 justify-end'>
                  <Button variant='outline' size='sm' onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => {
                      onDelete(fe.final_exam_id)
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

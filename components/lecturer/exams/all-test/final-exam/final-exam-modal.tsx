/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { DatePicker } from '@/components/ui/date-picker'
import QuestionSetDrawer from '../question-set-drawer'
import { MdDeleteOutline } from 'react-icons/md'

interface FinalExamModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: any) => void
  initialData?: any
  readOnly?: boolean
}

export default function FinalExamModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  readOnly = false
}: FinalExamModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [selectedQuestionSets, setSelectedQuestionSets] = useState<any[]>([])

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDescription(initialData.description || '')
      setStartTime(initialData.start_time ? new Date(initialData.start_time) : null)
      setEndTime(initialData.end_time ? new Date(initialData.end_time) : null)
      setSelectedQuestionSets(initialData.question_sets || [])
    } else {
      setTitle('')
      setDescription('')
      setStartTime(null)
      setEndTime(null)
      setSelectedQuestionSets([])
    }
  }, [initialData, open])

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        title,
        description,
        startTime: startTime ? startTime.toISOString() : '',
        endTime: endTime ? endTime.toISOString() : '',
        selectedQuestionSets
      })
    }
    onOpenChange(false)
  }

  const handleRemoveQuestionSet = (id: string) => {
    setSelectedQuestionSets((prev: any[]) => prev.filter(set => set.question_set_id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[800px]! w-full bg-greyscale-0'>
        <DialogHeader>
          <DialogTitle>
            {readOnly ? 'Xem chi tiết bài thi cuối kỳ' : (initialData ? 'Chỉnh sửa bài thi cuối kỳ' : 'Tạo bài thi cuối kỳ mới')}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4 bg-greyscale-25 rounded-lg p-6 border min-h-[50vh] max-h-[70vh] overflow-y-auto'>
          <div>
            <Input
              className='bg-greyscale-0'
              placeholder='Tên bài thi'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={readOnly}
            />
          </div>
          <div>
            <Input
              className='bg-greyscale-0'
              placeholder='Mô tả'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='w-full'>
              <DatePicker
                value={startTime}
                onChange={(date) => setStartTime(date ?? null)}
                showTimeSelect
                placeholder='Thời gian bắt đầu'
                className='w-full'
                disabled={readOnly}
              />
            </div>
            <div className='w-full'>
              <DatePicker
                value={endTime}
                onChange={(date) => setEndTime(date ?? null)}
                showTimeSelect
                placeholder='Thời gian kết thúc'
                className='w-full'
                disabled={readOnly}
              />
            </div>
          </div>

          {!readOnly && (
            <QuestionSetDrawer
              onApply={(selected) => setSelectedQuestionSets(selected)}
              selectedIds={selectedQuestionSets.map((set: any) => set.question_set_id)}
            />
          )}

          {selectedQuestionSets.length > 0 && (
            <div className='mt-4'>
              <div className='flex flex-col gap-2'>
                {selectedQuestionSets.map((set: any) => (
                  <div
                    key={set.question_set_id}
                    className='border rounded px-3 py-2 bg-white dark:bg-neutral-800 flex justify-between items-center'
                  >
                    <div>
                      <div className='font-medium'>{set.title}</div>
                      <div className='text-sm text-gray-500'>{set.description}</div>
                    </div>
                    <div className='flex flex-col items-center gap-2'>
                      <div className='text-xs text-gray-400'>
                        {set.total_questions ? `${set.total_questions} câu` : null}
                      </div>
                      {!readOnly && (
                        <Button
                          variant='ghost'
                          className='text-error hover:text-error-600 p-0! h-5!'
                          onClick={() => handleRemoveQuestionSet(set.question_set_id)}
                          title='Xóa bộ câu hỏi này'
                        >
                          <MdDeleteOutline/>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className='flex justify-between'>
          <DialogClose asChild>
            <Button variant='outline'>Đóng</Button>
          </DialogClose>
          {!readOnly && (
            <Button onClick={handleSubmit}>
              {initialData ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
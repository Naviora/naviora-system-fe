/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { DatePicker } from '@/components/ui/date-picker'
import QuestionSetDrawer from '../question-set-drawer'

export default function EntryTestModal({
  open,
  onOpenChange,
  onSubmit
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: any) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [selectedQuestionSets, setSelectedQuestionSets] = useState<any[]>([])

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='!max-w-[800px] w-full bg-white'>
        <DialogHeader>
          <DialogTitle>Tạo bài kiểm tra đầu vào mới</DialogTitle>
        </DialogHeader>
        <div className='space-y-4 bg-greyscale-25 rounded-lg p-6 border min-h-[50vh] max-h-[70vh] overflow-y-auto'>
          <div>
            <Input
              className='bg-white'
              placeholder='Tên bài kiểm tra'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Input
              className='bg-white'
              placeholder='Mô tả'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              />
            </div>
            <div className='w-full'>
              <DatePicker
                value={endTime}
                onChange={(date) => setEndTime(date ?? null)}
                showTimeSelect
                placeholder='Thời gian kết thúc'
                className='w-full'
              />
            </div>
          </div>

          <QuestionSetDrawer onApply={(selected) => setSelectedQuestionSets(selected)} />

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
                    <div className='text-xs text-gray-400'>
                      {set.total_questions ? `${set.total_questions} câu` : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className='flex justify-between'>
          <DialogClose asChild>
            <Button variant='outline'>Hủy</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Tạo mới</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

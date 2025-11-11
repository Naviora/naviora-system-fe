/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import QuestionSetDrawer from '@/components/lecturer/exams/all-test/question-set-drawer'
import { MdDeleteOutline } from 'react-icons/md'
import { Loader2 } from 'lucide-react'

interface ReviewedExerciseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: any) => void
  lessonId: string
  lessonName?: string
  initialData?: any
  readOnly?: boolean
  isLoading?: boolean
}

export default function ReviewedExerciseModal({
  open,
  onOpenChange,
  onSubmit,
  lessonId,
  lessonName,
  initialData,
  readOnly = false,
  isLoading = false
}: ReviewedExerciseModalProps) {
  const [status, setStatus] = useState<string>('DRAFT')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [selectedQuestionSets, setSelectedQuestionSets] = useState<any[]>([])

  useEffect(() => {
    if (initialData) {
      setStatus(initialData.status || 'DRAFT')
      setStartTime(initialData.start_time ? new Date(initialData.start_time).toISOString().slice(0, 16) : '')
      setEndTime(initialData.end_time ? new Date(initialData.end_time).toISOString().slice(0, 16) : '')
      setSelectedQuestionSets(initialData.question_sets || [])
    } else {
      setStatus('DRAFT')
      setStartTime('')
      setEndTime('')
      setSelectedQuestionSets([])
    }
  }, [initialData, open])

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        lessonId,
        status,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        questionSets: selectedQuestionSets.map((set: any) => set.question_set_id)
      })
    }
    onOpenChange(false)
  }

  const handleRemoveQuestionSet = (id: string) => {
    setSelectedQuestionSets((prev: any[]) => prev.filter((set) => set.question_set_id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[800px]! w-full bg-greyscale-0'>
        <DialogHeader>
          <DialogTitle>
            {readOnly
              ? 'Xem chi tiết bài tập ôn tập'
              : initialData
                ? 'Chỉnh sửa bài tập ôn tập'
                : 'Tạo bài tập ôn tập mới'}
          </DialogTitle>
          {lessonName && <p className='text-sm text-greyscale-500'>Bài học: {lessonName}</p>}
        </DialogHeader>
        <div className='space-y-4 bg-greyscale-25 rounded-lg p-6 border min-h-[50vh] max-h-[70vh] overflow-y-auto'>
          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <Loader2 className='size-6 animate-spin text-primary' />
            </div>
          ) : (
            <>
              <div className='space-y-2'>
                <Label htmlFor='status'>Trạng thái</Label>
                <Select value={status} onValueChange={setStatus} disabled={readOnly}>
                  <SelectTrigger className='bg-greyscale-0'>
                    <SelectValue placeholder='Chọn trạng thái' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='DRAFT'>Nháp</SelectItem>
                    <SelectItem value='ACTIVE'>Đang mở</SelectItem>
                    <SelectItem value='CLOSED'>Đã đóng</SelectItem>
                    <SelectItem value='PENDING'>Chờ kích hoạt</SelectItem>
                    <SelectItem value='ENDED'>Đã kết thúc</SelectItem>
                    <SelectItem value='ARCHIVED'>Đã lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='startTime'>Thời gian bắt đầu</Label>
                  <Input
                    id='startTime'
                    type='datetime-local'
                    className='bg-greyscale-0'
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={readOnly}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='endTime'>Thời gian kết thúc</Label>
                  <Input
                    id='endTime'
                    type='datetime-local'
                    className='bg-greyscale-0'
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={readOnly}
                  />
                </div>
              </div>

              {!readOnly && (
                <QuestionSetDrawer
                  onApply={(selected: any) => setSelectedQuestionSets(selected)}
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
                              <MdDeleteOutline />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <DialogFooter className='flex justify-between'>
          <DialogClose asChild>
            <Button variant='outline'>Đóng</Button>
          </DialogClose>
          {!readOnly && <Button onClick={handleSubmit}>{initialData ? 'Cập nhật' : 'Tạo mới'}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedQuestionSets, setSelectedQuestionSets] = useState<any[]>([])

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDescription(initialData.description || '')
      setSelectedQuestionSets(initialData.question_sets || [])
    } else {
      setTitle('')
      setDescription('')
      setSelectedQuestionSets([])
    }
  }, [initialData, open])

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        title,
        description,
        lessonId,
        selectedQuestionSets
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
              <div>
                <Input
                  className='bg-greyscale-0'
                  placeholder='Tên bài tập'
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

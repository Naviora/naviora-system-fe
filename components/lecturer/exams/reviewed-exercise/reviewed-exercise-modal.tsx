/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import React, { useEffect, useMemo, useState } from 'react'
import { addHours } from 'date-fns'
import QuestionSetDrawer from '@/components/lecturer/exams/all-test/question-set-drawer'
import { MdDeleteOutline } from 'react-icons/md'
import { Loader2 } from 'lucide-react'
import { useGetMultipleQuestionSetDetail } from '@/hooks/api/lecturer/exams/use-question-set'
import type { QuestionSet, QuestionSetDetail } from '@/lib/validations/lecturer/exams/question-set'

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
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [selectedQuestionSets, setSelectedQuestionSets] = useState<Array<QuestionSet | QuestionSetDetail>>([])
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  const rawInitialQuestionSets = useMemo(() => {
    if (!Array.isArray(initialData?.question_sets)) return []
    return initialData?.question_sets as Array<QuestionSet | QuestionSetDetail | string>
  }, [initialData?.question_sets])

  const initialQuestionSetIds = useMemo(() => {
    return rawInitialQuestionSets.filter((item) => typeof item === 'string') as string[]
  }, [rawInitialQuestionSets])

  const questionSetQueries = useGetMultipleQuestionSetDetail(initialQuestionSetIds)

  const isQuestionSetLoading =
    initialQuestionSetIds.length > 0 ? questionSetQueries.some((query) => query.isLoading || query.isFetching) : false

  const questionSetLoadError = questionSetQueries.some((query) => query.isError)

  useEffect(() => {
    if (!open) return

    if (initialData) {
      setStatus(initialData.status || 'DRAFT')
      setStartTime(initialData.start_time ? new Date(initialData.start_time) : null)
      setEndTime(initialData.end_time ? new Date(initialData.end_time) : null)
      setSelectedQuestionSets([])
    } else {
      setStatus('DRAFT')
      // Auto-fill: Start time = now, End time = now + 2 hours
      const now = new Date()
      const twoHoursLater = addHours(now, 2)
      setStartTime(now)
      setEndTime(twoHoursLater)
      setSelectedQuestionSets([])
    }
  }, [initialData, open])

  useEffect(() => {
    if (!open) return

    setHasUserInteracted(false)
  }, [open])

  useEffect(() => {
    if (!open || hasUserInteracted) return

    const objectQuestionSets = rawInitialQuestionSets.filter(
      (item): item is QuestionSet | QuestionSetDetail => typeof item === 'object' && item !== null
    )

    if (objectQuestionSets.length > 0) {
      setSelectedQuestionSets((prev) => {
        const prevIds = prev.map((set) => set.question_set_id).sort()
        const nextIds = objectQuestionSets.map((set) => set.question_set_id).sort()
        const isSame = prevIds.length === nextIds.length && prevIds.every((id, index) => id === nextIds[index])
        return isSame ? prev : objectQuestionSets
      })
      return
    }

    if (initialQuestionSetIds.length === 0) {
      setSelectedQuestionSets([])
      return
    }
  }, [open, hasUserInteracted, rawInitialQuestionSets, initialQuestionSetIds])

  // Separate effect for loading question set details
  useEffect(() => {
    if (!open || hasUserInteracted || initialQuestionSetIds.length === 0) return

    const loadedSets = questionSetQueries
      .filter((query) => query.status === 'success' && query.data)
      .map((query) => query.data as QuestionSetDetail)

    if (loadedSets.length === initialQuestionSetIds.length) {
      setSelectedQuestionSets((prev) => {
        const prevIds = prev.map((set) => set.question_set_id).sort()
        const nextIds = loadedSets.map((set) => set.question_set_id).sort()
        const isSame = prevIds.length === nextIds.length && prevIds.every((id, index) => id === nextIds[index])
        return isSame ? prev : loadedSets
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestionSetIds.length, open, hasUserInteracted])

  const handleSubmit = () => {
    if (!startTime || !endTime) {
      return
    }

    if (onSubmit) {
      onSubmit({
        lessonId,
        status,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        questionSets: selectedQuestionSets.map((set: any) => set.question_set_id)
      })
    }
    onOpenChange(false)
  }

  const handleRemoveQuestionSet = (id: string) => {
    setHasUserInteracted(true)
    setSelectedQuestionSets((prev) => prev.filter((set) => set.question_set_id !== id))
  }

  const handleStartTimeChange = (date: Date | undefined) => {
    setStartTime(date || null)
  }

  const handleEndTimeChange = (date: Date | undefined) => {
    setEndTime(date || null)
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
                  <DatePicker
                    value={startTime}
                    onChange={handleStartTimeChange}
                    placeholder='Chọn thời gian bắt đầu'
                    showTimeSelect={true}
                    disabled={readOnly}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='endTime'>Thời gian kết thúc</Label>
                  <DatePicker
                    value={endTime}
                    onChange={handleEndTimeChange}
                    placeholder='Chọn thời gian kết thúc'
                    showTimeSelect={true}
                    disabled={readOnly}
                  />
                </div>
              </div>

              {!readOnly && (
                <QuestionSetDrawer
                  onApply={(selected) => {
                    setHasUserInteracted(true)
                    setSelectedQuestionSets(selected)
                  }}
                  selectedIds={selectedQuestionSets.map((set) => set.question_set_id)}
                />
              )}

              {isQuestionSetLoading && (
                <div className='mt-4 flex items-center gap-2 text-sm text-greyscale-500'>
                  <Loader2 className='size-4 animate-spin' />
                  <span>Đang tải thông tin bộ câu hỏi...</span>
                </div>
              )}

              {questionSetLoadError &&
                !isQuestionSetLoading &&
                initialQuestionSetIds.length > 0 &&
                selectedQuestionSets.length === 0 && (
                  <div className='mt-4 rounded-md border border-error/40 bg-error/5 px-3 py-2 text-sm text-error'>
                    Không thể tải thông tin bộ câu hỏi. Vui lòng thử lại sau hoặc chọn lại bộ câu hỏi.
                  </div>
                )}

              {selectedQuestionSets.length > 0 && (
                <div className='mt-4'>
                  <div className='flex flex-col gap-2'>
                    {selectedQuestionSets.map((set) => {
                      const totalQuestions =
                        'total_questions' in set && typeof set.total_questions === 'number'
                          ? set.total_questions
                          : 'config' in set && set.config && 'general' in set.config
                            ? set.config.general.total_questions
                            : 'questions' in set && Array.isArray(set.questions)
                              ? set.questions.length
                              : undefined

                      return (
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
                              {typeof totalQuestions === 'number' ? `${totalQuestions} câu` : null}
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
                      )
                    })}
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

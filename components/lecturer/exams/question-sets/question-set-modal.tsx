/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import React, { useState } from 'react'
import { QuestionBankDrawer } from '@/components/lecturer/exams/question-sets/question-drawer'
import { getDifficultyLabel, getTypeLabel } from '@/lib/constants/exams'
import { MdDeleteOutline } from 'react-icons/md'

interface QuestionSetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: any
  onSubmit: (data: any) => void
}

export function QuestionSetModal({ open, onOpenChange, initialData, onSubmit }: QuestionSetModalProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [questions, setQuestions] = useState(initialData?.questions || [])
  const [duration, setDuration] = useState(initialData?.duration || 45)
  const [passingScore, setPassingScore] = useState(initialData?.passingScore || 5)
  const [perQuestion, setPerQuestion] = useState(initialData?.perQuestion || true)
  const [showCorrectAfterSubmit, setShowCorrectAfterSubmit] = useState(initialData?.showCorrectAfterSubmit || true)
  const [maxAttempts, setMaxAttempts] = useState(initialData?.maxAttempts || 1)
  const [shuffleQuestions, setShuffleQuestions] = useState(initialData?.shuffleQuestions || false)
  const [shuffleAnswers, setShuffleAnswers] = useState(initialData?.shuffleAnswers || false)
  const [enableTabTracking, setEnableTabTracking] = useState(initialData?.enableTabTracking || false)
  const [enableCopyPasteRestriction, setEnableCopyPasteRestriction] = useState(
    initialData?.enableCopyPasteRestriction || false
  )
  const [allowReview, setAllowReview] = useState(initialData?.allowReview || true)

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev: any[]) => prev.filter((q) => q.question_id !== id))
  }

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      questions,
      duration,
      totalQuestions: questions.length,
      passingScore,
      perQuestion,
      showCorrectAfterSubmit,
      maxAttempts,
      shuffleQuestions,
      shuffleAnswers,
      enableTabTracking,
      enableCopyPasteRestriction,
      allowReview
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='!max-w-[1200px] w-full'>
        <DialogHeader>
          <DialogTitle className='pb-2'>Tạo bộ câu hỏi mới</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-12 gap-3'>
          {/* Left panel */}
          <div className='col-span-8 bg-greyscale-25 rounded-lg p-6 border max-h-[70vh] overflow-y-auto'>
            <Input
              className='mb-3 bg-greyscale-0'
              placeholder='Tên bộ câu hỏi'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              className='mb-4 bg-greyscale-0'
              placeholder='Vui lòng nhập mô tả'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <QuestionBankDrawer
              onApply={(selected) => setQuestions(selected)}
              selectedIds={questions.map((q: any) => q.question_id)}
            />
            <div className='space-y-3 mt-2'>
              {questions.map((q: any, idx: number) => (
                <div key={idx} className='bg-greyscale-0 rounded p-4 border mb-2 flex justify-between items-start'>
                  <div>
                    <div className='flex gap-2 mb-1 text-xs'>
                      <span className='bg-blue-50 text-blue-600 px-2 py-0.5 rounded'>{getTypeLabel(q.type)}</span>
                      <span className='bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded'>
                        {getDifficultyLabel(q.difficulty)}
                      </span>
                    </div>
                    <div className='font-medium mb-1'>
                      {idx + 1}. {q.content}
                    </div>
                    <ul>
                      {q.answers.map((opt: any) => (
                        <li key={opt.answer_id} className='text-greyscale-700 text-sm'>
                          {opt.content} {opt.is_correct && <span className='text-green-600 font-semibold'>(Đúng)</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    variant='ghost'
                    className='text-error hover:text-error-600 !p-0 !h-[20px]'
                    onClick={() => handleRemoveQuestion(q.question_id)}
                    title='Xóa câu hỏi này'
                  >
                    <MdDeleteOutline />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          {/* Right panel */}
          <div className='col-span-4 rounded-lg p-6 border space-y-6 max-h-[70vh] overflow-y-auto'>
            <div>
              <span className='font-semibold block mb-2'>Thời gian làm bài (phút)</span>
              <Input
                type='number'
                placeholder='Thời gian làm bài (phút)'
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>
            <div>
              <span className='font-semibold block mb-2'>Tổng số câu hỏi</span>
              <Input type='number' placeholder='Tổng số câu hỏi' value={questions.length} disabled />
            </div>
            <div>
              <span className='font-semibold block mb-2'>Điểm đạt</span>
              <Input
                type='number'
                placeholder='Điểm đạt'
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
              />
            </div>
            <div>
              <span className='font-semibold block mb-2'>Số lần làm tối đa</span>
              <Input
                type='number'
                placeholder='Số lần làm tối đa'
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number(e.target.value))}
              />
            </div>
            <div>
              <span className='font-semibold block mb-2'>Cấu hình nâng cao</span>
              <div className='flex items-center gap-2 mb-2'>
                <Checkbox checked={allowReview} onCheckedChange={setAllowReview} id='allow-review' />
                <label htmlFor='allow-review' className='text-sm'>
                  Cho phép xem lại bài sau khi nộp
                </label>
              </div>
              <div className='flex items-center gap-2 mb-2'>
                <Checkbox checked={perQuestion} onCheckedChange={setPerQuestion} id='per-question' />
                <label htmlFor='per-question' className='text-sm'>
                  Chấm điểm từng câu hỏi
                </label>
              </div>
              <div className='flex items-center gap-2 mb-2'>
                <Checkbox
                  checked={showCorrectAfterSubmit}
                  onCheckedChange={setShowCorrectAfterSubmit}
                  id='show-correct'
                />
                <label htmlFor='show-correct' className='text-sm'>
                  Hiện đáp án đúng sau khi nộp
                </label>
              </div>
              <div className='flex items-center gap-2 mb-2'>
                <Checkbox checked={shuffleQuestions} onCheckedChange={setShuffleQuestions} id='shuffle-questions' />
                <label htmlFor='shuffle-questions' className='text-sm'>
                  Trộn thứ tự câu hỏi
                </label>
              </div>
              <div className='flex items-center gap-2 mb-2'>
                <Checkbox checked={shuffleAnswers} onCheckedChange={setShuffleAnswers} id='shuffle-answers' />
                <label htmlFor='shuffle-answers' className='text-sm'>
                  Trộn thứ tự đáp án
                </label>
              </div>
              <div className='flex items-center gap-2 mb-2'>
                <Checkbox checked={enableTabTracking} onCheckedChange={setEnableTabTracking} id='tab-tracking' />
                <label htmlFor='tab-tracking' className='text-sm'>
                  Theo dõi chuyển tab
                </label>
              </div>
              <div className='flex items-center gap-2 mb-2'>
                <Checkbox
                  checked={enableCopyPasteRestriction}
                  onCheckedChange={setEnableCopyPasteRestriction}
                  id='copy-paste'
                />
                <label htmlFor='copy-paste' className='text-sm'>
                  Chặn copy/paste
                </label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className='flex justify-between'>
          <div className='flex gap-2'>
            <DialogClose asChild>
              <Button variant='outline'>Hủy</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>Tạo mới</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

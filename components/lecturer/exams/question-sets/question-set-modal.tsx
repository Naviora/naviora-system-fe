/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import React, { useState, useEffect } from 'react'
import { QuestionBankDrawer } from '@/components/lecturer/exams/question-sets/question-drawer'
import { getDifficultyLabel, getTypeLabel } from '@/lib/constants/exams'
import { MdDeleteOutline } from 'react-icons/md'
import { QuestionSetDetail } from '@/lib/validations/lecturer/exams/question-set'

interface QuestionSetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: QuestionSetDetail
  onSubmit: (data: any) => void
}

export function QuestionSetModal({ open, onOpenChange, initialData, onSubmit }: QuestionSetModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState<any[]>([])
  const [duration, setDuration] = useState(45)
  const [passingScore, setPassingScore] = useState(5)
  const [perQuestion, setPerQuestion] = useState(true)
  const [showCorrectAfterSubmit, setShowCorrectAfterSubmit] = useState(true)
  const [maxAttempts, setMaxAttempts] = useState(1)
  const [shuffleQuestions, setShuffleQuestions] = useState(false)
  const [shuffleAnswers, setShuffleAnswers] = useState(false)
  const [enableTabTracking, setEnableTabTracking] = useState(false)
  const [enableCopyPasteRestriction, setEnableCopyPasteRestriction] = useState(false)
  const [allowReview, setAllowReview] = useState(true)

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDescription(initialData.description || '')
      setQuestions(initialData.questions || [])
      setDuration(initialData.config?.general?.duration_minutes ?? 45)
      setPassingScore(initialData.config?.scoring?.passing_score ?? 5)
      setPerQuestion(initialData.config?.scoring?.per_question ?? true)
      setShowCorrectAfterSubmit(initialData.config?.behavior?.show_correct_after_submit ?? true)
      setMaxAttempts(initialData.config?.behavior?.max_attempts ?? 1)
      setShuffleQuestions(initialData.config?.general?.shuffle_questions ?? false)
      setShuffleAnswers(initialData.config?.general?.shuffle_answers ?? false)
      setEnableTabTracking(initialData.config?.proctoring?.enable_tab_tracking ?? false)
      setEnableCopyPasteRestriction(initialData.config?.proctoring?.enable_copy_paste_restriction ?? false)
      setAllowReview(initialData.config?.general?.allow_review ?? true)
    }
  }, [initialData])

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev: any[]) => prev.filter((q) => q.question_id !== id))
  }

  console.log("CHECKKK:" , initialData)

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
      <DialogContent className='max-w-[1200px]! w-full'>
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
                    className='text-error hover:text-error-600 p-0! h-5!'
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
                <Checkbox checked={allowReview} onCheckedChange={checked => setAllowReview(Boolean(checked))} id='allow-review' />
                <label htmlFor='allow-review' className='text-sm'>
                  Cho phép xem lại bài sau khi nộp
                </label>
              </div>
              <div className='flex items-center gap-2 mb-2'>
                <Checkbox checked={perQuestion} onCheckedChange={checked => setPerQuestion(Boolean(checked))} id='per-question' />
                <label htmlFor='per-question' className='text-sm'>
                  Chấm điểm từng câu hỏi
                </label>
              </div>
              <div className='flex items-center gap-2 mb-2'>
                <Checkbox checked={showCorrectAfterSubmit} onCheckedChange={checked => setShowCorrectAfterSubmit(Boolean(checked))} id='show-correct' />
                <label htmlFor='show-correct' className='text-sm'>
                  Hiện đáp án đúng sau khi nộp
                </label>
              </div>
              <div className='flex items-center gap-2 mb-2'>
                <Checkbox checked={shuffleQuestions} onCheckedChange={checked => setShuffleQuestions(Boolean(checked))} id='shuffle-questions' />
                <label htmlFor='shuffle-questions' className='text-sm'>
                  Trộn thứ tự câu hỏi
                </label>
              </div>
              <div className='flex items-center gap-2 mb-2'>
                <Checkbox checked={shuffleAnswers} onCheckedChange={checked => setShuffleAnswers(Boolean(checked))} id='shuffle-answers' />
                <label htmlFor='shuffle-answers' className='text-sm'>
                  Trộn thứ tự đáp án
                </label>
              </div>
              <div className='flex items-center gap-2 mb-2'>
                <Checkbox checked={enableTabTracking} onCheckedChange={checked => setEnableTabTracking(Boolean(checked))} id='tab-tracking' />
                <label htmlFor='tab-tracking' className='text-sm'>
                  Theo dõi chuyển tab
                </label>
              </div>
              <div className='flex items-center gap-2 mb-2'>
                <Checkbox checked={enableCopyPasteRestriction} onCheckedChange={checked => setEnableCopyPasteRestriction(Boolean(checked))} id='copy-paste' />
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
            <Button onClick={handleSubmit}>{initialData ? "Cập nhật" :'Tạo mới'}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Button } from '@/components/ui/button'
import { IoIosSearch, IoMdAdd } from 'react-icons/io'
import React, { useState } from 'react'
import ManageQuestion from '@/components/lecturer/exams/questions/manage-question'
import { QuestionDialog } from './questions/question-modal'
import ManageQuestionSet from '@/components/lecturer/exams/question-sets/manage-question-set'
import { QuestionSetModal } from '@/components/lecturer/exams/question-sets/question-set-modal'
import { useCreateQuestion, useUpdateQuestion } from '@/hooks/api/lecturer/exams/use-question'
import { useCreateQuestionSet } from '@/hooks/api/lecturer/exams/use-question-set'
import { toast } from 'sonner'
import { CreateQuestionRequest, Question } from '@/lib/validations/lecturer/exams/question'

export default function ManageLayout() {
  const [activeTab, setActiveTab] = React.useState<'question' | 'exam' | 'question-set'>('question')
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false)
  const [editQuestionData, setEditQuestionData] = useState<Question | null>(null)
  const createQuestionMutation = useCreateQuestion()
  const updateQuestionMutation = useUpdateQuestion()
  const createQuestionSetMutation = useCreateQuestionSet()
  const [questionSetDialogOpen, setQuestionSetDialogOpen] = useState(false)

  const handleBtnAdd = () => {
    if (activeTab === 'question') {
      setEditQuestionData(null)
      setQuestionDialogOpen(true)
    } else if (activeTab === 'question-set') {
      setQuestionSetDialogOpen(true)
    }
    // ...handle exam tab if needed
  }

  const handleSubmitQuestion = (data: any) => {
    if (editQuestionData?.question_id) {
      const payload = {
        content: data.question,
        type: data.type,
        difficulty: data.difficulty,
        lesson_id: data.lesson_id || '', 
        additional_image: data.additional_image || null,
        answers: data.options.map((opt: string, idx: number) => ({
          answer_id: data.answer_ids?.[idx] || '',
          content: opt,
          is_correct: data.correctIndexes?.includes(idx)
        }))
      }
      updateQuestionMutation.mutate(
        { id: editQuestionData.question_id, data: payload },
        {
          onSuccess: () => {
            toast.success("Cập nhật câu hỏi thành công")
            setQuestionDialogOpen(false)
            setEditQuestionData(null)
          },
          onError: (err: any) => {
            toast.error(err?.message || "Có lỗi xảy ra khi cập nhật câu hỏi")
          }
        }
      )
      return
    }

    if (!data.question || !data.type || !data.difficulty || !data.options?.length) {
      toast.error('Vui lòng nhập đầy đủ thông tin câu hỏi!')
      return
    }
    const payload: CreateQuestionRequest = {
      content: data.question,
      type: data.type,
      difficulty: data.difficulty,
      lesson_id: data.lesson_id || null,
      additional_image: data.additional_image || null,
      answers: data.options.map((opt: string, idx: number) => ({
        content: opt,
        isCorrect: data.correctIndexes?.includes(idx) ?? false
      }))
    }
    createQuestionMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Thêm câu hỏi mới thành công")
        setQuestionDialogOpen(false)
        setEditQuestionData(null)
      },
      onError: (err: any) => {
        toast.error(err?.message || "Có lỗi xảy ra khi thêm câu hỏi")
      }
    })
  }

  const handleSubmitQuestionSet = (data: any) => {
    const payload = {
      title: data.title,
      description: data.description,
      questions: data.questions.map((q: Question) => q.question_id),
      config: {
        general: {
          duration_minutes: data.duration,
          total_questions: data.questions.length,
          allow_review: data.allowReview,
          shuffle_questions: data.shuffleQuestions,
          shuffle_answers: data.shuffleAnswers
        },
        scoring: {
          per_question: data.perQuestion,
          passing_score: data.passingScore
        },
        behavior: {
          show_correct_after_submit: data.showCorrectAfterSubmit,
          max_attempts: data.maxAttempts
        },
        composition: {
          question_sources: ['question'],
          topics: []
        },
        proctoring: {
          enable_tab_tracking: data.enableTabTracking,
          enable_copy_paste_restriction: data.enableCopyPasteRestriction
        }
      }
    }

    createQuestionSetMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Tạo bộ câu hỏi thành công')
        setQuestionSetDialogOpen(false)
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Có lỗi xảy ra khi tạo bộ câu hỏi')
      }
    })
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button
            className={`rounded-2xl h-[36px] w-[100px] flex justify-center text-sm ${activeTab === 'question' ? 'bg-primary-25 hover:bg-primary-25 text-primary font-semibold' : 'bg-greyscale-100 hover:bg-greyscale-200 text-greyscale-500'}`}
            onClick={() => setActiveTab('question')}
          >
            Câu hỏi
          </Button>
          <Button
            className={`rounded-2xl h-[36px] w-[100px] flex justify-center text-sm ${activeTab === 'question-set' ? 'bg-primary-25 hover:bg-primary-25 text-primary font-semibold' : 'bg-greyscale-100 hover:bg-greyscale-200 text-greyscale-500'}`}
            onClick={() => setActiveTab('question-set')}
          >
            Bộ câu hỏi
          </Button>
          <Button
            className={`rounded-2xl h-[36px] w-[100px] flex justify-center text-sm ${activeTab === 'exam' ? 'bg-primary-25 hover:bg-primary-25 text-primary font-semibold' : 'bg-greyscale-100 hover:bg-greyscale-200 text-greyscale-500'}`}
            onClick={() => setActiveTab('exam')}
          >
            Bài thi
          </Button>
        </div>

        <div className='flex gap-2'>
          <Button variant='outline' className='rounded-2xl h-[36px] w-[200px] flex justify-center items-center text-sm'>
            <IoIosSearch className='size-4 text-greyscale-500 ml-3' />
            <input type='text' placeholder='Tìm kiếm...' className='border-none outline-none text-muted-foreground' />
          </Button>

          <Button
            className='rounded-2xl h-[36px] flex justify-center items-center text-sm bg-primary hover:bg-primary-300 text-greyscale-0 font-semibold'
            onClick={handleBtnAdd}
          >
            <IoMdAdd className='size-4 text-greyscale-0' />
            {activeTab === 'question' && 'Thêm câu hỏi'}
            {activeTab === 'exam' && 'Thêm bài thi'}
            {activeTab === 'question-set' && 'Thêm bộ câu hỏi'}
          </Button>
        </div>
      </div>

      {activeTab === 'question' && (
        <>
          <ManageQuestion
            onEdit={(data) => {
              setEditQuestionData(data)
              setQuestionDialogOpen(true)
            }}
          />
          <QuestionDialog
            open={questionDialogOpen}
            onOpenChange={setQuestionDialogOpen}
            initialData={editQuestionData}
            onSubmit={handleSubmitQuestion}
          />
        </>
      )}
      {activeTab === 'question-set' && (
        <>
          <ManageQuestionSet />
          <QuestionSetModal
            open={questionSetDialogOpen}
            onOpenChange={setQuestionSetDialogOpen}
            onSubmit={handleSubmitQuestionSet}
          />
        </>
      )}
      {activeTab === 'exam' && <div>Exam Management Coming Soon...</div>}
    </div>
  )
}

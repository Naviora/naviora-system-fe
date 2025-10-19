/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Button } from '@/components/ui/button'
import { IoIosSearch, IoMdAdd } from 'react-icons/io'
import React, { useState } from 'react'
import ManageQuestion from '@/components/lecturer/exams/questions/manage-question'
import { QuestionDialog } from './questions/question-modal'
import ManageQuestionSet from '@/components/lecturer/exams/question-sets/manage-question-set'
import { QuestionSetModal } from '@/components/lecturer/exams/question-sets/question-set-modal'

export default function ManageLayout() {
  const [activeTab, setActiveTab] = React.useState<'question' | 'exam' | 'question-set'>('question')
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false)
  const [editQuestionData, setEditQuestionData] = useState<any>(null)
  const [questionSetDialogOpen, setQuestionSetDialogOpen] = useState(false)

  const handleBtnAdd = () => {
    if (activeTab === 'question') {
      setEditQuestionData(null)
      setQuestionDialogOpen(true)
    }
    if (activeTab === "question-set"){
      setQuestionSetDialogOpen(true)
    } 
    else {
      // Handle adding a new exam
    }
  }

  const handleSubmitQuestion = (data: any) => {
    // ...
    setQuestionDialogOpen(false)
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
            onSubmit={data => {/* handle submit */}}
          />
        </>
      )}
      {activeTab === 'exam' && <div>Exam Management Coming Soon...</div>}
    </div>
  )
}

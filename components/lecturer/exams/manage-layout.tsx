/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Button } from '@/components/ui/button'
import { IoIosSearch, IoMdAdd } from 'react-icons/io'
import React, { useState } from 'react'
import ManageQuestion from '@/components/lecturer/exams/manage-question'
import { QuestionDialog } from './question-modal'

export default function ManageLayout() {
  const [activeTab, setActiveTab] = React.useState<'question' | 'exam'>('question')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editData, setEditData] = useState<any>(null)

  const handleBtnAdd = () => {
    if (activeTab === 'question') {
      setEditData(null)
      setDialogOpen(true)
    } else {
      // Handle adding a new exam
    }
  }

  const handleSubmitQuestion = (data: any) => {
    // ...
    setDialogOpen(false)
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
            {activeTab === 'question' ? 'Thêm câu hỏi' : 'Thêm bài thi'}
          </Button>
        </div>
      </div>

      {activeTab === 'question' ? (
        <>
          <ManageQuestion
            onEdit={data => {
              setEditData(data)
              setDialogOpen(true)
            }}
          />
          <QuestionDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            initialData={editData}
            onSubmit={handleSubmitQuestion}
          />
        </>
      ) : (
        <div>Exam Management Coming Soon...</div>
      )}
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch } from '@/components/ui/switch'
import { DIFFICULTY_LEVELS, QUESTION_TYPES } from '@/lib/constants/exams'
import React, { useState } from 'react'
import { useGetQuestions } from '@/hooks/api/lecturer/exams/use-question'
import { QuestionCard } from '@/components/lecturer/exams/questions/question-card'
import { LoadingSpinner } from '@/components/ui'
import { NEmpty } from '@/components/ui/NEmpty'

interface ManageQuestionProps {
  onEdit: (data: any) => void
}

export default function ManageQuestion({ onEdit }: ManageQuestionProps) {
  const [selectedType, setSelectedType] = useState('ALL')
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL')
  const [sortNewest, setSortNewest] = useState(true)
  const [showAnswers, setShowAnswers] = useState(false)

  const {
    data: questionsData,
    isLoading,
    isError
  } = useGetQuestions({
    limit: 200,
    page: 1
  })
  console.log('Check questions data: ', questionsData)
  const questions = questionsData?.questions || []
  console.log('Check question:', questions)

  const filteredQuestions = questions
    .filter((q) => selectedType === 'ALL' || q.type === selectedType)
    .filter((q) => selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty)

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
    return sortNewest ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
  })

  console.log('Check sort question: ', sortedQuestions)

  return (
    <div className='bg-white rounded-lg shadow p-4'>
      <div className='flex flex-col gap-2 mb-4'>
        <div className='flex gap-4 flex-wrap items-center'>
          <span className='font-medium text-sm'>Loại câu hỏi</span>
          {QUESTION_TYPES.map((type) => (
            <button
              key={type.value}
              className={`text-sm px-2 py-1 rounded ${selectedType === type.value ? 'text-primary font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setSelectedType(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>
        <div className='flex gap-4 flex-wrap items-center'>
          <span className='font-medium text-sm'>Độ khó</span>
          {DIFFICULTY_LEVELS.map((level) => (
            <button
              key={level.value}
              className={`text-sm px-2 py-1 rounded ${selectedDifficulty === level.value ? 'text-primary font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setSelectedDifficulty(level.value)}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort & Total & Toggle Answer */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex gap-4 items-center'>
          <button
            className={`text-sm px-2 py-1 rounded border ${sortNewest ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
            onClick={() => setSortNewest(true)}
          >
            Mới nhất ↑
          </button>
          <button
            className={`text-sm px-2 py-1 rounded border ${!sortNewest ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
            onClick={() => setSortNewest(false)}
          >
            Cũ nhất ↓
          </button>
        </div>
        <div className='flex gap-4 items-center'>
          <div className='text-sm text-gray-600'>
            Tổng cộng <span className='font-semibold'>{questions.length}</span> câu
          </div>
          <div className='flex items-center gap-2'>
            <label htmlFor='showAnswers' className='text-sm text-gray-700 cursor-pointer'>
              Hiển thị đáp án
            </label>
            <Switch id='showAnswers' checked={showAnswers} onCheckedChange={setShowAnswers} />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className='space-y-6'>
        {isLoading && (
          <div className='text-center text-gray-400 py-8'>
            <LoadingSpinner variant='dots' />
          </div>
        )}
        {isError && <div className='text-center text-red-400 py-8'>Lỗi tải dữ liệu.</div>}
        {!isLoading &&
          !isError &&
          sortedQuestions.map((q, idx) => (
            <QuestionCard key={q.question_id} question={q} index={idx} showAnswers={showAnswers} onEdit={onEdit} />
          ))}
        {!isLoading && !isError && sortedQuestions.length === 0 && (
          <NEmpty
            title='Không có câu hỏi phù hợp'
            description='Vui lòng thử lại với bộ lọc khác hoặc thêm mới câu hỏi.'
          />
        )}
      </div>
    </div>
  )
}

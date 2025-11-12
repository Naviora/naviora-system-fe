/* eslint-disable @typescript-eslint/no-explicit-any */
import { DIFFICULTY_LEVELS, QUESTION_TYPES } from '@/lib/constants/exams'
import React, { useState } from 'react'
import { useGetQuestions } from '@/hooks/api/lecturer/exams/use-question'
import { QuestionCard } from '@/components/lecturer/exams/questions/question-card'
import { LoadingSpinner } from '@/components/ui'
import { NEmpty } from '@/components/ui/NEmpty'
import { SearchRequest } from '@/types/api/common'
import { ExamToolBar } from '@/components/lecturer/exams/exam-toolbar'

interface ManageQuestionProps {
  onEdit: (data: any) => void
}

export default function ManageQuestion({ onEdit }: ManageQuestionProps) {
  const [selectedType, setSelectedType] = useState('ALL')
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL')
  const [sortNewest, setSortNewest] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const pageSize = 25

  const queryParams: SearchRequest = {
    limit: pageSize,
    page: currentPage
  }
  if (searchValue.trim() !== '') {
    queryParams.q = searchValue
  }

  const { data: questionsData, isLoading, isError } = useGetQuestions(queryParams)

  const questions = questionsData?.questions || []
  const totalPages = questionsData?.pagination.total_pages ?? 0

  const filteredQuestions = questions
    .filter((q) => selectedType === 'ALL' || q.type === selectedType)
    .filter((q) => selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty)

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
    return sortNewest ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
  })

  const handleSearch = () => {
    setSearchValue(search)
    setCurrentPage(1)
  }

  return (
    <div className='rounded-lg shadow p-4'>
      <div className='flex flex-col'>
        <div className='flex gap-4 flex-wrap items-center'>
          <span className='font-medium text-sm'>Loại câu hỏi</span>
          {QUESTION_TYPES.map((type) => (
            <button
              key={type.value}
              className={`text-sm px-2 py-1 rounded ${selectedType === type.value ? 'text-primary font-semibold' : 'text-greyscale-700 hover:bg-greyscale-100'}`}
              onClick={() => setSelectedType(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>
        <div className='flex gap-4 flex-wrap items-center mb-2'>
          <span className='font-medium text-sm'>Độ khó</span>
          {DIFFICULTY_LEVELS.map((level) => (
            <button
              key={level.value}
              className={`text-sm px-2 py-1 rounded ${selectedDifficulty === level.value ? 'text-primary font-semibold' : 'text-greyscale-700 hover:bg-greyscale-100'}`}
              onClick={() => setSelectedDifficulty(level.value)}
            >
              {level.label}
            </button>
          ))}
        </div>

        <ExamToolBar
          searchPlaceholder="Tìm kiếm câu hỏi..."
          search={search}
          setSearch={setSearch}
          onSearch={handleSearch}
          sortNewest={sortNewest}
          setSortNewest={setSortNewest}
          totalLabel="Tổng cộng"
          totalCount={questions.length}
          totalLabel2="câu"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Questions List */}
      <div className='space-y-6'>
        {isLoading && (
          <div className='text-center text-greyscale-400 py-8'>
            <LoadingSpinner variant='dots' />
          </div>
        )}
        {isError && <div className='text-center text-error py-8'>Lỗi tải dữ liệu.</div>}
        {!isLoading &&
          !isError &&
          sortedQuestions.map((q, idx) => (
            <QuestionCard key={q.question_id} question={q} index={idx} onEdit={onEdit} />
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

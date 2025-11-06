/* eslint-disable @typescript-eslint/no-explicit-any */
import { DIFFICULTY_LEVELS, QUESTION_TYPES } from '@/lib/constants/exams'
import React, { useState } from 'react'
import { useGetQuestions } from '@/hooks/api/lecturer/exams/use-question'
import { QuestionCard } from '@/components/lecturer/exams/questions/question-card'
import { LoadingSpinner } from '@/components/ui'
import { NEmpty } from '@/components/ui/NEmpty'
import { Pagination } from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchRequest } from '@/types/api/common'

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
      <div className='flex flex-col gap-2 mb-4'>
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
        <div className='flex gap-4 flex-wrap items-center'>
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
        <div className='flex items-end justify-between'>
          <div className='flex gap-4 items-center mt-2'>
            <button
              className={`text-sm px-2 py-1 rounded border ${sortNewest ? 'bg-success-0 text-success-200 border-success-200' : 'bg-greyscale-25 text-greyscale-700 border-greyscale-200'}`}
              onClick={() => setSortNewest(true)}
            >
              Mới nhất ↑
            </button>
            <button
              className={`text-sm px-2 py-1 rounded border ${!sortNewest ? 'bg-success-0 text-success-200 border-success-200' : 'bg-greyscale-25 text-greyscale-700 border-greyscale-200'}`}
              onClick={() => setSortNewest(false)}
            >
              Cũ nhất ↓
            </button>
          </div>
          <div className='text-sm text-greyscale-600'>
            Tổng cộng <span className='font-semibold'>{questions.length}</span> câu
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between mb-4'>
        {/* Search input */}
        <div className='flex gap-2 items-center'>
          <Input
            placeholder='Tìm kiếm câu hỏi...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
            className='w-xs h-8'
          />
          <Button variant='default' size='sm' onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>
        <div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
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

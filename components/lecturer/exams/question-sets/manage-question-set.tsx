/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { QuestionSetCard } from './question-set-card'
import { NEmpty } from '@/components/ui/NEmpty'
import {
  useDeleteQuestionSet,
  useGetQuestionSets,
  useGetQuestionSetDetail,
  useUpdateQuestionSet
} from '@/hooks/api/lecturer/exams/use-question-set'
import { LoadingSpinner } from '@/components/ui'
import { toast } from 'sonner'
import { QuestionSetModal } from './question-set-modal'
import { Question } from '@/lib/validations/lecturer/exams/question'
import { Pagination } from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchRequest } from '@/types/api/common'

export default function ManageQuestionSet() {
  const [editId, setEditId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [sortNewest, setSortNewest] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const pageSize = 5

  const queryParams: SearchRequest = {
    limit: pageSize,
    page: currentPage
  }
  if (searchValue.trim() !== '') {
    queryParams.q = searchValue
  }

  const { data: questionSetData, isLoading, isError } = useGetQuestionSets(queryParams)
  const questionSets = questionSetData?.question_sets || []
  const totalPages = questionSetData?.pagiantion?.total_pages ?? 0

  const sortedSets = [...questionSets].sort((a, b) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
    return sortNewest ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
  })

  const handleSearch = () => {
    setSearchValue(search)
    setCurrentPage(1)
  }

  const deleteMutation = useDeleteQuestionSet()
  const updateMutation = useUpdateQuestionSet()
  const { data: editDetail, isLoading: isEditLoading } = useGetQuestionSetDetail(editId ?? '')

  const handleEdit = (data: any) => {
    setEditId(data.question_set_id)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Xóa câu hỏi thành công')
      },
      onError(err: any) {
        toast.error(err?.message || 'Xóa câu hỏi không thành công')
      }
    })
  }

  const handleUpdateQuestionSet = (data: any) => {
    if (!editId) return
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
    updateMutation.mutate(
      { id: editId, data: payload },
      {
        onSuccess: () => {
          toast.success('Cập nhật bộ câu hỏi thành công')
          setModalOpen(false)
          setEditId(null)
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Cập nhật bộ câu hỏi thất bại')
        }
      }
    )
  }

  return (
    <div className='rounded-lg shadow p-4'>
      <div className='mb-2 text-lg font-semibold'>Danh sách bộ câu hỏi</div>
      <div className='mb-4 flex items-end justify-between'>
        <div className='flex gap-2'>
          <button
            className={`text-sm px-2 py-1 rounded border ${sortNewest ? 'bg-success-0 text-success-200 border-success-200' : 'bg-greyscale-25 text-greyscale-700 border-greyscale-200'}`}
            onClick={() => {
              setSortNewest(true)
              setCurrentPage(1)
            }}
          >
            Mới nhất ↑
          </button>
          <button
            className={`text-sm px-2 py-1 rounded border ${!sortNewest ? 'bg-success-0 text-success-200 border-success-200' : 'bg-greyscale-25 text-greyscale-700 border-greyscale-200'}`}
            onClick={() => {
              setSortNewest(false)
              setCurrentPage(1)
            }}
          >
            Cũ nhất ↓
          </button>
        </div>
        <div className='text-sm text-greyscale-600'>
          Tổng cộng <span className='font-semibold'>{questionSets.length}</span> bộ câu hỏi
        </div>
      </div>

      <div className='flex items-center justify-between mb-4'>
        {/* Search input */}
        <div className='flex gap-2 items-center'>
          <Input
            placeholder='Tìm kiếm bộ câu hỏi...'
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

      <div className='space-y-6'>
        {isLoading && (
          <div className='text-center text-greyscale-400 py-8'>
            <LoadingSpinner variant='dots' />
          </div>
        )}
        {isError && <div className='text-center text-error py-8'>Lỗi tải dữ liệu.</div>}
        {!isLoading && !isError && sortedSets.length === 0 && (
          <NEmpty title='Không có bộ câu hỏi' description='Vui lòng thêm mới bộ câu hỏi.' />
        )}
        {!isLoading &&
          !isError &&
          sortedSets.map((qs, idx) => (
            <QuestionSetCard
              key={qs.question_set_id}
              questionSet={qs}
              index={idx}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
      </div>

      <QuestionSetModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditId(null)
        }}
        initialData={isEditLoading ? undefined : editDetail}
        onSubmit={handleUpdateQuestionSet}
      />
    </div>
  )
}

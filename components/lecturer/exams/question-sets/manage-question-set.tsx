/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { QuestionSetCard } from './question-set-card'
import { NEmpty } from '@/components/ui/NEmpty'
import { useDeleteQuestionSet, useGetQuestionSets } from '@/hooks/api/lecturer/exams/use-question-set'
import { LoadingSpinner } from '@/components/ui'
import { toast } from 'sonner'

export default function ManageQuestionSet() {
  const [editData, setEditData] = useState<any>(null)
  const [sortNewest, setSortNewest] = useState(true)
  const deleteMutation = useDeleteQuestionSet()
  const { data: questionSetData, isLoading, isError } = useGetQuestionSets({ limit: 50, page: 1 })
  const questionSets = questionSetData?.question_sets || []

  const handleEdit = (data: any) => {
    setEditData(data)
    // mở dialog chỉnh sửa
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

  const sortedSets = [...questionSets].sort((a, b) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
    return sortNewest ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
  })

  return (
    <div className='rounded-lg shadow p-4'>
      <div className='mb-2 text-lg font-semibold'>Danh sách bộ câu hỏi</div>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex gap-2'>
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
          Tổng cộng <span className='font-semibold'>{questionSets.length}</span> bộ câu hỏi
        </div>
      </div>
      <div className='space-y-6'>
        {isLoading && <div className='text-center text-greyscale-400 py-8'><LoadingSpinner variant='dots' /></div>}
        {isError && <div className='text-center text-error py-8'>Lỗi tải dữ liệu.</div>}
        {!isLoading && !isError && sortedSets.length === 0 && (
          <NEmpty title='Không có bộ câu hỏi' description='Vui lòng thêm mới bộ câu hỏi.' />
        )}
        {!isLoading && !isError && sortedSets.map((qs, idx) => (
          <QuestionSetCard
            key={qs.question_set_id}
            questionSet={qs}
            index={idx}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}

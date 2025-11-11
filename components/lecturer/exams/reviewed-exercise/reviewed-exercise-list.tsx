/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { NEmpty } from '@/components/ui/NEmpty'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import ReviewedExerciseModal from './reviewed-exercise-modal'
import {
  useCreateReviewedExercise,
  useDeleteReviewedExercise,
  useUpdateReviewedExercise,
  useGetReviewedExercise
} from '@/hooks/api/lecturer/exams/use-reviewed-exercise'
import ReviewedExerciseCard from '@/components/lecturer/exams/reviewed-exercise/reviewed-exercise-card'
import type { ReviewedExerciseSummary } from '@/lib/validations/lecturer/exams/reviewed-exercise'

interface ReviewedExerciseListProps {
  lessonId: string
  lessonName: string
  exercises?: ReviewedExerciseSummary[]
}

export default function ReviewedExerciseList({ lessonId, lessonName, exercises = [] }: ReviewedExerciseListProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null)
  const [isViewMode, setIsViewMode] = useState(false)

  const createMutation = useCreateReviewedExercise(lessonId)
  const deleteMutation = useDeleteReviewedExercise(lessonId)
  const updateMutation = useUpdateReviewedExercise(lessonId)

  // Fetch full exercise detail when user clicks view or edit
  const detailQuery = useGetReviewedExercise(selectedExerciseId || '')

  const handleDelete = (id: string) => {
    // Show confirmation with the exercise being deleted
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Xóa bài tập ôn tập thành công')
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Xóa bài tập thất bại. Vui lòng thử lại!')
      }
    })
  }

  const handleEdit = (exercise: any) => {
    // Use exercise data directly from list (already has full question_sets from lesson detail)
    setEditData(exercise)
    setSelectedExerciseId(exercise.reviewed_exercise_id)
    setIsViewMode(false)
    setModalOpen(true)
  }

  const handleView = (exercise: any) => {
    // Use exercise data directly from list (already has full question_sets from lesson detail)
    setEditData(exercise)
    setSelectedExerciseId(exercise.reviewed_exercise_id)
    setIsViewMode(true)
    setModalOpen(true)
  }

  const handleSubmit = (formData: any) => {
    // Validation
    if (!formData.status) {
      toast.error('Vui lòng chọn trạng thái')
      return
    }

    if (!formData.startTime) {
      toast.error('Vui lòng chọn thời gian bắt đầu')
      return
    }

    if (!formData.endTime) {
      toast.error('Vui lòng chọn thời gian kết thúc')
      return
    }

    if (!formData.questionSets || formData.questionSets.length === 0) {
      toast.error('Vui lòng chọn ít nhất một bộ câu hỏi')
      return
    }

    const payload = {
      lessonId: lessonId,
      status: formData.status,
      startTime: formData.startTime,
      endTime: formData.endTime,
      questionSets: formData.questionSets
    }

    if (editData && editData.reviewed_exercise_id) {
      // Update
      updateMutation.mutate(
        {
          id: editData.reviewed_exercise_id,
          data: payload
        },
        {
          onSuccess: () => {
            toast.success('Cập nhật bài tập thành công')
            setModalOpen(false)
            setEditData(null)
            setSelectedExerciseId(null)
          },
          onError: (err: any) => {
            toast.error(err?.message || 'Cập nhật bài tập thất bại. Vui lòng thử lại!')
          }
        }
      )
    } else {
      // Create
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Tạo bài tập ôn tập thành công')
          setModalOpen(false)
          setSelectedExerciseId(null)
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Tạo bài tập thất bại. Vui lòng kiểm tra lại thông tin!')
        }
      })
    }
  }

  // Update editData when detail data is loaded
  useEffect(() => {
    if (detailQuery.data && selectedExerciseId) {
      setEditData(detailQuery.data)
    }
  }, [detailQuery.data, selectedExerciseId])

  return (
    <div className='mt-4 space-y-3'>
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-medium text-greyscale-700'>Bài tập ôn tập</h4>
        <Button
          size='sm'
          variant='outline'
          className='flex items-center gap-2 h-8 text-xs'
          onClick={() => {
            setEditData(null)
            setModalOpen(true)
          }}
        >
          <Plus className='size-3' />
          Thêm bài tập
        </Button>
      </div>

      {exercises.length === 0 && (
        <div className='text-center py-6'>
          <NEmpty title='Chưa có bài tập ôn tập' description='Thêm bài tập để học viên ôn luyện' />
        </div>
      )}

      {exercises.length > 0 && (
        <div className='space-y-2'>
          {exercises.map((exercise: any, index: number) => (
            <ReviewedExerciseCard
              key={exercise.reviewed_exercise_id}
              exercise={exercise}
              index={index}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ReviewedExerciseModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) {
            setEditData(null)
            setSelectedExerciseId(null)
            setIsViewMode(false)
          }
        }}
        onSubmit={isViewMode ? undefined : handleSubmit}
        lessonId={lessonId}
        lessonName={lessonName}
        initialData={editData}
        readOnly={isViewMode}
        isLoading={detailQuery.isLoading && selectedExerciseId !== null}
      />
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { NEmpty } from "@/components/ui/NEmpty"
import { LoadingSpinner } from "@/components/ui"
import { IoMdAdd } from "react-icons/io"
import FinalExamModal from "./final-exam-modal"
import { useGetFinalExams, useCreateFinalExam, useDeleteFinalExam, useUpdateFinalExam } from "@/hooks/api/lecturer/exams/use-final-exam"
import FinalExamCard from "./final-exam-card"
import { toast } from "sonner"
import { ExamToolBar } from "@/components/lecturer/exams/exam-toolbar"

export default function FinalExamList() {
  const [sortNewest, setSortNewest] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editData, setEditData] = useState<any>(null)
  const pageSize = 5

  const queryParams: any = {
    limit: pageSize,
    page: currentPage
  }
  if (searchValue.trim() !== '') {
    queryParams.q = searchValue
  }

  const { data, isLoading, isError } = useGetFinalExams(queryParams)
  const finalExams = data?.final_exams || []
  const totalPages = data?.pagination?.total_pages ?? 1

  const createMutation = useCreateFinalExam()
  const deleteMutation = useDeleteFinalExam()
  const updateMutation = useUpdateFinalExam()

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Xóa bài thi cuối kỳ thành công")
      },
      onError: (err) => {
        toast.error(err?.message || "Xóa bài thi thất bại")
      }
    })
  }

  const handleEdit = (finalExam: any) => {
    setEditData(finalExam)
    setModalOpen(true)
  }

  const handleSubmit = (formData: any) => {
    const payload = {
      ...formData,
      questionSets: formData.selectedQuestionSets?.map((qs: any) => qs.question_set_id) || []
    }
    if (editData && editData.final_exam_id) {
      // Update
      updateMutation.mutate(
        {
          finalExamId: editData.final_exam_id,
          data: payload,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật bài thi cuối kỳ thành công")
            setModalOpen(false)
            setEditData(null)
          },
          onError: (err) => {
            toast.error(err?.message || "Có lỗi xảy ra")
          },
        }
      )
    } else {
      // Create
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Tạo bài thi cuối kỳ thành công")
          setModalOpen(false)
        },
        onError: (err) => {
          toast.error(err?.message || "Có lỗi xảy ra")
        },
      })
    }
  }

  const sortedTests = [...finalExams].sort((a, b) => {
    const dateA = new Date(a.updated_at)
    const dateB = new Date(b.updated_at)
    return sortNewest ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
  })

  const handleSearch = () => {
    setSearchValue(search)
    setCurrentPage(1)
  }

  return (
    <div className="bg-greyscale-0 rounded-lg shadow p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-lg font-semibold">Bài thi cuối kỳ</div>
        <Button
          className="flex items-center gap-2 rounded-2xl h-9 text-sm bg-primary hover:bg-primary-300 text-greyscale-0 font-semibold"
          onClick={() => setModalOpen(true)}
        >
          <IoMdAdd className="size-4 text-greyscale-0" />
          Thêm mới
        </Button>
      </div>

      <ExamToolBar
        searchPlaceholder="Tìm kiếm bài thi cuối kỳ..."
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
        sortNewest={sortNewest}
        setSortNewest={setSortNewest}
        totalLabel="Tổng cộng"
        totalCount={finalExams.length}
        totalLabel2="bài thi"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <div className="space-y-6">
        {isLoading && <div className="text-center text-greyscale-400 py-8"><LoadingSpinner variant="dots" /></div>}
        {isError && <div className="text-center text-red-400 py-8">Lỗi tải dữ liệu.</div>}
        {!isLoading && !isError && sortedTests.length === 0 && (
          <NEmpty title="Không có bài thi cuối kỳ" description="Vui lòng thêm mới bài thi." />
        )}
        {!isLoading && !isError && sortedTests.length > 0 && (
          <div className="space-y-2">
            {sortedTests.map((test: any, idx: number) => (
              <FinalExamCard
                key={test.final_exam_id}
                finalExam={test}
                index={idx}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
      <FinalExamModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditData(null)
        }}
        initialData={editData}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
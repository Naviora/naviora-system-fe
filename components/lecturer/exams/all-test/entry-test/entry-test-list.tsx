/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { NEmpty } from "@/components/ui/NEmpty"
import { LoadingSpinner } from "@/components/ui"
import { IoMdAdd } from "react-icons/io"
import EntryTestModal from "./entry-test-modal"
import { useGetEntryTests, useCreateEntryTest } from "@/hooks/api/lecturer/exams/use-entry-test"
import { EntryTestCard } from "@/components/lecturer/exams/all-test/entry-test/entry-test-card"
import { toast } from "sonner"

export default function EntryTestList() {
  const [sortNewest, setSortNewest] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const { data, isLoading, isError } = useGetEntryTests()
  const entryTests = data?.entry_tests || []

  const createMutation = useCreateEntryTest()

  const handleCreate = (formData: any) => {
    const payload = {
      ...formData,
      questionSets: formData.selectedQuestionSets?.map((qs: any) => qs.question_set_id) || []
    }
    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Tạo bài kiểm tra đầu vào thành công")
        setModalOpen(false)
      },
      onError: (err) => {
        toast.error(err?.message || "Có lỗi xảy ra")
      }
    })
  }

  const sortedTests = [...entryTests].sort((a, b) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
    return sortNewest ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
  })

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-lg font-semibold">Bài thi đầu vào</div>
        <Button
          className="flex items-center gap-2 rounded-2xl h-[36px] text-sm bg-primary hover:bg-primary-300 text-greyscale-0 font-semibold"
          onClick={() => setModalOpen(true)}
        >
          <IoMdAdd className="size-4 text-greyscale-0" />
          Thêm mới
        </Button>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
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
        <div className="text-sm text-gray-600">
          Tổng cộng <span className="font-semibold">{entryTests.length}</span> bài thi
        </div>
      </div>
      <div className="space-y-6">
        {isLoading && <div className="text-center text-gray-400 py-8"><LoadingSpinner variant="dots" /></div>}
        {isError && <div className="text-center text-red-400 py-8">Lỗi tải dữ liệu.</div>}
        {!isLoading && !isError && sortedTests.length === 0 && (
          <NEmpty title="Không có bài thi đầu vào" description="Vui lòng thêm mới bài thi." />
        )}
        {!isLoading && !isError && sortedTests.length > 0 && (
          <div className="space-y-2">
            {sortedTests.map((test: any, idx: number) => (
              <EntryTestCard
                key={test.entry_test_id}
                entryTest={test}
                index={idx}
                onEdit={() => {/* TODO: handle edit */}}
                onDelete={() => {/* TODO: handle delete */}}
              />
            ))}
          </div>
        )}
      </div>
      <EntryTestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleCreate}
      />
    </div>
  )
}
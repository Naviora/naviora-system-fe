/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { NEmpty } from "@/components/ui/NEmpty"
import { LoadingSpinner } from "@/components/ui"
import { IoMdAdd } from "react-icons/io"

export default function OtherTestList() {
  const [sortNewest, setSortNewest] = useState(true)
  // TODO: Thay bằng hook lấy dữ liệu thực tế
  const otherTests: any = []
  const isLoading = false
  const isError = false

  const sortedTests = [...otherTests].sort((a, b) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
    return sortNewest ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
  })

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-lg font-semibold">Các bài thi khác</div>
        <Button className="flex items-center gap-2 rounded-2xl h-[36px] text-sm bg-primary hover:bg-primary-300 text-greyscale-0 font-semibold">
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
          Tổng cộng <span className="font-semibold">{otherTests.length}</span> bài thi
        </div>
      </div>
      <div className="space-y-6">
        {isLoading && <div className="text-center text-gray-400 py-8"><LoadingSpinner variant="dots" /></div>}
        {isError && <div className="text-center text-red-400 py-8">Lỗi tải dữ liệu.</div>}
        {!isLoading && !isError && sortedTests.length === 0 && (
          <NEmpty title="Không có bài thi" description="Vui lòng thêm mới bài thi." />
        )}
        {/* TODO: Render danh sách các bài kiểm tra khác ở đây */}
      </div>
    </div>
  )
}
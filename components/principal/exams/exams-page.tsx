'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useEntryTests } from '@/hooks/api/principal/use-entry-tests'
import { SectionHeader } from '@/components/common'

export function PrincipalExamsPageClient() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 10
  })

  const entryTestsQuery = useEntryTests({
    page: pagination.page,
    limit: pagination.limit,
    q: searchQuery || undefined,
    status: statusFilter || undefined
  })

  const entryTests = entryTestsQuery.data?.data?.entry_tests ?? []
  const paginationData = entryTestsQuery.data?.data?.pagination

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setPagination({ page: 1, limit: 10 })
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value === 'all' ? null : value)
    setPagination({ page: 1, limit: 10 })
  }

  const handlePreviousPage = () => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(1, prev.page - 1)
    }))
  }

  const handleNextPage = () => {
    if (paginationData && pagination.page < paginationData.total_pages) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1
      }))
    }
  }

  const handleViewDetail = (entryTestId: string) => {
    router.push(`/main/principal/exams/${entryTestId}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800'
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800'
      case 'CLOSED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-greyscale-100 text-greyscale-800'
    }
  }

  return (
    <div className='min-h-screen bg-white p-8'>
      <SectionHeader title='Quản lý bài thi Entry Test' />

      <div className='mt-8 space-y-6'>
        {/* Filters */}
        <div className='flex gap-4'>
          <div className='relative flex-1'>
            <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-greyscale-400' />
            <Input
              placeholder='Tìm kiếm theo tiêu đề...'
              value={searchQuery}
              onChange={handleSearch}
              className='pl-10'
              disabled={entryTestsQuery.isLoading}
            />
          </div>
          <Select value={statusFilter || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className='w-48'>
              <SelectValue placeholder='Lọc theo trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả trạng thái</SelectItem>
              <SelectItem value='DRAFT'>Nháp</SelectItem>
              <SelectItem value='PUBLISHED'>Đã công bố</SelectItem>
              <SelectItem value='CLOSED'>Đã đóng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className='border border-greyscale-100 rounded-lg overflow-hidden'>
          <Table>
            <TableHeader className='bg-greyscale-50'>
              <TableRow>
                <TableHead className='text-greyscale-700'>Tiêu đề</TableHead>
                <TableHead className='text-greyscale-700'>Mô tả</TableHead>
                <TableHead className='text-greyscale-700'>Trạng thái</TableHead>
                <TableHead className='text-greyscale-700'>Thời gian bắt đầu</TableHead>
                <TableHead className='text-greyscale-700'>Thời gian kết thúc</TableHead>
                <TableHead className='text-greyscale-700 text-right'>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entryTestsQuery.isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {Array.from({ length: 6 }).map((_, cellIdx) => (
                      <TableCell key={cellIdx}>
                        <Skeleton className='h-4 w-24' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : entryTests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center py-8 text-greyscale-500'>
                    {searchQuery || statusFilter
                      ? 'Không tìm thấy bài thi phù hợp'
                      : 'Không có bài thi nào'}
                  </TableCell>
                </TableRow>
              ) : (
                entryTests.map((test) => (
                  <TableRow key={test.entry_test_id} className='hover:bg-greyscale-50'>
                    <TableCell className='font-medium max-w-xs truncate'>{test.title}</TableCell>
                    <TableCell className='text-greyscale-600 max-w-xs truncate'>
                      {test.description || '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(test.status)}`}>
                        {test.status === 'DRAFT' && 'Nháp'}
                        {test.status === 'PUBLISHED' && 'Đã công bố'}
                        {test.status === 'CLOSED' && 'Đã đóng'}
                      </span>
                    </TableCell>
                    <TableCell className='text-sm text-greyscale-600'>
                      {formatDate(test.start_time)}
                    </TableCell>
                    <TableCell className='text-sm text-greyscale-600'>
                      {formatDate(test.end_time)}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleViewDetail(test.entry_test_id)}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {paginationData && (
          <div className='border-t border-greyscale-100 pt-6 flex items-center justify-between'>
            <div className='text-sm text-greyscale-600'>
              Hiển thị {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, paginationData.total_records)}/
              {paginationData.total_records} bài thi
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handlePreviousPage}
                disabled={pagination.page === 1 || entryTestsQuery.isLoading}
                aria-label='Trang trước'
              >
                <ChevronLeftIcon className='h-4 w-4' />
              </Button>
              <div className='text-sm text-greyscale-600 min-w-16 text-center'>
                Trang {pagination.page}/{paginationData.total_pages}
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={handleNextPage}
                disabled={pagination.page >= paginationData.total_pages || entryTestsQuery.isLoading}
                aria-label='Trang tiếp theo'
              >
                <ChevronRightIcon className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

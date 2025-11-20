import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className='flex justify-center items-center gap-2'>
      <Button
        variant="outline"
        size="sm"
        className='h-8 w-8 p-0'
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeftIcon className='size-4' aria-hidden='true' />
      </Button>
      <span className='text-sm font-semibold'>
        Trang {currentPage} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        className='h-8 w-8 p-0'
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRightIcon className='size-4' aria-hidden='true' />
      </Button>
    </div>
  )
}
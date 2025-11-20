import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'

interface ExamToolBarProps {
  searchPlaceholder?: string
  search: string
  setSearch: (v: string) => void
  onSearch: () => void
  sortNewest: boolean
  setSortNewest: (v: boolean) => void
  totalLabel?: string
  totalCount: number
  totalLabel2?: string
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ExamToolBar({
  searchPlaceholder = 'Tìm kiếm...',
  search,
  setSearch,
  onSearch,
  sortNewest,
  setSortNewest,
  totalLabel = 'Tổng cộng',
  totalCount,
  totalLabel2 = 'câu',
  currentPage,
  totalPages,
  onPageChange,
}: ExamToolBarProps) {
  return (
    <>
      <div className='mb-4 flex items-end justify-between'>
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
          {totalLabel} <span className='font-semibold'>{totalCount}</span> {totalLabel2}
        </div>
      </div>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex gap-2 items-center'>
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') onSearch()
            }}
            className='w-xs h-8'
          />
          <Button variant="default" size="sm" onClick={onSearch}>
            Tìm kiếm
          </Button>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </>
  )
}
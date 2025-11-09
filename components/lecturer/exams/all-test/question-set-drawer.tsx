import { useEffect, useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import { useGetQuestionSets } from '@/hooks/api/lecturer/exams/use-question-set'
import { LoadingSpinner } from '@/components/ui'
import { NEmpty } from '@/components/ui/NEmpty'
import { SearchRequest } from '@/types/api/common'
import { QuestionSet } from '@/lib/validations/lecturer/exams/question-set'

export default function QuestionSetDrawer({
  onApply,
  selectedIds: externalSelectedIds = []
}: {
  onApply?: (selected: QuestionSet[]) => void
  selectedIds?: string[]
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchValue, setSearchValue] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const params: SearchRequest = { limit: 100, page: 1 }
  if (searchValue && searchValue.trim() !== '') params.q = searchValue

  const { data, isLoading } = useGetQuestionSets(params)
  const sets = data?.question_sets || data?.question_sets || []

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleApply = () => {
    const selected = sets.filter((s: QuestionSet) => selectedIds.includes(s.question_set_id))
    onApply?.(selected)
    setOpen(false)
  }

  const handleSearch = () => {
    setSearchValue(search)
  }

  useEffect(() => {
    if (open) {
      setSelectedIds(externalSelectedIds)
    }
  }, [open, externalSelectedIds])

  return (
    <>
      <Button variant='outline' size='sm' className='flex items-center gap-2' onClick={() => setOpen(true)}>
        <IoMdAdd className='text-lg' />
        Thêm bộ câu hỏi từ danh sách
      </Button>

      <Drawer open={open} onOpenChange={setOpen} direction='right'>
        <DrawerContent className='max-w-3xl! w-full'>
          <DrawerHeader>
            <DrawerTitle>Chọn bộ câu hỏi</DrawerTitle>
            <DrawerClose asChild>
              <Button variant='ghost' size='icon' className='absolute right-4 top-2'>
                <IoMdClose />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className='px-4 pt-2 flex gap-2'>
            <Input
              placeholder='Tìm kiếm bộ câu hỏi...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full'
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
            />
            <Button variant='outline' onClick={handleSearch}>
              Tìm
            </Button>
          </div>

          <div className='p-4 mt-1 overflow-y-auto' style={{ maxHeight: '70vh' }}>
            {isLoading && <LoadingSpinner variant='dots' />}
            {!isLoading && sets.length === 0 && (
              <NEmpty title='Không có bộ câu hỏi' description='Thử tìm với từ khóa khác hoặc tạo mới bộ câu hỏi.' />
            )}
            {!isLoading &&
              sets.map((s: QuestionSet) => {
                const id = s.question_set_id
                const total = s.total_questions
                return (
                  <div key={id} className='border rounded p-3 mb-3 flex items-start gap-3'>
                    <Checkbox
                      checked={selectedIds.includes(String(id))}
                      onCheckedChange={() => handleToggle(String(id))}
                      className='mt-1'
                    />
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <div className='font-medium'>{s.title}</div>
                        <div className='text-sm text-greyscale-500'>{total ? `${total} câu` : null}</div>
                      </div>
                      {s.description && <div className='text-sm text-greyscale-600 mt-1'>{s.description}</div>}
                      <div className='text-xs text-greyscale-400 mt-2'>
                        {s.created_at ? new Date(s.created_at).toLocaleString() : ''}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>

          <div className='flex items-center justify-between px-6 py-4 border-t bg-greyscale-0'>
            <span>
              Đã chọn: <b>{selectedIds.length}</b>
            </span>
            <Button onClick={handleApply} disabled={selectedIds.length === 0}>
              Áp dụng
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

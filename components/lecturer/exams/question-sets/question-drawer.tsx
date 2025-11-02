import { useState, useEffect } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import { useGetQuestions } from '@/hooks/api/lecturer/exams/use-question'
import { Checkbox } from '@/components/ui/checkbox'
import { DIFFICULTY_LEVELS, getDifficultyLabel, getTypeLabel, QUESTION_TYPES } from '@/lib/constants/exams'
import { LoadingSpinner } from '@/components/ui'
import { NEmpty } from '@/components/ui/NEmpty'
import { Input } from '@/components/ui/input'
import { SearchRequest } from '@/types/api/common'
import { Question } from '@/lib/validations/lecturer/exams/question'

export function QuestionBankDrawer({
  onApply,
  selectedIds: externalSelectedIds
}: {
  onApply: (selectedQuestions: Question[]) => void
  selectedIds?: string[]
}) {
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState('ALL')
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL')
  const [search, setSearch] = useState('')
  const [searchValue, setSearchValue] = useState<string | null>(null)

  const params: SearchRequest = { limit: 100, page: 1 }
  if (searchValue && searchValue.trim() !== '') {
    params.q = searchValue
  }

  const { data, isLoading } = useGetQuestions(params)
  const questions = data?.questions || []

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const filteredQuestions = questions
    .filter((q) => selectedType === 'ALL' || q.type === selectedType)
    .filter((q) => selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty)

  const handleApply = () => {
    const selectedQuestions = questions.filter((q) => selectedIds.includes(q.question_id))
    onApply(selectedQuestions)
    setOpen(false)
  }

  const handleSearch = () => {
    setSearchValue(search)
  }

  // Select all filtered questions
  const handleSelectAll = () => {
    setSelectedIds(filteredQuestions.map(q => q.question_id))
  }

  // Deselect all
  const handleDeselectAll = () => {
    setSelectedIds([])
  }

  useEffect(() => {
    if (open) {
      setSelectedIds(externalSelectedIds ?? [])
    }
  }, [open, externalSelectedIds])

  return (
    <>
      <Button variant='outline' size={'sm'} className='flex items-center gap-2' onClick={() => setOpen(true)}>
        <IoMdAdd className='text-lg' />
        Thêm câu hỏi từ ngân hàng
      </Button>
      <Drawer open={open} onOpenChange={setOpen} direction='right'>
        <DrawerContent className='!max-w-3xl w-full'>
          <DrawerHeader>
            <DrawerTitle>Chọn câu hỏi từ ngân hàng</DrawerTitle>
            <DrawerClose asChild>
              <Button variant='ghost' size='icon' className='absolute right-4 top-2'>
                <IoMdClose />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className='px-4'>
            <div className='flex gap-2 items-center'>
              <span className='font-medium text-sm'>Loại câu hỏi</span>
              {QUESTION_TYPES.map((type) => (
                <button
                  key={type.value}
                  className={`text-sm px-2 py-1 rounded ${selectedType === type.value ? 'text-primary font-semibold' : 'text-greyscale-700 hover:bg-greyscale-100'}`}
                  onClick={() => setSelectedType(type.value)}
                >
                  {type.label}
                </button>
              ))}
            </div>
            <div className='flex gap-2 items-center'>
              <span className='font-medium text-sm'>Độ khó</span>
              {DIFFICULTY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  className={`text-sm px-2 py-1 rounded ${selectedDifficulty === level.value ? 'text-primary font-semibold' : 'text-greyscale-700 hover:bg-greyscale-100'}`}
                  onClick={() => setSelectedDifficulty(level.value)}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
          <div className='flex gap-2 px-4 pt-2'>
            <Input
              placeholder='Tìm kiếm nội dung câu hỏi...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full'
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
            />
            <Button variant='outline' onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>
          <div className='flex gap-2 px-4 py-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleSelectAll}
              disabled={filteredQuestions.length === 0 || selectedIds.length === filteredQuestions.length}
            >
              Chọn tất cả
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={handleDeselectAll}
              disabled={selectedIds.length === 0}
            >
              Bỏ chọn tất cả
            </Button>
          </div>
          <div className='p-4 mt-1 overflow-y-auto' style={{ maxHeight: '70vh' }}>
            {isLoading && <LoadingSpinner variant='dots' />}
            {!isLoading && filteredQuestions.length === 0 && (
              <NEmpty
                title='Không có câu hỏi phù hợp'
                description='Vui lòng thử lại với bộ lọc khác hoặc thêm mới câu hỏi.'
              />
            )}
            {!isLoading &&
              filteredQuestions.map((q) => (
                <div key={q.question_id} className='border rounded p-3 mb-3 flex items-start gap-3'>
                  <Checkbox
                    checked={selectedIds.includes(q.question_id)}
                    onCheckedChange={() => handleSelect(q.question_id)}
                    className='mt-1'
                  />
                  <div>
                    <div className='flex gap-2 mb-1 text-xs'>
                      <span className='bg-blue-50 text-blue-600 px-2 py-0.5 rounded'>{getTypeLabel(q.type)}</span>
                      <span className='bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded'>{getDifficultyLabel(q.difficulty)}</span>
                    </div>
                    <div className='font-medium'>{q.content}</div>
                    <ul className='ml-4 list-disc text-sm text-greyscale-600'>
                      {q.answers?.map((a, idx: number) => (
                        <li key={a.answer_id || idx}>
                          {a.content} {a.is_correct && <span className='text-green-600 font-semibold'>(Đúng)</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
          <div className='flex items-center justify-between px-6 py-4 border-t bg-greyscale-0'>
            <span>
              Đã chọn: <b>{selectedIds.length}</b> câu
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

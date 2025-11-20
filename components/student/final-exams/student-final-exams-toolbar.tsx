'use client'

import { RotateCcw, Search } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const STATUS_OPTIONS = [
  { label: 'Tất cả', value: null },
  { label: 'Sắp diễn ra', value: 'PUBLISHED' },
  { label: 'Đang diễn ra', value: 'ACTIVE' },
  { label: 'Đã kết thúc', value: 'COMPLETED' }
]

interface StudentFinalExamsToolbarProps {
  searchTerm: string
  onSearchChange?: (value: string) => void
  statusFilter: string | null
  onStatusFilterChange?: (value: string | null) => void
  isDisabled?: boolean
}

export function StudentFinalExamsToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isDisabled = false
}: StudentFinalExamsToolbarProps) {
  const handleStatusChange = (value: string) => {
    if (value === 'null') {
      onStatusFilterChange?.(null)
    } else {
      onStatusFilterChange?.(value)
    }
  }

  const handleReset = () => {
    onSearchChange?.('')
    onStatusFilterChange?.(null)
  }

  return (
    <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
      <div className='flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
        <InputGroup className='sm:max-w-xs'>
          <InputGroupAddon>
            <Search className='size-4 text-greyscale-400' aria-hidden='true' />
          </InputGroupAddon>
          <InputGroupInput
            placeholder='Tìm kiếm bài thi theo tên'
            value={searchTerm}
            onChange={(event) => onSearchChange?.(event.target.value)}
            disabled={isDisabled}
          />
        </InputGroup>

        <Select value={statusFilter ?? 'null'} onValueChange={handleStatusChange} disabled={isDisabled}>
          <SelectTrigger className='w-full sm:w-auto sm:min-w-[200px]' size='sm'>
            <SelectValue placeholder='Lọc theo trạng thái' />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value ?? 'null'} value={option.value ?? 'null'}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <InputGroupButton
        variant='ghost'
        size='sm'
        className='self-start rounded-md border border-greyscale-200 text-sm font-medium text-greyscale-600 lg:self-auto'
        onClick={handleReset}
        disabled={isDisabled}
      >
        <RotateCcw className='mr-1 size-4' aria-hidden='true' /> Đặt lại
      </InputGroupButton>
    </div>
  )
}

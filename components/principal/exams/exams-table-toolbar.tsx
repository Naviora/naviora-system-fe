'use client'

import * as React from 'react'
import { RotateCcw, Search } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ExamsTableToolbarProps {
  searchTerm: string
  onSearchChange?: (value: string) => void
  statusFilter: string | null
  onStatusFilterChange?: (value: string | null) => void
  isSearchDisabled?: boolean
}

const STATUS_OPTIONS = [
  { label: 'Tất cả', value: null },
  { label: 'Nháp', value: 'DRAFT' },
  { label: 'Đã xuất bản', value: 'PUBLISHED' },
  { label: 'Đang hoạt động', value: 'ACTIVE' },
  { label: 'Đã đóng', value: 'CLOSED' },
  { label: 'Lưu trữ', value: 'ARCHIVED' }
]

export function ExamsTableToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isSearchDisabled = false
}: ExamsTableToolbarProps) {
  const handleStatusChange = (value: string) => {
    if (value === 'null') {
      onStatusFilterChange?.(null)
    } else {
      onStatusFilterChange?.(value)
    }
  }

  const handleResetFilters = () => {
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
            placeholder='Tìm kiếm theo tên bài thi'
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            disabled={isSearchDisabled}
          />
        </InputGroup>

        <Select value={statusFilter ?? 'null'} onValueChange={handleStatusChange} disabled={isSearchDisabled}>
          <SelectTrigger className='w-full sm:w-auto sm:min-w-[180px]' size='sm'>
            <SelectValue placeholder='Chọn trạng thái' />
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

      <div className='flex items-center gap-2 self-start text-sm text-greyscale-500 sm:self-auto'>
        <InputGroupButton
          variant='ghost'
          size='sm'
          className='rounded-md border border-greyscale-200 text-sm font-medium text-greyscale-600'
          onClick={handleResetFilters}
          disabled={isSearchDisabled}
          title='Đặt lại bộ lọc'
        >
          <RotateCcw className='mr-1 size-4' aria-hidden='true' />
          Đặt lại
        </InputGroupButton>
      </div>
    </div>
  )
}

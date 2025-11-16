'use client'

import * as React from 'react'
import { RotateCcw, Search } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ClassType } from '@/types/principal/classes'

const classTypeOptions: Array<{ value: ClassType; label: string }> = [
  { value: 'school', label: 'Trường học' },
  { value: 'city', label: 'Thành phố' },
  { value: 'province', label: 'Tỉnh' },
  { value: 'national', label: 'Quốc gia' },
  { value: 'international', label: 'Quốc tế' }
]

interface ClassTableToolbarProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  selectedClassType?: ClassType | null
  onClassTypeChange?: (type: ClassType | null) => void
  isSearchDisabled?: boolean
}

export function ClassTableToolbar({
  searchValue,
  onSearchChange,
  selectedClassType,
  onClassTypeChange,
  isSearchDisabled
}: ClassTableToolbarProps) {
  const currentSearchValue = searchValue ?? ''

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    onSearchChange?.(value)
  }

  const handleClassTypeChange = (value: string) => {
    if (value === 'all') {
      onClassTypeChange?.(null)
    } else {
      onClassTypeChange?.(value as ClassType)
    }
  }

  const handleResetFilters = () => {
    onSearchChange?.('')
    onClassTypeChange?.(null)
  }

  return (
    <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
      <div className='flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
        <InputGroup className='sm:max-w-xs'>
          <InputGroupAddon>
            <Search className='size-4 text-greyscale-400' aria-hidden='true' />
          </InputGroupAddon>
          <InputGroupInput
            placeholder='Tìm kiếm theo tên hoặc mã lớp'
            value={currentSearchValue}
            onChange={handleSearchChange}
            disabled={isSearchDisabled}
          />
        </InputGroup>

        <Select value={selectedClassType ?? 'all'} onValueChange={handleClassTypeChange} disabled={isSearchDisabled}>
          <SelectTrigger className='w-full sm:w-auto sm:min-w-[180px]' size='sm'>
            <SelectValue placeholder='Chọn loại lớp' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả loại lớp</SelectItem>
            {classTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
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

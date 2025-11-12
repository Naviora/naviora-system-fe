'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ClassType } from '@/types/api/class'

interface LecturerClassTableToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedClassType: ClassType | 'all'
  onClassTypeChange: (value: ClassType | 'all') => void
}

const classTypeOptions: Array<{ label: string; value: ClassType | 'all' }> = [
  { label: 'Tất cả loại lớp', value: 'all' },
  { label: 'Trường học', value: 'school' },
  { label: 'Thành phố', value: 'city' },
  { label: 'Tỉnh', value: 'province' },
  { label: 'Quốc gia', value: 'national' },
  { label: 'Quốc tế', value: 'international' }
]

export function LecturerClassTableToolbar({
  searchTerm,
  onSearchChange,
  selectedClassType,
  onClassTypeChange
}: LecturerClassTableToolbarProps) {
  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <Input
        placeholder='Tìm kiếm theo tên hoặc mã lớp...'
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className='h-9 max-w-sm'
      />
      <Select value={selectedClassType} onValueChange={(value) => onClassTypeChange(value as ClassType | 'all')}>
        <SelectTrigger className='h-9 w-full sm:w-[180px]'>
          <SelectValue placeholder='Chọn loại lớp' />
        </SelectTrigger>
        <SelectContent>
          {classTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

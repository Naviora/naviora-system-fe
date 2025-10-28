'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ClassType } from '@/types/api/class'
import { CLASS_TYPE_LABELS } from '@/types/api/class'

interface ClassFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  classType: ClassType | 'all'
  onClassTypeChange: (value: ClassType | 'all') => void
}

export function ClassFilters({ searchQuery, onSearchChange, classType, onClassTypeChange }: ClassFiltersProps) {
  return (
    <div className='flex flex-col sm:flex-row gap-4'>
      {/* Search */}
      <div className='relative flex-1'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-greyscale-500' />
        <Input
          type='text'
          placeholder='Search classes by name or code...'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Class Type Filter */}
      <Select value={classType} onValueChange={(value) => onClassTypeChange(value as ClassType | 'all')}>
        <SelectTrigger className='w-full sm:w-[200px]'>
          <SelectValue placeholder='All Types' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Types</SelectItem>
          {Object.entries(CLASS_TYPE_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

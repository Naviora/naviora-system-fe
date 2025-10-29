'use client'

import * as React from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export interface ModuleToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  sortOrder: 'ASC' | 'DESC'
  onSortOrderChange: (value: 'ASC' | 'DESC') => void
}

export function ModuleToolbar({
  searchValue,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange
}: ModuleToolbarProps) {
  const handleReset = () => {
    onSearchChange('')
    onSortChange('module_name')
    onSortOrderChange('ASC')
  }

  return (
    <div className='flex items-center gap-3'>
      {/* Search */}
      <div className='relative flex-1'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-greyscale-500' />
        <Input
          type='search'
          placeholder='Tìm kiếm chuyên đề...'
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className='pl-9'
        />
      </div>

      {/* Filter & Sort Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='default' className='gap-2 shrink-0'>
            <SlidersHorizontal className='h-4 w-4' />
            <span className='hidden sm:inline'>Bộ lọc</span>
          </Button>
        </SheetTrigger>
        <SheetContent className='w-full sm:max-w-md'>
          <SheetHeader>
            <SheetTitle className='text-xl font-bold'>Bộ lọc & Sắp xếp</SheetTitle>
          </SheetHeader>

          <div className='mt-8 space-y-6'>
            {/* Sort Section */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <div className='h-8 w-1 bg-primary-600 rounded-full' />
                <h3 className='text-base font-semibold text-greyscale-900'>Sắp xếp</h3>
              </div>

              <div className='space-y-4 pl-5'>
                <div className='space-y-2'>
                  <Label htmlFor='sort-by' className='text-sm font-medium text-greyscale-700'>
                    Sắp xếp theo
                  </Label>
                  <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger id='sort-by' className='h-11'>
                      <SelectValue placeholder='Chọn tiêu chí' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='module_name'>Tên chuyên đề</SelectItem>
                      <SelectItem value='module_code'>Mã chuyên đề</SelectItem>
                      <SelectItem value='created_at'>Ngày tạo</SelectItem>
                      <SelectItem value='updated_at'>Ngày cập nhật</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='sort-order' className='text-sm font-medium text-greyscale-700'>
                    Thứ tự
                  </Label>
                  <Select value={sortOrder} onValueChange={onSortOrderChange}>
                    <SelectTrigger id='sort-order' className='h-11'>
                      <SelectValue placeholder='Chọn thứ tự' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='ASC'>Tăng dần (A-Z, 0-9)</SelectItem>
                      <SelectItem value='DESC'>Giảm dần (Z-A, 9-0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='pt-6 space-y-3'>
              <Button variant='outline' className='w-full h-11' onClick={handleReset}>
                Đặt lại bộ lọc
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

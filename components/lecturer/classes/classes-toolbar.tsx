'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface ClassesToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  sortOrder: 'ASC' | 'DESC'
  onSortOrderChange: (value: 'ASC' | 'DESC') => void
  classType: string
  onClassTypeChange: (value: string) => void
}

export function ClassesToolbar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  classType,
  onClassTypeChange
}: ClassesToolbarProps) {
  const handleReset = () => {
    onSearchChange('')
    onSortChange('class_name')
    onSortOrderChange('ASC')
    onClassTypeChange('all')
  }

  return (
    <div className='flex items-center gap-3'>
      {/* Search */}
      <div className='relative flex-1'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-greyscale-500' />
        <Input
          type='search'
          placeholder='Tìm kiếm lớp học...'
          value={searchQuery}
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
                      <SelectItem value='class_name'>Tên lớp</SelectItem>
                      <SelectItem value='class_code'>Mã lớp</SelectItem>
                      <SelectItem value='start_date'>Ngày bắt đầu</SelectItem>
                      <SelectItem value='end_date'>Ngày kết thúc</SelectItem>
                      <SelectItem value='created_at'>Ngày tạo</SelectItem>
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

            <Separator className='my-6' />

            {/* Filter Section */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <div className='h-8 w-1 bg-primary-600 rounded-full' />
                <h3 className='text-base font-semibold text-greyscale-900'>Bộ lọc</h3>
              </div>

              <div className='space-y-2 pl-5'>
                <Label htmlFor='class-type' className='text-sm font-medium text-greyscale-700'>
                  Loại lớp học
                </Label>
                <Select value={classType} onValueChange={onClassTypeChange}>
                  <SelectTrigger id='class-type' className='h-11'>
                    <SelectValue placeholder='Tất cả loại lớp' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Tất cả</SelectItem>
                    <SelectItem value='school'>Cấp trường</SelectItem>
                    <SelectItem value='city'>Cấp thành phố</SelectItem>
                    <SelectItem value='province'>Cấp tỉnh</SelectItem>
                    <SelectItem value='national'>Cấp quốc gia</SelectItem>
                    <SelectItem value='international'>Cấp quốc tế</SelectItem>
                  </SelectContent>
                </Select>
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

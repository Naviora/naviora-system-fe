'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEnrolledClasses } from '@/hooks/api/student/use-enrolled-classes'

interface StudentModuleToolbarProps {
  onClassChange?: (classId: string) => void
}

export function StudentModuleToolbar({ onClassChange }: StudentModuleToolbarProps) {
  const { data: classes = [], isLoading } = useEnrolledClasses()
  const [selectedClassId, setSelectedClassId] = useState<string>('')

  // Khi classes data load xong, tự động chọn lớp đầu tiên
  useEffect(() => {
    if (!isLoading && classes.length > 0 && !selectedClassId) {
      const newClassId = classes[0].class_id
      setSelectedClassId(newClassId)
      onClassChange?.(newClassId)
    }
  }, [classes, isLoading, selectedClassId, onClassChange])

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId)
    onClassChange?.(classId)
  }

  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
      {/* No classes message */}
      {!isLoading && classes.length === 0 ? (
        <div className='text-sm text-muted-foreground'>Bạn đang không ở trong lớp nào</div>
      ) : (
        <div className='flex gap-3 flex-col sm:flex-row'>
          {/* Class Filter Dropdown */}
          <Select value={selectedClassId} onValueChange={handleClassChange}>
            <SelectTrigger className='w-full sm:w-[280px] border-greyscale-100'>
              <SelectValue placeholder='Chọn lớp học' />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <div className='px-2 py-1.5 text-sm text-muted-foreground'>Đang tải...</div>
              ) : (
                classes.map((classItem) => (
                  <SelectItem key={classItem.class_id} value={classItem.class_id}>
                    <span className='truncate'>
                      {classItem.class_code} - {classItem.class_name}
                    </span>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Search Input */}
      {classes.length > 0 && (
        <InputGroup className='w-full max-w-xs border-greyscale-100 shadow-none'>
          <InputGroupAddon align='inline-start' className='text-greyscale-400'>
            <Search className='h-4 w-4' aria-hidden='true' />
          </InputGroupAddon>
          <InputGroupInput placeholder='Tìm kiếm khóa học' aria-label='Tìm kiếm khóa học' />
        </InputGroup>
      )}
    </div>
  )
}

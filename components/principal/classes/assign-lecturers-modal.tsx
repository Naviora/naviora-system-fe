'use client'

import * as React from 'react'
import { Loader2, CheckCircle2, Circle, Search } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useLecturers, useAssignLecturersToClass, useAssignLecturersToModule } from '@/hooks/api/principal/use-classes'
import { ErrorHandler } from '@/lib/utils/error-handler'
import type { LecturerInClassDto } from '@/types/principal/classes'

interface AssignLecturersModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  classId: string
  moduleId: string
  moduleName: string
  classEndDate: string
  classLecturers?: LecturerInClassDto[]
  onSuccess?: () => void
}

export function AssignLecturersModal({
  isOpen,
  onOpenChange,
  classId,
  moduleId,
  moduleName,
  classEndDate,
  classLecturers = [],
  onSuccess
}: AssignLecturersModalProps) {
  const [selectedLecturers, setSelectedLecturers] = React.useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = React.useState('')

  const lecturersQuery = useLecturers()
  const assignToClassMutation = useAssignLecturersToClass({
    onError: (error) => {
      toast.error(ErrorHandler.getErrorMessage(error))
    }
  })

  const assignToModuleMutation = useAssignLecturersToModule({
    onSuccess: () => {
      toast.success('Gán giáo viên vào chuyên đề thành công')
      handleClose()
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(ErrorHandler.getErrorMessage(error))
    }
  })

  // Filter lecturers based on search query
  const filteredLecturers = React.useMemo(() => {
    const data = lecturersQuery.data?.data ?? []
    return data.filter(
      (lecturer) =>
        lecturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecturer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lecturer.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    )
  }, [lecturersQuery.data?.data, searchQuery])

  const handleSelectLecturer = (lecturerId: string, checked: boolean) => {
    const newSelected = new Set(selectedLecturers)
    if (checked) {
      newSelected.add(lecturerId)
    } else {
      newSelected.delete(lecturerId)
    }
    setSelectedLecturers(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLecturers(new Set(filteredLecturers.map((l) => l.account_id)))
    } else {
      setSelectedLecturers(new Set())
    }
  }

  const handleAssign = async () => {
    if (selectedLecturers.size === 0) {
      toast.error('Vui lòng chọn ít nhất một giáo viên')
      return
    }

    const lecturerIds = Array.from(selectedLecturers)

    // Check which lecturers are not already in the class
    const classLecturerIds = new Set(classLecturers.map((l) => l.id))
    const lecturersNotInClass = lecturerIds.filter((id) => !classLecturerIds.has(id))

    try {
      // Only assign to class if there are lecturers not already in the class
      if (lecturersNotInClass.length > 0) {
        await assignToClassMutation.mutateAsync({
          classId,
          lecturerIds: lecturersNotInClass
        })
      }

      // Always assign lecturers to module (including those already in the class)
      await assignToModuleMutation.mutateAsync({
        moduleId,
        lecturerIds,
        endDate: classEndDate
      })
    } catch (error) {
      console.error('Error assigning lecturers:', error)
    }
  }

  const handleClose = () => {
    setSelectedLecturers(new Set())
    onOpenChange(false)
  }

  const isLoading = lecturersQuery.isLoading || assignToClassMutation.isPending || assignToModuleMutation.isPending
  const allSelected = filteredLecturers.length > 0 && selectedLecturers.size === filteredLecturers.length

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Gán giáo viên vào chuyên đề</DialogTitle>
          <DialogDescription>
            Chuyên đề: <span className='font-semibold text-foreground'>{moduleName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Search Input */}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-greyscale-400' />
            <Input
              placeholder='Tìm kiếm theo tên, email, số điện thoại...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10'
              disabled={isLoading}
            />
          </div>

          {/* Select All */}
          <div className='flex items-center gap-3 border-b border-greyscale-100 pb-3'>
            <Checkbox
              id='select-all'
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              disabled={isLoading || filteredLecturers.length === 0}
            />
            <label htmlFor='select-all' className='text-sm font-medium cursor-pointer flex-1'>
              Chọn tất cả ({filteredLecturers.length} giáo viên)
            </label>
          </div>

          {/* Lecturers List */}
          <div className='h-64 border border-greyscale-100 rounded-md p-4 overflow-y-auto'>
            {isLoading ? (
              <div className='space-y-3'>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className='flex items-center gap-3'>
                    <Skeleton className='h-4 w-4 rounded' />
                    <div className='space-y-1 flex-1'>
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='h-3 w-40' />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredLecturers.length === 0 ? (
              <div className='flex items-center justify-center h-full text-sm text-greyscale-500'>
                {searchQuery ? 'Không tìm thấy giáo viên' : 'Không có giáo viên nào'}
              </div>
            ) : (
              <div className='space-y-2'>
                {filteredLecturers.map((lecturer) => (
                  <div key={lecturer.account_id} className='flex items-start gap-3 p-3 rounded hover:bg-greyscale-50'>
                    <Checkbox
                      id={lecturer.account_id}
                      checked={selectedLecturers.has(lecturer.account_id)}
                      onCheckedChange={(checked) => handleSelectLecturer(lecturer.account_id, !!checked)}
                      disabled={isLoading}
                    />
                    <label htmlFor={lecturer.account_id} className='flex-1 cursor-pointer'>
                      <div className='text-sm font-medium'>{lecturer.name}</div>
                      <div className='text-xs text-greyscale-500'>{lecturer.email}</div>
                      {lecturer.phone && <div className='text-xs text-greyscale-500'>{lecturer.phone}</div>}
                    </label>
                    <div className='flex items-center gap-1'>
                      {lecturer.status === 'Active' ? (
                        <CheckCircle2 className='h-4 w-4 text-green-600' />
                      ) : (
                        <Circle className='h-4 w-4 text-gray-400' />
                      )}
                      <span className='text-xs text-greyscale-500'>{lecturer.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Count */}
          <div className='text-sm text-greyscale-500'>
            Đã chọn: <span className='font-semibold text-foreground'>{selectedLecturers.size}</span> giáo viên
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleAssign} disabled={isLoading || selectedLecturers.size === 0}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {assignToModuleMutation.isPending ? 'Đang gán...' : 'Gán giáo viên'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

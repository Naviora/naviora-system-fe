'use client'

import * as React from 'react'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PaginationState } from '@tanstack/react-table'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useClasses, useCreateClass, useUpdateClass } from '@/hooks/api/principal/use-classes'
import { CreateClassForm, UpdateClassForm } from './class-form'
import { PrincipalClassesTable } from './principal-classes-table'
import { ErrorHandler } from '@/lib/utils/error-handler'
import type {
  CreateClassFormValues,
  UpdateClassFormValues,
  PrincipalClassRow,
  ClassType,
  ClassDto
} from '@/types/principal/classes'

const CLASS_QUERY_DEFAULTS = { limit: 10 }

function mapClassesToPrincipalRows(classes: ClassDto[]): PrincipalClassRow[] {
  return classes.map((cls) => ({
    id: cls.class_id,
    code: cls.class_code,
    name: cls.class_name,
    type: cls.class_type,
    startDate: cls.start_date,
    endDate: cls.end_date,
    isActive: cls.is_active,
    updatedAt: cls.updated_at
  }))
}

function useDebounce<T>(value: T, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => window.clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}

export function PrincipalClassesPageClient() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false)
  const [isModulePromptOpen, setIsModulePromptOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClassType, setSelectedClassType] = useState<ClassType | null>(null)
  const [editingClass, setEditingClass] = useState<PrincipalClassRow | null>(null)
  const [togglingClass, setTogglingClass] = useState<PrincipalClassRow | null>(null)
  const [recentlyCreatedClass, setRecentlyCreatedClass] = useState<ClassDto | null>(null)
  const [pagination, setPagination] = useState<PaginationState>(() => ({
    pageIndex: 0,
    pageSize: CLASS_QUERY_DEFAULTS.limit
  }))

  const debouncedSearch = useDebounce(searchTerm)

  const classesQueryParams = useMemo(
    () => ({
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      q: debouncedSearch || undefined,
      class_type: selectedClassType || undefined
    }),
    [debouncedSearch, pagination.pageIndex, pagination.pageSize, selectedClassType]
  )

  const classesQuery = useClasses(classesQueryParams)

  const createClassMutation = useCreateClass({
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ['classes', 'list'] })
      toast.success('Tạo lớp thành công')
      setIsDialogOpen(false)
      setRecentlyCreatedClass(response.data)
      setIsModulePromptOpen(true)
    },
    onError: (error: unknown) => {
      toast.error(ErrorHandler.getErrorMessage(error))
    }
  })

  const updateClassMutation = useUpdateClass({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['classes', 'list'] })
      toast.success('Cập nhật lớp thành công')
      setIsEditDialogOpen(false)
      setEditingClass(null)
    },
    onError: (error: unknown) => {
      toast.error(ErrorHandler.getErrorMessage(error))
    }
  })

  const classData = classesQuery.data?.data.classes ?? []
  const paginationData = classesQuery.data?.data.pagination

  const mappedRows = mapClassesToPrincipalRows(classData)

  const handleCreateClass = async (data: CreateClassFormValues) => {
    createClassMutation.mutate(data)
  }

  const handleUpdateClass = async (data: UpdateClassFormValues) => {
    if (!editingClass) return
    updateClassMutation.mutate({ classId: editingClass.id, data })
  }

  const handleCloseEditDialog = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      setEditingClass(null)
      updateClassMutation.reset()
    }
  }

  const handleToggleStatus = (classItem: PrincipalClassRow) => {
    setTogglingClass(classItem)
    setIsToggleDialogOpen(true)
  }

  const handleConfirmToggle = () => {
    if (!togglingClass) return
    const newStatus = !togglingClass.isActive
    updateClassMutation.mutate(
      {
        classId: togglingClass.id,
        data: { is_active: newStatus }
      },
      {
        onSuccess: () => {
          const status = newStatus ? 'hoạt động' : 'không hoạt động'
          toast.success(`Lớp đã chuyển sang ${status}`)
          setIsToggleDialogOpen(false)
          setTogglingClass(null)
        }
      }
    )
  }

  const handleCloseToggleDialog = (open: boolean) => {
    setIsToggleDialogOpen(open)
    if (!open) {
      setTogglingClass(null)
    }
  }

  const handleModulePromptChange = (open: boolean) => {
    setIsModulePromptOpen(open)
    if (!open) {
      setRecentlyCreatedClass(null)
    }
  }

  const handleNavigateToModules = () => {
    const targetClassId = recentlyCreatedClass?.class_id
    const query = targetClassId ? `?classId=${targetClassId}` : ''
    router.push(`/principal/modules${query}`)
    handleModulePromptChange(false)
  }

  const handleStayOnClasses = () => {
    handleModulePromptChange(false)
  }

  const renderContent = () => {
    if (classesQuery.isLoading) {
      return (
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className='h-12 w-full rounded-md bg-greyscale-50' />
          ))}
        </div>
      )
    }

    if (classesQuery.isError) {
      return (
        <div className='flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center'>
          <p className='text-sm font-medium text-destructive'>{ErrorHandler.getErrorMessage(classesQuery.error)}</p>
          <Button variant='outline' onClick={() => classesQuery.refetch()}>
            Thử lại
          </Button>
        </div>
      )
    }

    return (
      <PrincipalClassesTable
        data={mappedRows}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        selectedClassType={selectedClassType}
        onClassTypeChange={setSelectedClassType}
        isSearchDisabled={classesQuery.isFetching}
        onEdit={(classItem) => {
          setEditingClass(classItem)
          setIsEditDialogOpen(true)
        }}
        onToggleStatus={handleToggleStatus}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalPages={paginationData?.total_pages ?? 1}
      />
    )
  }

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
      <header className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-semibold text-greyscale-900'>Quản lý lớp học</h1>
          <p className='text-sm text-greyscale-500'>Tạo, chỉnh sửa và quản lý các lớp học trên hệ thống</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} size='sm' className='w-full sm:w-auto'>
          <Plus className='mr-2 h-4 w-4' />
          Tạo lớp
        </Button>
      </header>

      <section className='space-y-4'>{renderContent()}</section>

      {/* Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-xl'>
          <DialogHeader>
            <DialogTitle>Tạo lớp mới</DialogTitle>
            <DialogDescription>Nhập thông tin để tạo một lớp học mới</DialogDescription>
          </DialogHeader>
          <CreateClassForm onSubmit={handleCreateClass} isLoading={createClassMutation.isPending} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className='max-w-xl'>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa lớp</DialogTitle>
            <DialogDescription>Cập nhật thông tin lớp học</DialogDescription>
          </DialogHeader>
          {editingClass && (
            <UpdateClassForm
              initialData={{
                class_name: editingClass.name,
                class_type: editingClass.type,
                start_date: editingClass.startDate,
                end_date: editingClass.endDate,
                is_active: editingClass.isActive
              }}
              onSubmit={handleUpdateClass}
              isLoading={updateClassMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Toggle Status Dialog */}
      <Dialog open={isToggleDialogOpen} onOpenChange={handleCloseToggleDialog}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Thay đổi trạng thái lớp</DialogTitle>
            <DialogDescription>
              {togglingClass
                ? `Bạn có chắc chắn muốn chuyển lớp "${togglingClass.name}" sang ${!togglingClass.isActive ? 'hoạt động' : 'không hoạt động'}?`
                : 'Xác nhận thay đổi trạng thái'}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => handleCloseToggleDialog(false)}
              disabled={updateClassMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmToggle}
              disabled={updateClassMutation.isPending}
              className={togglingClass?.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {updateClassMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang xử lý...
                </>
              ) : togglingClass?.isActive ? (
                'Vô hiệu hóa'
              ) : (
                'Kích hoạt'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prompt to add modules */}
      <Dialog open={isModulePromptOpen} onOpenChange={handleModulePromptChange}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Thêm chuyên đề cho lớp mới?</DialogTitle>
            <DialogDescription>
              {recentlyCreatedClass
                ? `Bạn vừa tạo lớp "${recentlyCreatedClass.class_name}". Bạn có muốn chuyển sang trang Chuyên đề để thêm module cho lớp này không?`
                : 'Bạn có muốn chuyển sang trang Chuyên đề để thêm module cho lớp vừa tạo không?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={handleStayOnClasses}>
              Ở lại trang lớp
            </Button>
            <Button onClick={handleNavigateToModules}>Chuyển tới trang chuyên đề</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

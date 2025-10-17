'use client'

import * as React from 'react'
import { useMemo, useState } from 'react'
import type { OnChangeFn, PaginationState } from '@tanstack/react-table'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { CreateModuleForm } from '@/components/principal/modules/create-module-form'
import { PrincipalModulesTable } from '@/components/principal/modules/principal-modules-table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { LoadingSpinner } from '@/components/ui/loading'
import { Skeleton } from '@/components/ui/skeleton'
import { MODULE_QUERY_DEFAULTS, QUERY_KEYS } from '@/lib/constants'
import { useClasses, useCreateModule, useDeleteModule, useModules, useUpdateModule } from '@/hooks/api/use-modules'
import { ErrorHandler } from '@/lib/utils/error-handler'
import { type CreateModuleFormValues, type ModuleDto } from '@/lib/validations/modules'
import type { PrincipalModuleRow } from '@/types/principal/modules'

function mapModulesToPrincipalRows(modules: ModuleDto[]): PrincipalModuleRow[] {
  return modules.map((module) => ({
    id: module.module_id,
    code: module.module_code,
    name: module.module_name,
    description: module.module_description ?? null,
    banner: module.banner ?? null,
    classId: module.class_id ?? null,
    updatedAt: module.updated_at
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

export function PrincipalModulesPageClient() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingModule, setEditingModule] = useState<PrincipalModuleRow | null>(null)
  const [deletingModuleId, setDeletingModuleId] = useState<string | null>(null)
  const [modulePendingDeletion, setModulePendingDeletion] = useState<PrincipalModuleRow | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>(() => ({
    pageIndex: 0,
    pageSize: MODULE_QUERY_DEFAULTS.limit
  }))

  const debouncedSearch = useDebounce(searchTerm)
  const pageSizeOptions = useMemo(() => {
    const baseOptions = Array.from(new Set([MODULE_QUERY_DEFAULTS.limit, 20, 50]))
    return baseOptions.sort((a, b) => a - b)
  }, [])

  const modulesQueryParams = useMemo(
    () => ({
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      q: debouncedSearch || undefined
    }),
    [debouncedSearch, pagination.pageIndex, pagination.pageSize]
  )

  const modulesQuery = useModules(modulesQueryParams)
  const classesQuery = useClasses({ limit: 100 })

  const createModuleMutation = useCreateModule({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES })
      toast.success('Tạo chuyên đề thành công')
      setIsDialogOpen(false)
    },
    onError: (error) => {
      toast.error(ErrorHandler.getErrorMessage(error))
    }
  })

  const deleteModuleMutation = useDeleteModule({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES })
      toast.success('Đã xóa chuyên đề thành công')
      setIsDeleteDialogOpen(false)
      setModulePendingDeletion(null)
    },
    onError: (error) => {
      toast.error(ErrorHandler.getErrorMessage(error))
    }
  })

  const updateModuleMutation = useUpdateModule({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES })
      toast.success('Cập nhật chuyên đề thành công')
      setIsEditDialogOpen(false)
      setEditingModule(null)
    },
    onError: (error) => {
      toast.error(ErrorHandler.getErrorMessage(error))
    }
  })

  const handleCreateModule = async (values: CreateModuleFormValues) => {
    await createModuleMutation.mutateAsync(values)
  }

  const handleViewModule = (module: PrincipalModuleRow) => {
    router.push(`/principal/modules/${module.id}`)
  }

  const handleEditModule = (module: PrincipalModuleRow) => {
    setEditingModule(module)
    setIsEditDialogOpen(true)
  }

  const handleDeleteModule = (module: PrincipalModuleRow) => {
    setModulePendingDeletion(module)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDeleteModule = async () => {
    if (!modulePendingDeletion) {
      return
    }

    try {
      setDeletingModuleId(modulePendingDeletion.id)
      await deleteModuleMutation.mutateAsync(modulePendingDeletion.id)
    } finally {
      setDeletingModuleId(null)
    }
  }

  const handleCloseDeleteDialog = (open: boolean) => {
    setIsDeleteDialogOpen(open)

    if (!open) {
      setModulePendingDeletion(null)
      setDeletingModuleId(null)
      deleteModuleMutation.reset()
    }
  }

  const handleCloseEditDialog = (open: boolean) => {
    setIsEditDialogOpen(open)

    if (!open) {
      setEditingModule(null)
      updateModuleMutation.reset()
    }
  }

  const handleUpdateModule = async (values: CreateModuleFormValues) => {
    if (!editingModule) {
      return
    }

    await updateModuleMutation.mutateAsync({
      moduleId: editingModule.id,
      data: values
    })
  }

  const modules = useMemo(() => mapModulesToPrincipalRows(modulesQuery.data?.data ?? []), [modulesQuery.data?.data])
  const modulesPagination = modulesQuery.data?.pagination
  const totalRecords = modulesPagination?.total_records ?? modules.length
  const derivedPageCount =
    modulesPagination?.total_pages ?? (pagination.pageSize ? Math.ceil(totalRecords / pagination.pageSize) : 0)
  const safePageCount = Math.max(derivedPageCount, totalRecords === 0 ? 1 : 0)

  const handlePaginationChange = React.useCallback<OnChangeFn<PaginationState>>((updater) => {
    setPagination((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchTerm(value)
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0
    }))
  }, [])

  React.useEffect(() => {
    const apiPagination = modulesPagination
    if (!apiPagination) {
      return
    }

    const nextPageIndex = Math.max(apiPagination.current_page - 1, 0)
    const nextPageSize = apiPagination.limit ?? MODULE_QUERY_DEFAULTS.limit

    setPagination((prev) => {
      if (prev.pageIndex === nextPageIndex && prev.pageSize === nextPageSize) {
        return prev
      }

      return {
        pageIndex: nextPageIndex,
        pageSize: nextPageSize
      }
    })
  }, [modulesPagination])

  React.useEffect(() => {
    if (safePageCount === 0) {
      return
    }

    setPagination((prev) => {
      if (prev.pageIndex < safePageCount) {
        return prev
      }

      return {
        ...prev,
        pageIndex: Math.max(safePageCount - 1, 0)
      }
    })
  }, [safePageCount])

  const editFormDefaults = useMemo(() => {
    if (!editingModule) {
      return undefined
    }

    return {
      module_code: editingModule.code,
      module_name: editingModule.name,
      module_description: editingModule.description ?? '',
      class_id: editingModule.classId ?? ''
    }
  }, [editingModule])

  const renderContent = () => {
    if (modulesQuery.isLoading) {
      return (
        <div className='space-y-2'>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className='h-12 w-full rounded-md bg-greyscale-50' />
          ))}
        </div>
      )
    }

    if (modulesQuery.isError) {
      return (
        <div className='flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center'>
          <p className='text-sm font-medium text-destructive'>{ErrorHandler.getErrorMessage(modulesQuery.error)}</p>
          <Button variant='outline' onClick={() => modulesQuery.refetch()}>
            Thử lại
          </Button>
        </div>
      )
    }

    return (
      <PrincipalModulesTable
        data={modules}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        isSearchDisabled={modulesQuery.isFetching}
        onViewModule={handleViewModule}
        onEditModule={handleEditModule}
        onDeleteModule={handleDeleteModule}
        deletingModuleId={deletingModuleId}
        isDeleteLoading={deleteModuleMutation.isPending}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        pageCount={safePageCount}
        totalItems={totalRecords}
        isPaginationDisabled={modulesQuery.isFetching}
        pageSizeOptions={pageSizeOptions}
      />
    )
  }

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
      <header className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-semibold text-greyscale-900'>Chuyên đề toàn trường</h1>
          <p className='text-sm text-greyscale-500'>Theo dõi và điều phối các chuyên đề trên toàn hệ thống.</p>
        </div>

        <Button type='button' size='sm' className='w-full sm:w-auto' onClick={() => setIsDialogOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Tạo chuyên đề
        </Button>
      </header>

      <section className='space-y-4'>{renderContent()}</section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-xl'>
          <DialogHeader>
            <DialogTitle>Tạo chuyên đề mới</DialogTitle>
            <DialogDescription>
              Điền thông tin chi tiết của chuyên đề. Bạn có thể cập nhật lại bất cứ lúc nào sau này.
            </DialogDescription>
          </DialogHeader>

          {classesQuery.isLoading ? (
            <div className='flex items-center justify-center py-10'>
              <LoadingSpinner />
            </div>
          ) : classesQuery.isError ? (
            <div className='flex flex-col gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-sm text-destructive'>
              <p>{ErrorHandler.getErrorMessage(classesQuery.error)}</p>
              <Button variant='outline' onClick={() => classesQuery.refetch()} className='w-fit'>
                Tải lại danh sách lớp
              </Button>
            </div>
          ) : (
            <CreateModuleForm
              classes={classesQuery.data?.data ?? []}
              isSubmitting={createModuleMutation.isPending}
              onSubmit={handleCreateModule}
              submitLabel='Tạo chuyên đề'
              pendingLabel='Đang tạo...'
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className='max-w-xl'>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa chuyên đề</DialogTitle>
            <DialogDescription>Cập nhật thông tin chuyên đề và lưu thay đổi.</DialogDescription>
          </DialogHeader>

          {classesQuery.isLoading ? (
            <div className='flex items-center justify-center py-10'>
              <LoadingSpinner />
            </div>
          ) : classesQuery.isError ? (
            <div className='flex flex-col gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-sm text-destructive'>
              <p>{ErrorHandler.getErrorMessage(classesQuery.error)}</p>
              <Button variant='outline' onClick={() => classesQuery.refetch()} className='w-fit'>
                Tải lại danh sách lớp
              </Button>
            </div>
          ) : (
            <CreateModuleForm
              classes={classesQuery.data?.data ?? []}
              isSubmitting={updateModuleMutation.isPending}
              onSubmit={handleUpdateModule}
              submitLabel='Lưu thay đổi'
              pendingLabel='Đang lưu...'
              defaultValues={editFormDefaults}
              shouldResetOnSubmit={false}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Xóa chuyên đề</DialogTitle>
            <DialogDescription>
              {modulePendingDeletion
                ? `Hành động này sẽ xóa vĩnh viễn chuyên đề "${modulePendingDeletion.name}" khỏi hệ thống.`
                : 'Bạn có chắc chắn muốn xóa chuyên đề này?'}
            </DialogDescription>
          </DialogHeader>

          {deleteModuleMutation.isError ? (
            <p className='rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
              {ErrorHandler.getErrorMessage(deleteModuleMutation.error)}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleCloseDeleteDialog(false)}
              disabled={deleteModuleMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              type='button'
              variant='destructive'
              onClick={handleConfirmDeleteModule}
              disabled={deleteModuleMutation.isPending}
            >
              {deleteModuleMutation.isPending ? 'Đang xóa...' : 'Xóa chuyên đề'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRoleOptions } from '@/hooks/api/use-roles'
import { useAccounts, useCreateAccount, useUpdateAccountRole } from '@/hooks/api/use-account'
import { type UserRole } from '@/lib/constants/roles'
import { PAGINATION } from '@/lib/constants/config'
import { toast } from 'sonner'
import {
  AccountFilters,
  AccountTable,
  CreateAccountDialog,
  AssignRoleDialog,
  type AccountRow,
  type CreateAccountFormData
} from '@/components/admin/account'

export default function AccountPage() {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [assigning, setAssigning] = useState<{ open: boolean; account?: AccountRow }>({ open: false })
  const [page, setPage] = useState(0)

  // Role options from API (mapped to nice labels already)
  const { roleOptions } = useRoleOptions()

  // Reset pagination to first page when filters change
  useEffect(() => {
    setPage(0)
  }, [query, roleFilter])

  // Build API request params
  const requestParams = useMemo(
    () => ({
      page: page + 1, // API uses 1-based pagination
      limit: PAGINATION.DEFAULT_PAGE_SIZE,
      search: query.trim() || undefined,
      filters: {
        ...(roleFilter && { role: roleFilter })
      }
    }),
    [page, query, roleFilter]
  )

  // Fetch accounts from API
  const { data: accountsData, isLoading, isError, error, isFetching, isPlaceholderData } = useAccounts(requestParams)

  // Mutations
  const createAccountMutation = useCreateAccount({
    onSuccess: () => {
      toast.success('Tạo tài khoản thành công')
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo tài khoản')
    }
  })

  const updateRoleMutation = useUpdateAccountRole({
    onSuccess: () => {
      toast.success('Cập nhật vai trò thành công')
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật vai trò')
    }
  })

  const handleCreateAccount = async (formData: CreateAccountFormData) => {
    // Map role (UserRole string) to role_id (number)
    const selectedRole = roleOptions.find((r) => r.value === formData.role)
    if (!selectedRole) {
      toast.error('Vai trò không hợp lệ')
      return
    }

    await createAccountMutation.mutateAsync({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role_id: selectedRole.id
    })
  }

  const handleAssignRole = async (accountId: string, role: UserRole) => {
    await updateRoleMutation.mutateAsync({ accountId, role })
  }

  // Extract data and pagination info
  const accounts = accountsData?.data ?? []
  const hasMore = accountsData?.pagination?.hasNext ?? false

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
      <header className='space-y-1'>
        <h1 className='text-2xl font-semibold text-greyscale-900 sm:text-3xl'>Quản lý tài khoản</h1>
        <p className='text-sm text-greyscale-500'>Quản lý tài khoản của hệ thống</p>
      </header>

      <section className='flex flex-col gap-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <AccountFilters
            query={query}
            onQueryChange={setQuery}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            roleOptions={roleOptions}
          />

          <CreateAccountDialog roleOptions={roleOptions} onSubmit={handleCreateAccount}>
            <Button>Tạo tài khoản</Button>
          </CreateAccountDialog>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <div className='text-greyscale-500'>Đang tải...</div>
          </div>
        ) : isError ? (
          <div className='flex items-center justify-center py-8'>
            <div className='text-error'>Lỗi: {error?.message || 'Có lỗi xảy ra'}</div>
          </div>
        ) : (
          <>
            <AccountTable
              data={accounts as AccountRow[]}
              onAssignRole={(account) => setAssigning({ open: true, account })}
            />

            <div className='flex flex-col gap-4 border-t border-greyscale-200 pt-4 sm:flex-row sm:items-center sm:justify-between'>
              <span className='text-sm text-greyscale-600'>Trang hiện tại: {page + 1}</span>
              <div className='flex items-center gap-2'>
                <Button onClick={() => setPage((old) => Math.max(old - 1, 0))} disabled={page === 0} variant='outline'>
                  Trang trước
                </Button>
                <Button
                  onClick={() => {
                    if (!isPlaceholderData && hasMore) {
                      setPage((old) => old + 1)
                    }
                  }}
                  disabled={isPlaceholderData || !hasMore}
                  variant='outline'
                >
                  Trang sau
                </Button>
                {isFetching ? <span className='text-sm text-greyscale-500'>Đang tải...</span> : null}
              </div>
            </div>
          </>
        )}
      </section>

      <AssignRoleDialog
        open={assigning.open}
        onOpenChange={(o) => setAssigning((s) => ({ ...s, open: o }))}
        account={assigning.account}
        roleOptions={roleOptions}
        onSave={handleAssignRole}
      />
    </div>
  )
}

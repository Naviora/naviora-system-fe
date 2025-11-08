'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { useRoleOptions } from '@/hooks/api/use-roles'
import { type UserRole } from '@/lib/constants/roles'
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

  // Role options from API (mapped to nice labels already)
  const { roleOptions } = useRoleOptions()

  // Mock data (replace with API integration later)
  const data = useMemo<AccountRow[]>(
    () => [
      { id: '1', name: 'Nguyễn Văn A', email: 'a@naviora.dev', role: 'Admin', status: 'active' },
      { id: '2', name: 'Trần Thị B', email: 'b@naviora.dev', role: 'Lecturer', status: 'active' },
      { id: '3', name: 'Lê Văn C', email: 'c@naviora.dev', role: 'Student', status: 'inactive' }
    ],
    []
  )

  const filteredData = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter((row) => {
      const matchesQuery = !q || row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q)
      const matchesRole = !roleFilter || row.role === (roleFilter as UserRole)
      return matchesQuery && matchesRole
    })
  }, [data, query, roleFilter])

  const handleCreateAccount = async (formData: CreateAccountFormData) => {
    // TODO: Call API to create account
    console.log('Creating account:', formData)
  }

  const handleAssignRole = async (accountId: string, role: UserRole) => {
    // TODO: Call API to assign role
    console.log('Assigning role:', { accountId, role })
  }

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

        <AccountTable data={filteredData} onAssignRole={(account) => setAssigning({ open: true, account })} />
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

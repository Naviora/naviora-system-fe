'use client'
import React from 'react'
import { useState, useMemo } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DataTable } from '@/components/ui/data-table'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useRoleOptions } from '@/hooks/api/use-roles'
import { DEFAULT_USER_ROLE, USER_ROLE_VALUES, type UserRole } from '@/lib/constants/roles'

type AccountRow = {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'active' | 'inactive'
}

const createAccountSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên'),
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Bao gồm chữ hoa, chữ thường và số'),
  role: z.enum(USER_ROLE_VALUES)
})

type CreateAccountFormData = z.infer<typeof createAccountSchema>

export default function AccountPage() {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [assigning, setAssigning] = useState<{ open: boolean; account?: AccountRow }>({ open: false })
  const ALL_ROLES_VALUE = '__all__'

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

  const columns = useMemo<ColumnDef<AccountRow>[]>(
    () => [
      { accessorKey: 'name', header: 'Họ và tên' },
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'role',
        header: 'Vai trò',
        cell: ({ row }) => (
          <span className='inline-flex items-center rounded-sm bg-greyscale-25 px-2 py-0.5 text-xs text-greyscale-700'>
            {row.original.role}
          </span>
        )
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => (
          <span
            className={
              row.original.status === 'active'
                ? 'inline-flex items-center rounded-sm bg-success-0 text-success px-2 py-0.5 text-xs'
                : 'inline-flex items-center rounded-sm bg-error-0 text-error px-2 py-0.5 text-xs'
            }
          >
            {row.original.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
          </span>
        )
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                Thao tác
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setAssigning({ open: true, account: row.original })}>
                Gán vai trò
              </DropdownMenuItem>
              <DropdownMenuItem>Vô hiệu hóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    []
  )

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
      <header className='space-y-1'>
        <h1 className='text-2xl font-semibold text-greyscale-900 sm:text-3xl'>Quản lý tài khoản</h1>
        <p className='text-sm text-greyscale-500'>Quản lý tài khoản của hệ thống</p>
      </header>

      <section className='flex flex-col gap-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
            <div className='flex items-center gap-2'>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Tìm theo tên, email...'
                className='w-[260px]'
              />
            </div>
            <div className='flex items-center gap-2'>
              <Select
                value={roleFilter ? roleFilter : ALL_ROLES_VALUE}
                onValueChange={(v) => setRoleFilter(v === ALL_ROLES_VALUE ? '' : v)}
              >
                <SelectTrigger className='min-w-[180px]'>
                  <SelectValue placeholder='Lọc theo vai trò' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_ROLES_VALUE}>Tất cả vai trò</SelectItem>
                  {roleOptions.length > 0
                    ? roleOptions.map((r) => (
                        <SelectItem key={r.id} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))
                    : USER_ROLE_VALUES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <CreateAccountDialog roleOptions={roleOptions}>
            <Button>Tạo tài khoản</Button>
          </CreateAccountDialog>
        </div>

        <DataTable columns={columns} data={filteredData} />
      </section>

      <AssignRoleDialog
        open={assigning.open}
        onOpenChange={(o) => setAssigning((s) => ({ ...s, open: o }))}
        account={assigning.account}
        roleOptions={roleOptions}
      />
    </div>
  )
}

function CreateAccountDialog({
  children,
  roleOptions
}: {
  children: React.ReactNode
  roleOptions: { id: number; value: UserRole; label: string }[]
}) {
  const form = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { name: '', email: '', password: '', role: DEFAULT_USER_ROLE }
  })

  const [open, setOpen] = useState(false)

  const onSubmit = (values: CreateAccountFormData) => {
    void values
    // TODO: integrate API to create account
    // temporary: close dialog
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[520px]'>
        <DialogHeader>
          <DialogTitle>Tạo tài khoản</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className='grid gap-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập họ và tên' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Chọn vai trò' />
                      </SelectTrigger>
                      <SelectContent>
                        {(roleOptions.length
                          ? roleOptions
                          : USER_ROLE_VALUES.map((r) => ({ id: r, value: r, label: r }))
                        ).map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button type='submit'>Tạo</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function AssignRoleDialog({
  open,
  onOpenChange,
  account,
  roleOptions
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: AccountRow
  roleOptions: { id: number; value: UserRole; label: string }[]
}) {
  const [role, setRole] = useState<UserRole | ''>('')

  const onSave = () => {
    if (!account || !role) return
    // TODO: integrate API to update role for account.id
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[480px]'>
        <DialogHeader>
          <DialogTitle>Gán vai trò</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4'>
          <div className='text-sm text-greyscale-600'>
            Tài khoản: <span className='font-medium text-foreground'>{account?.name}</span>
          </div>
          <div className='grid gap-2'>
            <label className='text-sm font-medium text-foreground'>Vai trò</label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={account?.role ?? 'Chọn vai trò'} />
              </SelectTrigger>
              <SelectContent>
                {(roleOptions.length ? roleOptions : USER_ROLE_VALUES.map((r) => ({ id: r, value: r, label: r }))).map(
                  (r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' type='button' onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type='button' onClick={onSave} disabled={!role}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

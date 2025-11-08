'use client'
import React from 'react'
import { useState, useMemo, useEffect } from 'react'
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

// Utility functions for email and password generation
const removeVietnameseDiacritics = (str: string): string => {
  const diacriticsMap: Record<string, string> = {
    à: 'a',
    á: 'a',
    ạ: 'a',
    ả: 'a',
    ã: 'a',
    â: 'a',
    ầ: 'a',
    ấ: 'a',
    ậ: 'a',
    ẩ: 'a',
    ẫ: 'a',
    ă: 'a',
    ằ: 'a',
    ắ: 'a',
    ặ: 'a',
    ẳ: 'a',
    ẵ: 'a',
    è: 'e',
    é: 'e',
    ẹ: 'e',
    ẻ: 'e',
    ẽ: 'e',
    ê: 'e',
    ề: 'e',
    ế: 'e',
    ệ: 'e',
    ể: 'e',
    ễ: 'e',
    ì: 'i',
    í: 'i',
    ị: 'i',
    ỉ: 'i',
    ĩ: 'i',
    ò: 'o',
    ó: 'o',
    ọ: 'o',
    ỏ: 'o',
    õ: 'o',
    ô: 'o',
    ồ: 'o',
    ố: 'o',
    ộ: 'o',
    ổ: 'o',
    ỗ: 'o',
    ơ: 'o',
    ờ: 'o',
    ớ: 'o',
    ợ: 'o',
    ở: 'o',
    ỡ: 'o',
    ù: 'u',
    ú: 'u',
    ụ: 'u',
    ủ: 'u',
    ũ: 'u',
    ư: 'u',
    ừ: 'u',
    ứ: 'u',
    ự: 'u',
    ử: 'u',
    ữ: 'u',
    ỳ: 'y',
    ý: 'y',
    ỵ: 'y',
    ỷ: 'y',
    ỹ: 'y',
    đ: 'd',
    À: 'A',
    Á: 'A',
    Ạ: 'A',
    Ả: 'A',
    Ã: 'A',
    Â: 'A',
    Ầ: 'A',
    Ấ: 'A',
    Ậ: 'A',
    Ẩ: 'A',
    Ẫ: 'A',
    Ă: 'A',
    Ằ: 'A',
    Ắ: 'A',
    Ặ: 'A',
    Ẳ: 'A',
    Ẵ: 'A',
    È: 'E',
    É: 'E',
    Ẹ: 'E',
    Ẻ: 'E',
    Ẽ: 'E',
    Ê: 'E',
    Ề: 'E',
    Ế: 'E',
    Ệ: 'E',
    Ể: 'E',
    Ễ: 'E',
    Ì: 'I',
    Í: 'I',
    Ị: 'I',
    Ỉ: 'I',
    Ĩ: 'I',
    Ò: 'O',
    Ó: 'O',
    Ọ: 'O',
    Ỏ: 'O',
    Õ: 'O',
    Ô: 'O',
    Ồ: 'O',
    Ố: 'O',
    Ộ: 'O',
    Ổ: 'O',
    Ỗ: 'O',
    Ơ: 'O',
    Ờ: 'O',
    Ớ: 'O',
    Ợ: 'O',
    Ở: 'O',
    Ỡ: 'O',
    Ù: 'U',
    Ú: 'U',
    Ụ: 'U',
    Ủ: 'U',
    Ũ: 'U',
    Ư: 'U',
    Ừ: 'U',
    Ứ: 'U',
    Ự: 'U',
    Ử: 'U',
    Ữ: 'U',
    Ỳ: 'Y',
    Ý: 'Y',
    Ỵ: 'Y',
    Ỷ: 'Y',
    Ỹ: 'Y',
    Đ: 'D'
  }

  return str
    .split('')
    .map((char) => diacriticsMap[char] || char)
    .join('')
    .toLowerCase()
}

const generateEmailFromName = (name: string): string => {
  if (!name.trim()) return ''

  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''

  // Lấy tên (phần cuối cùng)
  const lastName = removeVietnameseDiacritics(parts[parts.length - 1])

  // Lấy chữ cái đầu của các phần còn lại (họ và tên đệm)
  const initials = parts
    .slice(0, -1)
    .map((part) => removeVietnameseDiacritics(part)[0])
    .join('')

  // Format: tên + chữ cái đầu của họ và tên đệm
  const email = `${lastName}${initials}@gmail.com`

  return email
}

const generateRandomPassword = (): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const special = '!@#$%^&*'

  // Đảm bảo có ít nhất 1 ký tự từ mỗi loại
  let password = ''
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += special[Math.floor(Math.random() * special.length)]

  // Thêm các ký tự ngẫu nhiên để đủ 12 ký tự
  const allChars = lowercase + uppercase + numbers + special
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Shuffle password để không có pattern rõ ràng
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}

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
  const [emailManuallyEdited, setEmailManuallyEdited] = useState(false)
  const [passwordManuallyEdited, setPasswordManuallyEdited] = useState(false)

  const nameValue = form.watch('name')

  // Auto-generate email and password when name changes
  useEffect(() => {
    if (!open) return // Don't auto-generate when dialog is closed

    if (nameValue && nameValue.trim()) {
      // Auto-generate email if not manually edited
      if (!emailManuallyEdited) {
        const generatedEmail = generateEmailFromName(nameValue)
        form.setValue('email', generatedEmail, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        })
      }

      // Auto-generate password if not manually edited or if password is empty
      const currentPassword = form.getValues('password')
      if (!passwordManuallyEdited || !currentPassword) {
        if (!currentPassword) {
          // Reset flag if password was cleared, allowing regeneration
          setPasswordManuallyEdited(false)
        }
        const generatedPassword = generateRandomPassword()
        form.setValue('password', generatedPassword, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        })
      }
    }
  }, [nameValue, open, emailManuallyEdited, passwordManuallyEdited, form])

  // Reset form and flags when dialog opens/closes
  useEffect(() => {
    if (!open) {
      form.reset({ name: '', email: '', password: '', role: DEFAULT_USER_ROLE })
      setEmailManuallyEdited(false)
      setPasswordManuallyEdited(false)
    }
  }, [open, form])

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
                    <Input
                      type='email'
                      placeholder='name@example.com'
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        setEmailManuallyEdited(true)
                      }}
                    />
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
                    <Input
                      type='password'
                      placeholder='********'
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        setPasswordManuallyEdited(true)
                      }}
                    />
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

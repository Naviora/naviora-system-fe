'use client'

import React, { useState, useEffect, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, FileSpreadsheet, X } from 'lucide-react'
import { DEFAULT_USER_ROLE, USER_ROLE_VALUES, type UserRole } from '@/lib/constants/roles'
import { createAccountSchema, type CreateAccountFormData, type ImportAccountData } from './account-types'
import { generateEmailFromName, generateRandomPassword, readExcelFile } from './account-utils'
import { useImportAccounts } from '@/hooks/api/use-account'
import { toast } from 'sonner'

type RoleOption = { id: number; value: UserRole; label: string }

interface CreateAccountDialogProps {
  children: React.ReactNode
  roleOptions: RoleOption[]
  onSubmit?: (data: CreateAccountFormData) => Promise<void> | void
  onImport?: (accounts: ImportAccountData[]) => Promise<void> | void
}

export function CreateAccountDialog({ children, roleOptions, onSubmit, onImport }: CreateAccountDialogProps) {
  const form = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { name: '', email: '', password: '', role: DEFAULT_USER_ROLE }
  })

  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('manual')
  const [emailManuallyEdited, setEmailManuallyEdited] = useState(false)
  const [passwordManuallyEdited, setPasswordManuallyEdited] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Import Excel state
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importAccounts, setImportAccounts] = useState<Array<{ name: string; email: string; row: number }>>([])
  const [importRole, setImportRole] = useState<UserRole>(DEFAULT_USER_ROLE)
  const [isReadingFile, setIsReadingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const importMutation = useImportAccounts({
    onSuccess: (data) => {
      toast.success(`Import thành công`)
      if (data.errors && data.errors.length > 0) {
        const errorMessages = data.errors.map((e) => `Dòng ${e.row}: ${e.error}`).join('\n')
        toast.error(`Lỗi chi tiết:\n${errorMessages}`)
      }
      setOpen(false)
      resetImportState()
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi import tài khoản')
    }
  })

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
      resetImportState()
      setActiveTab('manual')
    }
  }, [open, form])

  const resetImportState = () => {
    setImportFile(null)
    setImportAccounts([])
    setImportRole(DEFAULT_USER_ROLE)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ]
    const validExtensions = ['.xlsx', '.xls', '.csv']

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      toast.error('Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV')
      return
    }

    setImportFile(file)
    setIsReadingFile(true)

    try {
      const accounts = await readExcelFile(file)
      if (accounts.length === 0) {
        toast.error('Không tìm thấy dữ liệu trong file. Vui lòng kiểm tra lại.')
        setImportFile(null)
        return
      }
      setImportAccounts(accounts)
      toast.success(`Đã đọc ${accounts.length} tài khoản từ file`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể đọc file Excel')
      setImportFile(null)
      setImportAccounts([])
    } finally {
      setIsReadingFile(false)
    }
  }

  const handleImportSubmit = async () => {
    if (importAccounts.length === 0) {
      toast.error('Vui lòng chọn file Excel để import')
      return
    }

    // Map role (UserRole string) to role_id (number)
    const selectedRole = roleOptions.find((r) => r.value === importRole)
    if (!selectedRole) {
      toast.error('Vai trò không hợp lệ')
      return
    }

    // Map accounts with role_id and auto-generate password for each account
    const accountsData: ImportAccountData[] = importAccounts.map((acc) => ({
      name: acc.name,
      email: acc.email,
      password: generateRandomPassword(), // Auto-generate password for each account
      role_id: selectedRole.id
    }))

    if (onImport) {
      await onImport(accountsData)
    } else {
      importMutation.mutate(accountsData)
    }
  }

  const handleSubmit = async (values: CreateAccountFormData) => {
    setIsSubmitting(true)
    try {
      if (onSubmit) {
        await onSubmit(values)
      }
      setOpen(false)
    } catch (error) {
      console.error('Error creating account:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Tạo tài khoản</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='manual'>Tạo thủ công</TabsTrigger>
            <TabsTrigger value='import'>Import Excel</TabsTrigger>
          </TabsList>

          <TabsContent value='manual' className='mt-4'>
            <Form {...form}>
              <form className='grid gap-4' onSubmit={form.handleSubmit(handleSubmit)}>
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
                  <Button type='button' variant='outline' onClick={() => setOpen(false)} disabled={isSubmitting}>
                    Hủy
                  </Button>
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Đang tạo...' : 'Tạo'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value='import' className='mt-4 space-y-4'>
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium mb-2 block'>Chọn file Excel</label>
                <div className='flex items-center gap-2'>
                  <Input
                    ref={fileInputRef}
                    type='file'
                    accept='.xlsx,.xls,.csv'
                    onChange={handleFileSelect}
                    className='hidden'
                    id='excel-file-input'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isReadingFile}
                    className='flex items-center gap-2'
                  >
                    <Upload className='h-4 w-4' />
                    {isReadingFile ? 'Đang đọc...' : 'Chọn file'}
                  </Button>
                  {importFile && (
                    <div className='flex items-center gap-2 text-sm text-greyscale-600'>
                      <FileSpreadsheet className='h-4 w-4' />
                      <span>{importFile.name}</span>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={resetImportState}
                        className='h-6 w-6 p-0'
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  )}
                </div>
                <p className='text-xs text-greyscale-500 mt-1'>
                  File Excel cần có 2 cột: <strong>Name</strong> (hoặc Tên) và <strong>Email</strong>
                </p>
              </div>

              {importAccounts.length > 0 && (
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <label className='text-sm font-medium'>Vai trò</label>
                    <span className='text-xs text-greyscale-500'>{importAccounts.length} tài khoản</span>
                  </div>
                  <Select value={importRole} onValueChange={(value) => setImportRole(value as UserRole)}>
                    <SelectTrigger>
                      <SelectValue />
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

                  <div className='border border-greyscale-200 rounded-lg p-3 max-h-60 overflow-y-auto'>
                    <div className='text-xs font-medium text-greyscale-500 mb-2'>
                      Preview ({importAccounts.length} tài khoản):
                    </div>
                    <div className='space-y-1'>
                      {importAccounts.slice(0, 10).map((acc, idx) => (
                        <div
                          key={idx}
                          className='text-xs text-greyscale-700 py-1 border-b border-greyscale-100 last:border-0'
                        >
                          <span className='font-medium'>{acc.name}</span> -{' '}
                          <span className='text-greyscale-500'>{acc.email}</span>
                        </div>
                      ))}
                      {importAccounts.length > 10 && (
                        <div className='text-xs text-greyscale-500 pt-1'>
                          ... và {importAccounts.length - 10} tài khoản khác
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setOpen(false)}
                  disabled={importMutation.isPending}
                >
                  Hủy
                </Button>
                <Button
                  type='button'
                  onClick={handleImportSubmit}
                  disabled={importAccounts.length === 0 || importMutation.isPending}
                >
                  {importMutation.isPending ? 'Đang import...' : `Import ${importAccounts.length} tài khoản`}
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { DEFAULT_USER_ROLE, USER_ROLE_VALUES, type UserRole } from '@/lib/constants/roles'
import { createAccountSchema, type CreateAccountFormData } from './account-types'
import { generateEmailFromName, generateRandomPassword } from './account-utils'

type RoleOption = { id: number; value: UserRole; label: string }

interface CreateAccountDialogProps {
  children: React.ReactNode
  roleOptions: RoleOption[]
  onSubmit?: (data: CreateAccountFormData) => Promise<void> | void
}

export function CreateAccountDialog({ children, roleOptions, onSubmit }: CreateAccountDialogProps) {
  const form = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { name: '', email: '', password: '', role: DEFAULT_USER_ROLE }
  })

  const [open, setOpen] = useState(false)
  const [emailManuallyEdited, setEmailManuallyEdited] = useState(false)
  const [passwordManuallyEdited, setPasswordManuallyEdited] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      <DialogContent className='sm:max-w-[520px]'>
        <DialogHeader>
          <DialogTitle>Tạo tài khoản</DialogTitle>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  )
}

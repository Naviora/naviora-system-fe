'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useUpdateProfile } from '@/hooks/api/use-profile'
import type { UserProfile } from '@/types/api/profile'

const profileFormSchema = z.object({
  name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(100, 'Họ tên không vượt quá 100 ký tự'),
  email: z.string().email('Email không hợp lệ').readonly(),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại phải từ 10-11 số'),
  address: z.string().max(200, 'Địa chỉ không vượt quá 200 ký tự'),
  dateOfBirth: z.string().refine((date) => {
    if (!date) return true
    return !isNaN(Date.parse(date))
  }, 'Định dạng ngày không hợp lệ'),
  gender: z.enum(['male', 'female', 'other'])
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
  profile: UserProfile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const updateMutation = useUpdateProfile()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      dateOfBirth: profile.date_of_birth,
      gender: profile.gender
    }
  })

  useEffect(() => {
    form.reset({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      dateOfBirth: profile.date_of_birth,
      gender: profile.gender
    })
  }, [profile, form])

  async function onSubmit(data: ProfileFormValues) {
    try {
      await updateMutation.mutateAsync({
        name: data.name,
        phone: data.phone,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender
      })
      toast.success('Cập nhật thông tin thành công')
    } catch (error) {
      toast.error('Cập nhật thất bại')
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Họ tên */}
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

          {/* Email (Read-only) */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Email' {...field} disabled />
                </FormControl>
                <FormDescription>Email không thể thay đổi</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Số điện thoại */}
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập số điện thoại' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Giới tính */}
          <FormField
            control={form.control}
            name='gender'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn giới tính' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='male'>Nam</SelectItem>
                    <SelectItem value='female'>Nữ</SelectItem>
                    <SelectItem value='other'>Khác</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngày sinh */}
          <FormField
            control={form.control}
            name='dateOfBirth'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày sinh</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Địa chỉ */}
          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập địa chỉ' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Nút lưu */}
        <div className='flex gap-2 justify-end'>
          <Button type='button' variant='outline' onClick={() => form.reset()} disabled={updateMutation.isPending}>
            Đặt lại
          </Button>
          <Button type='submit' disabled={updateMutation.isPending} className='gap-2'>
            {updateMutation.isPending && <Loader2 className='w-4 h-4 animate-spin' />}
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

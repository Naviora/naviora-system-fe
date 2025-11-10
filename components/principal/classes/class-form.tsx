'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, addDays } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import type { UpdateClassFormValues, CreateClassFormValues, ClassType } from '@/types/principal/classes'

interface ApiErrorDetail {
  property: string
  code: string
  message: string
}

interface ApiError {
  response?: {
    data?: {
      details?: ApiErrorDetail[]
      message?: string
    }
  }
  message?: string
}

const getTodayStartOfDay = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

const createClassSchema = z
  .object({
    class_code: z
      .string()
      .min(1, 'Mã lớp không được để trống')
      .min(3, 'Mã lớp phải có ít nhất 3 ký tự')
      .max(20, 'Mã lớp không được vượt quá 20 ký tự'),
    class_name: z
      .string()
      .min(1, 'Tên lớp không được để trống')
      .min(3, 'Tên lớp phải có ít nhất 3 ký tự')
      .max(100, 'Tên lớp không được vượt quá 100 ký tự'),
    class_type: z.enum(['school', 'city', 'province', 'national', 'international'] as const, {
      message: 'Vui lòng chọn loại lớp'
    }),
    start_date: z
      .date({
        message: 'Vui lòng chọn ngày bắt đầu'
      })
      .refine((date) => date >= getTodayStartOfDay(), {
        message: 'Ngày bắt đầu không được trước hôm nay'
      }),
    end_date: z.date({
      message: 'Vui lòng chọn ngày kết thúc'
    })
  })
  .refine((data) => data.end_date > data.start_date, {
    message: 'Ngày kết thúc phải sau ngày bắt đầu',
    path: ['end_date']
  })

const updateClassSchema = z.object({
  class_name: z
    .string()
    .min(1, 'Tên lớp không được để trống')
    .min(3, 'Tên lớp phải có ít nhất 3 ký tự')
    .max(100, 'Tên lớp không được vượt quá 100 ký tự')
    .optional()
    .or(z.literal('')),
  class_type: z.enum(['school', 'city', 'province', 'national', 'international'] as const).optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  is_active: z.boolean().optional()
})

type CreateClassFormData = z.infer<typeof createClassSchema>
type UpdateClassFormData = z.infer<typeof updateClassSchema>

const classTypeOptions: Array<{ value: ClassType; label: string }> = [
  { value: 'school', label: 'Trường học' },
  { value: 'city', label: 'Thành phố' },
  { value: 'province', label: 'Tỉnh' },
  { value: 'national', label: 'Quốc gia' },
  { value: 'international', label: 'Quốc tế' }
]

const handleApiError = (error: unknown) => {
  const apiError = error as ApiError
  if (apiError?.response?.data?.details && Array.isArray(apiError.response.data.details)) {
    const details = apiError.response.data.details
    if (details.length > 0) {
      const firstError = details[0]
      toast.error(`${firstError.property}: ${firstError.message}`)
      return
    }
  }
  const message = apiError?.response?.data?.message || apiError?.message || 'Có lỗi xảy ra'
  toast.error(message)
}

interface CreateClassFormProps {
  onSubmit: (data: CreateClassFormValues) => Promise<void>
  isLoading?: boolean
}

interface UpdateClassFormProps {
  initialData?: {
    class_name?: string
    class_type?: ClassType
    start_date?: string
    end_date?: string
    is_active?: boolean
  }
  onSubmit: (data: UpdateClassFormValues) => Promise<void>
  isLoading?: boolean
}

export function CreateClassForm({ onSubmit, isLoading }: CreateClassFormProps) {
  const today = getTodayStartOfDay()
  const nextWeek = addDays(today, 7)

  const form = useForm<CreateClassFormData>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      class_code: '',
      class_name: '',
      class_type: undefined,
      start_date: today,
      end_date: nextWeek
    }
  })

  const handleSubmit = async (data: CreateClassFormData) => {
    try {
      await onSubmit({
        class_code: data.class_code,
        class_name: data.class_name,
        class_type: data.class_type,
        start_date: format(data.start_date, 'yyyy-MM-dd'),
        end_date: format(data.end_date, 'yyyy-MM-dd')
      })
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-5'>
        <FormField
          control={form.control}
          name='class_code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã lớp</FormLabel>
              <FormControl>
                <Input placeholder='VD: SINH12-2024' disabled={isLoading} {...field} />
              </FormControl>
              <FormDescription>Mã định danh duy nhất cho lớp học</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='class_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên lớp</FormLabel>
              <FormControl>
                <Input placeholder='VD: Lớp Sinh học 12 - Năm học 2024-2025' disabled={isLoading} {...field} />
              </FormControl>
              <FormDescription>Tên đầy đủ của lớp học</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='class_type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại lớp</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn loại lớp' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Phân loại cấp độ của lớp học</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='start_date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        disabled={isLoading}
                      >
                        {field.value ? format(field.value, 'dd/MM/yyyy') : 'Chọn ngày'}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date('2100-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='end_date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Ngày kết thúc</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        disabled={isLoading}
                      >
                        {field.value ? format(field.value, 'dd/MM/yyyy') : 'Chọn ngày'}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date('2100-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type='submit' disabled={isLoading} className='w-full'>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Đang tạo...
            </>
          ) : (
            'Tạo lớp'
          )}
        </Button>
      </form>
    </Form>
  )
}

export function UpdateClassForm({ initialData, onSubmit, isLoading }: UpdateClassFormProps) {
  const form = useForm<UpdateClassFormData>({
    resolver: zodResolver(updateClassSchema),
    defaultValues: {
      class_name: initialData?.class_name || '',
      class_type: initialData?.class_type,
      start_date: initialData?.start_date ? new Date(initialData.start_date) : undefined,
      end_date: initialData?.end_date ? new Date(initialData.end_date) : undefined,
      is_active: initialData?.is_active || false
    }
  })

  const handleSubmit = async (data: UpdateClassFormData) => {
    try {
      const submitData: UpdateClassFormValues = {
        class_name: data.class_name || undefined,
        class_type: data.class_type,
        start_date: data.start_date ? format(data.start_date, 'yyyy-MM-dd') : undefined,
        end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : undefined,
        is_active: data.is_active
      }
      await onSubmit(submitData)
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-5'>
        <FormField
          control={form.control}
          name='class_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên lớp</FormLabel>
              <FormControl>
                <Input placeholder='Tên lớp' disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='class_type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại lớp</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn loại lớp' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='start_date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        disabled={isLoading}
                      >
                        {field.value ? format(field.value, 'dd/MM/yyyy') : 'Chọn ngày'}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date('2100-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='end_date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Ngày kết thúc</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        disabled={isLoading}
                      >
                        {field.value ? format(field.value, 'dd/MM/yyyy') : 'Chọn ngày'}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date('2100-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='is_active'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border border-greyscale-200 p-3'>
              <div className='space-y-0.5'>
                <FormLabel>Hoạt động</FormLabel>
                <FormDescription>Lớp học này đang hoạt động hay tạm dừng</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isLoading} className='w-full'>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Đang cập nhật...
            </>
          ) : (
            'Cập nhật lớp'
          )}
        </Button>
      </form>
    </Form>
  )
}

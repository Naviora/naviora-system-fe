'use client'

import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { type ClassDto, type CreateModuleFormValues, createModuleFormSchema } from '@/lib/validations/modules'

interface CreateModuleFormProps {
  classes: ClassDto[]
  isSubmitting: boolean
  onSubmit: (values: CreateModuleFormValues) => Promise<void>
  submitLabel?: string
  pendingLabel?: string
  defaultValues?: Partial<CreateModuleFormValues>
  shouldResetOnSubmit?: boolean
}

export function CreateModuleForm({
  classes,
  isSubmitting,
  onSubmit,
  submitLabel = 'Tạo chuyên đề',
  pendingLabel = 'Đang xử lý...',
  defaultValues,
  shouldResetOnSubmit = true
}: CreateModuleFormProps) {
  const firstAvailableClassId = classes[0]?.class_id ?? ''

  const fallbackClassId = useMemo(() => {
    if (defaultValues?.class_id && defaultValues.class_id.length > 0) {
      return defaultValues.class_id
    }

    return firstAvailableClassId
  }, [defaultValues?.class_id, firstAvailableClassId])

  const normalizedDefaultValues = useMemo<CreateModuleFormValues>(
    () => ({
      module_code: defaultValues?.module_code ?? '',
      module_name: defaultValues?.module_name ?? '',
      module_description: defaultValues?.module_description ?? '',
      class_id: fallbackClassId,
      banner: null
    }),
    [defaultValues?.module_code, defaultValues?.module_name, defaultValues?.module_description, fallbackClassId]
  )

  const form = useForm<CreateModuleFormValues>({
    resolver: zodResolver(createModuleFormSchema),
    defaultValues: normalizedDefaultValues
  })

  useEffect(() => {
    form.reset(normalizedDefaultValues)
  }, [form, normalizedDefaultValues])

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values)
    if (shouldResetOnSubmit) {
      form.reset(normalizedDefaultValues)
    }
  })

  const isSubmitDisabled = isSubmitting || classes.length === 0
  const submitButtonLabel = isSubmitting ? pendingLabel : submitLabel

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <FormField
          control={form.control}
          name='module_code'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center gap-1'>
                Mã chuyên đề
                <span className='text-destructive'>*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder='VD: WDP101' required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='module_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center gap-1'>
                Tên chuyên đề
                <span className='text-destructive'>*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên chuyên đề' required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='module_description'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center gap-1'>
                Mô tả
                <span className='text-destructive'>*</span>
              </FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder='Tóm tắt nội dung chuyên đề' required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='class_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center gap-1'>
                Lớp
                <span className='text-destructive'>*</span>
              </FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitDisabled}>
                  <SelectTrigger aria-required='true'>
                    <SelectValue placeholder='Chọn lớp phụ trách' />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.length > 0 ? (
                      classes.map((classItem) => (
                        <SelectItem key={classItem.class_id} value={classItem.class_id}>
                          {classItem.class_name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className='px-3 py-2 text-sm text-muted-foreground'>Chưa có lớp khả dụng</div>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
              {classes.length === 0 ? (
                <p className='text-xs text-muted-foreground'>Chưa có lớp nào khả dụng, vui lòng tạo lớp trước.</p>
              ) : null}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='banner'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center gap-2'>
                Ảnh banner
                <span className='text-xs font-normal text-muted-foreground'>(không bắt buộc)</span>
              </FormLabel>
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  disabled={isSubmitting}
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    field.onChange(file ?? null)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end'>
          <Button type='submit' className='w-full sm:w-auto' disabled={isSubmitDisabled}>
            {submitButtonLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}

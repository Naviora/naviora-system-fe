'use client'
import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView
} from '@/components/ui/full-calendar'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useClasses } from '@/hooks/api/use-classes'
import { toast } from 'sonner'

type Invitee = { id: string; name: string }

const formSchema = z
  .object({
    class_id: z.string().min(1, 'Bắt buộc chọn lớp'),
    title: z.string().min(1, 'Tiêu đề là bắt buộc'),
    description: z.string().optional(),
    note: z.string().optional(),
    invitees: z.array(z.string()).optional(),
    start_time: z.date('Thời gian bắt đầu là bắt buộc'),
    end_time: z.date('Thời gian kết thúc là bắt buộc')
  })
  .refine((v) => (v.start_time && v.end_time ? v.end_time > v.start_time : true), {
    message: 'Thời gian kết thúc phải lớn hơn bắt đầu',
    path: ['end_time']
  })

export default function CalendarPage() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Calendar
        events={[
          {
            id: '1',
            start: new Date('2025-10-26T09:30:00Z'),
            end: new Date('2025-10-26T14:30:00Z'),
            title: 'Cuối kì 1',
            description: 'Thi cuối kỳ môn Toán học cơ bản',
            host: {
              name: 'Nguyễn Văn A'
            },
            color: 'pink'
          },
          {
            id: '2',
            start: new Date('2025-10-27T10:00:00Z'),
            end: new Date('2025-10-27T10:30:00Z'),
            title: 'Cuối kì 2',
            description: 'Thi cuối kỳ môn Vật lý đại cương',
            host: {
              name: 'Trần Thị B'
            },
            color: 'blue'
          }
        ]}
      >
        <div className='h-dvh py-6 flex flex-col'>
          <div className='flex px-6 items-center gap-2 mb-6'>
            <CalendarViewTrigger view='week' className='aria-[current=true]:bg-accent'>
              Week
            </CalendarViewTrigger>
            <CalendarViewTrigger view='month' className='aria-[current=true]:bg-accent'>
              Month
            </CalendarViewTrigger>
            <CalendarViewTrigger view='year' className='aria-[current=true]:bg-accent'>
              Year
            </CalendarViewTrigger>

            <span className='flex-1' />

            <Button size='sm' onClick={() => setOpen(true)}>
              <Plus className='mr-2 size-4' /> Tạo cuộc họp
            </Button>

            <CalendarCurrentDate />

            <CalendarPrevTrigger>
              <ChevronLeft size={20} />
              <span className='sr-only'>Previous</span>
            </CalendarPrevTrigger>

            <CalendarTodayTrigger>Today</CalendarTodayTrigger>

            <CalendarNextTrigger>
              <ChevronRight size={20} />
              <span className='sr-only'>Next</span>
            </CalendarNextTrigger>

            {/* <ModeToggle /> */}
          </div>

          <div className='flex-1 overflow-auto px-6 relative'>
            <CalendarDayView />
            <CalendarWeekView />
            <CalendarMonthView />
            <CalendarYearView />
          </div>
        </div>
      </Calendar>

      <CreateMeetingDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

function CreateMeetingDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { data: classesData } = useClasses({ limit: 100, page: 1 })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class_id: '',
      title: '',
      description: '',
      note: '',
      invitees: [],
      start_time: undefined as unknown as Date,
      end_time: undefined as unknown as Date
    }
  })

  const selectedClassId = form.watch('class_id')
  const startTimeWatch = form.watch('start_time')

  const inviteeOptions: Invitee[] = useMemo(() => {
    if (!selectedClassId) return []
    // Stub: replace with API to fetch students in class
    // e.g., GET /classes/{id}/students
    return []
  }, [selectedClassId])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Stub API call to create meeting event
    await new Promise((resolve) => setTimeout(resolve, 800))
    toast.success('Tạo cuộc họp thành công')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>Tạo cuộc họp</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='class_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lớp</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn lớp' />
                      </SelectTrigger>
                      <SelectContent>
                        {(classesData?.classes ?? []).map((c) => (
                          <SelectItem key={c.class_id} value={c.class_id}>
                            {c.class_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập tiêu đề' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='start_time'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bắt đầu</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value as Date}
                        onChange={field.onChange}
                        showTimeSelect
                        minDate={new Date()}
                        placeholder='Chọn thời gian bắt đầu'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='end_time'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kết thúc</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value as Date}
                        onChange={field.onChange}
                        showTimeSelect
                        minDate={startTimeWatch || new Date()}
                        placeholder='Chọn thời gian kết thúc'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder='Mô tả nội dung buổi họp' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder='Ghi chú (không bắt buộc)' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='invitees'
              render={() => (
                <FormItem>
                  <FormLabel>Học viên tham gia</FormLabel>
                  <div className='rounded-md border p-3 space-y-2 max-h-40 overflow-auto'>
                    {inviteeOptions.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>Không có học viên trong lớp hoặc chưa chọn lớp.</p>
                    ) : (
                      inviteeOptions.map((s) => (
                        <label key={s.id} className='flex items-center gap-2 text-sm'>
                          <Checkbox
                            checked={(form.getValues('invitees') || []).includes(s.id)}
                            onCheckedChange={(checked) => {
                              const current = new Set(form.getValues('invitees') || [])
                              if (checked) current.add(s.id)
                              else current.delete(s.id)
                              form.setValue('invitees', Array.from(current))
                            }}
                          />
                          <span>{s.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2 pt-2'>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type='submit'>Tạo</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

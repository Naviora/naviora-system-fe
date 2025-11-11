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
  CalendarYearView,
  useCalendar
} from '@/components/ui/full-calendar'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'
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
import { useGetAssignedClasses } from '@/hooks/api/use-classes'
import { useCreateMeetingEvent, useGetMeetingEvents } from '@/hooks/api/use-meeting-event'
import { useProfile } from '@/hooks/api/use-profile'
import type { CreateMeetingEventRequest, MeetingEvent } from '@/types/api/meeting-event'
import type { CalendarEvent } from '@/components/ui/full-calendar'
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

// Component to fetch and update events based on calendar context
function CalendarEventsLoader() {
  const { date, view, setEvents } = useCalendar()

  // Calculate start and end dates based on current view and date
  const dateRange = useMemo(() => {
    let start: Date
    let end: Date

    switch (view) {
      case 'day':
        start = new Date(date)
        start.setHours(0, 0, 0, 0)
        end = new Date(date)
        end.setHours(23, 59, 59, 999)
        break
      case 'week':
        start = startOfWeek(date, { weekStartsOn: 1 }) // Monday
        end = endOfWeek(date, { weekStartsOn: 1 }) // Sunday
        break
      case 'month':
        start = startOfMonth(date)
        end = endOfMonth(date)
        break
      case 'year':
        start = startOfYear(date)
        end = endOfYear(date)
        break
      default:
        // Default to week view
        start = startOfWeek(date, { weekStartsOn: 1 })
        end = endOfWeek(date, { weekStartsOn: 1 })
    }

    return {
      start: start.toISOString(),
      end: end.toISOString()
    }
  }, [date, view])

  // Fetch meeting events with weekly query params
  const { data: eventsData } = useGetMeetingEvents({
    start: dateRange.start,
    end: dateRange.end
  })

  // Transform API events to Calendar events and update calendar
  useEffect(() => {
    // Debug: log the actual data structure
    console.log('eventsData:', eventsData)

    // Handle different possible response structures
    // Case 1: eventsData has .data property (array of events) - based on MeetingEventsListResponse type
    // Case 2: eventsData is directly an array (if apiClient extracts differently)
    let eventsArray: MeetingEvent[] = []

    if (Array.isArray(eventsData)) {
      eventsArray = eventsData
    } else if (eventsData?.data && Array.isArray(eventsData.data)) {
      eventsArray = eventsData.data
    }

    if (eventsArray.length === 0) {
      setEvents([])
      return
    }

    const calendarEvents: CalendarEvent[] = eventsArray.map((event: MeetingEvent, index: number) => ({
      id: event.id,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      title: event.title,
      description: event.description || undefined,
      host: event.host_detail
        ? {
            name: event.host_detail.name,
            avatar: event.host_detail.avatar ?? null
          }
        : undefined,
      // Cycle through colors for visual variety
      color: (['blue', 'green', 'pink', 'purple'] as const)[index % 4]
    }))

    console.log('calendarEvents:', calendarEvents)
    setEvents(calendarEvents)
  }, [eventsData, setEvents])

  return null
}

export default function CalendarPage() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Calendar>
        <CalendarEventsLoader />
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
  const { data: classesData } = useGetAssignedClasses({ limit: 100, page: 1 })
  const { data: profile } = useProfile()
  const createMeetingMutation = useCreateMeetingEvent()

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
    if (!profile?.account_id) {
      toast.error('Không thể lấy thông tin người dùng')
      return
    }

    // Transform Date objects to ISO string for API
    const requestData: CreateMeetingEventRequest = {
      class_id: values.class_id,
      host_by: profile.account_id,
      title: values.title,
      description: values.description || undefined,
      note: values.note || undefined,
      invitees: values.invitees && values.invitees.length > 0 ? values.invitees : undefined,
      start_time: values.start_time.toISOString(),
      end_time: values.end_time.toISOString()
    }

    try {
      await createMeetingMutation.mutateAsync(requestData)
      toast.success('Tạo cuộc họp thành công')
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo cuộc họp')
    }
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
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  form.reset()
                  onOpenChange(false)
                }}
                disabled={createMeetingMutation.isPending}
              >
                Hủy
              </Button>
              <Button type='submit' disabled={createMeetingMutation.isPending}>
                {createMeetingMutation.isPending ? 'Đang tạo...' : 'Tạo'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

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
import { ChevronLeft, ChevronRight } from 'lucide-react'
export default function CalendarPage() {
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
    </>
  )
}

'use client'

import { CalendarDays } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type UpcomingSession = {
  id: number
  title: string
  timeRange: string
  descriptor: string
  location: string
  mode: 'Trực tiếp' | 'Trực tuyến'
}

interface UpcomingSessionsProps {
  sessions?: UpcomingSession[]
}

const DEFAULT_SESSIONS: UpcomingSession[] = [
  {
    id: 1,
    title: 'Cấu trúc dữ liệu & giải thuật',
    timeRange: '08:00 - 09:45 · 04/11',
    descriptor: 'Lớp CNTT K18A',
    location: 'Phòng B405',
    mode: 'Trực tiếp'
  },
  {
    id: 2,
    title: 'Workshop: Thiết kế đề thi chuẩn đầu ra',
    timeRange: '13:30 - 15:00 · 05/11',
    descriptor: 'Cố vấn khoa',
    location: 'Google Meet',
    mode: 'Trực tuyến'
  },
  {
    id: 3,
    title: 'Tư vấn đồ án tốt nghiệp',
    timeRange: '09:00 - 10:30 · 06/11',
    descriptor: 'Nhóm đồ án AI-03',
    location: 'Phòng ThinkLab',
    mode: 'Trực tiếp'
  }
]

export function UpcomingSessions({ sessions = DEFAULT_SESSIONS }: UpcomingSessionsProps) {
  return (
    <Card className='border-greyscale-200'>
      <CardHeader className='px-6 pb-0'>
        <CardTitle className='text-xl text-greyscale-900'>Lịch sắp diễn ra</CardTitle>
        <CardDescription>Chuẩn bị cho các buổi dạy, họp và cố vấn trong 3 ngày tới.</CardDescription>
      </CardHeader>
      <CardContent className='px-6 pt-6'>
        <div className='flex flex-col gap-4'>
          {sessions.map((session) => (
            <div
              key={session.id}
              className='flex flex-col gap-2 rounded-lg border border-greyscale-200/80 bg-greyscale-0 p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between'
            >
              <div className='flex flex-col gap-1'>
                <p className='font-semibold text-greyscale-900'>{session.title}</p>
                <p className='text-sm text-muted-foreground'>{session.descriptor}</p>
                <p className='text-sm text-greyscale-600'>{session.timeRange}</p>
              </div>
              <div className='flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3'>
                <span className='inline-flex items-center gap-2 rounded-full bg-primary-0 px-3 py-1 text-xs font-medium text-primary-600'>
                  <CalendarDays className='size-3.5' /> {session.location}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
                    session.mode === 'Trực tiếp' ? 'bg-success-0 text-success-200' : 'bg-sky-50 text-sky-600'
                  )}
                >
                  {session.mode}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

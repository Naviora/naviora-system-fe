'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TeachingOverviewChart } from './teaching-overview-chart'

type TeachingTrendPoint = {
  day: string
  hours: number
}

interface TeachingOverviewProps {
  data?: TeachingTrendPoint[]
}

const DEFAULT_DATA: TeachingTrendPoint[] = [
  { day: 'T2', hours: 4.5 },
  { day: 'T3', hours: 3.8 },
  { day: 'T4', hours: 6.2 },
  { day: 'T5', hours: 5.0 },
  { day: 'T6', hours: 4.3 },
  { day: 'T7', hours: 2.5 }
]

export function TeachingOverview({ data = DEFAULT_DATA }: TeachingOverviewProps) {
  return (
    <Card className='xl:col-span-2 border-greyscale-200'>
      <CardHeader className='px-6 pb-0'>
        <CardTitle className='text-xl text-greyscale-900'>Tổng quan giảng dạy tuần này</CardTitle>
        <CardDescription>
          {data.reduce((total, point) => total + point.hours, 0).toFixed(1)} giờ đã lên lịch · Cao nhất vào{' '}
          {data[2]?.day ?? 'T4'}
        </CardDescription>
      </CardHeader>
      <CardContent className='px-6 pt-6'>
        <div className='rounded-lg border border-greyscale-200 bg-linear-to-b from-primary-0/40 to-greyscale-0 p-4'>
          <TeachingOverviewChart data={data} />
        </div>
      </CardContent>
    </Card>
  )
}

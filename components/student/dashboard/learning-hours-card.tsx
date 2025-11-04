'use client'

import { Ellipsis, TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

import type { LearningDataPoint } from './types'

type LearningHoursCardProps = {
  data: LearningDataPoint[]
}

const chartConfig = {
  hours: {
    label: 'Giờ học'
  }
} satisfies ChartConfig

export function LearningHoursCard({ data }: LearningHoursCardProps) {
  return (
    <Card className='border-[rgba(230,230,230,0.9)] shadow-none'>
      <CardHeader className='flex flex-col gap-4 px-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <CardTitle className='text-base font-medium text-greyscale-700'>Thời lượng học</CardTitle>
            <CardDescription>Tổng hợp thời gian học mỗi ngày trong tuần vừa qua</CardDescription>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='outline' size='sm' className='h-9 rounded-lg border-greyscale-100 text-xs font-medium'>
              Tháng trước
            </Button>
            <button
              type='button'
              className='text-muted-foreground/70 hover:text-muted-foreground focus-visible:ring-ring flex size-9 items-center justify-center rounded-lg border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2'
              aria-label='Tùy chọn thời lượng học'
            >
              <Ellipsis className='size-4' />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-6 px-6 pb-6'>
        <div className='flex flex-wrap items-center gap-4'>
          <p className='text-4xl font-semibold text-greyscale-900'>62,7 giờ</p>
          <div className='flex flex-wrap items-center gap-3 text-sm'>
            <span className='flex items-center gap-1 font-medium text-success-100'>
              <TrendingUp className='size-4' aria-hidden='true' />
              +10,8%
            </span>
            <span className='text-muted-foreground text-xs'>so với tháng trước</span>
          </div>
        </div>
        <ChartContainer config={chartConfig} className='h-full w-full'>
          <ResponsiveContainer width='100%' height={260}>
            <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id='learning-hours-gradient' x1='0' x2='0' y1='0' y2='1'>
                  <stop offset='0%' stopColor='rgba(14,102,254,0.35)' />
                  <stop offset='100%' stopColor='rgba(14,102,254,0.05)' />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='4 4' vertical={false} stroke='rgba(223,225,231,0.7)' />
              <XAxis
                dataKey='day'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke='rgba(107,114,128,0.7)'
                tickFormatter={(value: number) => `Ngày ${value}`}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={40}
                stroke='rgba(107,114,128,0.7)'
                tickFormatter={(value: number) => `${value}h`}
              />
              <ChartTooltip cursor={{ strokeDasharray: '4 4' }} content={<ChartTooltipContent />} />
              <Area
                type='monotone'
                dataKey='hours'
                stroke='rgba(14,102,254,1)'
                strokeWidth={2}
                fill='url(#learning-hours-gradient)'
                dot={{ fill: 'rgba(14,102,254,1)', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

'use client'

import { ArrowUpRight, Layers3, ClipboardList, Users2, CalendarDays } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Metric = {
  label: string
  value: string
  trend: number
  trendLabel: string
  icon: LucideIcon
}

interface MetricsSectionProps {
  metrics?: Metric[]
}

const DEFAULT_METRICS: Metric[] = [
  {
    label: 'Lớp đang giảng dạy',
    value: '5',
    trend: 1.8,
    trendLabel: 'so với tháng trước',
    icon: Layers3
  },
  {
    label: 'Bài nộp đang chờ duyệt',
    value: '12',
    trend: -2.1,
    trendLabel: 'so với tuần trước',
    icon: ClipboardList
  },
  {
    label: 'Tỉ lệ chuyên cần',
    value: '92%',
    trend: 3.4,
    trendLabel: 'tăng 7 ngày qua',
    icon: Users2
  },
  {
    label: 'Phiên cố vấn tuần này',
    value: '3',
    trend: 0,
    trendLabel: 'đã xác nhận',
    icon: CalendarDays
  }
]

function createTrendClasses(trend: number) {
  if (trend > 0) {
    return 'text-success-200 bg-success-0'
  }

  if (trend < 0) {
    return 'text-destructive bg-destructive/10'
  }

  return 'text-greyscale-600 bg-greyscale-100'
}

export function MetricsSection({ metrics = DEFAULT_METRICS }: MetricsSectionProps) {
  return (
    <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {metrics.map((metric) => {
        const Icon = metric.icon
        const trendClass = createTrendClasses(metric.trend)

        return (
          <Card key={metric.label} className='gap-3 border-greyscale-200'>
            <CardHeader className='flex flex-row items-start justify-between px-6 pb-3'>
              <div className='flex flex-col gap-1'>
                <CardDescription className='text-xs font-medium uppercase tracking-wide text-greyscale-500'>
                  {metric.label}
                </CardDescription>
                <CardTitle className='text-3xl font-semibold text-greyscale-900'>{metric.value}</CardTitle>
              </div>
              <div className='rounded-full bg-primary/10 p-3 text-primary-600'>
                <Icon className='size-5' aria-hidden='true' />
              </div>
            </CardHeader>
            <CardContent className='px-6 pt-0'>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                  trendClass
                )}
              >
                {metric.trend === 0 ? 'Ổn định' : `${metric.trend > 0 ? '+' : ''}${metric.trend}%`}
                {metric.trend !== 0 ? <ArrowUpRight className='size-3' aria-hidden='true' /> : null}
              </span>
              <p className='mt-2 text-xs text-muted-foreground'>{metric.trendLabel}</p>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}

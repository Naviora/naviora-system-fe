'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export type TeachingTrendData = {
  day: string
  hours: number
}

interface TeachingOverviewChartProps {
  data: TeachingTrendData[]
}

/**
 * TeachingOverviewChart
 * A reusable, responsive area chart displaying teaching hours by day.
 * Designed for Next.js 15 + React 19 with Recharts.
 *
 * Features:
 * - Responsive container for mobile/tablet/desktop
 * - Interactive tooltip on hover
 * - Gradient area fill with smooth curve
 * - Accessible labels and color-coded visualization
 */
export function TeachingOverviewChart({ data }: TeachingOverviewChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className='flex h-40 items-center justify-center rounded-lg border border-greyscale-200 bg-greyscale-50'>
        <p className='text-sm text-muted-foreground'>Không có dữ liệu để hiển thị</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width='100%' height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
        <defs>
          <linearGradient id='colorHours' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='hsl(var(--primary))' stopOpacity={0.6} />
            <stop offset='95%' stopColor='hsl(var(--primary))' stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' vertical={false} />
        <XAxis
          dataKey='day'
          stroke='hsl(var(--muted-foreground))'
          style={{ fontSize: '12px' }}
          tickLine={false}
        />
        <YAxis
          stroke='hsl(var(--muted-foreground))'
          style={{ fontSize: '12px' }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          labelStyle={{
            color: 'hsl(var(--foreground))',
            fontWeight: 600
          }}
          formatter={(value: number) => [`${value.toFixed(1)} giờ`, 'Giờ giảng dạy']}
          labelFormatter={(label: string) => `${label}`}
        />
        <Area
          type='monotone'
          dataKey='hours'
          stroke='hsl(var(--primary))'
          strokeWidth={2.5}
          fillOpacity={1}
          fill='url(#colorHours)'
          dot={{ fill: 'hsl(var(--primary))', r: 4, strokeWidth: 1.5 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

'use client'

import { Ellipsis, TrendingDown, TrendingUp } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import type { StatCardConfig } from './types'

type DashboardStatGridProps = {
  stats: StatCardConfig[]
}

type StatCardProps = {
  config: StatCardConfig
}

export function DashboardStatGrid({ stats }: DashboardStatGridProps) {
  return (
    <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
      {stats.map((card) => (
        <StatCard key={card.id} config={card} />
      ))}
    </section>
  )
}

function StatCard({ config }: StatCardProps) {
  const { icon: Icon, title, value, delta, accent } = config
  const DeltaIcon = delta.direction === 'up' ? TrendingUp : TrendingDown

  return (
    <Card className='border-[rgba(226,226,238,0.8)] shadow-none'>
      <CardHeader className='flex flex-col gap-4 px-6'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-3 text-xs font-medium text-muted-foreground'>
            <span
              className={cn('flex size-10 items-center justify-center rounded-lg bg-muted text-primary-200', accent)}
            >
              <Icon className='size-5' aria-hidden='true' />
            </span>
            <span>{title}</span>
          </div>
          <button
            type='button'
            className='text-muted-foreground/70 hover:text-muted-foreground focus-visible:ring-ring flex size-9 items-center justify-center rounded-lg border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2'
            aria-label={`Tùy chọn cho ${title}`}
          >
            <Ellipsis className='size-4' />
          </button>
        </div>
        <div>
          <p className='text-3xl font-semibold text-greyscale-700'>{value}</p>
        </div>
      </CardHeader>
      <CardContent className='px-6 pb-6'>
        <div className='flex flex-wrap items-center justify-between gap-2 text-xs'>
          <span
            className={cn(
              'flex items-center gap-1 font-medium',
              delta.direction === 'up' ? 'text-success-100' : 'text-error-100'
            )}
          >
            <DeltaIcon className='size-4' aria-hidden='true' />
            {delta.value}
          </span>
          <span className='text-muted-foreground'>{delta.description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

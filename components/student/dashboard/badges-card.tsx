'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import type { BadgeCardConfig } from './types'

type BadgesCardProps = {
  badges: BadgeCardConfig[]
}

type BadgeCardProps = {
  badge: BadgeCardConfig
}

export function BadgesCard({ badges }: BadgesCardProps) {
  return (
    <Card className='border-[rgba(230,230,230,0.9)] shadow-none'>
      <CardHeader className='flex flex-wrap items-center justify-between gap-3 px-6'>
        <CardTitle className='text-base font-medium text-greyscale-700'>Huy hiệu</CardTitle>
        <Button variant='outline' size='sm' className='h-9 rounded-lg border-greyscale-100 text-xs font-medium'>
          Xem tất cả
        </Button>
      </CardHeader>
      <CardContent className='px-6 pb-6'>
        <div className='flex gap-3 overflow-x-auto pb-1'>
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function BadgeCard({ badge }: BadgeCardProps) {
  const Icon = badge.icon

  return (
    <div className='flex min-w-[180px] flex-col gap-3 rounded-xl border border-[rgba(223,225,231,0.8)] bg-greyscale-25 p-4'>
      <span
        className={cn(
          'flex size-10 items-center justify-center rounded-full bg-white text-primary-200 shadow-sm',
          badge.accent
        )}
      >
        <Icon className='size-5' aria-hidden='true' />
      </span>
      <div className='flex flex-col gap-1'>
        <h3 className='text-sm font-semibold text-greyscale-700'>{badge.title}</h3>
        <p className='text-xs text-muted-foreground'>{badge.description}</p>
      </div>
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export interface SectionHeaderProps {
  title: string
  viewAllHref?: string
  onViewAll?: () => void
}

export function SectionHeader({ title, viewAllHref = '#', onViewAll }: SectionHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <h2 className='text-2xl font-semibold text-greyscale-900'>{title}</h2>
      {viewAllHref && (
        <Button
          variant='ghost'
          className='gap-2 text-greyscale-700 hover:text-greyscale-900'
          asChild={!onViewAll}
          onClick={onViewAll}
        >
          {onViewAll ? (
            <>
              View all
              <ArrowRight className='h-4 w-4' />
            </>
          ) : (
            <Link href={viewAllHref}>
              View all
              <ArrowRight className='h-4 w-4' />
            </Link>
          )}
        </Button>
      )}
    </div>
  )
}

import Image from 'next/image'
import { MoreVertical } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LecturerModuleSummary } from '@/types/lecturer/modules'

export interface LecturerModuleCardProps extends LecturerModuleSummary {
  className?: string
}

export function LecturerModuleCard({ level, code, title, thumbnail, className }: LecturerModuleCardProps) {
  return (
    <Card
      className={cn(
        'group gap-2 overflow-hidden rounded-md border border-greyscale-200 bg-greyscale-0 shadow-xs transition-all hover:shadow-md p-2',
        className
      )}
    >
      <div className='relative h-40 w-full overflow-hidden bg-greyscale-50 rounded-sm'>
        <Image
          src={thumbnail}
          alt={title}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105'
          sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
          priority={false}
        />
      </div>

      <div className='flex flex-col gap-2 pb-2'>
        <div className='flex items-center justify-between'>
          <span className='rounded-full bg-greyscale-50 px-3 py-1 text-xs font-medium text-greyscale-500'>{level}</span>
          <Button
            type='button'
            size='icon'
            variant='ghost'
            className='h-8 w-8 rounded-md border border-greyscale-200 text-greyscale-400 hover:text-greyscale-700'
          >
            <MoreVertical className='h-4 w-4' aria-hidden='true' />
            <span className='sr-only'>Mở menu cho {title}</span>
          </Button>
        </div>

        <div className='flex flex-col gap-1'>
          <span className='text-sm text-greyscale-500'>{code}</span>
          <h3 className='line-clamp-1 text-base font-semibold tracking-tight text-greyscale-900'>{title}</h3>
        </div>
      </div>
    </Card>
  )
}

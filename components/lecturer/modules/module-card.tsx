import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { cn, formatDateTime } from '@/lib/utils'

export interface ModuleListItem {
  id: string
  code: string
  name: string
  description?: string | null
  banner?: string | null
  updatedAt?: string
}

export interface LecturerModuleCardProps {
  module: ModuleListItem
  className?: string
}

export function LecturerModuleCard({ module, className }: LecturerModuleCardProps) {
  const { code, name, description, banner, updatedAt } = module

  return (
    <Card
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-lg border border-greyscale-200 bg-greyscale-0 shadow-xs transition-all hover:shadow-md',
        className
      )}
    >
      <div className='relative h-40 w-full overflow-hidden bg-greyscale-50'>
        {banner ? (
          <Image
            src={banner}
            alt={name}
            fill
            className='object-cover transition-transform duration-500 group-hover:scale-105'
            sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
            priority={false}
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-25 via-primary-0 to-greyscale-50 text-sm font-medium text-primary'>
            {code}
          </div>
        )}
      </div>

      <div className='flex flex-1 flex-col gap-4 p-4'>
        <div className='flex flex-col gap-2'>
          <span className='inline-flex w-fit rounded-full bg-primary-0 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary'>
            {code}
          </span>
          <div className='space-y-1'>
            <h3 className='line-clamp-1 text-base font-semibold text-greyscale-900'>{name}</h3>
            {description ? (
              <p className='line-clamp-2 text-sm text-greyscale-500'>{description}</p>
            ) : (
              <p className='text-sm text-greyscale-400'>Chưa có mô tả cho chuyên đề này.</p>
            )}
          </div>
        </div>
        <div className='mt-auto flex items-center justify-between text-xs text-greyscale-400'>
          <span>Cập nhật lần cuối</span>
          <span>{updatedAt ? formatDateTime(updatedAt, { dateStyle: 'medium' }) : '—'}</span>
        </div>
      </div>
    </Card>
  )
}

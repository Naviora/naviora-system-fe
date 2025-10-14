import Link from 'next/link'

import type { LecturerModuleSummary } from '@/types/lecturer/modules'

import { LecturerModuleCard } from './module-card'

interface LecturerModuleGridProps {
  modules: LecturerModuleSummary[]
  hrefBuilder?: (module: LecturerModuleSummary) => string | undefined
}

export function LecturerModuleGrid({ modules, hrefBuilder }: LecturerModuleGridProps) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {modules.map((module) => {
        const href = hrefBuilder?.(module) ?? `/lecturer/modules/${module.id}`

        const card = <LecturerModuleCard {...module} className='h-full transition-transform hover:-translate-y-0.5' />

        if (!href) {
          return (
            <div key={module.id} className='h-full'>
              {card}
            </div>
          )
        }

        return (
          <Link key={module.id} href={href} className='block h-full'>
            {card}
          </Link>
        )
      })}
    </div>
  )
}

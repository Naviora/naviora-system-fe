'use client'

import { ModuleCard, type ModuleCardProps } from '@/components/student/modules/module-card'

interface StudentModuleGridProps {
  modules: ModuleCardProps[]
}

export function StudentModuleGrid({ modules }: StudentModuleGridProps) {
  return (
    <div className='grid gap-4 lg::grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {modules.map((course) => (
        <ModuleCard key={course.id} {...course} />
      ))}
    </div>
  )
}

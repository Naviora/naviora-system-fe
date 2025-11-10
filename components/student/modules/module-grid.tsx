'use client'

import { ModuleCard, type ModuleCardProps } from '@/components/student/modules/module-card'

export function StudentModuleGrid({ modules }: { modules: ModuleCardProps[] }) {
  return (
    <div className='grid gap-4 lg::grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {modules.map((course) => (
        <ModuleCard key={course.id} {...course} />
      ))}
    </div>
  )
}

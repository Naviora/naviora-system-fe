'use client'

import { ModuleCard } from '@/components/student/modules/module-card'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function StudentModuleGrid({ modules }: { modules: any[] }) {
  return (
    <div className='grid gap-4 lg::grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
      {modules.map((course) => (
        <ModuleCard key={course.id} {...course} />
      ))}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { DayStreak } from '@/components/common/day-streak'
import { StudentModuleGrid, StudentModuleToolbar } from '@/components/student/modules'
import { motion } from 'framer-motion'
import { useClassModules, type ClassModule } from '@/hooks/api/student/use-class-modules'
import { ModuleCardProps } from '@/components/student/modules/module-card'
import { useSetBreadcrumbItems } from '@/lib/context/breadcrumb-context'

function transformClassModulesToCards(classModules: ClassModule[] | undefined): ModuleCardProps[] {
  if (!Array.isArray(classModules)) return []
  return classModules.map((module) => ({
    id: module.module_id,
    moduleName: module.module_name,
    classType: 'Môn học',
    class_name: module.class?.class_code || 'N/A',
    lecturerName: [],
    progress: Math.round(module.progress_percent || 0),
    thumbnail: module.banner || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
  }))
}

export function StudentModulesPageClient() {
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const { data: classModules, isLoading } = useClassModules(selectedClassId)
  const setBreadcrumbItems = useSetBreadcrumbItems()

  useEffect(() => {
    setBreadcrumbItems([])
  }, [setBreadcrumbItems])

  const transformedModules = transformClassModulesToCards(classModules)

  return (
    <div className='flex flex-col-reverse lg:flex-row gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full '
      >
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold text-greyscale-900 sm:text-3xl'>Hành trình học tập của bạn</h1>
          <p className='text-sm text-muted-foreground'>
            Hành trình học tập của bạn bắt đầu từ bây giờ, hãy khám phá các bài học của bạn và tiếp tục tiến về phía
            trước.
          </p>
        </div>

        <section className='mt-6 rounded-xl border border-greyscale-200 bg-card p-4 shadow-sm sm:p-6'>
          <StudentModuleToolbar onClassChange={setSelectedClassId} />

          <div className='mt-6'>
            {isLoading ? (
              <div className='text-center py-12'>
                <p className='text-muted-foreground'>Đang tải modules...</p>
              </div>
            ) : transformedModules.length > 0 ? (
              <StudentModuleGrid modules={transformedModules} />
            ) : (
              <div className='text-center py-12'>
                <p className='text-muted-foreground'>Không có modules nào cho lớp này</p>
              </div>
            )}
          </div>
        </section>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <DayStreak />
      </motion.div>
    </div>
  )
}

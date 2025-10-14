import { Metadata } from 'next'
import { ModuleToolbar, LecturerModuleGrid } from '@/components/lecturer/modules'
import { getLecturerModuleSummaries } from '@/lib/data/lecturer-modules'

export const metadata: Metadata = {
  title: 'Lecturer Modules'
}

export default function LecturerModulesPage() {
  const modules = getLecturerModuleSummaries()

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8  '>
      <header className='space-y-1'>
        <h1 className='text-2xl font-semibold text-greyscale-900'>Chuyên đề của bạn</h1>
        <p className='text-sm text-greyscale-500'>Các chuyên đề bạn đã tạo</p>
      </header> 

      <section className='rounded-md border bg-greyscale-0 p-4 shadow-sm sm:p-6'>
        <ModuleToolbar />
        <div className='mt-6'>
          <LecturerModuleGrid modules={modules} />
        </div>
      </section>
    </div>
  )
}

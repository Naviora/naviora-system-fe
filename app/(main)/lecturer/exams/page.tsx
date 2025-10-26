import ManageLayout from '@/components/lecturer/exams/manage-layout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản lý đề thi'
}


export default function ManageExamsPage() {

  return (
    <div className='flex flex-col gap-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8  '>
      <header className='space-y-1'>
        <h1 className='text-2xl font-semibold text-greyscale-900'>Ngân hàng câu hỏi của tôi</h1>
        <p className='text-sm text-greyscale-500'>Quản lý ngân hàng câu hỏi và bài kiểm tra</p>
      </header> 

      <ManageLayout />
    </div>
  )
}

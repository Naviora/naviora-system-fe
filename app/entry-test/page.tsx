'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { RiVerifiedBadgeLine } from 'react-icons/ri'
import { MdErrorOutline, MdOutlineAccessTime, MdOutlineOutlinedFlag } from 'react-icons/md'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { FiPlay } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export default function EntryTestPage() {
  const router = useRouter()

  const handleOnClick = () => {
    router.push('/entry-test/start-test')
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900 py-8'>
      <Card className='w-full max-w-4xl rounded shadow-lg'>
        <CardContent className='p-4'>
          <div className='flex flex-col items-center mb-6'>
            <Image src='/Naviora.svg' width={80} height={70} alt='Naviora' className='mb-2' />
            <h1 className='text-2xl font-bold text-center text-gray-900 dark:text-white mb-1'>Bài kiểm tra đầu vào</h1>
            <div className='text-gray-500 dark:text-gray-300 text-center text-base'>Đánh giá học lực học sinh</div>
          </div>
          <div className='border rounded-lg bg-primary-0 dark:bg-primary-0 border-primary-200 dark:border-primary-100 p-4 mb-4'>
            <div className='font-semibold mb-2 text-primary-200 dark:text-primary-300'>Hướng dẫn làm bài:</div>
            <ul className='space-y-2 text-greyscale-800 dark:text-greyscale-600 text-sm'>
              <li className='flex items-center gap-2'>
                <RiVerifiedBadgeLine size={20} className='text-primary dark:text-primary-200' />
                <span>
                  Bài kiểm tra gồm <b>10 câu trắc nghiệm</b>
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <MdOutlineAccessTime size={20} className='text-primary dark:text-primary-200' />
                <span>
                  Thời gian làm bài: <b>45 phút</b>
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <MdErrorOutline size={20} className='text-primary dark:text-primary-200' />
                <span>
                  Bạn chỉ có thể làm bài kiểm tra này <b>1 lần</b>
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <IoMdInformationCircleOutline size={20} className='text-primary dark:text-primary-200' />
                <span>
                  Chọn đáp án <b>đúng nhất</b> cho mỗi câu hỏi
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <MdOutlineOutlinedFlag size={20} className='text-primary dark:text-primary-200' />
                <span>Bạn có thể đánh dấu câu hỏi để xem lại sau</span>
              </li>
            </ul>
          </div>
          <div className='rounded-lg border border-yellow-500 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/40 p-4 mb-6'>
            <div className='flex items-center gap-2 mb-1'>
              <MdErrorOutline size={20} className='text-yellow-500' />
              <div className='font-semibold text-yellow-800 dark:text-yellow-200 mb-1'>Lưu ý quan trọng</div>
            </div>

            <div className='text-yellow-800 dark:text-yellow-100 text-sm'>
              Khi bắt đầu làm bài, đồng hồ đếm ngược sẽ tự động chạy. Hãy chắc chắn bạn đã sẵn sàng trước khi bắt đầu.
            </div>
          </div>
          <div className='flex justify-end'>
            <Button className='flex justify-center items-center font-semibold gap-2' onClick={handleOnClick}>
              Bắt đầu làm bài
              <FiPlay />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { RiVerifiedBadgeLine } from 'react-icons/ri'
import { MdErrorOutline, MdOutlineAccessTime, MdOutlineOutlinedFlag } from 'react-icons/md'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { FiPlay } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { useGetLatestEntryTests, useStartEntryTest } from '@/hooks/api/lecturer/exams/use-entry-test'
import { LoadingPage } from '@/components/ui'
import { saveQuestionSet } from '@/lib/utils/exam-test-indb'

export default function EntryTestPage() {
  const router = useRouter()
  const { data, isLoading } = useGetLatestEntryTests()
  const startMutation = useStartEntryTest()

  if (isLoading) return <LoadingPage />

  const handleOnClick = async () => {
    if (!data?.entry_test_id) return
    try {
      const res = await startMutation.mutateAsync(data.entry_test_id)
      await saveQuestionSet({
      entry_test_id: res.entry_test_id,
      question_set_id: res.question_set_id,
    })
      router.push('/entry-test/exam-test')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-greyscale-25'>
      <Card className='w-full max-w-4xl rounded shadow-lg'>
        <CardContent className='p-4'>
          <div className='flex flex-col items-center mb-6'>
            <Image src='/Naviora.svg' width={80} height={70} alt='Naviora' className='mb-2' />
            <h1 className='text-2xl font-bold text-center text-greyscale-900 mb-1'>Bài kiểm tra đầu vào</h1>
            <div className='text-greyscale-500 text-center text-base'>Đánh giá học lực học sinh</div>
          </div>
          <div className='border rounded-lg bg-primary-0 border-primary-200 p-4 mb-4'>
            <div className='font-semibold mb-2 text-primary-200 '>Hướng dẫn làm bài:</div>
            <ul className='space-y-2 text-greyscale-800 text-sm'>
              <li className='flex items-center gap-2'>
                <RiVerifiedBadgeLine size={20} className='text-primary' />
                <span>
                  Bài kiểm tra gồm <b>10 câu trắc nghiệm</b>
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <MdOutlineAccessTime size={20} className='text-primary' />
                <span>
                  Thời gian làm bài: <b>45 phút</b>
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <MdErrorOutline size={20} className='text-primary' />
                <span>
                  Bạn chỉ có thể làm bài kiểm tra này <b>1 lần</b>
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <IoMdInformationCircleOutline size={20} className='text-primary' />
                <span>
                  Chọn đáp án <b>đúng nhất</b> cho mỗi câu hỏi
                </span>
              </li>
              <li className='flex items-center gap-2'>
                <MdOutlineOutlinedFlag size={20} className='text-primary' />
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
            <Button
              className='flex justify-center items-center font-semibold gap-2'
              onClick={handleOnClick}
              disabled={startMutation.isPending}
            >
              Bắt đầu làm bài
              <FiPlay />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { Progress } from '@/components/ui/progress'
import { MdOutlineTimer } from 'react-icons/md'

export function ExamTestHeader({
  title,
  description,
  progress,
  time
}: {
  title: string
  description: string
  progress: number
  time: string
}) {
  return (
    <div className='border-b bg-white dark:bg-neutral-800 px-40 py-2'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='font-semibold text-lg text-gray-900 dark:text-white'>{title}</div>
          <div className='text-gray-500 dark:text-gray-300 text-sm'>{description}</div>
        </div>
        <div className='flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold'>
          <MdOutlineTimer size={20} />
          {time}
        </div>
      </div>

      <Progress value={progress} className='w-full h-2 inline-block' />
    </div>
  )
}

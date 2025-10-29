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
    <div className='border-b bg-greyscale-0 px-40 py-2'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='font-semibold text-lg text-greyscale-900 '>{title}</div>
          <div className='text-greyscale-500  text-sm'>{description}</div>
        </div>
        <div className='flex items-center gap-2 text-greyscale-700 font-semibold'>
          <MdOutlineTimer size={20} />
          {time}
        </div>
      </div>

      <Progress value={progress} className='w-full h-2 inline-block' />
    </div>
  )
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { IoFlag } from 'react-icons/io5'

interface ExamQuestionSidebarProps {
  totalQuestions: number
  selected: { [key: number]: number }
  flagged: number[]
  current: number
  onJump: (idx: number) => void
  answeredCount: number
  onSubmit: () => void
  isSubmitting?: boolean
}

export function ExamQuestionSidebar({
  totalQuestions,
  selected,
  flagged,
  current,
  onJump,
  answeredCount,
  onSubmit,
  isSubmitting
}: ExamQuestionSidebarProps) {
  return (
    <div className='bg-greyscale-0 rounded-xl shadow p-6 col-span-4 flex flex-col'>
      <div className='font-semibold mb-4'>Danh sách câu hỏi</div>
      <div className='grid grid-cols-8 gap-1 mb-4'>
        {[...Array(totalQuestions)].map((_, i) => {
          const isCurrent = current === i
          const isAnswered = selected[i + 1] !== undefined
          return (
            <div key={i} className='relative'>
              <Button
                size='icon'
                variant='outline'
                className={`
                  w-full h-10 text-base font-semibold transition-all
                  ${isCurrent ? 'bg-primary! text-white' : isAnswered ? 'bg-success-25! text-success-200' : ''}
                `}
                onClick={() => onJump(i)}
              >
                {i + 1}
              </Button>
              {flagged.includes(i + 1) && (
                <IoFlag className='absolute top-1 right-1 text-yellow-500 text-xs' style={{ pointerEvents: 'none' }} />
              )}
            </div>
          )
        })}
      </div>
      <div className='text-sm text-greyscale-600 mb-3'>
        Đã trả lời: <span className='font-semibold'>{answeredCount}</span>/{totalQuestions} câu
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className='w-full bg-success-200 hover:bg-green-700 text-white font-semibold' disabled={isSubmitting}>
            {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận nộp bài</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn đã trả lời <b>{answeredCount}</b> trên tổng số <b>{totalQuestions}</b> câu hỏi. Sau khi nộp, bạn sẽ
              không thể chỉnh sửa câu trả lời.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Đang nộp...' : 'Xác nhận nộp'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

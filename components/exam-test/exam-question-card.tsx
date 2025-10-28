/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Answer, Question } from "@/lib/validations/lecturer/exams/question"
import { IoFlagOutline } from "react-icons/io5"

export function ExamQuestionCard({
  question,
  current,
  selected,
  onSelect,
  flagged,
  onFlag,
  onPrev,
  onNext,
  disablePrev,
  disableNext
}: {
  question: Question
  current: number
  selected: { [key: number]: number }
  onSelect: (idx: number) => void
  flagged: number[]
  onFlag: () => void
  onPrev: () => void
  onNext: () => void
  disablePrev: boolean
  disableNext: boolean
}) {
  return (
    <div className='bg-greyscale-0 rounded shadow p-5 col-span-8'>
      <div className='mb-6 flex justify-between items-center gap-2'>
        <span className='bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 px-3 py-1 rounded font-semibold text-sm'>
          Câu {current + 1}
        </span>
        <Button
          variant='ghost'
          size='sm'
          className={`ml-2 px-2 py-1 text-xs ${flagged.includes(current + 1) ? 'text-yellow-400' : 'text-greyscale-400'}`}
          onClick={onFlag}
        >
          <IoFlagOutline/>
        </Button>
      </div>
      <div className='font-medium text-base mb-6'>{question?.content}</div>
      <div className='flex flex-col gap-3 mb-8'>
        {question?.answers.map((ans: Answer, idx: number) => (
          <label
            key={ans.answer_id}
            className={`flex items-center border rounded px-4 py-3 cursor-pointer transition ${
              selected[current + 1] === idx
                ? 'border-primary bg-blue-50 dark:bg-blue-950'
                : 'border-greyscale-200'
            }`}
            onClick={() => onSelect(idx)}
          >
            <input type='radio' checked={selected[current + 1] === idx} readOnly className='mr-3 accent-primary' />
            <span className='font-medium'>{ans.content}</span>
          </label>
        ))}
      </div>
      <div className='flex justify-between'>
        <Button variant='outline' size='lg' disabled={disablePrev} onClick={onPrev}>
          &lt; Câu trước
        </Button>
        <Button size='lg' disabled={disableNext} onClick={onNext}>
          Câu tiếp theo &gt;
        </Button>
      </div>
    </div>
  )
}
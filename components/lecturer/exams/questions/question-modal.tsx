/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React, { useState } from 'react'
import { DIFFICULTY_LEVELS, QUESTION_TYPES } from '@/lib/constants/exams'
import { Checkbox } from '@/components/ui/checkbox'

interface QuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: {
    type?: string
    difficulty?: string
    question?: string
    options?: string[]
    answer?: string
  }
  onSubmit: (data: any) => void
}

export function QuestionDialog({ open, onOpenChange, initialData, onSubmit }: QuestionDialogProps) {
  const [type, setType] = useState(initialData?.type || '')
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || '')
  const [question, setQuestion] = useState(initialData?.question || '')
  const [options, setOptions] = useState(initialData?.options || ['', '', '', ''])
  const [correctIndexes, setCorrectIndexes] = useState<number[]>([])

  const handleChangeOption = (idx: number, value: string) => {
    const newOptions = [...options]
    newOptions[idx] = value
    setOptions(newOptions)
  }

  const handleToggleCorrect = (idx: number) => {
    setCorrectIndexes((prev) =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  const handleSubmit = () => {
    onSubmit({
      type,
      difficulty,
      question,
      options,
      correctIndexes
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</DialogTitle>
        </DialogHeader>
        <div className='space-y-3'>
          <div className='flex gap-2'>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className='w-1/2'>
                <SelectValue placeholder='Loại đề' />
              </SelectTrigger>
              <SelectContent>
                {QUESTION_TYPES.filter((t) => t.value !== 'ALL').map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className='w-1/2'>
                <SelectValue placeholder='Độ khó' />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.filter((d) => d.value !== 'ALL').map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            className='w-full'
            placeholder='Câu hỏi'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className='space-y-1'>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Checkbox
                  checked={correctIndexes.includes(idx)}
                  onCheckedChange={() => handleToggleCorrect(idx)}
                  id={`answer-correct-${idx}`}
                />
                <Input
                  className='w-full'
                  placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                  value={opt}
                  onChange={(e) => handleChangeOption(idx, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Hủy</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>{initialData ? 'Lưu' : 'Thêm'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

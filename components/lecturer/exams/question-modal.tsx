/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

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
  const [answer, setAnswer] = useState(initialData?.answer || '')

  const handleChangeOption = (idx: number, value: string) => {
    const newOptions = [...options]
    newOptions[idx] = value
    setOptions(newOptions)
  }

  const handleSubmit = () => {
    onSubmit({ type, difficulty, question, options, answer })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Câu hỏi"
            value={question}
            onChange={e => setQuestion(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              className="w-1/2 border rounded px-2 py-1"
              placeholder="Loại đề"
              value={type}
              onChange={e => setType(e.target.value)}
            />
            <input
              className="w-1/2 border rounded px-2 py-1"
              placeholder="Độ khó"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            {options.map((opt, idx) => (
              <input
                key={idx}
                className="w-full border rounded px-2 py-1"
                placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                value={opt}
                onChange={e => handleChangeOption(idx, e.target.value)}
              />
            ))}
          </div>
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Đáp án đúng"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>{initialData ? 'Lưu' : 'Thêm'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import React, { useState } from 'react'

interface QuestionSetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: any
  onSubmit: (data: any) => void
}

export function QuestionSetModal({ open, onOpenChange, initialData, onSubmit }: QuestionSetModalProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [questions, setQuestions] = useState(initialData?.questions || [])
  const [showAnswers, setShowAnswers] = useState(false)
  const [score, setScore] = useState(initialData?.score || 15)
  const [duration, setDuration] = useState(initialData?.duration || 45)
  const [passingScore, setPassingScore] = useState(initialData?.passingScore || 5)
  const [perQuestion, setPerQuestion] = useState(initialData?.perQuestion || false)
  const [showCorrectAfterSubmit, setShowCorrectAfterSubmit] = useState(initialData?.showCorrectAfterSubmit || false)
  const [maxAttempts, setMaxAttempts] = useState(initialData?.maxAttempts || 1)
  const [shuffleQuestions, setShuffleQuestions] = useState(initialData?.shuffleQuestions || false)
  const [shuffleAnswers, setShuffleAnswers] = useState(initialData?.shuffleAnswers || false)
  const [enableTabTracking, setEnableTabTracking] = useState(initialData?.enableTabTracking || false)
  const [enableCopyPasteRestriction, setEnableCopyPasteRestriction] = useState(initialData?.enableCopyPasteRestriction || false)

  const handleSubmit = () => {
    onSubmit({ title, description, questions, score, duration, passingScore, perQuestion, showCorrectAfterSubmit, maxAttempts, shuffleQuestions, shuffleAnswers, enableTabTracking, enableCopyPasteRestriction })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1200px] w-full bg-white">
        <DialogHeader>
          <DialogTitle className="pb-2">Tạo bài kiểm tra mới</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-12 gap-3">
          {/* Left panel */}
          <div className="col-span-8 bg-gray-50 rounded-lg p-6 border max-h-[70vh] overflow-y-auto">
            <Input
              className="mb-3"
              placeholder="Tên bài kiểm tra"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <Input
              className="mb-4"
              placeholder="Vui lòng nhập mô tả (không bắt buộc)"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            {/* Danh sách câu hỏi */}
            <div className="space-y-3">
              {questions.map((q: any, idx: number) => (
                <div key={idx} className="bg-white rounded p-4 border mb-2">
                  <div className="flex gap-2 mb-1">
                    <span className="bg-gray-200 text-xs px-2 py-0.5 rounded">{q.type}</span>
                    <span className="bg-gray-200 text-xs px-2 py-0.5 rounded">{q.difficulty}</span>
                  </div>
                  <div className="font-medium mb-1">{idx + 1}. {q.content}</div>
                  <ul>
                    {q.answers.map((opt: any) => (
                      <li key={opt.answer_id} className="text-gray-700 text-sm">{opt.content}</li>
                    ))}
                  </ul>
                  {showAnswers && (
                    <div className="text-green-700 text-sm">
                      <span className="font-semibold">Đáp án: </span>
                      {q.answers.filter((a: any) => a.is_correct).map((a: any) => a.content).join(', ')}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span>Điểm</span>
                    <Input type="number" className="w-16" value={q.score || 5} />
                    <Button variant="ghost" size="sm">Di chuyển lên</Button>
                    <Button variant="ghost" size="sm">Di chuyển xuống</Button>
                    <Button variant="ghost" size="sm" className="text-error">Xóa</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right panel */}
          <div className="col-span-4 bg-white rounded-lg p-6 border space-y-6 max-h-[70vh] overflow-y-auto">
            <div>
              <span className="font-semibold block mb-2">Thời gian</span>
              <Input
                type="number"
                placeholder="Thời gian làm bài (phút)"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
              />
            </div>
            <div>
              <span className="font-semibold block mb-2">Tổng số câu hỏi</span>
              <Input
                type="number"
                placeholder="Tổng số câu hỏi"
                value={questions.length}
                disabled
              />
            </div>
            <div>
              <span className="font-semibold block mb-2">Đánh giá</span>
              <Input
                type="number"
                placeholder="Điểm đạt"
                value={passingScore}
                onChange={e => setPassingScore(Number(e.target.value))}
              />
              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  checked={perQuestion}
                  onCheckedChange={setPerQuestion}
                  id="per-question"
                />
                <label htmlFor="per-question" className="text-sm">Chấm điểm từng câu hỏi</label>
              </div>
            </div>
            <div>
              <span className="font-semibold block mb-2">Hành vi</span>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={showCorrectAfterSubmit}
                  onCheckedChange={setShowCorrectAfterSubmit}
                  id="show-correct"
                />
                <label htmlFor="show-correct" className="text-sm">Hiện đáp án đúng sau khi nộp</label>
              </div>
              <Input
                type="number"
                placeholder="Số lần làm tối đa"
                value={maxAttempts}
                onChange={e => setMaxAttempts(Number(e.target.value))}
              />
            </div>
            <div>
              <span className="font-semibold block mb-2">Cấu hình nâng cao</span>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={shuffleQuestions}
                  onCheckedChange={setShuffleQuestions}
                  id="shuffle-questions"
                />
                <label htmlFor="shuffle-questions" className="text-sm">Trộn thứ tự câu hỏi</label>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={shuffleAnswers}
                  onCheckedChange={setShuffleAnswers}
                  id="shuffle-answers"
                />
                <label htmlFor="shuffle-answers" className="text-sm">Trộn thứ tự đáp án</label>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={enableTabTracking}
                  onCheckedChange={setEnableTabTracking}
                  id="tab-tracking"
                />
                <label htmlFor="tab-tracking" className="text-sm">Theo dõi chuyển tab</label>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  checked={enableCopyPasteRestriction}
                  onCheckedChange={setEnableCopyPasteRestriction}
                  id="copy-paste"
                />
                <label htmlFor="copy-paste" className="text-sm">Chặn copy/paste</label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>Tạo mới</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
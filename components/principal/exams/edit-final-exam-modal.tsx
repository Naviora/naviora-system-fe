'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateFinalExam } from '@/hooks/api/principal/use-final-exams'
import type { FinalExamDto } from '@/hooks/api/principal/use-final-exams'

interface EditFinalExamModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  finalExam: FinalExamDto
  onSuccess?: () => void
}

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Nháp' },
  { value: 'PUBLISHED', label: 'Đã xuất bản' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'COMPLETED', label: 'Đã hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' }
]

export function EditFinalExamModal({ open, onOpenChange, finalExam, onSuccess }: EditFinalExamModalProps) {
  const [formData, setFormData] = React.useState({
    title: finalExam.title,
    description: finalExam.description,
    status: finalExam.status,
    start_time: format(new Date(finalExam.start_time), "yyyy-MM-dd'T'HH:mm"),
    end_time: format(new Date(finalExam.end_time), "yyyy-MM-dd'T'HH:mm")
  })

  const updateMutation = useUpdateFinalExam({
    onSuccess: () => {
      toast.success('Bài thi đã được cập nhật thành công', {
        description: `${formData.title} đã được cập nhật`
      })
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật bài thi', {
        description: error.message || 'Vui lòng thử lại'
      })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Lỗi', { description: 'Vui lòng nhập tiêu đề bài thi' })
      return
    }

    if (!formData.description.trim()) {
      toast.error('Lỗi', { description: 'Vui lòng nhập mô tả bài thi' })
      return
    }

    const startTime = new Date(formData.start_time)
    const endTime = new Date(formData.end_time)

    if (startTime >= endTime) {
      toast.error('Lỗi', { description: 'Thời gian bắt đầu phải trước thời gian kết thúc' })
      return
    }

    updateMutation.mutate({
      id: finalExam.final_exam_id,
      payload: {
        title: formData.title,
        description: formData.description,
        status: formData.status as 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString()
      }
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!updateMutation.isPending) {
      onOpenChange(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài thi cuối kỳ</DialogTitle>
          <DialogDescription>Cập nhật thông tin bài thi cuối kỳ</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Title */}
          <div className='space-y-2'>
            <Label htmlFor='title'>Tiêu đề</Label>
            <Input
              id='title'
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder='Nhập tiêu đề bài thi'
              disabled={updateMutation.isPending}
            />
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description'>Mô tả</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder='Nhập mô tả bài thi'
              rows={4}
              disabled={updateMutation.isPending}
            />
          </div>

          {/* Status */}
          <div className='space-y-2'>
            <Label htmlFor='status'>Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  status: value as 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
                })
              }
            >
              <SelectTrigger id='status' disabled={updateMutation.isPending}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Time */}
          <div className='space-y-2'>
            <Label htmlFor='start_time'>Thời gian bắt đầu</Label>
            <Input
              id='start_time'
              type='datetime-local'
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              disabled={updateMutation.isPending}
            />
          </div>

          {/* End Time */}
          <div className='space-y-2'>
            <Label htmlFor='end_time'>Thời gian kết thúc</Label>
            <Input
              id='end_time'
              type='datetime-local'
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              disabled={updateMutation.isPending}
            />
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Hủy
            </Button>
            <Button type='submit' disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

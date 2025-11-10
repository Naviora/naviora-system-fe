'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { EntryTestDto } from '@/hooks/api/principal/use-entry-tests'

interface EditEntryTestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entryTest: EntryTestDto
  onSubmit?: (data: Partial<EntryTestDto>) => void | Promise<void>
  isLoading?: boolean
}

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Nháp' },
  { value: 'PUBLISHED', label: 'Đã xuất bản' },
  { value: 'CLOSED', label: 'Đã đóng' }
]

export function EditEntryTestModal({
  open,
  onOpenChange,
  entryTest,
  onSubmit,
  isLoading = false
}: EditEntryTestModalProps) {
  const [formData, setFormData] = React.useState({
    title: entryTest.title,
    description: entryTest.description,
    status: entryTest.status,
    start_time: format(new Date(entryTest.start_time), "yyyy-MM-dd'T'HH:mm"),
    end_time: format(new Date(entryTest.end_time), "yyyy-MM-dd'T'HH:mm")
  })

  React.useEffect(() => {
    if (open) {
      setFormData({
        title: entryTest.title,
        description: entryTest.description,
        status: entryTest.status,
        start_time: format(new Date(entryTest.start_time), "yyyy-MM-dd'T'HH:mm"),
        end_time: format(new Date(entryTest.end_time), "yyyy-MM-dd'T'HH:mm")
      })
    }
  }, [open, entryTest])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit?.(formData)
    onOpenChange(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài thi</DialogTitle>
          <DialogDescription>Cập nhật thông tin bài thi vào đây</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Title */}
          <div className='space-y-2'>
            <Label htmlFor='title'>Tên bài thi</Label>
            <Input
              id='title'
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder='Nhập tên bài thi'
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description'>Mô tả</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder='Nhập mô tả bài thi'
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* Status */}
          <div className='space-y-2'>
            <Label htmlFor='status'>Trạng thái</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)} disabled={isLoading}>
              <SelectTrigger id='status'>
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
              onChange={(e) => handleChange('start_time', e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* End Time */}
          <div className='space-y-2'>
            <Label htmlFor='end_time'>Thời gian kết thúc</Label>
            <Input
              id='end_time'
              type='datetime-local'
              value={formData.end_time}
              onChange={(e) => handleChange('end_time', e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

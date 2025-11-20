'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, X } from 'lucide-react'
import { useUploadAvatar } from '@/hooks/api/use-profile'
import { toast } from 'sonner'

interface AvatarUploadProps {
  currentAvatar?: string
  userName?: string
}

export function AvatarUpload({ currentAvatar, userName = 'User' }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null)
  const [file, setFile] = useState<File | null>(null)
  const uploadMutation = useUploadAvatar()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Vui lòng chọn một tệp hình ảnh')
        return
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('Kích thước tệp phải nhỏ hơn 5MB')
        return
      }

      setFile(selectedFile)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Vui lòng chọn tệp trước')
      return
    }

    try {
      await uploadMutation.mutateAsync(file)
      toast.success('Tải ảnh đại diện thành công')
      setFile(null)
    } catch (error) {
      toast.error('Tải ảnh đại diện thất bại')
      console.error(error)
    }
  }

  const handleClear = () => {
    setPreview(null)
    setFile(null)
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-6'>
        {/* Avatar Preview */}
        <div className='flex justify-center'>
          <div className='relative w-32 h-32 rounded-full overflow-hidden border-2 border-greyscale-200 bg-greyscale-50'>
            {preview ? (
              <Image src={preview} alt={userName} fill className='object-cover' priority />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-greyscale-400'>
                <span className='text-sm'>Chưa có ảnh</span>
              </div>
            )}
          </div>
        </div>

        {/* File Input */}
        <div className='space-y-2'>
          <label htmlFor='avatar-input' className='text-sm font-medium text-greyscale-700'>
            Tải ảnh đại diện mới
          </label>
          <div className='flex gap-2'>
            <Input id='avatar-input' type='file' accept='image/*' onChange={handleFileChange} className='flex-1' />
          </div>
          <p className='text-xs text-greyscale-500'>Định dạng hỗ trợ: JPG, PNG, GIF. Dung lượng tối đa: 5MB</p>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2 justify-center'>
          {file && (
            <>
              <Button onClick={handleUpload} disabled={uploadMutation.isPending} className='gap-2'>
                <Upload className='w-4 h-4' />
                {uploadMutation.isPending ? 'Đang tải lên...' : 'Tải lên'}
              </Button>
              <Button onClick={handleClear} variant='outline' className='gap-2'>
                <X className='w-4 h-4' />
                Hủy
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

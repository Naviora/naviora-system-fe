'use client'

import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Upload, X, Loader2, File, FileImage, FileVideo, Music, FileText } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useUploadMaterial } from '@/hooks/api/use-materials'
import { ErrorHandler } from '@/lib/utils/error-handler'
import type { MaterialDto } from '@/lib/validations/modules'

interface MaterialDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (material: MaterialDto) => Promise<void>
  isSubmitting?: boolean
}

interface MaterialUploadState {
  selectedFile: File | null
  materialName: string
  materialType: 'image' | 'video' | 'pdf' | 'document' | 'audio' | 'other'
  isUploading: boolean
  uploadedMaterial: MaterialDto | null
}

const MATERIAL_TYPE_ICONS: Record<MaterialUploadState['materialType'], React.ReactNode> = {
  image: <FileImage className='h-4 w-4' />,
  video: <FileVideo className='h-4 w-4' />,
  pdf: <FileText className='h-4 w-4' />,
  document: <FileText className='h-4 w-4' />,
  audio: <Music className='h-4 w-4' />,
  other: <File className='h-4 w-4' />
}

const MATERIAL_TYPE_LABELS: Record<MaterialUploadState['materialType'], string> = {
  image: 'Hình ảnh',
  video: 'Video',
  pdf: 'PDF',
  document: 'Tài liệu',
  audio: 'Âm thanh',
  other: 'Khác'
}

export function MaterialDialog({ isOpen, onOpenChange, onSubmit, isSubmitting }: MaterialDialogProps) {
  const uploadMaterialMutation = useUploadMaterial()
  const [uploadState, setUploadState] = useState<MaterialUploadState>({
    selectedFile: null,
    materialName: '',
    materialType: 'image',
    isUploading: false,
    uploadedMaterial: null
  })

  const isUploadDisabled =
    !uploadState.selectedFile || !uploadState.materialName || uploadState.isUploading || isSubmitting

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadState((prev) => ({
        ...prev,
        selectedFile: file,
        materialName: uploadState.materialName || file.name.replace(/\.[^/.]+$/, '') // Remove extension
      }))
    }
  }

  const handleMaterialNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUploadState((prev) => ({
      ...prev,
      materialName: event.target.value
    }))
  }

  const handleMaterialTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setUploadState((prev) => ({
      ...prev,
      materialType: event.target.value as MaterialUploadState['materialType']
    }))
  }

  const handleRemoveFile = () => {
    setUploadState((prev) => ({
      ...prev,
      selectedFile: null,
      uploadedMaterial: null
    }))
  }

  const handleUploadFile = async () => {
    if (!uploadState.selectedFile || !uploadState.materialName) {
      toast.error('Vui lòng chọn file và nhập tên tài liệu')
      return
    }

    const formData = new FormData()
    formData.append('file', uploadState.selectedFile)
    formData.append('material_name', uploadState.materialName)
    formData.append('material_type', uploadState.materialType)

    try {
      setUploadState((prev) => ({ ...prev, isUploading: true }))
      const response = await uploadMaterialMutation.mutateAsync(formData)
      setUploadState((prev) => ({
        ...prev,
        uploadedMaterial: response.data,
        isUploading: false
      }))
      toast.success('Tệp đã được tải lên thành công')
    } catch (error) {
      ErrorHandler.logError(error, 'material-upload')
      toast.error(ErrorHandler.getErrorMessage(error))
      setUploadState((prev) => ({ ...prev, isUploading: false }))
    }
  }

  const handleDialogSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!uploadState.uploadedMaterial) {
      toast.error('Vui lòng tải lên tài liệu trước')
      return
    }

    try {
      await onSubmit(uploadState.uploadedMaterial)
      // Reset form after successful submission
      setUploadState({
        selectedFile: null,
        materialName: '',
        materialType: 'image',
        isUploading: false,
        uploadedMaterial: null
      })
      onOpenChange(false)
    } catch (error) {
      ErrorHandler.logError(error, 'material-dialog-submit')
      toast.error(ErrorHandler.getErrorMessage(error))
    }
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when closing
      setUploadState({
        selectedFile: null,
        materialName: '',
        materialType: 'image',
        isUploading: false,
        uploadedMaterial: null
      })
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className='w-full max-w-[520px] gap-0 overflow-hidden rounded-md border border-greyscale-200 bg-greyscale-0 p-0 shadow-2xl'>
        <form onSubmit={handleDialogSubmit} className='flex flex-col gap-0'>
          <DialogHeader className='border-b border-greyscale-100 px-6 py-5'>
            <DialogTitle className='text-left text-xl font-semibold text-greyscale-900'>
              Thêm tài liệu cho bài học
            </DialogTitle>
            <DialogDescription className='text-left text-sm text-greyscale-500'>
              Tải lên tệp và điền mô tả nội dung của tài liệu.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-5 px-6 py-6'>
            {/* File Upload Section */}
            <div className='space-y-2'>
              <Label htmlFor='material-file'>Tệp tài liệu *</Label>

              {!uploadState.uploadedMaterial ? (
                <div className='space-y-3'>
                  <div className='relative'>
                    <input
                      id='material-file'
                      type='file'
                      onChange={handleFileSelect}
                      disabled={uploadState.isUploading || isSubmitting}
                      className='hidden'
                      accept='image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,audio/*'
                    />
                    <label
                      htmlFor='material-file'
                      className={cn(
                        'flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-greyscale-200 bg-greyscale-25 p-6 cursor-pointer transition-colors',
                        uploadState.selectedFile ? 'border-primary bg-primary-0' : 'hover:border-greyscale-300'
                      )}
                    >
                      <Upload className='h-5 w-5 text-greyscale-400' aria-hidden='true' />
                      <div className='text-center min-w-0'>
                        {uploadState.selectedFile ? (
                          <div className='space-y-1'>
                            <p className='text-sm font-medium text-greyscale-900'>Đã chọn:</p>
                            <p
                              className='text-sm font-medium text-greyscale-900 truncate px-2'
                              title={uploadState.selectedFile.name}
                            >
                              {uploadState.selectedFile.name}
                            </p>
                          </div>
                        ) : (
                          <p className='text-sm font-medium text-greyscale-900'>Chọn hoặc kéo thả tệp</p>
                        )}
                        <p className='text-xs text-greyscale-500'>Hỗ trợ: hình ảnh, video, PDF, tài liệu, âm thanh</p>
                      </div>
                    </label>
                  </div>

                  {uploadState.selectedFile && (
                    <div className='space-y-3'>
                      <div className='space-y-2'>
                        <Label htmlFor='material-name'>Tên tài liệu *</Label>
                        <Input
                          id='material-name'
                          placeholder='Nhập tên tài liệu'
                          value={uploadState.materialName}
                          onChange={handleMaterialNameChange}
                          disabled={uploadState.isUploading || isSubmitting}
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='material-type'>Loại tài liệu *</Label>
                        <select
                          id='material-type'
                          value={uploadState.materialType}
                          onChange={handleMaterialTypeChange}
                          disabled={uploadState.isUploading || isSubmitting}
                          className='flex h-10 w-full rounded-md border border-greyscale-200 bg-greyscale-0 px-3 py-2 text-sm placeholder:text-greyscale-400 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                          <option value='image'>Hình ảnh</option>
                          <option value='video'>Video</option>
                          <option value='pdf'>PDF</option>
                          <option value='document'>Tài liệu</option>
                          <option value='audio'>Âm thanh</option>
                          <option value='other'>Khác</option>
                        </select>
                      </div>

                      <Button
                        type='button'
                        onClick={handleUploadFile}
                        disabled={isUploadDisabled}
                        className='h-10 w-full rounded-sm bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90'
                      >
                        {uploadState.isUploading ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' aria-hidden='true' />
                            Đang tải lên...
                          </>
                        ) : (
                          <>
                            <Upload className='mr-2 h-4 w-4' aria-hidden='true' />
                            Tải lên tệp
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className='flex items-center justify-between gap-3 rounded-md border border-greyscale-200 bg-greyscale-25 p-4'>
                  <div className='flex items-center gap-3 flex-1 min-w-0'>
                    <span className='flex-shrink-0 text-greyscale-400'>
                      {MATERIAL_TYPE_ICONS[uploadState.materialType]}
                    </span>
                    <div className='min-w-0 flex-1'>
                      <p className='text-sm font-medium text-greyscale-900 truncate'>
                        {uploadState.uploadedMaterial.material_name}
                      </p>
                      <p className='text-xs text-greyscale-500'>{MATERIAL_TYPE_LABELS[uploadState.materialType]}</p>
                    </div>
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={handleRemoveFile}
                    disabled={isSubmitting}
                    className='h-8 w-8 flex-shrink-0 rounded-full text-greyscale-400 hover:bg-greyscale-100 hover:text-greyscale-600'
                  >
                    <X className='h-4 w-4' aria-hidden='true' />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className='border-t border-greyscale-100 bg-greyscale-25 px-6 py-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleDialogOpenChange(false)}
              disabled={uploadState.isUploading || isSubmitting}
              className='h-10 rounded-sm border-greyscale-200 bg-greyscale-0 px-6 text-sm font-medium text-greyscale-700 hover:bg-greyscale-50'
            >
              Hủy bỏ
            </Button>
            <Button
              type='submit'
              disabled={!uploadState.uploadedMaterial || isSubmitting}
              className='h-10 rounded-sm bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' aria-hidden='true' />
                  Đang lưu...
                </>
              ) : (
                'Lưu tài liệu'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

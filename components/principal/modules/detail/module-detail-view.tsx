'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { BookOpen, CalendarClock, ChevronDown, ClipboardList, Eye, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { QUERY_KEYS } from '@/lib/constants/config'
import { useCreateLesson, useDeleteLesson, useUpdateLesson } from '@/hooks/api/use-lessons'
import { ErrorHandler } from '@/lib/utils/error-handler'
import { cn, formatDateTime } from '@/lib/utils'
import type { LessonDto, ModuleDetailDto } from '@/lib/validations/modules'

interface ModuleDetailViewProps {
  module: ModuleDetailDto
  lessons: LessonDto[]
  isLessonsLoading?: boolean
}

interface LessonFormState {
  title: string
  description: string
}

const LESSON_FORM_DEFAULT: LessonFormState = {
  title: '',
  description: ''
}

export function ModuleDetailView({ module, lessons, isLessonsLoading }: ModuleDetailViewProps) {
  const queryClient = useQueryClient()
  const createLessonMutation = useCreateLesson()
  const updateLessonMutation = useUpdateLesson()
  const deleteLessonMutation = useDeleteLesson()
  const [lessonForm, setLessonForm] = useState<LessonFormState>({ ...LESSON_FORM_DEFAULT })
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false)
  const [lessonDialogMode, setLessonDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedLesson, setSelectedLesson] = useState<LessonDto | null>(null)
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null)
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null)

  const stats = useMemo(
    () => [
      { id: 'lessons', label: 'Số bài học', value: lessons.length.toString(), icon: BookOpen },
      { id: 'resources', label: 'Tổng số tài liệu', value: '—', icon: ClipboardList },
      {
        id: 'duration',
        label: 'Tổng thời lượng',
        value: '—',
        icon: CalendarClock
      },
      { id: 'students', label: 'Số học viên', value: '—', icon: BookOpen }
    ],
    [lessons.length]
  )

  const headerSubtitle = module.module_description?.trim() || 'Theo dõi và quản lý tiến độ giảng dạy của chuyên đề.'

  const handleLessonFieldChange =
    (field: keyof LessonFormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setLessonForm((previous) => ({ ...previous, [field]: event.target.value }))
    }

  const openLessonDialog = (mode: 'create' | 'edit', lesson?: LessonDto) => {
    setLessonDialogMode(mode)

    if (mode === 'edit' && lesson) {
      setSelectedLesson(lesson)
      setLessonForm({
        title: lesson.lesson_name,
        description: lesson.lesson_description ?? ''
      })
    } else {
      setSelectedLesson(null)
      setLessonForm({ ...LESSON_FORM_DEFAULT })
    }

    setIsLessonDialogOpen(true)
  }

  const closeLessonDialog = () => {
    setIsLessonDialogOpen(false)
    setSelectedLesson(null)
    setLessonForm({ ...LESSON_FORM_DEFAULT })
  }

  const handleLessonDialogOpenChange = (open: boolean) => {
    if (!open) {
      closeLessonDialog()
    } else {
      setIsLessonDialogOpen(true)
    }
  }

  const handleLessonDialogSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = lessonForm.title.trim()
    const trimmedDescription = lessonForm.description.trim()

    if (!trimmedTitle) {
      toast.error('Tiêu đề bài học không được để trống')
      return
    }

    const payload = {
      module_id: module.module_id,
      lesson_name: trimmedTitle,
      lesson_description: trimmedDescription || undefined
    }

    try {
      if (lessonDialogMode === 'create') {
        await createLessonMutation.mutateAsync(payload)
        toast.success('Đã thêm bài học mới')
      } else if (selectedLesson) {
        await updateLessonMutation.mutateAsync({
          lessonId: selectedLesson.lesson_id,
          data: payload
        })
        toast.success('Đã cập nhật bài học')
      }

      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULE_LESSONS(module.module_id) })
      closeLessonDialog()
    } catch (error) {
      ErrorHandler.logError(error, 'lesson-dialog-submit')
      toast.error(ErrorHandler.getErrorMessage(error))
    }
  }

  const handleDeleteLesson = async (lesson: LessonDto) => {
    if (deleteLessonMutation.isPending) {
      return
    }

    const shouldDelete = window.confirm(`Bạn có chắc chắn muốn xóa bài học “${lesson.lesson_name}”?`)

    if (!shouldDelete) {
      return
    }

    setDeletingLessonId(lesson.lesson_id)

    try {
      await deleteLessonMutation.mutateAsync(lesson.lesson_id)
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULE_LESSONS(module.module_id) })
      toast.success('Đã xóa bài học')
    } catch (error) {
      ErrorHandler.logError(error, 'lesson-delete')
      toast.error(ErrorHandler.getErrorMessage(error))
    } finally {
      setDeletingLessonId(null)
    }
  }

  useEffect(() => {
    if (!lessons.length) {
      setExpandedLessonId(null)
      return
    }

    setExpandedLessonId((previous) => {
      if (previous && lessons.some((lesson) => lesson.lesson_id === previous)) {
        return previous
      }

      return lessons[0]?.lesson_id ?? null
    })
  }, [lessons])

  const toggleLesson = (lessonId: string) => {
    setExpandedLessonId((previous) => (previous === lessonId ? null : lessonId))
  }

  const formatLessonTime = (value: string) =>
    formatDateTime(value, {
      hour: '2-digit',
      minute: '2-digit'
    })

  const isSubmitting = createLessonMutation.isPending || updateLessonMutation.isPending

  return (
    <div className='mx-auto flex w-full max-w-[1144px] flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 lg:px-8'>
      <Card className='flex flex-col gap-6 border-none bg-greyscale-0 shadow-lg ring-1 ring-greyscale-200/80 rounded-md'>
        <header className='flex flex-col gap-5 border-b border-greyscale-100 px-8 py-6 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:gap-5'>
            <div className='flex flex-col gap-2'>
              <div className='inline-flex w-fit items-center gap-2 rounded-full bg-primary-0 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary'>
                <span>{module.module_code}</span>
              </div>
              <div className='space-y-1'>
                <h1 className='text-2xl font-semibold text-greyscale-900 md:text-3xl'>{module.module_name}</h1>
                <p className='max-w-2xl text-sm text-greyscale-500'>{headerSubtitle}</p>
              </div>
            </div>
          </div>
        </header>

        <div className='flex flex-col gap-8 px-8 pb-8'>
          <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {stats.map((stat) => (
              <Card
                key={stat.id}
                className='flex flex-col gap-3 rounded-md border border-greyscale-100 bg-greyscale-25 px-5 py-4 shadow-xs'
              >
                <div className='flex items-center gap-3'>
                  <span className='grid size-10 place-content-center rounded-full bg-primary-0 text-primary'>
                    <stat.icon className='h-5 w-5' aria-hidden='true' />
                  </span>
                  <p className='text-sm font-medium text-greyscale-500'>{stat.label}</p>
                </div>
                <p className='text-xl font-semibold text-greyscale-900'>{stat.value}</p>
              </Card>
            ))}
          </section>

          <div className='flex flex-col gap-6'>
            <button
              type='button'
              onClick={() => openLessonDialog('create')}
              className='mx-auto flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-primary bg-primary-0 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
            >
              <Plus className='h-4 w-4' aria-hidden='true' />
              Thêm bài học mới
            </button>
          </div>

          <section className='space-y-6'>
            <div className='flex flex-col gap-2'>
              <h2 className='text-lg font-semibold text-greyscale-900'>Danh sách bài học</h2>
              <p className='text-sm text-greyscale-500'>Theo dõi chi tiết các bài học thuộc chuyên đề này.</p>
            </div>

            {isLessonsLoading ? (
              <div className='flex flex-col gap-5 py-6'>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`lesson-skeleton-${index}`}
                    className='space-y-3 rounded-2xl border border-greyscale-100 bg-greyscale-25/70 p-5'
                  >
                    <Skeleton className='h-5 w-2/3 rounded-md bg-greyscale-100' />
                    <Skeleton className='h-4 w-1/2 rounded-md bg-greyscale-100' />
                    <Skeleton className='h-10 w-full rounded-md bg-greyscale-100' />
                  </div>
                ))}
              </div>
            ) : lessons.length > 0 ? (
              <ul className='flex flex-col gap-4 py-6'>
                {lessons.map((lesson) => {
                  const isExpanded = expandedLessonId === lesson.lesson_id
                  const isDeletingLesson = deleteLessonMutation.isPending && deletingLessonId === lesson.lesson_id

                  return (
                    <li
                      key={lesson.lesson_id}
                      className='overflow-hidden rounded-md border border-greyscale-200 bg-greyscale-0 shadow-xs transition-shadow hover:shadow-sm'
                    >
                      <div className='flex w-full items-center justify-between gap-4 bg-greyscale-50 px-5 py-4 text-left transition-colors hover:bg-greyscale-50/70'>
                        <Button
                          size='icon'
                          variant={'ghost'}
                          onClick={() => toggleLesson(lesson.lesson_id)}
                          aria-expanded={isExpanded}
                          aria-controls={`lesson-details-${lesson.lesson_id}`}
                        >
                          <ChevronDown
                            className={cn(' -rotate-180 transition-transform', isExpanded ? 'rotate-0' : '')}
                            aria-hidden='true'
                          />
                        </Button>
                        <div className='flex flex-1 flex-col gap-2'>
                          <div className='flex items-center gap-2 text-sm font-semibold text-greyscale-900'>
                            <span>{lesson.lesson_name}</span>
                          </div>
                          <div className='flex flex-wrap items-center gap-3 text-xs text-greyscale-500'>
                            <span>0 tài liệu</span>
                            <span aria-hidden='true'>•</span>
                            <span>{formatLessonTime(lesson.updated_at)} phút</span>
                          </div>
                        </div>

                        <div className='flex items-center gap-2'>
                          <Button
                            type='button'
                            size='sm'
                            className='h-9 rounded-sm bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90'
                          >
                            <Plus className='h-4 w-4' aria-hidden='true' />
                            Thêm tài liệu
                          </Button>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-9 w-9 rounded-full text-greyscale-500 hover:bg-greyscale-25 hover:text-greyscale-700'
                            aria-label={`Chỉnh sửa tài liệu của bài học ${lesson.lesson_name}`}
                            onClick={() => openLessonDialog('edit', lesson)}
                          >
                            <Pencil className='h-4 w-4' aria-hidden='true' />
                          </Button>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-9 w-9 rounded-full text-greyscale-400 hover:bg-greyscale-25 hover:text-greyscale-600'
                            aria-label={`Xóa bài học ${lesson.lesson_name}`}
                            onClick={() => handleDeleteLesson(lesson)}
                            disabled={isDeletingLesson}
                          >
                            {isDeletingLesson ? (
                              <Loader2 className='h-4 w-4 animate-spin' aria-hidden='true' />
                            ) : (
                              <Trash2 className='h-4 w-4' aria-hidden='true' />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div
                        id={`lesson-details-${lesson.lesson_id}`}
                        className={cn(
                          'grid bg-greyscale-0 transition-all duration-300 ease-in-out',
                          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        )}
                      >
                        <div className='overflow-hidden border-t border-greyscale-200'>
                          <div className='flex items-center justify-between gap-6 px-5 py-4'>
                            <div className='flex flex-1 items-center gap-4'>
                              <span className='grid size-12 place-content-center rounded-xl bg-primary text-primary-foreground shadow-xs'>
                                <BookOpen className='h-5 w-5' aria-hidden='true' />
                              </span>
                              <div className='flex flex-col gap-1'>
                                <p className='text-sm font-medium text-greyscale-900'>{lesson.lesson_name}</p>
                                {lesson.lesson_description ? (
                                  <p className='text-sm text-greyscale-500'>{lesson.lesson_description}</p>
                                ) : (
                                  <p className='text-sm text-greyscale-400'>Chưa có mô tả chi tiết.</p>
                                )}
                                <div className='flex flex-wrap items-center gap-3 text-xs text-greyscale-400'>
                                  <span>Tạo {formatDateTime(lesson.created_at)}</span>
                                  <span aria-hidden='true'>•</span>
                                  <span>Cập nhật {formatDateTime(lesson.updated_at)}</span>
                                </div>
                              </div>
                            </div>
                            <div className='flex items-center gap-2'>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='h-9 w-9 rounded-full text-greyscale-500 hover:bg-greyscale-25 hover:text-greyscale-700'
                                aria-label={`Xem trước bài học ${lesson.lesson_name}`}
                              >
                                <Eye className='h-4 w-4' aria-hidden='true' />
                              </Button>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='h-9 w-9 rounded-full text-greyscale-500 hover:bg-greyscale-25 hover:text-greyscale-700'
                                aria-label={`Chỉnh sửa bài học ${lesson.lesson_name}`}
                                onClick={() => openLessonDialog('edit', lesson)}
                              >
                                <Pencil className='h-4 w-4' aria-hidden='true' />
                              </Button>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='h-9 w-9 rounded-full text-greyscale-500 hover:bg-greyscale-25 hover:text-greyscale-700'
                                aria-label={`Xóa bài học ${lesson.lesson_name}`}
                                onClick={() => handleDeleteLesson(lesson)}
                                disabled={isDeletingLesson}
                              >
                                {isDeletingLesson ? (
                                  <Loader2 className='h-4 w-4 animate-spin' aria-hidden='true' />
                                ) : (
                                  <Trash2 className='h-4 w-4' aria-hidden='true' />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className='flex flex-col items-center justify-center gap-4 px-6 py-12 text-center'>
                <span className='grid size-16 place-content-center rounded-full border border-dashed border-greyscale-200 bg-greyscale-25 text-greyscale-400'>
                  <BookOpen className='h-7 w-7' aria-hidden='true' />
                </span>
                <div className='space-y-1'>
                  <p className='text-sm font-semibold text-greyscale-700'>Chưa có bài học nào</p>
                  <p className='text-sm text-greyscale-500'>
                    Các bài học sẽ hiển thị tại đây khi được thêm vào chuyên đề.
                  </p>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => openLessonDialog('create')}
                  className='rounded-full border-dashed border-greyscale-200 bg-greyscale-0 px-4 py-2 text-xs font-semibold text-greyscale-600 hover:bg-greyscale-50'
                >
                  <Plus className='mr-2 h-4 w-4' aria-hidden='true' />
                  Thêm bài học đầu tiên
                </Button>
              </div>
            )}
          </section>
        </div>
      </Card>
      <Dialog open={isLessonDialogOpen} onOpenChange={handleLessonDialogOpenChange}>
        <DialogContent className='w-full max-w-[520px] gap-0 overflow-hidden rounded-md border border-greyscale-200 bg-greyscale-0 p-0 shadow-2xl'>
          <form onSubmit={handleLessonDialogSubmit} className='flex flex-col gap-0'>
            <DialogHeader className='border-b border-greyscale-100 px-6 py-5'>
              <DialogTitle className='text-left text-xl font-semibold text-greyscale-900'>
                {lessonDialogMode === 'create' ? 'Thêm bài học mới' : 'Chỉnh sửa bài học'}
              </DialogTitle>
              <DialogDescription className='text-left text-sm text-greyscale-500'>
                {lessonDialogMode === 'create'
                  ? 'Điền thông tin bài học để thêm vào chuyên đề này.'
                  : selectedLesson
                    ? `Cập nhật thông tin cho bài học “${selectedLesson.lesson_name}”.`
                    : 'Cập nhật thông tin bài học và lưu lại thay đổi.'}
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-5 px-6 py-6'>
              <div className='space-y-2'>
                <Label htmlFor='lesson-title'>Tiêu đề *</Label>
                <Input
                  id='lesson-title'
                  placeholder='Nhập tiêu đề của bài học'
                  value={lessonForm.title}
                  onChange={handleLessonFieldChange('title')}
                  disabled={isSubmitting}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lesson-description'>Mô tả *</Label>
                <Textarea
                  id='lesson-description'
                  placeholder='Nhập mô tả ngắn cho bài học'
                  value={lessonForm.description}
                  onChange={handleLessonFieldChange('description')}
                  className='min-h-[140px]'
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <DialogFooter className='border-t border-greyscale-100 bg-greyscale-25 px-6 py-4'>
              <Button
                type='button'
                variant='outline'
                onClick={closeLessonDialog}
                disabled={isSubmitting}
                className='h-10 rounded-sm border-greyscale-200 bg-greyscale-0 px-6 text-sm font-medium text-greyscale-700 hover:bg-greyscale-50'
              >
                Hủy bỏ
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='h-10 rounded-sm bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90'
              >
                {lessonDialogMode === 'create' ? 'Lưu bài học' : 'Cập nhật bài học'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

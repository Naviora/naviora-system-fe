'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, ChevronDown, Clock, Eye, FileText, Pencil, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { LecturerModuleDetail, LecturerModuleSection } from '@/types/lecturer/modules'

interface ModuleDetailViewProps {
  module: LecturerModuleDetail
}

interface NewLessonFormValues {
  title: string
  description: string
}

const INITIAL_FORM_VALUES: NewLessonFormValues = {
  title: '',
  description: ''
}

export function ModuleDetailView({ module }: ModuleDetailViewProps) {
  const router = useRouter()
  const [isNewLessonVisible, setIsNewLessonVisible] = React.useState(true)
  const [formValues, setFormValues] = React.useState<NewLessonFormValues>(INITIAL_FORM_VALUES)
  const [expandedSections, setExpandedSections] = React.useState(
    () => new Set(module.sections.filter((section) => section.isExpanded !== false).map((section) => section.id))
  )

  const handleFormFieldChange =
    <Field extends keyof NewLessonFormValues>(field: Field) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormValues((previous) => ({ ...previous, [field]: event.target.value }))
    }

  const handleNewLessonSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.info('Submitting new lesson for module %s', module.id, formValues)
    setFormValues(INITIAL_FORM_VALUES)
    setIsNewLessonVisible(false)
  }

  const handleCancelNewLesson = () => {
    setFormValues(INITIAL_FORM_VALUES)
    setIsNewLessonVisible(false)
  }

  const handleToggleSection = (section: LecturerModuleSection) => {
    setExpandedSections((previous) => {
      const next = new Set(previous)
      if (next.has(section.id)) {
        next.delete(section.id)
      } else {
        next.add(section.id)
      }
      return next
    })
  }

  const sectionIsExpanded = React.useCallback(
    (sectionId: string) => expandedSections.has(sectionId),
    [expandedSections]
  )

  return (
    <div className='mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 lg:px-0'>
      <div className='rounded-2xl border border-greyscale-200 bg-greyscale-0 shadow-sm'>
        <header className='flex flex-col gap-4 border-b border-greyscale-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-start gap-3 sm:items-center'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='h-10 w-10 rounded-full border border-greyscale-100 text-greyscale-500 hover:bg-greyscale-25'
              onClick={() => router.back()}
              aria-label='Quay lại danh sách chuyên đề'
            >
              <ArrowLeft className='h-5 w-5' aria-hidden='true' />
            </Button>

            <div className='flex flex-col'>
              <h1 className='text-xl font-semibold text-greyscale-900 sm:text-2xl'>{module.title}</h1>
              <p className='text-sm text-greyscale-500'>{module.subtitle}</p>
            </div>
          </div>

          <Button
            type='button'
            className='h-11 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90'
          >
            Lưu thay đổi
          </Button>
        </header>

        <div className='flex flex-col gap-6 px-6 py-6'>
          <section aria-labelledby='module-stats-heading'>
            <h2 id='module-stats-heading' className='sr-only'>
              Tổng quan chuyên đề
            </h2>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
              {module.stats.map((stat) => (
                <div
                  key={stat.id}
                  className='rounded-xl border border-greyscale-100 bg-greyscale-25 px-4 py-4 text-center shadow-xs'
                >
                  <p className='text-sm font-medium text-greyscale-500'>{stat.label}</p>
                  <p className='mt-2 text-lg font-semibold text-greyscale-900'>{stat.value}</p>
                </div>
              ))}
            </div>
          </section>

          <button
            type='button'
            onClick={() => setIsNewLessonVisible(true)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary bg-primary-0 px-4 py-3 text-sm font-medium text-primary transition-colors',
              'hover:bg-primary-0/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
            )}
          >
            <Plus className='h-4 w-4' aria-hidden='true' />
            Thêm bài học mới
          </button>

          {isNewLessonVisible && (
            <section
              className='rounded-xl border border-greyscale-200 bg-greyscale-0 p-6 shadow-xs'
              aria-labelledby='new-lesson-heading'
            >
              <div className='flex items-start justify-between gap-4'>
                <div className='space-y-1'>
                  <h2 id='new-lesson-heading' className='text-lg font-semibold text-greyscale-900'>
                    Bài học mới
                  </h2>
                  <p className='text-sm text-greyscale-500'>Điền thông tin bài học và lưu lại để thêm vào chuyên đề.</p>
                </div>

                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={handleCancelNewLesson}
                  className='h-8 w-8 rounded-full text-greyscale-400 hover:bg-greyscale-25 hover:text-greyscale-600'
                  aria-label='Đóng biểu mẫu bài học mới'
                >
                  <span aria-hidden='true'>×</span>
                </Button>
              </div>

              <Separator className='my-4 bg-greyscale-100' />

              <form className='flex flex-col gap-6' onSubmit={handleNewLessonSubmit}>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='flex flex-col gap-2 sm:col-span-2'>
                    <Label htmlFor='lesson-title' className='text-sm font-medium text-greyscale-900'>
                      Tiêu đề <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='lesson-title'
                      required
                      value={formValues.title}
                      onChange={handleFormFieldChange('title')}
                      placeholder='Nhập tiêu đề của bài học'
                      className='h-11 rounded-lg border-greyscale-200 bg-greyscale-0 text-sm text-greyscale-900 placeholder:text-greyscale-400'
                    />
                  </div>

                  <div className='flex flex-col gap-2 sm:col-span-2'>
                    <Label htmlFor='lesson-description' className='text-sm font-medium text-greyscale-900'>
                      Mô tả <span className='text-destructive'>*</span>
                    </Label>
                    <Textarea
                      id='lesson-description'
                      required
                      value={formValues.description}
                      onChange={handleFormFieldChange('description')}
                      placeholder='Nhập mô tả ngắn'
                      className='min-h-[120px] rounded-lg border-greyscale-200 bg-greyscale-0 text-sm text-greyscale-900 placeholder:text-greyscale-400'
                    />
                  </div>
                </div>

                <div className='flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:justify-end'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleCancelNewLesson}
                    className='h-10 rounded-lg border-greyscale-200 bg-greyscale-50 px-4 text-sm font-medium text-greyscale-900 hover:bg-greyscale-100'
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type='submit'
                    className='h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90'
                  >
                    Tạo mới
                  </Button>
                </div>
              </form>
            </section>
          )}

          <section aria-labelledby='module-lessons-heading' className='flex flex-col gap-4'>
            <h2 id='module-lessons-heading' className='text-lg font-semibold text-greyscale-900'>
              Danh sách bài học
            </h2>

            <div className='flex flex-col gap-4'>
              {module.sections.map((section) => {
                const expanded = sectionIsExpanded(section.id)

                return (
                  <article
                    key={section.id}
                    className='overflow-hidden rounded-xl border border-greyscale-200 bg-greyscale-0 shadow-xs'
                  >
                    <button
                      type='button'
                      onClick={() => handleToggleSection(section)}
                      className='flex w-full items-center justify-between bg-greyscale-50 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
                      aria-expanded={expanded}
                    >
                      <div className='flex items-center gap-3'>
                        <span
                          className={cn(
                            'grid size-9 place-content-center rounded-full border border-greyscale-200 bg-greyscale-0 text-greyscale-600 transition-colors',
                            expanded && 'border-primary/30 bg-primary-0 text-primary'
                          )}
                        >
                          <ChevronDown
                            className={cn('h-5 w-5 transition-transform', expanded ? 'rotate-180' : 'rotate-90')}
                            aria-hidden='true'
                          />
                        </span>
                        <div className='flex flex-col'>
                          <p className='text-sm font-semibold text-greyscale-900'>{section.title}</p>
                          <p className='text-xs text-greyscale-500'>{section.summary}</p>
                        </div>
                      </div>

                      <div className='flex items-center gap-3'>
                        <Button
                          type='button'
                          size='sm'
                          className='h-8 gap-2 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90'
                        >
                          <Plus className='h-3.5 w-3.5' aria-hidden='true' />
                          Thêm tài liệu
                        </Button>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 rounded-full text-greyscale-400 hover:bg-greyscale-25 hover:text-greyscale-600'
                          aria-label={`Xóa chương ${section.title}`}
                        >
                          <Trash2 className='h-4 w-4' aria-hidden='true' />
                        </Button>
                      </div>
                    </button>

                    {expanded && (
                      <div className='flex flex-col divide-y divide-greyscale-100'>
                        {section.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className='flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between'
                          >
                            <div className='flex flex-1 items-start gap-3'>
                              <span className='grid size-10 place-content-center rounded-lg bg-primary text-primary-foreground shadow-xs'>
                                <BookOpen className='h-4 w-4' aria-hidden='true' />
                              </span>
                              <div className='flex flex-col gap-1'>
                                <p className='text-sm font-medium text-greyscale-800'>{lesson.title}</p>
                                <div className='flex flex-wrap items-center gap-3 text-xs text-greyscale-500'>
                                  {typeof lesson.resources === 'number' && (
                                    <span className='flex items-center gap-1'>
                                      <FileText className='h-3.5 w-3.5' aria-hidden='true' />
                                      {lesson.resources} tài liệu
                                    </span>
                                  )}
                                  <span className='flex items-center gap-1'>
                                    <Clock className='h-3.5 w-3.5' aria-hidden='true' />
                                    {lesson.duration}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className='flex items-center gap-2'>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='h-9 w-9 rounded-full text-greyscale-500 hover:bg-greyscale-25 hover:text-greyscale-700'
                                aria-label={`Xem trước bài học ${lesson.title}`}
                              >
                                <Eye className='h-4 w-4' aria-hidden='true' />
                              </Button>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='h-9 w-9 rounded-full text-greyscale-500 hover:bg-greyscale-25 hover:text-greyscale-700'
                                aria-label={`Chỉnh sửa bài học ${lesson.title}`}
                              >
                                <Pencil className='h-4 w-4' aria-hidden='true' />
                              </Button>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='h-9 w-9 rounded-full text-greyscale-500 hover:bg-greyscale-25 hover:text-greyscale-700'
                                aria-label={`Xóa bài học ${lesson.title}`}
                              >
                                <Trash2 className='h-4 w-4' aria-hidden='true' />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

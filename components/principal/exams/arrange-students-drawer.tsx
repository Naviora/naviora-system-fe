'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import { Users, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetClasses, useArrangeStudents } from '@/hooks/api/principal/use-arrange-students'
import type { StudentGradeDto } from '@/hooks/api/principal/use-entry-tests'
import { ErrorHandler } from '@/lib/utils/error-handler'

interface ScoreRange {
  id: string
  min: number
  max: number
  classId: string | null
}

interface RangeDistribution {
  id: string
  range: string
  min: number
  max: number
  classId: string | null
  className: string | null
  students: StudentGradeDto[]
}

interface ArrangeStudentsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entryTestId: string
  entryTestTitle: string
  students: StudentGradeDto[]
  onSuccess?: () => void
}

export function ArrangeStudentsDrawer({
  open,
  onOpenChange,
  entryTestId,
  entryTestTitle,
  students,
  onSuccess
}: ArrangeStudentsDrawerProps) {
  const [scoreRanges, setScoreRanges] = useState<ScoreRange[]>([
    { id: crypto.randomUUID(), min: 0, max: 5, classId: null },
    { id: crypto.randomUUID(), min: 5, max: 7, classId: null },
    { id: crypto.randomUUID(), min: 7, max: 10, classId: null }
  ])
  const [showPreview, setShowPreview] = useState(false)

  const classesQuery = useGetClasses({ limit: 100 }, { enabled: open })
  const arrangeStudentsMutation = useArrangeStudents({
    onSuccess: (data) => {
      toast.success(data.message)
      onSuccess?.()
      onOpenChange(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(ErrorHandler.getErrorMessage(error))
    }
  })

  const activeClasses = useMemo(() => {
    return (classesQuery.data?.data.classes ?? []).filter((cls) => cls.is_active)
  }, [classesQuery.data])

  const distribution = useMemo((): RangeDistribution[] => {
    return scoreRanges.map((scoreRange) => {
      // Use <= for max if it's 10 (to include perfect scores), otherwise use <
      const rangeStudents = students.filter((s) => {
        const isInRange =
          scoreRange.max === 10
            ? s.score >= scoreRange.min && s.score <= scoreRange.max
            : s.score >= scoreRange.min && s.score < scoreRange.max
        return isInRange
      })
      const className = scoreRange.classId
        ? activeClasses.find((c) => c.class_id === scoreRange.classId)?.class_name || null
        : null

      return {
        id: scoreRange.id,
        range: `${scoreRange.min}-${scoreRange.max}`,
        min: scoreRange.min,
        max: scoreRange.max,
        classId: scoreRange.classId,
        className,
        students: rangeStudents
      }
    })
  }, [scoreRanges, students, activeClasses])

  const failedStudents = useMemo(() => {
    const allAssignedStudents = distribution
      .filter((d) => d.classId)
      .flatMap((d) => d.students.map((s) => s.student_id))

    return students.filter((s) => !allAssignedStudents.includes(s.student_id))
  }, [distribution, students])

  const enrolledStudents = useMemo(() => {
    return distribution.filter((d) => d.classId).flatMap((d) => d.students)
  }, [distribution])

  // Validate score ranges
  const validateRanges = (): { valid: boolean; message?: string } => {
    // Check if all ranges have valid min < max
    for (const range of scoreRanges) {
      if (range.min >= range.max) {
        return { valid: false, message: `Khoảng điểm ${range.min}-${range.max} không hợp lệ (min phải nhỏ hơn max)` }
      }
      if (range.min < 0 || range.max > 10) {
        return { valid: false, message: `Khoảng điểm ${range.min}-${range.max} phải nằm trong khoảng 0-10` }
      }
    }

    // Check for overlapping ranges
    const sorted = [...scoreRanges].sort((a, b) => a.min - b.min)
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i]
      const next = sorted[i + 1]

      // Check if ranges overlap (allowing exact boundaries to touch)
      if (current.max > next.min) {
        return {
          valid: false,
          message: `Khoảng điểm ${current.min}-${current.max} và ${next.min}-${next.max} bị trùng lặp`
        }
      }
    }

    return { valid: true }
  }

  const handleRangeChange = (id: string, field: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return

    setScoreRanges((prev) => prev.map((range) => (range.id === id ? { ...range, [field]: numValue } : range)))
  }

  const handleClassChange = (id: string, classId: string) => {
    setScoreRanges((prev) =>
      prev.map((range) => (range.id === id ? { ...range, classId: classId === 'unassigned' ? null : classId } : range))
    )
  }

  const addScoreRange = () => {
    setScoreRanges((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        min: 0,
        max: 10,
        classId: null
      }
    ])
  }

  const removeScoreRange = (id: string) => {
    if (scoreRanges.length <= 1) {
      toast.error('Phải có ít nhất một khoảng điểm')
      return
    }
    setScoreRanges((prev) => prev.filter((range) => range.id !== id))
  }

  const resetForm = () => {
    setScoreRanges([
      { id: crypto.randomUUID(), min: 0, max: 5, classId: null },
      { id: crypto.randomUUID(), min: 5, max: 7, classId: null },
      { id: crypto.randomUUID(), min: 7, max: 10, classId: null }
    ])
    setShowPreview(false)
  }

  const handlePreview = () => {
    // Validate ranges first
    const validation = validateRanges()
    if (!validation.valid) {
      toast.error(validation.message || 'Khoảng điểm không hợp lệ')
      return
    }

    // Check if at least one class is selected
    const hasSelection = scoreRanges.some((range) => range.classId)
    if (!hasSelection) {
      toast.error('Vui lòng chọn ít nhất một lớp học')
      return
    }

    // Check for duplicate classes
    const selectedClassIds = scoreRanges.filter((range) => range.classId).map((range) => range.classId)

    const uniqueClassIds = new Set(selectedClassIds)
    if (selectedClassIds.length !== uniqueClassIds.size) {
      const selectedClasses = scoreRanges
        .filter((range) => range.classId)
        .map((range) => {
          const cls = activeClasses.find((c) => c.class_id === range.classId)
          return cls?.class_name || 'Unknown'
        })

      const duplicateClass = selectedClasses.find((cls, idx) => selectedClasses.indexOf(cls) !== idx)
      toast.error(`Lớp học "${duplicateClass}" được chọn nhiều lần. Mỗi lớp chỉ được chọn một lần.`)
      return
    }

    setShowPreview(true)
  }

  const handleSubmit = () => {
    // Final validation
    const validation = validateRanges()
    if (!validation.valid) {
      toast.error(validation.message || 'Khoảng điểm không hợp lệ')
      return
    }

    // Check for duplicate classes
    const selectedClassIds = scoreRanges.filter((range) => range.classId).map((range) => range.classId)

    const uniqueClassIds = new Set(selectedClassIds)
    if (selectedClassIds.length !== uniqueClassIds.size) {
      const selectedClasses = scoreRanges
        .filter((range) => range.classId)
        .map((range) => {
          const cls = activeClasses.find((c) => c.class_id === range.classId)
          return cls?.class_name || 'Unknown'
        })

      const duplicateClass = selectedClasses.find((cls, idx) => selectedClasses.indexOf(cls) !== idx)
      toast.error(`Lớp học "${duplicateClass}" được chọn nhiều lần. Mỗi lớp chỉ được chọn một lần.`)
      return
    }

    const classDistribution = distribution
      .filter((d) => d.classId)
      .map((d) => ({
        range: d.range,
        classId: d.classId!
      }))

    if (classDistribution.length === 0) {
      toast.error('Vui lòng chọn ít nhất một lớp học')
      return
    }

    arrangeStudentsMutation.mutate({
      entryTestId,
      classDistribution
    })
  }

  const canPreview = scoreRanges.some((r) => r.classId)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className='flex flex-col max-h-[96vh]'>
        <DrawerHeader className='border-b border-greyscale-100 shrink-0'>
          <div className='mx-auto w-full max-w-4xl'>
            <DrawerTitle className='text-lg sm:text-xl'>Xếp học sinh vào lớp</DrawerTitle>
            <DrawerDescription className='text-sm'>
              Phân phối học sinh từ bài thi &ldquo;{entryTestTitle}&rdquo; vào các lớp học theo khoảng điểm
            </DrawerDescription>
          </div>
        </DrawerHeader>

        <div className='flex-1 overflow-y-auto min-h-0'>
          <div className='mx-auto w-full max-w-4xl px-4 sm:px-6'>
            <div className='space-y-4 sm:space-y-6 py-4 sm:py-6'>
              {/* Class Selection */}
              {!showPreview && (
                <div className='space-y-4'>
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                    <div className='text-sm font-medium text-greyscale-900'>Chọn lớp học cho từng khoảng điểm</div>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={addScoreRange}
                      className='flex items-center gap-2 w-full sm:w-auto'
                    >
                      <Plus className='size-4' />
                      <span>Thêm khoảng</span>
                    </Button>
                  </div>

                  {classesQuery.isLoading ? (
                    <div className='space-y-3'>
                      {scoreRanges.map((range) => (
                        <Skeleton key={range.id} className='h-40 w-full' />
                      ))}
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {scoreRanges.map((range) => {
                        // Use same logic as distribution - include max if it's 10
                        const rangeStudents = students.filter((s) => {
                          return range.max === 10
                            ? s.score >= range.min && s.score <= range.max
                            : s.score >= range.min && s.score < range.max
                        })

                        return (
                          <div
                            key={range.id}
                            className='rounded-lg border border-greyscale-200 bg-greyscale-50 p-3 sm:p-4'
                          >
                            <div className='flex flex-col sm:flex-row sm:items-start gap-3'>
                              <div className='flex-1 space-y-3'>
                                {/* Range Inputs */}
                                <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2'>
                                  <div className='flex-1'>
                                    <Label htmlFor={`min-${range.id}`} className='text-xs text-greyscale-600'>
                                      Điểm tối thiểu
                                    </Label>
                                    <Input
                                      id={`min-${range.id}`}
                                      type='number'
                                      min={0}
                                      max={10}
                                      step={0.1}
                                      value={range.min}
                                      onChange={(e) => handleRangeChange(range.id, 'min', e.target.value)}
                                      className='mt-1'
                                    />
                                  </div>
                                  <div className='hidden sm:block mt-6 text-greyscale-400'>-</div>
                                  <div className='flex-1'>
                                    <Label htmlFor={`max-${range.id}`} className='text-xs text-greyscale-600'>
                                      Điểm tối đa
                                    </Label>
                                    <Input
                                      id={`max-${range.id}`}
                                      type='number'
                                      min={0}
                                      max={10}
                                      step={0.1}
                                      value={range.max}
                                      onChange={(e) => handleRangeChange(range.id, 'max', e.target.value)}
                                      className='mt-1'
                                    />
                                  </div>
                                </div>

                                {/* Class Selection */}
                                <div>
                                  <Label htmlFor={`class-${range.id}`} className='text-xs text-greyscale-600'>
                                    Lớp học
                                  </Label>
                                  <Select
                                    value={range.classId || 'unassigned'}
                                    onValueChange={(value) => handleClassChange(range.id, value)}
                                  >
                                    <SelectTrigger id={`class-${range.id}`} className='mt-1 w-full'>
                                      <SelectValue placeholder='Chọn lớp học hoặc không xếp' />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value='unassigned'>Không xếp lớp</SelectItem>
                                      {activeClasses.map((cls) => (
                                        <SelectItem key={cls.class_id} value={cls.class_id}>
                                          {cls.class_name} ({cls.class_code})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Student Count */}
                                <div className='text-xs text-greyscale-500'>
                                  {rangeStudents.length} học sinh trong khoảng này
                                </div>
                              </div>

                              {/* Remove Button */}
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                onClick={() => removeScoreRange(range.id)}
                                className='text-greyscale-400 hover:text-destructive shrink-0'
                                disabled={scoreRanges.length <= 1}
                              >
                                <Trash2 className='size-4' />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className='flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700'>
                    <Users className='size-4 shrink-0' />
                    <span>Tổng số học sinh: {students.length}</span>
                  </div>
                </div>
              )}

              {/* Preview */}
              {showPreview && (
                <div className='space-y-4'>
                  <div className='text-sm font-medium text-greyscale-900'>Xem trước phân phối</div>

                  {/* Enrolled Students */}
                  {distribution
                    .filter((d) => d.classId)
                    .map((dist) => (
                      <div key={dist.id} className='rounded-lg border border-greyscale-200 p-3 sm:p-4'>
                        <div className='mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                          <div>
                            <div className='text-sm font-medium text-greyscale-900'>{dist.className}</div>
                            <div className='text-xs text-greyscale-500'>
                              {dist.min}-{dist.max} điểm • {dist.students.length} học sinh
                            </div>
                          </div>
                          <div className='rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700'>
                            Đậu
                          </div>
                        </div>
                        <div className='space-y-1.5'>
                          {dist.students.slice(0, 5).map((student) => (
                            <div key={student.student_id} className='flex items-center justify-between text-sm'>
                              <span className='text-greyscale-700'>{student.student_name}</span>
                              <span className='font-medium text-blue-600'>{student.score.toFixed(2)}</span>
                            </div>
                          ))}
                          {dist.students.length > 5 && (
                            <div className='text-xs text-greyscale-500'>
                              ...và {dist.students.length - 5} học sinh khác
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                  {/* Failed Students */}
                  {failedStudents.length > 0 && (
                    <div className='rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4'>
                      <div className='mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                        <div>
                          <div className='text-sm font-medium text-red-900'>Học sinh không vào lớp</div>
                          <div className='text-xs text-red-600'>{failedStudents.length} học sinh</div>
                        </div>
                        <div className='rounded-full bg-red-200 px-2.5 py-0.5 text-xs font-medium text-red-700'>
                          Rớt
                        </div>
                      </div>
                      <div className='space-y-1.5'>
                        {failedStudents.slice(0, 5).map((student) => (
                          <div key={student.student_id} className='flex items-center justify-between text-sm'>
                            <span className='text-red-700'>{student.student_name}</span>
                            <span className='font-medium text-red-600'>{student.score.toFixed(2)}</span>
                          </div>
                        ))}
                        {failedStudents.length > 5 && (
                          <div className='text-xs text-red-600'>...và {failedStudents.length - 5} học sinh khác</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div className='grid grid-cols-2 gap-3 sm:gap-4 rounded-lg bg-greyscale-50 p-3 sm:p-4'>
                    <div>
                      <div className='text-xs text-greyscale-600'>Tổng số học sinh</div>
                      <div className='text-lg sm:text-xl font-bold text-greyscale-900'>{students.length}</div>
                    </div>
                    <div>
                      <div className='text-xs text-greyscale-600'>Được xếp vào lớp</div>
                      <div className='text-lg sm:text-xl font-bold text-green-600'>{enrolledStudents.length}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DrawerFooter className='border-t border-greyscale-100 shrink-0'>
          <div className='mx-auto w-full max-w-4xl flex flex-col-reverse sm:flex-row gap-2'>
            {!showPreview ? (
              <>
                <Button variant='outline' onClick={() => onOpenChange(false)} className='w-full sm:w-auto'>
                  Hủy
                </Button>
                <Button onClick={handlePreview} disabled={!canPreview} className='w-full sm:flex-1'>
                  Xem trước
                </Button>
              </>
            ) : (
              <>
                <Button variant='outline' onClick={() => setShowPreview(false)} className='w-full sm:w-auto'>
                  Quay lại
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={arrangeStudentsMutation.isPending}
                  className='w-full sm:flex-1'
                >
                  {arrangeStudentsMutation.isPending ? (
                    <>
                      <Loader2 className='mr-2 size-4 animate-spin' />
                      Đang xử lý...
                    </>
                  ) : (
                    'Xác nhận xếp lớp'
                  )}
                </Button>
              </>
            )}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

'use client'

import { useEffect, useMemo } from 'react'
import { AlertCircle, ArrowLeft, Clock, FileText, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type StudentFinalExamDetailResponse, useStudentFinalExamDetail } from '@/hooks/api/student/use-final-exams'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLiveTime } from '@/hooks/use-live-time'
import {
  formatDateTime,
  formatDurationShort,
  getCountdownParts,
  getExamCountdownState,
  type ExamCountdownState
} from '@/lib/utils'
import { useSetBreadcrumbItems } from '@/lib/context/breadcrumb-context'
import { toast } from 'sonner'
import { ErrorHandler } from '@/lib/utils/error-handler'

interface StudentFinalExamDetailPageClientProps {
  finalExamId: string
}

function CountdownSegment({ label, value }: { label: string; value: number }) {
  return (
    <div className='flex flex-col items-center rounded-lg border border-greyscale-100 bg-greyscale-0 px-4 py-2 text-center'>
      <div className='text-2xl font-semibold text-greyscale-900'>{value.toString().padStart(2, '0')}</div>
      <div className='text-xs font-medium uppercase tracking-wide text-greyscale-500'>{label}</div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className='text-xs font-semibold uppercase tracking-wide text-greyscale-500'>{label}</p>
      <p className='mt-1 text-sm font-semibold text-greyscale-900'>{value}</p>
    </div>
  )
}

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Nháp', className: 'bg-greyscale-100 text-greyscale-700' },
  PUBLISHED: { label: 'Sắp diễn ra', className: 'bg-blue-100 text-blue-700' },
  ACTIVE: { label: 'Đang diễn ra', className: 'bg-green-100 text-green-700' },
  COMPLETED: { label: 'Đã kết thúc', className: 'bg-purple-100 text-purple-700' },
  CANCELLED: { label: 'Đã hủy', className: 'bg-red-100 text-red-700' }
}

export function StudentFinalExamDetailPageClient({ finalExamId }: StudentFinalExamDetailPageClientProps) {
  const router = useRouter()
  const setBreadcrumbItems = useSetBreadcrumbItems()
  const now = useLiveTime(1000)
  const examQuery = useStudentFinalExamDetail(finalExamId)
  const response: StudentFinalExamDetailResponse | undefined = examQuery.data
  const exam = response?.data

  const countdown: ExamCountdownState | null = useMemo(() => {
    if (!exam) return null
    return getExamCountdownState(exam.start_time, exam.end_time, now)
  }, [exam, now])

  const countdownParts = countdown
    ? getCountdownParts(countdown.secondsRemaining)
    : { days: 0, hours: 0, minutes: 0, seconds: 0 }

  useEffect(() => {
    if (exam) {
      setBreadcrumbItems([
        { label: 'Bài thi cuối kỳ', href: '/student/final-exams' },
        { label: exam.title, href: `/student/final-exams/${exam.final_exam_id}` }
      ])
    }
  }, [exam, setBreadcrumbItems])

  const hasSubmitted =
    Boolean(exam?.is_submitted) || exam?.attempt_status === 'SUBMITTED' || exam?.attempt_status === 'GRADED'
  const isCancelled = exam?.attempt_status === 'CANCELLED'
  const isActiveStatus = exam?.status === 'ACTIVE'
  const canJoinNow = countdown?.phase === 'ONGOING' && isActiveStatus && !hasSubmitted && !isCancelled
  const ctaLabel = (() => {
    if (hasSubmitted) return 'Đã hoàn thành'
    if (isCancelled) return 'Bài thi đã hủy'
    if (!isActiveStatus) return 'Chưa mở cho học sinh'
    if (countdown?.phase === 'ONGOING') {
      return exam?.attempt_status === 'IN_PROGRESS' ? 'Tiếp tục làm bài' : 'Tham gia ngay'
    }
    if (countdown?.phase === 'ENDED') return 'Bài thi đã kết thúc'
    return 'Sẵn sàng thi'
  })()

  const handleJoinExam = () => {
    if (!exam || !countdown) return

    if (hasSubmitted) {
      toast.info('Bạn đã hoàn thành bài thi này. Vui lòng chờ giáo viên công bố kết quả.')
      return
    }

    if (isCancelled) {
      toast.error('Bài thi đã bị hủy. Vui lòng liên hệ giáo viên phụ trách để biết thêm chi tiết.')
      return
    }

    if (!isActiveStatus) {
      toast.info('Bài thi hiện chưa được kích hoạt. Vui lòng chờ giáo viên mở đề chính thức.')
      return
    }

    if (countdown.phase === 'ENDED') {
      toast.error('Bài thi này đã kết thúc, bạn không thể tham gia nữa.')
      return
    }

    if (countdown.phase === 'UPCOMING') {
      toast.info('Bài thi chưa mở. Bạn có thể quay lại khi đếm ngược kết thúc.')
      return
    }

    router.push(`/student/final-exams/${finalExamId}/play`)
  }

  const statusBadge = exam ? (STATUS_BADGES[exam.status] ?? STATUS_BADGES.DRAFT) : null
  const durationLabel = exam
    ? formatDurationShort(
        Math.max(0, Math.floor((new Date(exam.end_time).getTime() - new Date(exam.start_time).getTime()) / 1000))
      )
    : ''

  if (examQuery.isLoading) {
    return (
      <div className='space-y-4 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className='h-24 w-full rounded-xl bg-greyscale-50' />
        ))}
      </div>
    )
  }

  if (examQuery.isError) {
    return (
      <div className='flex flex-col gap-4 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
        <div className='flex items-start gap-3 rounded-xl border border-destructive/50 bg-destructive/5 p-6'>
          <AlertCircle className='mt-0.5 size-5 text-destructive' />
          <div>
            <p className='text-sm font-semibold text-destructive'>Không thể tải bài thi</p>
            <p className='text-sm text-destructive/80'>{ErrorHandler.getErrorMessage(examQuery.error)}</p>
          </div>
        </div>
        <Button variant='outline' className='w-fit' onClick={() => examQuery.refetch()}>
          Thử lại
        </Button>
      </div>
    )
  }

  if (!exam) {
    return (
      <div className='flex flex-col gap-3 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
        <div className='rounded-xl border border-greyscale-100 bg-greyscale-0 p-6 text-center'>
          <p className='text-sm font-medium text-greyscale-700'>Không tìm thấy bài thi mà bạn yêu cầu.</p>
          <Button className='mt-3' onClick={() => router.push('/student/final-exams')}>
            Quay về danh sách
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 px-4 pb-10 pt-4 sm:px-6 lg:px-8'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex flex-wrap items-center gap-2'>
          {statusBadge ? (
            <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${statusBadge.className}`}>
              {statusBadge.label}
            </span>
          ) : null}
          {exam?.attempt_status ? (
            <span className='rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-800'>
              Trạng thái nộp bài: {exam.attempt_status}
            </span>
          ) : null}
        </div>
      </div>

      <section className='rounded-xl border border-greyscale-100 bg-greyscale-0 p-6 shadow-sm'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-semibold text-greyscale-900'>{exam.title}</h1>
          <p className='text-sm text-greyscale-600'>{exam.description}</p>
        </div>

        <div className='mt-6 grid gap-4 lg:grid-cols-[2fr,1fr]'>
          <Card className='bg-greyscale-25'>
            <CardHeader>
              <CardTitle>Đếm ngược tới thời điểm quan trọng</CardTitle>
              <CardDescription>
                {countdown?.phase === 'UPCOMING' && 'Bài thi sẽ mở sau khi đếm ngược kết thúc.'}
                {countdown?.phase === 'ONGOING' && 'Bài thi đang mở. Hãy tham gia ngay để không bỏ lỡ.'}
                {countdown?.phase === 'ENDED' && 'Bài thi đã kết thúc.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                <CountdownSegment label='Ngày' value={countdownParts.days} />
                <CountdownSegment label='Giờ' value={countdownParts.hours} />
                <CountdownSegment label='Phút' value={countdownParts.minutes} />
                <CountdownSegment label='Giây' value={countdownParts.seconds} />
              </div>
              <p className='mt-4 text-sm font-medium text-greyscale-800'>{countdown?.label}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin khóa thi</CardTitle>
              <CardDescription>Các mốc thời gian quan trọng mà bạn cần lưu ý.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <InfoItem label='Bắt đầu' value={formatDateTime(exam.start_time)} />
              <InfoItem label='Kết thúc' value={formatDateTime(exam.end_time)} />
              <InfoItem label='Thời lượng' value={durationLabel || 'Đang cập nhật'} />
            </CardContent>
          </Card>
        </div>

        <div className='mt-6 flex flex-wrap items-center gap-3'>
          <Button size='lg' onClick={handleJoinExam} disabled={!canJoinNow}>
            {ctaLabel}
          </Button>
          <p className='text-xs text-greyscale-500'>Bạn chỉ có thể tham gia khi bài thi đang diễn ra.</p>
        </div>
      </section>

      <div className='space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn ôn tập</CardTitle>
            <CardDescription>Để hoàn thành bài thi tốt nhất, hãy đảm bảo:</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3 text-sm text-greyscale-600'>
            <p className='flex items-start gap-2'>
              <ShieldCheck className='mt-0.5 size-4 text-green-600' />
              Kết nối mạng ổn định và tránh làm mới trang khi đang thi.
            </p>
            <p className='flex items-start gap-2'>
              <FileText className='mt-0.5 size-4 text-blue-600' />
              Chuẩn bị giấy nháp, máy tính và các tài liệu được cho phép.
            </p>
            <p className='flex items-start gap-2'>
              <Clock className='mt-0.5 size-4 text-amber-600' />
              Canh thời gian hợp lý, tính toán thời gian cho từng câu hỏi.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lộ trình bài thi</CardTitle>
            <CardDescription>Tham khảo các mốc thời gian quan trọng.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3 text-sm text-greyscale-600'>
            <div>
              <p className='font-semibold text-greyscale-900'>1. Chuẩn bị</p>
              <p className='text-xs text-greyscale-500'>Kiểm tra tài khoản, thiết bị và đề cương ôn tập.</p>
            </div>
            <div>
              <p className='font-semibold text-greyscale-900'>2. Đếm ngược mở đề</p>
              <p className='text-xs text-greyscale-500'>Quay lại phòng thi khi đếm ngược kết thúc.</p>
            </div>
            <div>
              <p className='font-semibold text-greyscale-900'>3. Làm bài</p>
              <p className='text-xs text-greyscale-500'>
                Giữ tập trung, đánh dấu câu cần xem lại giống luồng reviewed-exercise.
              </p>
            </div>
            <div>
              <p className='font-semibold text-greyscale-900'>4. Nộp bài & xem kết quả</p>
              <p className='text-xs text-greyscale-500'>Chờ thông báo từ hệ thống hoặc giáo viên phụ trách.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

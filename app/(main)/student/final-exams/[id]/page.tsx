import { Metadata } from 'next'
import { StudentFinalExamDetailPageClient } from '@/components/student/final-exams/student-final-exam-detail-page'

type PageProps = {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: 'Chi tiết bài thi cuối kỳ'
}

export default function StudentFinalExamDetailPage({ params }: PageProps) {
  return <StudentFinalExamDetailPageClient finalExamId={params.id} />
}

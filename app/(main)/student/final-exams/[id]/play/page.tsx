import type { Metadata } from 'next'
import { ManageFinalExam } from '@/components/student/final-exams/manage-final-exam'

interface PageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: 'Làm bài thi cuối kỳ'
}

export default function StudentFinalExamPlayPage({ params }: PageProps) {
  return <ManageFinalExam finalExamId={params.id} />
}

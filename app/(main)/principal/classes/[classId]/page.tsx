import { ClassDetailPageClient } from '@/components/principal/classes/class-detail-page'

interface ClassDetailPageProps {
  params: Promise<{
    classId: string
  }>
}

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
  const { classId } = await params

  return <ClassDetailPageClient classId={classId} />
}

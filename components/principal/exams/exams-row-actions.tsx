'use client'

import { EyeIcon, PencilIcon } from 'lucide-react'
import { ActionDropdown } from '@/components/principal/action-dropdown'
import type { ExamsRow } from './principal-exams-table'

interface ExamsRowActionsProps {
  exam: ExamsRow
  onView?: (exam: ExamsRow) => void
  onEdit?: (exam: ExamsRow) => void
}

export function ExamsRowActions({ exam, onView, onEdit }: ExamsRowActionsProps) {
  return (
    <ActionDropdown
      actions={[
        {
          key: 'view',
          label: 'Xem chi tiết',
          icon: EyeIcon,
          onClick: () => onView?.(exam)
        },
        {
          key: 'edit',
          label: 'Chỉnh sửa bài thi',
          icon: PencilIcon,
          onClick: () => onEdit?.(exam)
        }
      ]}
    />
  )
}

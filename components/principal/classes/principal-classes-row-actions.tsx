'use client'

import { Pencil, Eye } from 'lucide-react'
import { ActionDropdown } from '@/components/principal/action-dropdown'
import type { PrincipalClassRow } from '@/types/principal/classes'

interface PrincipalClassRowActionsProps {
  classItem: PrincipalClassRow
  onEdit?: (classItem: PrincipalClassRow) => void
}

export function PrincipalClassRowActions({ classItem, onEdit }: PrincipalClassRowActionsProps) {
  // Nếu chỉ có 1 nút (edit), thì sử dụng Link component cho view
  // Nhưng vì cả 2 đều cần action khác nhau, chúng ta sẽ render custom
  const handleViewClick = () => {
    window.location.href = `/principal/classes/${classItem.id}`
  }

  return (
    <ActionDropdown
      actions={[
        {
          key: 'view',
          label: 'Xem chi tiết',
          icon: Eye,
          onClick: handleViewClick
        },
        {
          key: 'edit',
          label: 'Chỉnh sửa',
          icon: Pencil,
          onClick: () => onEdit?.(classItem)
        }
      ]}
    />
  )
}

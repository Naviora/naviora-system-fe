'use client'

import { EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { ActionDropdown } from '@/components/principal/action-dropdown'
import type { PrincipalModuleRow } from '@/types/principal/modules'

interface PrincipalModuleRowActionsProps {
  module: PrincipalModuleRow
  onView?: (module: PrincipalModuleRow) => void
  onEdit?: (module: PrincipalModuleRow) => void
  onDelete?: (module: PrincipalModuleRow) => void
  isDeleting?: boolean
}

export function PrincipalModuleRowActions({
  module,
  onView,
  onEdit,
  onDelete,
  isDeleting
}: PrincipalModuleRowActionsProps) {
  return (
    <ActionDropdown
      actions={[
        {
          key: 'view',
          label: 'Xem chi tiết',
          icon: EyeIcon,
          onClick: () => onView?.(module)
        },
        {
          key: 'edit',
          label: 'Chỉnh sửa',
          icon: PencilIcon,
          onClick: () => onEdit?.(module)
        },
        {
          key: 'delete',
          label: 'Xóa chuyên đề',
          icon: Trash2Icon,
          onClick: () => onDelete?.(module),
          variant: 'destructive',
          disabled: isDeleting,
          showDividerAfter: true
        }
      ]}
    />
  )
}

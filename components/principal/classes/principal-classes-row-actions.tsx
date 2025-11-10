'use client'

import Link from 'next/link'
import { MoreHorizontal, Pencil, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { PrincipalClassRow } from '@/types/principal/classes'

interface PrincipalClassRowActionsProps {
  classItem: PrincipalClassRow
  onEdit?: (classItem: PrincipalClassRow) => void
}

export function PrincipalClassRowActions({ classItem, onEdit }: PrincipalClassRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Mở menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <Link href={`/principal/classes/${classItem.id}`}>
            <Eye className='mr-2 h-4 w-4' />
            Xem chi tiết
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit?.(classItem)}>
          <Pencil className='mr-2 h-4 w-4' />
          Chỉnh sửa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

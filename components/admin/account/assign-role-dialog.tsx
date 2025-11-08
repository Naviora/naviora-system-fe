'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { USER_ROLE_VALUES, type UserRole } from '@/lib/constants/roles'
import type { AccountRow } from './account-types'

type RoleOption = { id: number; value: UserRole; label: string }

interface AssignRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: AccountRow
  roleOptions: RoleOption[]
  onSave?: (accountId: string, role: UserRole) => Promise<void> | void
}

export function AssignRoleDialog({ open, onOpenChange, account, roleOptions, onSave }: AssignRoleDialogProps) {
  const [role, setRole] = useState<UserRole | ''>('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!account || !role) return

    setIsSaving(true)
    try {
      if (onSave) {
        await onSave(account.id, role)
      }
      onOpenChange(false)
      setRole('')
    } catch (error) {
      console.error('Error assigning role:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[480px]'>
        <DialogHeader>
          <DialogTitle>Gán vai trò</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4'>
          <div className='text-sm text-greyscale-600'>
            Tài khoản: <span className='font-medium text-foreground'>{account?.name}</span>
          </div>
          <div className='grid gap-2'>
            <label className='text-sm font-medium text-foreground'>Vai trò</label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={account?.role ?? 'Chọn vai trò'} />
              </SelectTrigger>
              <SelectContent>
                {(roleOptions.length ? roleOptions : USER_ROLE_VALUES.map((r) => ({ id: r, value: r, label: r }))).map(
                  (r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' type='button' onClick={() => onOpenChange(false)} disabled={isSaving}>
            Hủy
          </Button>
          <Button type='button' onClick={handleSave} disabled={!role || isSaving}>
            {isSaving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

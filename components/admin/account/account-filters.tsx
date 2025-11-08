'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { USER_ROLE_VALUES, type UserRole } from '@/lib/constants/roles'

type RoleOption = { id: number; value: UserRole; label: string }

interface AccountFiltersProps {
  query: string
  onQueryChange: (query: string) => void
  roleFilter: string
  onRoleFilterChange: (role: string) => void
  roleOptions: RoleOption[]
}

const ALL_ROLES_VALUE = '__all__'

export function AccountFilters({
  query,
  onQueryChange,
  roleFilter,
  onRoleFilterChange,
  roleOptions
}: AccountFiltersProps) {
  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
      <div className='flex items-center gap-2'>
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder='Tìm theo tên, email...'
          className='w-[260px]'
        />
      </div>
      <div className='flex items-center gap-2'>
        <Select
          value={roleFilter ? roleFilter : ALL_ROLES_VALUE}
          onValueChange={(v) => onRoleFilterChange(v === ALL_ROLES_VALUE ? '' : v)}
        >
          <SelectTrigger className='min-w-[180px]'>
            <SelectValue placeholder='Lọc theo vai trò' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ROLES_VALUE}>Tất cả vai trò</SelectItem>
            {roleOptions.length > 0
              ? roleOptions.map((r) => (
                  <SelectItem key={r.id} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))
              : USER_ROLE_VALUES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

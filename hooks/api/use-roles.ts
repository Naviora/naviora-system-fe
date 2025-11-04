import { useMemo } from 'react'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { QUERY_KEYS } from '@/lib/constants'
import { ROLE_API_ENDPOINT } from '@/lib/constants/roles'
import type { ApiError } from '@/types/api/common'
import type { RoleDto, RoleOption, RolesPayload } from '@/types/api/roles'
import { toRoleOption } from '@/lib/mappers/role'

const fetchRoles = async () => {
  const payload = await apiClient.get<RolesPayload>(ROLE_API_ENDPOINT)
  return payload.data
}

export const useRoles = (options?: Omit<UseQueryOptions<RoleDto[], ApiError>, 'queryKey' | 'queryFn'>) =>
  useQuery({
    queryKey: QUERY_KEYS.ROLES,
    queryFn: fetchRoles,
    ...options
  })

export const useRoleOptions = (options?: Omit<UseQueryOptions<RoleDto[], ApiError>, 'queryKey' | 'queryFn'>) => {
  const query = useRoles(options)

  const roleOptions = useMemo<RoleOption[]>(() => {
    if (!query.data) return []

    return query.data.reduce<RoleOption[]>((accumulator, role) => {
      const option = toRoleOption(role)
      if (option) {
        accumulator.push(option)
      }
      return accumulator
    }, [])
  }, [query.data])

  return {
    ...query,
    roleOptions
  }
}

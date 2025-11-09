import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  type UseQueryOptions,
  type UseMutationOptions,
  type UseQueryResult
} from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { PaginatedResponse, ListRequest, ApiError } from '@/types/api/common'
import { QUERY_KEYS } from '@/lib/constants/config'
import type { AccountRow, ImportAccountData } from '@/components/admin/account/account-types'
import type { UserRole } from '@/lib/constants/roles'

// Account API endpoint
const ACCOUNTS_API_ENDPOINT = '/users'

// Get accounts list with pagination
const getAccountsRequest = async (params: ListRequest = {}): Promise<PaginatedResponse<AccountRow>> => {
  // API returns { users: Array<{ role: { name: string }, status: string, ... }>, ... }
  // but we need { data: AccountRow[], pagination: {...} }
  type ApiUserResponse = {
    id: string
    name: string
    email: string
    role: { name: string } | string
    status: string
    [key: string]: unknown
  }

  const response = await apiClient.get<{
    users: ApiUserResponse[]
    pagination?: PaginatedResponse<AccountRow>['pagination']
  }>(ACCOUNTS_API_ENDPOINT, { params })

  // Transform users to AccountRow format
  const accounts: AccountRow[] = (response.users || []).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: (typeof user.role === 'string' ? user.role : user.role?.name || '') as UserRole,
    status: user.status?.toLowerCase() === 'active' ? 'active' : 'inactive'
  }))

  // Transform response to match PaginatedResponse format
  return {
    data: accounts,
    pagination: response.pagination || {
      page: params.page || 1,
      limit: params.limit || 20,
      total: accounts.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    },
    success: true,
    status: 200
  }
}

// Create account - API expects role_id (number) instead of role (string)
type CreateAccountRequest = {
  name: string
  email: string
  password: string
  role_id: number
}

const createAccountRequest = async (data: CreateAccountRequest): Promise<AccountRow> => {
  return apiClient.post<AccountRow>(`/users/admin/create`, data)
}

// Update account role
const updateAccountRoleRequest = async ({
  accountId,
  role
}: {
  accountId: string
  role: UserRole
}): Promise<AccountRow> => {
  return apiClient.patch<AccountRow>(`${ACCOUNTS_API_ENDPOINT}/${accountId}`, { role })
}

// Import accounts from Excel - API expects object with accounts array
const importAccountsRequest = async (
  accounts: ImportAccountData[]
): Promise<{ success: number; failed: number; errors?: Array<{ row: number; error: string }> }> => {
  return apiClient.post<{ success: number; failed: number; errors?: Array<{ row: number; error: string }> }>(
    `/users/admin/bulk-create`,
    { accounts }
  )
}

// Hooks
export const useAccounts = (
  params: ListRequest = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<AccountRow>, ApiError>, 'queryKey' | 'queryFn'>
): UseQueryResult<PaginatedResponse<AccountRow>, ApiError> => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_LIST(params as Record<string, unknown>),
    queryFn: () => getAccountsRequest(params),
    placeholderData: keepPreviousData,
    ...options
  })
}

export const useCreateAccount = (options?: UseMutationOptions<AccountRow, ApiError, CreateAccountRequest>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAccountRequest,
    onSuccess: () => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS })
    },
    ...options
  })
}

export const useUpdateAccountRole = (
  options?: UseMutationOptions<AccountRow, ApiError, { accountId: string; role: UserRole }>
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAccountRoleRequest,
    onSuccess: (data, variables) => {
      // Update the detail query cache
      queryClient.setQueryData(QUERY_KEYS.USER_DETAIL(variables.accountId), data)
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS })
    },
    ...options
  })
}

export const useImportAccounts = (
  options?: UseMutationOptions<
    { success: number; failed: number; errors?: Array<{ row: number; error: string }> },
    ApiError,
    ImportAccountData[]
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: importAccountsRequest,
    onSuccess: () => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS })
    },
    ...options
  })
}

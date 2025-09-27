import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryClient,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  PaginatedResponse,
  ListRequest,
  UpdateRequest,
  DeleteRequest,
  ApiError,
} from "@/types/api/common";

// Generic query keys factory
export const createQueryKeys = (entity: string) => ({
  all: [entity] as const,
  lists: () => [...createQueryKeys(entity).all, "list"] as const,
  list: (params: ListRequest) =>
    [...createQueryKeys(entity).lists(), params] as const,
  details: () => [...createQueryKeys(entity).all, "detail"] as const,
  detail: (id: string | number) =>
    [...createQueryKeys(entity).details(), id] as const,
});

// Generic hooks factory
export function createEntityHooks<
  TEntity,
  TCreateData = Partial<TEntity>,
  TUpdateData = Partial<TEntity>
>(entityName: string, basePath: string) {
  const queryKeys = createQueryKeys(entityName);

  // List hook
  const useList = (
    params: ListRequest = {},
    options?: Omit<
      UseQueryOptions<PaginatedResponse<TEntity>, ApiError>,
      "queryKey" | "queryFn"
    >
  ) => {
    return useQuery({
      queryKey: queryKeys.list(params),
      queryFn: () =>
        apiClient.get<PaginatedResponse<TEntity>>(`${basePath}`, { params }),
      ...options,
    });
  };

  // Detail hook
  const useDetail = (
    id: string | number,
    options?: Omit<UseQueryOptions<TEntity, ApiError>, "queryKey" | "queryFn">
  ) => {
    return useQuery({
      queryKey: queryKeys.detail(id),
      queryFn: () => apiClient.get<TEntity>(`${basePath}/${id}`),
      enabled: !!id,
      ...options,
    });
  };

  // Create mutation
  const useCreate = (
    options?: Omit<
      UseMutationOptions<TEntity, ApiError, TCreateData>,
      "mutationFn"
    >
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data: TCreateData) =>
        apiClient.post<TEntity>(basePath, data),
      onSuccess: () => {
        // Invalidate list queries
        queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      },
      ...options,
    });
  };

  // Update mutation
  const useUpdate = (
    options?: Omit<
      UseMutationOptions<TEntity, ApiError, UpdateRequest<TUpdateData>>,
      "mutationFn"
    >
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data }: UpdateRequest<TUpdateData>) =>
        apiClient.put<TEntity>(`${basePath}/${id}`, data),
      onSuccess: (data, variables) => {
        // Update the detail query cache
        queryClient.setQueryData(queryKeys.detail(variables.id), data);
        // Invalidate list queries
        queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      },
      ...options,
    });
  };

  // Delete mutation
  const useDelete = (
    options?: Omit<
      UseMutationOptions<void, ApiError, DeleteRequest>,
      "mutationFn"
    >
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({ id }: DeleteRequest) => {
        await apiClient.delete(`${basePath}/${id}`);
      },
      onSuccess: (_, variables) => {
        // Remove from detail cache
        queryClient.removeQueries({ queryKey: queryKeys.detail(variables.id) });
        // Invalidate list queries
        queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      },
      ...options,
    });
  };

  return {
    useList,
    useDetail,
    useCreate,
    useUpdate,
    useDelete,
    queryKeys,
  };
}

// Utility hooks
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();
  return (queryKey: unknown[]) => queryClient.invalidateQueries({ queryKey });
};

export const useResetQueries = () => {
  const queryClient = useQueryClient();
  return (queryKey?: unknown[]) => {
    if (queryKey) {
      queryClient.resetQueries({ queryKey });
    } else {
      queryClient.resetQueries();
    }
  };
};

export const usePrefetchQuery = () => {
  const queryClient = useQueryClient();
  return <T>(
    queryKey: unknown[],
    queryFn: () => Promise<T>,
    options?: { staleTime?: number }
  ) => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: options?.staleTime ?? 60 * 1000, // 1 minute default
    });
  };
};

// Export query client type for custom hooks
export type { QueryClient };

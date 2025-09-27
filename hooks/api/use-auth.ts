import { createEntityHooks } from "./use-entity";
import { User } from "@/lib/validations/auth";
import type {
  LoginFormData,
  RegisterFormData,
  ProfileUpdateFormData,
} from "@/lib/validations/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

// User entity hooks
export const {
  useList: useUsers,
  useDetail: useUser,
  useCreate: useCreateUser,
  useUpdate: useUpdateUser,
  useDelete: useDeleteUser,
  queryKeys: userQueryKeys,
} = createEntityHooks<User, Partial<User>>("users", "/users");

// Authentication hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormData) =>
      apiClient.post<{ user: User; token: string }>("/auth/login", data),
    onSuccess: (response) => {
      // Store user in cache
      queryClient.setQueryData(["auth", "user"], response.user);
      // Store token
      if (typeof window !== "undefined") {
        localStorage.setItem("auth-token", response.token);
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterFormData) =>
      apiClient.post<{ user: User; token: string }>("/auth/register", data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.post("/auth/logout"),
    onSuccess: () => {
      // Clear user cache
      queryClient.removeQueries({ queryKey: ["auth"] });
      // Clear token
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
      }
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => apiClient.get<User>("/auth/me"),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileUpdateFormData) =>
      apiClient.put<User>("/auth/profile", data),
    onSuccess: (user) => {
      // Update user cache
      queryClient.setQueryData(["auth", "user"], user);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      apiClient.post("/auth/change-password", data),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) =>
      apiClient.post("/auth/forgot-password", { email }),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      apiClient.post("/auth/reset-password", data),
  });
};

// User preferences hooks
export const useUserPreferences = () => {
  return useQuery({
    queryKey: ["user", "preferences"],
    queryFn: () => apiClient.get("/user/preferences"),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: Record<string, unknown>) =>
      apiClient.put("/user/preferences", preferences),
    onSuccess: (data) => {
      queryClient.setQueryData(["user", "preferences"], data);
    },
  });
};

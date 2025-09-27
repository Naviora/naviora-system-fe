export type { ApiResponse, ApiError } from "@/lib/constants";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
  success: boolean;
  status: number;
}

// Generic CRUD operations types
export interface CreateRequest<T> {
  data: T;
}

export interface UpdateRequest<T> {
  id: string | number;
  data: Partial<T>;
}

export interface DeleteRequest {
  id: string | number;
}

export interface GetByIdRequest {
  id: string | number;
}

export interface ListRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  filters?: Record<string, unknown>;
}

// File upload types
export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  folder?: string;
  uploadedAt: string;
}

export interface MultiFileUploadResponse {
  files: FileUploadResponse[];
  totalSize: number;
  successCount: number;
  failedCount: number;
  failed?: Array<{
    filename: string;
    error: string;
  }>;
}

// Search types
export interface SearchRequest {
  query: string;
  filters?: Record<string, unknown>;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SearchResponse<T> {
  results: T[];
  query: string;
  totalResults: number;
  page: number;
  limit: number;
  suggestions?: string[];
  facets?: Record<
    string,
    Array<{
      value: string;
      count: number;
    }>
  >;
}

// Analytics types
export interface AnalyticsData {
  metric: string;
  value: number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  period: string;
  data?: Array<{
    date: string;
    value: number;
  }>;
}

export interface DashboardStats {
  totalUsers: AnalyticsData;
  activeUsers: AnalyticsData;
  revenue: AnalyticsData;
  conversions: AnalyticsData;
  customMetrics?: AnalyticsData[];
}

// Notification types
export interface NotificationData {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
}

// Webhook types
export interface WebhookPayload<T = unknown> {
  event: string;
  data: T;
  timestamp: string;
  signature?: string;
  version?: string;
}

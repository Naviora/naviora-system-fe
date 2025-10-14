// API Configuration Constants
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
} as const

// Query Keys for TanStack Query
export const QUERY_KEYS = {
  // Authentication
  AUTH: ['auth'] as const,
  CURRENT_USER: ['auth', 'currentUser'] as const,
  USER_PREFERENCES: ['auth', 'preferences'] as const,

  // Roles
  ROLES: ['roles'] as const,

  // Users
  USERS: ['users'] as const,
  USER_LIST: (filters?: Record<string, unknown>) => ['users', 'list', filters] as const,
  USER_DETAIL: (id: string) => ['users', 'detail', id] as const,

  // Dashboard
  DASHBOARD: ['dashboard'] as const,
  DASHBOARD_STATS: ['dashboard', 'stats'] as const,
  DASHBOARD_TODOS: ['dashboard', 'todos'] as const,

  // Forms
  FORMS: ['forms'] as const,
  FORM_DATA: (formId: string) => ['forms', formId] as const,

  // Generic entity keys
  ENTITY_LIST: (entity: string, filters?: Record<string, unknown>) => [entity, 'list', filters] as const,
  ENTITY_DETAIL: (entity: string, id: string) => [entity, 'detail', id] as const
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth-token',
  REFRESH_TOKEN: 'refresh-token',
  USER_PREFERENCES: 'user-preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebar-state',
  RECENT_SEARCHES: 'recent-searches'
} as const

// Application Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',

  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',

  // User Management
  PROFILE: '/profile',
  SETTINGS: '/settings',
  USERS: '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,

  // Forms
  FORMS: '/forms',
  CONTACT_FORM: '/forms/contact',

  // Error Pages
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',

  // API Routes
  API: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REGISTER: '/api/auth/register',
      REFRESH: '/api/auth/refresh',
      ME: '/api/auth/me',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password',
      VERIFY_EMAIL: '/api/auth/verify-email'
    },
    USERS: '/api/users',
    USER_DETAIL: (id: string) => `/api/users/${id}`,
    DASHBOARD: '/api/dashboard'
  }
} as const

// Theme Constants
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const

// Language Constants
export const LANGUAGES = {
  EN: 'en',
  VI: 'vi',
  FR: 'fr',
  ES: 'es'
} as const

// Form Validation Constants
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true
  },
  EMAIL: {
    MAX_LENGTH: 254
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30
  },
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100
  },
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  }
} as const

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
} as const

// Animation Constants
export const ANIMATIONS = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  EASING: {
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const

// Notification Constants
export const NOTIFICATIONS = {
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 10000
  },
  POSITION: {
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left',
    TOP_CENTER: 'top-center',
    BOTTOM_CENTER: 'bottom-center'
  }
} as const

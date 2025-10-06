import { z } from 'zod'
import { emailSchema, passwordSchema, phoneSchema, nonEmptyStringSchema } from './common'

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
})

export type LoginFormData = z.infer<typeof loginSchema>

export const loginResponseDataSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
  role: z.string()
})

export type LoginResponse = z.infer<typeof loginResponseDataSchema>

// Refresh token schema
export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required')
})

export type RefreshTokenFormData = z.infer<typeof refreshTokenSchema>

export type RefreshTokenResponse = z.infer<typeof loginResponseDataSchema>



// Registration schema
export const registerSchema = z
  .object({
    firstName: nonEmptyStringSchema.max(50, 'First name is too long'),
    lastName: nonEmptyStringSchema.max(50, 'Last name is too long'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    phone: phoneSchema.optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions'
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

export type RegisterFormData = z.infer<typeof registerSchema>

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

// Reset password schema
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

// Profile update schema
export const profileUpdateSchema = z.object({
  firstName: nonEmptyStringSchema.max(50, 'First name is too long'),
  lastName: nonEmptyStringSchema.max(50, 'Last name is too long'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  bio: z.string().max(500, 'Bio is too long').optional(),
  dateOfBirth: z.date().optional(),
  avatar: z.string().url().optional()
})

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>

// User type for API responses
export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  dateOfBirth: z.date().optional(),
  avatar: z.string().url().optional(),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  role: z.enum(['user', 'admin', 'moderator']),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type User = z.infer<typeof userSchema>

// Auth response schema
export const authResponseSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number()
})

export type AuthResponse = z.infer<typeof authResponseSchema>

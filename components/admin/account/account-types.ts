import { z } from 'zod'
import { USER_ROLE_VALUES, type UserRole } from '@/lib/constants/roles'

export type AccountRow = {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'active' | 'inactive'
}

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên'),
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Bao gồm chữ hoa, chữ thường và số'),
  role: z.enum(USER_ROLE_VALUES)
})

export type CreateAccountFormData = z.infer<typeof createAccountSchema>

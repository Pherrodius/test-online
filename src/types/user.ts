import type { Gender } from './prisma'

export interface CreateUserRequest {
  name: string
  phone: string
  password: string
  confirmPassword: string
}

export interface UpdateUserRequest {
  name?: string
  phone?: string
  password?: string
  avatarUrl?: string
  introduction?: string
  direction?: string
  area?: string
  gender?: Gender | null
}

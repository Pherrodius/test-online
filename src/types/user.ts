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
}

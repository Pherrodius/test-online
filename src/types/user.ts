export interface CreateUserRequest {
  name: string
  phone: string
  password: string
}

export interface UpdateUserRequest {
  name?: string
  phone?: string
  password?: string
}

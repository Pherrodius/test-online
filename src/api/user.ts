import type { LoginByNameRequest, LoginByPhoneRequest, RegisterRequest } from '@/types/reqeust'
import type { LoginResponse, RegisterResponse } from '@/types/response'

import { request } from '@/utils/request'
export function loginRequest<T>(data: LoginByNameRequest | LoginByPhoneRequest) {
  return request.post<T, LoginResponse>('/user/login', data)
}
export function registerRequest<T>(data: RegisterRequest) {
  return request.post<T, RegisterResponse>('/user', data)
}

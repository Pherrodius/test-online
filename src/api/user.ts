import type { CollectionType, TestHistory } from '@/types/prisma'
import type { LoginByNameRequest, LoginByPhoneRequest, RegisterRequest } from '@/types/reqeust'
import type {
  getOverviewResponse,
  LoginResponse,
  RegisterResponse,
  GetGroupedCollectionsRes,
  GetMyBanksRes,
} from '@/types/response'

import { request } from '@/utils/request'
export function loginRequest(data: LoginByNameRequest | LoginByPhoneRequest) {
  return request.post<unknown, LoginResponse>('/user/login', data)
}
export function registerRequest(data: RegisterRequest) {
  return request.post<unknown, RegisterResponse>('/user', data)
}
export function getOverview() {
  return request.get<unknown, getOverviewResponse>('/user/overview')
}

export function getTestHistory() {
  return request.get<unknown, TestHistory[]>('/user/testHistory')
}
export function deleteTestHistory(id: number) {
  return request.delete<unknown, TestHistory>(`/user/testHistory/${id}`)
}
export function getGroupedCollections(type: CollectionType) {
  return request.get<unknown, GetGroupedCollectionsRes[]>('/user/collections', { params: { type } })
}
export function getMyBanks() {
  return request.get<unknown, GetMyBanksRes[]>('/user/banks')
}

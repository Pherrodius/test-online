import type { Bank, Category, Discipline } from '@/types/prisma'
import type { GetBankRequest, CreateBankRequest } from '@/types/reqeust'
import type {
  GetBanksResponse,
  GetBankResponse,
  CreateBankResponse,
  GetQuestionDetailResponse,
} from '@/types/response'
import { request } from '@/utils/request'

export function getBankList(params: GetBankRequest) {
  return request.get<unknown, GetBanksResponse>('/bank', { params })
}
export function getBank(id: number) {
  return request.get<unknown, GetBankResponse | null>(`/bank/${id}`)
}
export function createBank(data: CreateBankRequest) {
  return request.post<unknown, CreateBankResponse>('/bank/create', data)
}
export function updateBank(id: number, data: CreateBankRequest) {
  return request.put<unknown, CreateBankResponse>(`/bank/update/${id}`, data)
}
export function collectBank(id: number) {
  return request.post<unknown, Bank>(`/bank/collection/${id}`)
}
export function uncollectBank(id: number) {
  return request.delete<unknown, Bank>(`/bank/collection/${id}`)
}
export function deleteBank(id: number) {
  return request.delete<unknown, Bank>(`/bank/delete/${id}`)
}
export function getOwnedBanks() {
  return request.get<unknown, (Bank & { disciplines: Discipline })[]>('/bank/mine')
}
export function isBankCollected(id: number) {
  return request.get<unknown, boolean>(`/bank/collection/${id}/exist`)
}
export function getCollectedBanks() {
  return request.get<unknown, GetBanksResponse>('/bank/collection')
}
export function getAllCategories() {
  return request.get<unknown, Category[]>('/bank/category')
}
export function getDetailedQuestions(bankId: number, disciplineId: number) {
  return request.get<unknown, GetQuestionDetailResponse[]>(`/bank/edit/${bankId}`, {
    params: { disciplineId },
  })
}

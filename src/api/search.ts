import type {
  SearchBanksReq,
  SearchDocumentsReq,
  SearchQuestionsReq,
  SearchUsersReq,
} from '@/types/reqeust'
import type {
  SearchBanksRes,
  SearchDocumentsRes,
  SearchQuestionsRes,
  SearchUsersRes,
} from '@/types/response'
import { request } from '@/utils/request'

export function searchQuestions(params: SearchQuestionsReq) {
  return request.get<unknown, SearchQuestionsRes>(`/search/question`, { params })
}
export function searchBanks(params: SearchBanksReq) {
  return request.get<unknown, SearchBanksRes>(`/search/question`, { params })
}
export function searchDocuments(params: SearchDocumentsReq) {
  return request.get<unknown, SearchDocumentsRes>(`/search/question`, { params })
}
export function searchUsers(params: SearchUsersReq) {
  return request.get<unknown, SearchUsersRes>(`/search/question`, { params })
}

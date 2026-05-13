import { request } from '@/utils/request'
import type {
  GetQuestionRequest,
  CreateQuestionRequest,
  CheckAnswerRequest,
  CreateCollectionRequest,
  GetBankRequest,
  CreateBankRequest,
  GetCollectionRequest,
} from '@/types/reqeust'
import type {
  GetQuestionsResponse,
  CreateQuestionResponse,
  CreateManyQuestionsResponse,
  CheckAnswerResponse,
  CheckManyAnswersResponse,
  CreateCollectionResponse,
  GetCollectionResponse,
  DeleteCollectionResponse,
  GetBanksResponse,
  CreateBankResponse,
  GetBankResponse,
  GetQuestionDetailResponse,
} from '@/types/response'
export function getQuestionList<T>(params: GetQuestionRequest) {
  return request.get<T, GetQuestionsResponse>('/question', { params })
}
export function getQuestionDetail<T>(id: number) {
  return request.get<T, GetQuestionDetailResponse>(`/question/${id}`)
}
export function createQuestion<T>(data: CreateQuestionRequest) {
  return request.post<T, CreateQuestionResponse>('/question', data)
}
export function createManyQuestions<T>(data: CreateQuestionRequest[]) {
  return request.post<T, CreateManyQuestionsResponse>('/question', data)
}
export function checkAnswer<T>(data: CheckAnswerRequest) {
  return request.post<T, CheckAnswerResponse>('/question/check', data)
}
export function checkManyAnswers<T>(data: CheckAnswerRequest[]) {
  return request.post<T, CheckManyAnswersResponse>('/question/checkMany', data)
}
export function createCollection<T>(data: CreateCollectionRequest) {
  return request.post<T, CreateCollectionResponse>('/collection', data)
}
export function getCollectionList<T>(params: GetCollectionRequest) {
  return request.get<T, GetCollectionResponse>(`/collection`, { params })
}
export function deleteCollection<T>(id: number) {
  return request.delete<T, DeleteCollectionResponse>(`/collection/${id}`)
}
export function getBankList<T>(params: GetBankRequest) {
  return request.get<T, GetBanksResponse>('/bank', { params })
}
export function getBank<T>(id: number) {
  return request.get<T, GetBankResponse>(`/bank/${id}`)
}
export function createBank<T>(data: CreateBankRequest) {
  return request.post<T, CreateBankResponse>('/bank/create', data)
}

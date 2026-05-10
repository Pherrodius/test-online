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
  GetQuestionResponse,
  CreateQuestionResponse,
  CreateManyQuestionsResponse,
  CheckAnswerResponse,
  CheckManyAnswersResponse,
  CreateCollectionResponse,
  GetCollectionResponse,
  DeleteCollectionResponse,
  GetBankResponse,
  CreateBankResponse,
} from '@/types/response'
export function getQuestionList<T>(params: GetQuestionRequest) {
  return request.get<T, GetQuestionResponse[]>('/question', { params })
}
export function getQuestion<T>(id: number) {
  return request.get<T, GetQuestionResponse>(`/question/${id}`)
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
  return request.get<T, GetBankResponse>('/bank', { params })
}
export function createBank<T>(data: CreateBankRequest) {
  return request.post<T, CreateBankResponse>('/bank', data)
}

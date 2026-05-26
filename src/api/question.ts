import { request } from '@/utils/request'
import type {
  GetQuestionRequest,
  CreateQuestionRequest,
  CheckAnswerRequest,
  CreateCollectionRequest,
  GetBankRequest,
  CreateBankRequest,
  GetCollectionRequest,
  DeleteAllCollectionsRequest,
  getResolutionsRequest,
} from '@/types/reqeust'
import type {
  GetQuestionListResponse,
  CreateQuestionResponse,
  CreateManyQuestionsResponse,
  CheckAnswerResponse,
  CheckManyAnswersResponse,
  CreateCollectionResponse,
  GetCollectionListResponse,
  DeleteCollectionResponse,
  GetBanksResponse,
  CreateBankResponse,
  GetBankResponse,
  GetQuestionDetailResponse,
  isCollectionExistResponse,
} from '@/types/response'
import type { Resolution } from '@/types/prisma'
export function getQuestionList<T>(params: GetQuestionRequest) {
  return request.get<T, GetQuestionListResponse[]>('/question', { params })
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
  return request.post<T, CheckManyAnswersResponse>('/question/check', data)
}
export function isCollectionExist<T>(questionId: number) {
  return request.get<T, isCollectionExistResponse>(`/question/collection/exist`, {
    params: { questionId },
  })
}
export function createCollection<T>(data: CreateCollectionRequest) {
  return request.post<T, CreateCollectionResponse>('/question/collection', data)
}
export function getCollectionList<T>(params: GetCollectionRequest) {
  return request.get<T, GetCollectionListResponse>(`/question/collection`, { params })
}
export function deleteCollection<T>(id: number) {
  return request.delete<T, DeleteCollectionResponse>(`/question/collection/${id}`)
}
export function deleteAllCollections<T>(params: DeleteAllCollectionsRequest) {
  return request.delete<T, void>(`/question/collection`, { params })
}
export function getResolutions<T>(params: getResolutionsRequest) {
  return request.get<T, Resolution[]>(`/question/resolution`, {
    params,
  })
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

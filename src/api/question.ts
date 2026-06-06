import { request } from '@/utils/request'
import type {
  GetQuestionRequest,
  CreateQuestionRequest,
  CheckAnswerRequest,
  CreateCollectionRequest,
  GetCollectionRequest,
  DeleteAllCollectionsRequest,
  SubmitTestRequest,
  GetResolutionsRequest,
  deleteResolutionRequest,
  EditQuestionReq,
} from '@/types/reqeust'
import type {
  GetQuestionListResponse,
  CreateQuestionResponse,
  CreateManyQuestionsResponse,
  CheckAnswerResponse,
  SubmitTestResponse,
  CreateCollectionResponse,
  GetCollectionListResponse,
  GetDetailedCollectionListResponse,
  DeleteCollectionResponse,
  GetQuestionDetailResponse,
  isCollectionExistResponse,
} from '@/types/response'
import type { Resolution } from '@/types/prisma'
export function getQuestionList(params: GetQuestionRequest) {
  return request.get<unknown, GetQuestionListResponse[]>('/question', { params })
}
export function getQuestionDetail(id: number) {
  return request.get<unknown, GetQuestionDetailResponse | null>(`/question/${id}`)
}
export function createQuestion(data: CreateQuestionRequest) {
  return request.post<unknown, CreateQuestionResponse>('/question', data)
}
export function deleteQuestion(id: number) {
  return request.delete<unknown, CreateQuestionResponse>(`/question/delete/${id}`)
}
export function createManyQuestions(data: CreateQuestionRequest[]) {
  return request.post<unknown, CreateManyQuestionsResponse>('/question', data)
}
export function checkAnswer(data: CheckAnswerRequest) {
  return request.post<unknown, CheckAnswerResponse>('/question/check', data, {
    timeout: 5 * 60 * 1000,
  })
}
export function submitTest(data: SubmitTestRequest) {
  return request.post<unknown, SubmitTestResponse>('/question/submit', data, {
    timeout: 50 * 60 * 1000,
  })
}
export function isCollectionExist(questionId: number) {
  return request.get<unknown, isCollectionExistResponse>(`/question/collection/exist`, {
    params: { questionId },
  })
}
export function createCollection(data: CreateCollectionRequest) {
  return request.post<unknown, CreateCollectionResponse>('/question/collection', data)
}
export function getCollectionList(
  params: GetCollectionRequest & { detailed: true },
): Promise<GetDetailedCollectionListResponse>

export function getCollectionList(params: GetCollectionRequest): Promise<GetCollectionListResponse>

export function getCollectionList(params: GetCollectionRequest) {
  return request.get<unknown, GetCollectionListResponse>(`/question/collection`, { params })
}
export function deleteCollection(id: number) {
  return request.delete<unknown, DeleteCollectionResponse>(`/question/collection/${id}`)
}
export function deleteAllCollections(params: DeleteAllCollectionsRequest) {
  return request.delete<unknown, DeleteCollectionResponse>(`/question/collection`, { params })
}
export function getResolutions(params: GetResolutionsRequest) {
  return request.get<unknown, Resolution[]>(`/question/resolution`, {
    params,
  })
}
export function deleteResolution(id: number) {
  return request.delete<unknown, Resolution>(`/question/resolution/${id}`)
}
export function batchDeleteResolution(params: deleteResolutionRequest) {
  return request.delete<unknown, Resolution>(`/question/resolution`, { params })
}
export function editQuestion(id: number, data: EditQuestionReq) {
  return request.put<unknown, CreateQuestionResponse>(`/question/edit/${id}`, data)
}

import type { QuestionType, Answer, CollectionType, MimeType, Gender } from '@/types/prisma'
export interface CreateQuestionRequest {
  type: QuestionType
  content: string
  options: {
    key: Answer
    text: string
  }[]
  answer: Answer | Answer[] | string
  bank?: string
  bankId?: number
  disciplineId?: number
  discipline?: string
  riskLevel?: number
  explanation?: string
}

export interface GetQuestionRequest {
  collectionType?: CollectionType
  type?: QuestionType
  content?: string
  bank?: string
  bankId?: number
  disciplineId?: number
  discipline?: string
  number?: number
}

export interface CheckAnswerRequest {
  questionId: number
  answer: Answer | Answer[] | string
}
export enum TestType {
  SeqPractice = 'SeqPractice',
  RandomPractice = 'RandomPractice',
  Review = 'Review',
}

export interface SubmitTestRequest {
  answerSheet: CheckAnswerRequest[]
  bankId: number
  disciplineId: number
  takenTime: number
  length: number
}
export interface CreateCollectionRequest {
  questionId: number
  type?: CollectionType
}

export interface GetCollectionRequest {
  type?: CollectionType
  bankId?: number
  disciplineId?: number
  isDay?: 1 | 0
  questionType?: QuestionType
  detailed?: boolean
}

export interface GetResolutionsRequest {
  bankId?: number
  disciplineId?: number
  bankName?: string
  disciplineName?: string
  detailed?: boolean
}

export interface DeleteAllCollectionsRequest {
  type?: CollectionType
  bankId?: number
  disciplineId?: number
  questionId?: number
}

export interface CreateBankRequest {
  name: string
  description: string
  disciplines: string[]
  categoryId?: number
  categoryName?: string
}

export interface GetBankRequest {
  name?: string
  description?: string
  creator?: string
  categoryId?: number
  categoryName?: string
}
export interface LoginByNameRequest {
  name: string
  password: string
}
export interface LoginByPhoneRequest {
  phone: string
  password: string
}
export interface RegisterRequest {
  name: string
  phone: string
  password: string
  confirmPassword: string
}

export interface UpdateUserRequest {
  name?: string
  phone?: string
  password?: string
  avatarUrl?: string
  introduction?: string
  direction?: string
  area?: string
  gender?: Gender | null
  tags?: string[]
}
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
export interface ChangePhoneRequest {
  password: string
  phone: string
}
export interface deleteResolutionRequest {
  id?: number
  bankId?: number
  disciplineId?: number
}
export interface SearchQuestionsReq {
  keyword?: string
  type?: QuestionType
  time?: string
  collectedCount?: string
  riskLevel?: number
  page: number
}
export interface SearchBanksReq {
  keyword?: string
  questionCount?: string
  time?: string
  collectedCount?: string
  page: number
}
export interface SearchDocumentsReq {
  keyword?: string
  mimeType?: MimeType
  size?: string
  time?: string
  page: number
}
export interface SearchUsersReq {
  keyword?: string
  bankCount?: string
  time?: string
  page: number
}
export interface EditQuestionReq {
  content: string
  options: {
    key: Answer
    text: string
  }[]
  singleAnswer?: Answer | null
  multiChoiceAnswer?: Answer[]
  trueFalseAnswer?: Answer | null
  subjectiveAnswer?: string | null
  explanation?: string
  riskLevel?: number
}
export interface LLMAnalysisFileReq {
  prompt?: string
  bankId: number
  disciplineId: number
}

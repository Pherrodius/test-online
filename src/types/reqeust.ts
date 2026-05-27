import type { QuestionType, Answer, CollectionType } from '@/types/prisma'
export interface CreateQuestionRequest {
  type: QuestionType
  content: string
  options: {
    key: Answer
    text: string
  }[]
  answer: Answer | Answer[]
  bank: string
  discipline: string
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
  answer: Answer | Answer[]
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
}

export interface CreateBankRequest {
  name: string
  description: string
  creator: string
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
}
export interface deleteResolutionRequest {
  id?: number
  bankId?: number
  disciplineId?: number
}

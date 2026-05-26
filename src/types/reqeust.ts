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

export interface getResolutionsRequest {
  bankId?: number
  disciplineId?: number
  bankName?: string
  disciplineName?: string
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
}

export interface GetBankRequest {
  name?: string
  description?: string
  creator?: string
  size?: number
  page?: number
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

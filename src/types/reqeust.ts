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
  type?: QuestionType
  content?: string
  bank?: string
  bankId?: number
  disciplineId?: number
  discipline?: string
  number?: number
}

export interface CheckAnswerRequest {
  userId: number
  questionId: number
  answer: Answer | Answer[]
}

export interface CreateCollectionRequest {
  questionId: number
  userId: number
  type?: CollectionType
}

export interface GetCollectionRequest {
  userId: number
  type?: CollectionType
  bankId?: number
}

export interface DeleteAllCollectionsRequest {
  userId: number
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

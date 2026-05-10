import type {
  QuestionType,
  Answer,
  CollectionType,
  Question,
  Option,
  Bank,
  Discipline,
  Collection,
} from '@/types/prisma'

export interface CreateQuestionResponse {
  id: number
  type: QuestionType
  content: string
  options: { key: Answer; text: string }[]
  bank: string
  discipline: string
  answer: Answer | Answer[]
}

export interface CreateManyQuestionsResponse {
  success: number
  failed: number
  questions: CreateQuestionResponse[]
}

export interface GetQuestionsResponse {
  id: number
  type: QuestionType
  content: string
  bank: string
  discipline: string
  createdTime: Date
  options: Option[]
}

export type GetQuestionResponse = GetQuestionsResponse

export interface CheckAnswerResponse {
  questionId: number
  yourAnswer: Answer | Answer[]
  correctAnswer: Answer | Answer[]
  isCorrect: boolean
  mistakeId?: number
}

export interface CheckManyAnswersResponse {
  userId: number
  correctCount: number
  wrongCount: number
  results: CheckAnswerResponse[]
}

export type CreateCollectionResponse = Collection

export interface GetCollectionResponse {
  userId: number
  type: CollectionType
  r: Question[]
  page: number
  size: number
  total: number
}

export type DeleteCollectionResponse = Collection

export type CreateBankResponse = Bank

export interface GetBankResponse {
  records: (Bank & { disciplines: Discipline[] })[]
  total: number
  page: number
  size: number
}

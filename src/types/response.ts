import type {
  QuestionType,
  Answer,
  CollectionType,
  Question,
  Option,
  Bank,
  Collection,
  MultiChoiceAnswer,
  SingleAnswer,
  TrueFalseAnswer,
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

export interface GetQuestionDetailResponse {
  id: number
  type: QuestionType
  content: string
  bankId: number
  disciplineId: number
  createdTime: Date
  options: Option[]
  explanation?: string
  bank: {
    id: number
    name: string
    createdTime: Date
    description: string
  }
  discipline: {
    id: number
    name: string
  }
  singleAnswer?: SingleAnswer
  multiChoiceAnswer?: MultiChoiceAnswer[]
  trueFalseAnswer?: TrueFalseAnswer
}

export type GetQuestionListResponse = {
  id: number
  type: QuestionType
  content: string
  bankId: number
  disciplineId: number
  createdTime: Date
  options: Option[]
  bank: {
    id: number
    name: string
  }
  discipline: {
    id: number
    name: string
  }
}

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
  records: Question[]
  total: number
  mistakes: number
  notes: number
}

export type DeleteCollectionResponse = Collection

export type CreateBankResponse = Bank

export interface GetBankResponse {
  id: number
  name: string
  description: string
  disciplines: {
    id: number
    name: string
  }[]
  creator: {
    id: number
    name: string
  }
  questions: {
    id: number
    content: string
    disciplineId: number
    type: QuestionType
  }[]
  createdTime: Date
}

export interface GetBanksResponse {
  records: GetBankResponse[]
  total: number
  page: number
  size: number
}

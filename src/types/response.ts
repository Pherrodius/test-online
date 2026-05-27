import type {
  QuestionType,
  Answer,
  CollectionType,
  Option,
  Bank,
  BankCategory,
  Collection,
  Discipline,
  MultiChoiceAnswer,
  Question,
  Resolution,
  SingleAnswer,
  TrueFalseAnswer,
  TestHistory,
  BankCollection,
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
  id: Question['id']
  type: Question['type']
  content: Question['content']
  bankId: Question['bankId']
  disciplineId: Question['disciplineId']
  createdTime: Question['createdTime']
  options: Option[]
  bank: Bank
  discipline: Discipline
  singleAnswer: SingleAnswer | null
  multiChoiceAnswer: MultiChoiceAnswer[]
  trueFalseAnswer: TrueFalseAnswer | null
}

export type GetQuestionListResponse = Omit<
  Question,
  'options' | 'singleAnswer' | 'multiChoiceAnswer' | 'trueFalseAnswer'
> & {
  options: Option[]
}

export type CheckAnswerResponse = Resolution

export interface SubmitTestResponse {
  userId: number
  correctCount: number
  wrongCount: number
  results: CheckAnswerResponse[]
  accuracy?: number
  takenTime?: number
  testRecord?: TestHistory
}

export type CreateCollectionResponse = Collection

export type GetCollectionRecordResponse = Omit<
  GetQuestionDetailResponse,
  'singleAnswer' | 'multiChoiceAnswer' | 'trueFalseAnswer'
> & {
  updatedTime: Collection['updatedTime']
  singleAnswer?: SingleAnswer | null
  multiChoiceAnswer?: MultiChoiceAnswer[]
  trueFalseAnswer?: TrueFalseAnswer | null
}

export type GetDetailedCollectionRecordResponse = Omit<
  GetCollectionRecordResponse,
  'singleAnswer' | 'multiChoiceAnswer' | 'trueFalseAnswer'
> & {
  singleAnswer: SingleAnswer | null
  multiChoiceAnswer: MultiChoiceAnswer[]
  trueFalseAnswer: TrueFalseAnswer | null
}

export interface GetCollectionListResponse {
  userId: number
  type?: CollectionType
  records: GetCollectionRecordResponse[]
  total: number
  mistakes: number
  notes: number
}

export interface GetDetailedCollectionListResponse extends Omit<
  GetCollectionListResponse,
  'records'
> {
  records: GetDetailedCollectionRecordResponse[]
}

export interface DeleteCollectionResponse {
  count: number
}

export type CreateBankResponse = Bank

export interface GetBankResponse extends Omit<Bank, 'disciplines'> {
  disciplines: Discipline[]
  creator: {
    id: number
    name: string
  }
  category: BankCategory | null
  questions: {
    id: number
    content: string
    disciplineId: number
    type: QuestionType
  }[]
}

export type GetBankListRecordResponse = Bank & {
  disciplines: Discipline[]
  category: BankCategory | null
}

export interface GetBanksResponse {
  records: GetBankListRecordResponse[]
  total: number
}
export interface LoginResponse {
  id: number
  name: string
  phone: string
  accessToken: string
  tokenType: 'Bearer'
}

export interface RegisterResponse {
  id: number
  name: string
  phone: string
}
export interface isCollectionExistResponse {
  userId: number
  questionId: number
  notedId?: number
  mistakeId?: number
  isMistake: boolean
  isNoted: boolean
}

export type GetResolutionsResponse = Resolution[]
export interface getOverviewResponse {
  recentRecords: TestHistory[]
  practiceCount: number
  noteCount: number
  mistakeCount: number
  collectedBank: (BankCollection & { bank: Bank })[]
}

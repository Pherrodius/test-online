export enum QuestionType {
  SingleChoice = 'SingleChoice',
  MultiChoice = 'MultiChoice',
  TrueFalse = 'TrueFalse',
}

export enum Answer {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export enum CollectionType {
  Mistake = 'Mistake',
  Note = 'Note',
}

// Dates are serialized as ISO strings in HTTP responses.
export type DateTimeString = string

export interface User {
  id: number
  name: string
  phone: string
  password: string
  createdTime: DateTimeString
}

export interface Option {
  id: number
  key: Answer
  text: string
  questionId: number
}

export interface SingleAnswer {
  questionId: number
  answerKey: Answer
}

export interface MultiChoiceAnswer {
  id: number
  questionId: number
  answerKey: Answer
}

export interface TrueFalseAnswer {
  questionId: number
  answerKey: Answer
}

export interface Question {
  id: number
  type: QuestionType
  content: string
  bankId: number
  disciplineId: number
  createdTime: DateTimeString
  options?: Option[]
  singleAnswer?: SingleAnswer | null
  multiChoiceAnswer?: MultiChoiceAnswer[]
  trueFalseAnswer?: TrueFalseAnswer | null
}

export interface Bank {
  id: number
  name: string
  description: string
  categoryId: number | null
  creatorId: number
  createdTime: DateTimeString
  disciplines?: Discipline[]
  bankCollections?: BankCollection[]
}

export interface BankCategory {
  id: number
  name: string
}

export interface Discipline {
  id: number
  name: string
}

export interface Collection {
  id: number
  userId: number
  questionId: number
  updatedTime: DateTimeString
  type: CollectionType
}

export interface BankCollection {
  id: number
  userId: number
  bankId: number
  updatedTime: DateTimeString
  bank?: Bank
}

export interface Resolution {
  id: number
  userId: number
  questionId: number
  yourAnswer: string
  correctAnswer: string
  isCorrect: boolean
  updatedTime: DateTimeString
  user?: User
  question?: Question
}
export interface Category {
  id: number
  name: string
}
export interface TestHistory {
  id: number
  userId: number
  bankId: number
  disciplineId: number
  accuracy: number
  takenTime: number
  createdTime: DateTimeString
  bank?: Bank
  discipline?: Discipline
  length: number
}

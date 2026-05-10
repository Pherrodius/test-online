export enum QuestionType {
  Choice = 'Choice',
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
  bank: string
  discipline: string
  createdTime: Date
  options?: Option[]
  singleAnswer?: SingleAnswer
  multiChoiceAnswer?: MultiChoiceAnswer[]
  trueFalseAnswer?: TrueFalseAnswer
}

export interface Bank {
  name: string
  description: string
  creator: string
  createdTime: Date
  disciplines?: Discipline[]
}

export interface Discipline {
  name: string
  bankName: string
}

export interface Collection {
  id: number
  userId: number
  questionId: number
  createdTime: Date
  type: CollectionType
}

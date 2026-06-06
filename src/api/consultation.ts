import { request } from '@/utils/request'

export interface ConsultationMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  createdTime: string
}

export function getConsultationHistory() {
  return request.get<unknown, ConsultationMessage[]>('/consultation/history')
}

export function clearConsultationHistory() {
  return request.delete<unknown, { count: number }>('/consultation/history')
}

export function getConsultationStreamUrl(questionId: number) {
  return `/api/consultation/${questionId}/stream`
}

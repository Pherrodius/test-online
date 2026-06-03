import { request } from '@/utils/request'
import type { Document } from '@/types/prisma'
import type { LLMAnalysisFileReq } from '@/types/reqeust'

export function uploadFile(file: File, content: string) {
  const formData = new FormData()
  formData.append('file', file)
  if (content.length > 0) formData.append('content', content)
  console.log(formData)
  return request.post('files/upload', formData)
}

export function deleteFile(id: number) {
  return request.delete(`files/delete/${id}`)
}

export function getFiles() {
  return request.get<unknown, Document[]>('/files')
}
export function LLMAnalysisFile(id: number, data: LLMAnalysisFileReq) {
  return request.post<unknown, string>(`/files/llm/${id}`, data, { timeout: 5 * 60 * 1000 })
}

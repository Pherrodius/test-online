import { request } from '@/utils/request'
import type { Document } from '@/types/prisma'

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

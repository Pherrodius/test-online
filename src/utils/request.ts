import axios from 'axios'
import { ElMessage } from 'element-plus'
export const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    if (response.data.code === 200) {
      return response.data.data || response.data
    }
    ElMessage.error(response.data.msg || '请求失败')
    return Promise.reject(response.data)
  },
  (error) => {
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  },
)

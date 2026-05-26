import router from '@/router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  router.push('/auth/login')
}

request.interceptors.response.use(
  (response) => {
    if (response.status === 401 || response.data.code === 401) {
      ElMessage.error('未登录或登录过期，请重新登录')
      clearAuth()
      return Promise.reject(response.data)
    }

    if (response.data.code === 200) {
      return response.data.data || response.data
    }

    console.error(response.data.message || '请求失败')
    return Promise.reject(response.data)
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.data?.code === 401) {
      ElMessage.error('未登录或登录过期，请重新登录')
      clearAuth()
    }

    console.error(error.message || '请求失败')
    return Promise.reject(error)
  },
)

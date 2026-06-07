import defaultAvatar from '@/assets/images/def-head.png'
import type { User } from '@/types/prisma'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { computed, onScopeDispose, ref } from 'vue'
import { useRouter } from 'vue-router'

export type SessionUser = Pick<User, 'id' | 'name' | 'phone' | 'avatarUrl'>

function readStoredUser(): SessionUser | null {
  const storedUser = localStorage.getItem('userInfo')
  if (!storedUser) return null

  try {
    return JSON.parse(storedUser) as SessionUser
  } catch {
    localStorage.removeItem('userInfo')
    return null
  }
}

export const useUserSessionStore = defineStore('userSession', () => {
  const router = useRouter()
  const mobileMedia = window.matchMedia('(max-width: 767px)')
  const userInfo = ref<SessionUser | null>(readStoredUser())
  const buttonSize = ref<'small' | 'default'>(mobileMedia.matches ? 'small' : 'default')
  const avatar = computed(() => userInfo.value?.avatarUrl || defaultAvatar)
  const isLogin = computed(() => !!userInfo.value)

  const syncButtonSize = (event: MediaQueryListEvent) => {
    buttonSize.value = event.matches ? 'small' : 'default'
  }

  mobileMedia.addEventListener('change', syncButtonSize)
  onScopeDispose(() => mobileMedia.removeEventListener('change', syncButtonSize))

  const setUser = (user: SessionUser) => {
    userInfo.value = user
    localStorage.setItem('userInfo', JSON.stringify(user))
  }

  const setSession = (user: SessionUser, token: string) => {
    setUser(user)
    localStorage.setItem('token', token)
  }

  const logout = () => {
    userInfo.value = null
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
    ElMessage.success('退出登录成功')
    router.push('/auth/login')
  }

  return {
    userInfo,
    avatar,
    isLogin,
    buttonSize,
    setUser,
    setSession,
    logout,
  }
})

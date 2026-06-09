<template>
  <div class="login-form">
    <div class="form-header">
      <h2 class="form-title">欢迎回来</h2>
      <p class="form-desc">登录您的账户，继续学习之旅</p>
    </div>

    <el-form :model="loginForm" ref="loginFormRef" :rules="loginRules" class="form-body">
      <el-form-item prop="name" v-if="loginByName">
        <el-input
          v-model="loginForm.name"
          type="text"
          placeholder="请输入用户名"
          prefix-icon="User"
          class="input-field"
        />
      </el-form-item>
      <el-form-item prop="phone" v-else>
        <el-input
          v-model="loginForm.phone"
          type="text"
          placeholder="请输入手机号"
          prefix-icon="Iphone"
          class="input-field"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          prefix-icon="Lock"
          class="input-field"
          @keyup.enter="handleLogin"
        />
      </el-form-item>

      <el-form-item class="submit-item">
        <el-button type="primary" class="login-btn" :loading="isLoading" @click="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
    <div class="social-divider">
      <span class="divider-text">其它方式登录</span>
    </div>
    <div class="social-login">
      <el-button class="social-btn" @click="loginByName = !loginByName">
        <el-icon v-if="loginByName" title="手机号登录"><Iphone /></el-icon>
        <el-icon v-else title="用户名登录"><User /></el-icon>
      </el-button>
    </div>
    <div class="form-footer">
      <span class="register-link">
        还没有账户？
        <router-link to="/auth/register" class="link-text">立即注册</router-link>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loginRequest } from '@/api/user'
import type { LoginByNameRequest, LoginByPhoneRequest } from '@/types/reqeust'
import { Iphone, User } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserSessionStore } from '@/stores/userSession'
const loginByName = ref(true)
const router = useRouter()
const route = useRoute()
const userSessionStore = useUserSessionStore()
const loginFormRef = ref()
const isLoading = ref(false)

const loginForm = reactive({
  phone: '',
  name: '',
  password: '',
  rememberMe: false,
})

const loginRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '手机号长度必须为11位', trigger: 'blur' },
  ],
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 12, message: '密码长度必须为6-12位', trigger: 'blur' },
  ],
}
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    const valid = await loginFormRef.value.validate()
    if (valid) {
      isLoading.value = true
      try {
        const payload: {
          phone?: string
          name?: string
          password: string
        } = {
          password: loginForm.password,
        }
        if (loginByName.value) {
          payload.name = loginForm.name
        } else {
          payload.phone = loginForm.phone
        }
        const res = await loginRequest(payload as LoginByNameRequest | LoginByPhoneRequest)
        userSessionStore.setSession(
          {
            id: res.id,
            name: res.name,
            phone: res.phone,
            avatarUrl: res.avatarUrl,
          },
          res.accessToken,
        )
        router.push(String(route.query.redirect || '/'))
        isLoading.value = false
      } catch (error) {
        console.error('登录失败', error)
        isLoading.value = false
      }
    }
  } catch (error) {
    console.error('表单验证失败', error)
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-form {
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;

  .form-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin: 0 0 8px 0;
  }

  .form-desc {
    font-size: 14px;
    color: #999;
    margin: 0;
  }
}

.form-body {
  margin-bottom: 24px;
}

.input-field {
  width: 100%;
  height: 44px;
  border-radius: 8px;

  :deep(.el-input__wrapper) {
    border-radius: 8px;
    box-shadow: none;

    &:focus-within {
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .remember-checkbox {
    color: #666;
    font-size: 14px;
  }

  .forgot-link {
    font-size: 14px;
    color: #409eff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.submit-item {
  margin-bottom: 0;
}

.login-btn {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

.form-footer {
  text-align: center;
  margin-bottom: 24px;

  .register-link {
    font-size: 14px;
    color: #666;

    .link-text {
      color: #409eff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.social-divider {
  position: relative;
  text-align: center;
  margin-bottom: 12px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 35%;
    height: 1px;
    background-color: #e0e0e0;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  .divider-text {
    display: inline-block;
    padding: 0 16px;
    font-size: 12px;
    color: #999;
    background-color: #fff;
  }
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
  .social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid #e0e0e0;
    color: #666;
    font-size: 0;

    &:hover {
      border-color: #409eff;
      color: #409eff;
      background-color: #f0f7ff;
    }

    :deep(.el-icon) {
      font-size: 20px;
    }
  }
}
</style>

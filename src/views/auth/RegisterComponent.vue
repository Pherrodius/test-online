<template>
  <div class="register-form">
    <div class="form-header">
      <h2 class="form-title">创建账户</h2>
      <p class="form-desc">开启您的学习之旅</p>
    </div>

    <el-form :model="registerForm" ref="registerFormRef" :rules="registerRules" class="form-body">
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" type="text" placeholder="请输入用户名" prefix-icon="User"
          class="input-field" />
      </el-form-item>

      <el-form-item prop="phone">
        <el-input v-model="registerForm.phone" type="text" placeholder="请输入手机号" prefix-icon="Phone"
          class="input-field" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock"
          class="input-field" />
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请确认密码" prefix-icon="Lock"
          class="input-field" @keyup.enter="handleRegister" />
      </el-form-item>

      <el-form-item prop="agree" class="form-options">
        <el-checkbox v-model="registerForm.agree" class="agree-checkbox">
          我已阅读并同意
          <a href="#" class="agreement-link">《用户协议》</a>
          和
          <a href="#" class="agreement-link">《隐私政策》</a>
        </el-checkbox>
      </el-form-item>

      <el-form-item class="submit-item">
        <el-button type="primary" class="register-btn" :loading="isLoading" @click="handleRegister">
          注册并登录
        </el-button>
      </el-form-item>
    </el-form>

    <div class="form-footer">
      <span class="login-link">
        已有账户？
        <router-link to="/auth/login" class="link-text">立即登录</router-link>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loginRequest, registerRequest } from '@/api/user'
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'



const router = useRouter()
const route = useRoute()
const registerFormRef = ref()
const isLoading = ref(false)

const registerForm = reactive({
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agree: false
})

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符之间', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '手机号长度必须为11位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 12, message: '密码长度必须为6-12位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  agree: [
    { required: true, message: '请同意用户协议和隐私政策', trigger: 'change' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    const valid = await registerFormRef.value.validate()
    if (valid) {
      isLoading.value = true
      try {
        await registerRequest({
          name: registerForm.username,
          phone: registerForm.phone,
          password: registerForm.password,
          confirmPassword: registerForm.confirmPassword
        })
        const data = await loginRequest({
          phone: registerForm.phone,
          password: registerForm.password,
        })
        localStorage.setItem(
          'userInfo',
          JSON.stringify({
            id: data.id,
            name: data.name,
            phone: data.phone,
          }),
        )
        localStorage.setItem('token', data.accessToken)
        router.push(String(route.query.redirect || '/'))
      } catch (error) {
        console.error('注册失败', error)
      }
      isLoading.value = false
    }
  } catch (error) {
    isLoading.value = false
    console.error('表单验证失败', error)
  }
}
</script>

<style scoped lang="scss">
.register-form {
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
  margin-bottom: 24px;

  .agree-checkbox {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    color: #666;
    font-size: 13px;
    line-height: 1.5;
  }

  .agreement-link {
    color: #409eff;
    text-decoration: none;
    margin: 0 4px;

    &:hover {
      text-decoration: underline;
    }
  }
}

.submit-item {
  margin-bottom: 0;
}

.register-btn {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

.form-footer {
  text-align: center;

  .login-link {
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
</style>

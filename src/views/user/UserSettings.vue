<template>
  <div class="user-page">
    <div class="page-header">
      <div>
        <h2>设置</h2>
        <p>管理账号安全、通知和练习偏好。</p>
      </div>
    </div>

    <section class="panel">
      <h3>账号安全</h3>
      <el-form label-width="120px">
        <el-form-item label="登录密码">
          <el-button plain @click="openPasswordDialog">修改密码</el-button>
        </el-form-item>
        <el-form-item label="绑定手机">
          <span>{{ maskedPhone }}</span>
          <el-button text type="primary" @click="openPhoneDialog">更换</el-button>
        </el-form-item>
      </el-form>
    </section>

    <section class="panel">
      <h3>练习设置</h3>
      <el-form label-width="120px" :model="practiceConfig">
        <el-form-item label="自动检查答案">
          <el-radio-group v-model="practiceConfig.autoCheck">
            <el-radio-button :value="true">开启</el-radio-button>
            <el-radio-button :value="false">关闭</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出题顺序">
          <el-radio-group v-model="practiceConfig.random">
            <el-radio-button :value="false">顺序</el-radio-button>
            <el-radio-button :value="true">随机</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </section>

    <section class="panel">
      <h3>测试设置</h3>
      <el-form label-width="120px" :model="testConfig">
        <el-form-item label="默认题量">
          <el-input-number v-model="testConfig.amount" :step="5" :min="5" :max="100" />
        </el-form-item>
      </el-form>
    </section>

    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      class="settings-dialog"
      width="460px"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="90px"
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input v-model="passwordForm.currentPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="passwordSaving" @click="submitPassword"
          >确认修改</el-button
        >
      </template>
    </el-dialog>

    <el-dialog
      v-model="phoneDialogVisible"
      title="更换绑定手机"
      class="settings-dialog"
      width="460px"
    >
      <el-form ref="phoneFormRef" :model="phoneForm" :rules="phoneRules" label-width="90px">
        <el-form-item label="新手机号" prop="phone">
          <el-input v-model="phoneForm.phone" maxlength="11" />
        </el-form-item>
        <el-form-item label="当前密码" prop="password">
          <el-input v-model="phoneForm.password" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="phoneDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="phoneSaving" @click="submitPhone">确认更换</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { changePassword, changePhone } from '@/api/user'
import { useConfigStore } from '@/stores/config'
import { useUserSessionStore } from '@/stores/userSession'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'

const configStore = useConfigStore()
const userSessionStore = useUserSessionStore()
const { practiceConfig, testConfig } = storeToRefs(configStore)
const { userInfo } = storeToRefs(userSessionStore)

const passwordDialogVisible = ref(false)
const phoneDialogVisible = ref(false)
const passwordSaving = ref(false)
const phoneSaving = ref(false)
const passwordFormRef = ref<FormInstance>()
const phoneFormRef = ref<FormInstance>()

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const phoneForm = reactive({
  phone: '',
  password: '',
})

const maskedPhone = computed(() => {
  const phone = userInfo.value?.phone
  return phone ? `${phone.slice(0, 3)}****${phone.slice(-4)}` : '未绑定'
})

const passwordRules: FormRules<typeof passwordForm> = {
  currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 12, message: '密码长度必须为 6-12 位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === passwordForm.newPassword) {
          callback()
        } else {
          callback(new Error('两次输入的新密码不一致'))
        }
      },
      trigger: 'blur',
    },
  ],
}
const phoneRules: FormRules<typeof phoneForm> = {
  phone: [
    { required: true, message: '请输入新手机号', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '请输入正确的 11 位手机号', trigger: 'blur' },
  ],
  password: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
}

const resetPasswordForm = () => {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordFormRef.value?.clearValidate()
}
const resetPhoneForm = () => {
  phoneForm.phone = ''
  phoneForm.password = ''
  phoneFormRef.value?.clearValidate()
}
const openPasswordDialog = () => {
  resetPasswordForm()
  passwordDialogVisible.value = true
}
const openPhoneDialog = () => {
  resetPhoneForm()
  phoneDialogVisible.value = true
}

const getErrorMessage = (error: unknown) => {
  const responseMessage = (error as { response?: { data?: { message?: string } } }).response?.data
    ?.message
  return responseMessage || '操作失败，请稍后重试'
}

const submitPassword = async () => {
  if (!(await passwordFormRef.value?.validate().catch(() => false))) return
  passwordSaving.value = true
  try {
    await changePassword(passwordForm)
    passwordDialogVisible.value = false
    ElMessage.success('密码修改成功')
  } catch (error) {
    ElMessage.error(getErrorMessage(error))
  } finally {
    passwordSaving.value = false
  }
}

const submitPhone = async () => {
  if (!(await phoneFormRef.value?.validate().catch(() => false))) return
  phoneSaving.value = true
  try {
    const updatedUser = await changePhone(phoneForm)
    userSessionStore.setUser({
      id: updatedUser.id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      avatarUrl: updatedUser.avatarUrl,
    })
    phoneDialogVisible.value = false
    ElMessage.success('绑定手机更换成功')
  } catch (error) {
    ElMessage.error(getErrorMessage(error))
  } finally {
    phoneSaving.value = false
  }
}
</script>

<style scoped lang="scss">
.user-page {
  padding: 24px;
  flex: 1;
}

.page-header,
.panel {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(31, 45, 61, 0.06);
}

.page-header {
  display: flex;
  justify-content: space-between;
  padding: 24px;
  margin-bottom: 16px;

  h2 {
    margin: 0 0 8px;
  }

  p {
    margin: 0;
    color: #7a8699;
  }
}

.panel {
  padding: 24px;
  margin-bottom: 16px;

  h3 {
    margin: 0 0 18px;
  }
}

@media (max-width: 767px) {
  .user-page {
    padding: 12px;
  }

  .page-header,
  .panel {
    padding: 16px;
  }

  :global(.settings-dialog) {
    width: calc(100vw - 24px);
    margin-top: 4vh;
  }

  :deep(.panel .el-form-item) {
    align-items: flex-start;
  }
}
</style>

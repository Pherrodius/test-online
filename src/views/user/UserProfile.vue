<template>
  <div class="user-page">
    <section class="panel profile-card">
      <el-avatar :size="80" :src="profile.avatarUrl">用户</el-avatar>
      <div>
        <h2>{{ profile.name }}</h2>
        <p>{{ profile.introduction }}</p>
        <el-tag type="success">普通会员</el-tag>
      </div>
    </section>

    <section class="panel">
      <div class="panel-title">
        <h3>基本信息</h3>
        <el-button type="primary" plain @click="openProfileDialog">编辑资料</el-button>
      </div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="昵称">{{ profile.name }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ profile.phone }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ profile.gender || '保密' }}</el-descriptions-item>
        <el-descriptions-item label="学习方向">{{
          profile.direction || '未填写'
        }}</el-descriptions-item>
        <el-descriptions-item label="所在地区">{{ profile.area || '未填写' }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ profile.createdTime }}</el-descriptions-item>
      </el-descriptions>
    </section>

    <section class="panel">
      <div class="panel-title">
        <h3>学习偏好</h3>
      </div>
      <el-space wrap>
        <el-tag v-for="tag in profile.tags" :key="tag">{{ tag }}</el-tag>
        <span v-if="!profile.tags.length" class="empty-tags">暂无学习偏好</span>
      </el-space>
    </section>

    <el-dialog v-model="profileDialogVisible" title="编辑资料" width="520px" class="profile-dialog">
      <el-form :model="profileForm" label-width="82px" class="profile-form">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="#"
            accept="image/*"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleAvatarChange"
          >
            <el-avatar :size="88" :src="profileForm.avatarUrl">
              <span>上传</span>
            </el-avatar>
            <div class="avatar-action">点击更换头像</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="昵称">
          <el-input v-model="profileForm.name" maxlength="20" show-word-limit />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="profileForm.phone" maxlength="11" />
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="profileForm.gender">
            <el-radio-button label="男" />
            <el-radio-button label="女" />
            <el-radio-button label="保密" />
          </el-radio-group>
        </el-form-item>

        <el-form-item label="学习方向">
          <el-input v-model="profileForm.direction" maxlength="30" show-word-limit />
        </el-form-item>

        <el-form-item label="学习偏好">
          <el-select
            v-model="profileForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="输入偏好后按回车添加"
          />
        </el-form-item>

        <el-form-item label="所在地区">
          <el-input v-model="profileForm.area" maxlength="20" />
        </el-form-item>

        <el-form-item label="个人简介">
          <el-input
            v-model="profileForm.bio"
            type="textarea"
            maxlength="80"
            show-word-limit
            :rows="3"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="profileDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveProfile">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getProfile, updateProfile, uploadAvatar } from '@/api/user'
import { Gender } from '@/types/prisma'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useUserSessionStore } from '@/stores/userSession'

const userSessionStore = useUserSessionStore()

const profile = reactive({
  avatarUrl: '',
  name: '学习用户',
  phone: '',
  gender: '保密',
  direction: '',
  area: '',
  createdTime: '',
  introduction: '',
  tags: [] as string[],
})

const profileForm = reactive({
  ...profile,
  tags: [...profile.tags],
  bio: profile.introduction,
})
const profileDialogVisible = ref(false)
const saving = ref(false)
const avatarFile = ref<File | null>(null)

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const syncProfile = (data: {
  avatarUrl?: string | null
  name?: string
  phone?: string
  gender?: Gender | null
  direction?: string | null
  area?: string | null
  introduction?: string | null
  createdTime?: string
  tags?: string[]
}) => {
  profile.avatarUrl = data.avatarUrl || ''
  profile.name = data.name || '学习用户'
  profile.phone = data.phone || ''
  profile.gender = data.gender || '保密'
  profile.direction = data.direction || ''
  profile.area = data.area || ''
  profile.createdTime = data.createdTime ? formatDate(data.createdTime) : ''
  profile.introduction = data.introduction || '暂无个人简介'
  profile.tags = data.tags || []
}

const openProfileDialog = () => {
  Object.assign(profileForm, {
    ...profile,
    tags: [...profile.tags],
    bio: profile.introduction === '暂无个人简介' ? '' : profile.introduction,
  })
  avatarFile.value = null
  profileDialogVisible.value = true
}

const handleAvatarChange = (uploadFile: UploadFile) => {
  const rawFile = uploadFile.raw

  if (!rawFile) return
  if (!rawFile.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }
  if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('头像大小不能超过 5MB')
    return
  }

  avatarFile.value = rawFile
  profileForm.avatarUrl = URL.createObjectURL(rawFile)
}

const saveProfile = async () => {
  saving.value = true

  try {
    let avatarUrl = profile.avatarUrl

    if (avatarFile.value) {
      const avatarUser = await uploadAvatar(avatarFile.value)
      avatarUrl = avatarUser.avatarUrl || ''
    }

    const updatedUser = await updateProfile({
      name: profileForm.name,
      phone: profileForm.phone,
      avatarUrl,
      gender: profileForm.gender === '保密' ? null : (profileForm.gender as Gender),
      direction: profileForm.direction || undefined,
      area: profileForm.area || undefined,
      introduction: profileForm.bio || undefined,
      tags: profileForm.tags,
    })

    syncProfile(updatedUser)
    userSessionStore.setUser({
      id: updatedUser.id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      avatarUrl: updatedUser.avatarUrl,
    })
    profileDialogVisible.value = false
    ElMessage.success('资料已更新')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  const data = await getProfile()
  syncProfile(data)
})
</script>

<style scoped lang="scss">
.user-page {
  padding: 24px;
  flex: 1;
}

.panel {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(31, 45, 61, 0.06);
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 20px;

  h2 {
    margin: 0 0 8px;
  }

  p {
    margin: 0 0 12px;
    color: #7a8699;
  }
}

.panel-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    margin: 0;
  }
}

.profile-form {
  :deep(.el-form-item:last-child) {
    margin-bottom: 0;
  }
}

.avatar-uploader {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.avatar-uploader :deep(.el-upload) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar-action {
  color: #409eff;
  font-size: 13px;
  line-height: 1;
}

.empty-tags {
  color: #a8abb2;
  font-size: 14px;
}

:deep(.profile-form .el-select) {
  width: 100%;
}

@media (max-width: 767px) {
  :global(.profile-dialog) {
    width: calc(100vw - 24px);
    margin-top: 4vh;
  }
}
</style>

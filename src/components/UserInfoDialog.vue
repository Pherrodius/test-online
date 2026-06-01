<template>
  <el-dialog v-model="visible" title="用户信息" width="460px">
    <div v-if="user" class="user-dialog">
      <el-avatar :size="72" :src="user.avatarUrl || undefined" class="dialog-avatar">
        {{ user.name.slice(0, 1) }}
      </el-avatar>
      <div class="dialog-name">{{ user.name }}</div>
      <div class="dialog-intro">
        {{ user.introduction || '这个用户暂未填写个人简介。' }}
      </div>
      <div class="dialog-stats">
        <div>
          <span>题库</span>
          <strong>{{ user._count?.banks || 0 }}</strong>
        </div>
        <div>
          <span>文档</span>
          <strong>{{ user._count?.documents || 0 }}</strong>
        </div>
      </div>
      <el-descriptions class="dialog-descriptions" :column="1" border>
        <el-descriptions-item label="性别">
          {{ user.gender || '保密' }}
        </el-descriptions-item>
        <el-descriptions-item label="学习方向">
          {{ user.direction || '未填写' }}
        </el-descriptions-item>
        <el-descriptions-item label="所在地区">
          {{ user.area || '未知地区' }}
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">
          {{ dayjs(user.createdTime).format('YYYY-MM-DD') }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { dayjs } from 'element-plus'
import type { SearchUsersRes } from '@/types/response'

type SearchUser = SearchUsersRes['records'][number]

defineProps<{
  user: SearchUser | null
}>()

const visible = defineModel<boolean>({ required: true })
</script>

<style scoped lang="scss">
.user-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dialog-avatar {
  background-color: #eaf3ff;
  color: #198cff;
}

.dialog-name {
  margin-top: 12px;
  color: #111827;
  font-size: 18px;
  font-weight: 600;
}

.dialog-intro {
  margin-top: 8px;
  color: #7b8494;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
}

.dialog-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 100%;
  margin: 14px 0 12px;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 38px;
    padding: 8px 10px;
    border-radius: 8px;
    background-color: #f7faff;
    text-align: center;
  }

  strong,
  span {
    display: inline-block;
  }

  strong {
    color: #198cff;
    font-size: 16px;
    line-height: 20px;
  }

  span {
    color: #7b8494;
    font-size: 13px;
    line-height: 20px;
  }
}

.dialog-descriptions {
  width: 100%;

  :deep(.el-descriptions__label) {
    width: 92px;
    color: #7b8494;
    font-weight: 400;
  }

  :deep(.el-descriptions__content) {
    color: #303133;
  }
}
</style>

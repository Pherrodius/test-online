<template>
  <div class="user-list">
    <div class="filter">
      <div class="dash">筛选</div>
      <el-form ref="formRef" :model="formData" :inline="true">
        <el-form-item prop="time">
          <el-select v-model="formData.time" placeholder="时间">
            <el-option label="全部" value="" />
            <el-option label="一周内" value="week" />
            <el-option label="一个月内" value="month" />
            <el-option label="一年内" value="year" />
          </el-select>
        </el-form-item>
        <el-form-item prop="bankCount">
          <el-select v-model="formData.bankCount" placeholder="题库数">
            <el-option label="全部" value="" />
            <el-option label="0个" value="0-0" />
            <el-option label="1-5" value="1-5" />
            <el-option label="6-20" value="6-20" />
            <el-option label="20+" value="20+" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="list">
      <div class="list-item" v-for="user in userRecords" :key="user.id">
        <el-avatar :size="48" :src="user.avatarUrl || undefined" class="user-avatar">
          {{ user.name.slice(0, 1) }}
        </el-avatar>
        <div class="item-main">
          <div class="item-header">
            <div class="item-title">{{ user.name }}</div>
            <span class="type-tag">{{ user.gender || '保密' }}</span>
          </div>
          <div class="item-description">
            {{ user.introduction || user.direction || '这个用户暂未填写个人简介。' }}
          </div>
          <div class="item-meta">
            <span>{{ user.area || '未知地区' }}</span>
            <span>题库 {{ user._count?.banks || 0 }}</span>
            <span>文档 {{ user._count?.documents || 0 }}</span>
            <span>{{ dayjs(user.createdTime).format('YYYY-MM-DD') }}</span>
          </div>
        </div>
        <el-button class="detail-btn" @click="openUserDialog(user)">
          查看用户
        </el-button>
      </div>
    </div>

    <UserInfoDialog v-model="dialogVisible" :user="selectedUser" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { dayjs } from 'element-plus'
import UserInfoDialog from '@/components/UserInfoDialog.vue'
import { useSearchStore } from '@/stores/search'
import { filterAttributes } from '@/hooks/useFilterAttributes'
import { SearchType } from '@/types/prisma'
import type { SearchUsersReq } from '@/types/reqeust'
import type { SearchUsersRes } from '@/types/response'

const searchStore = useSearchStore()
const { currentType, filterOptions, result } = storeToRefs(searchStore)
const formData = reactive<Omit<SearchUsersReq, 'page' | 'keyword'>>({
  time: undefined,
  bankCount: undefined,
})
const dialogVisible = ref(false)
const selectedUser = ref<SearchUsersRes['records'][number] | null>(null)
const userRecords = computed(() =>
  currentType.value === SearchType.User
    ? ((result.value?.records ?? []) as SearchUsersRes['records'])
    : [],
)

const openUserDialog = (user: SearchUsersRes['records'][number]) => {
  selectedUser.value = user
  dialogVisible.value = true
}

watch(
  () => formData,
  () => {
    filterOptions.value = filterAttributes(formData)
    searchStore.handleSearchFromFirstPage()
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
.user-list {
  margin-top: 24px;
  background-color: #fff;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.filter {
  min-height: 76px;
  padding: 0 36px;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #e5e7eb;
  gap: 40px;
}

.dash {
  flex: 0 0 auto;
  color: #8a8f99;
  font-size: 16px;
  line-height: 1;
}

:deep(.el-form) {
  display: flex;
  align-items: center;
  gap: 48px;
}

:deep(.el-form--inline .el-form-item) {
  margin: 0;
}

:deep(.el-select) {
  width: 78px;
}

:deep(.el-select__wrapper) {
  min-height: 36px;
  padding: 0;
  box-shadow: none;
  background-color: transparent;
}

:deep(.el-select__placeholder),
:deep(.el-select__selected-item) {
  color: #111827;
  font-size: 16px;
  font-weight: 400;
}

:deep(.el-select__caret) {
  color: #111827;
  font-size: 16px;
}

.list {
  min-height: 240px;
  padding: 8px 12px;
}

.list-item {
  position: relative;
  min-height: 112px;
  padding: 18px 24px 18px 28px;
  display: flex;
  align-items: center;
  gap: 18px;
  border-radius: 8px;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &::before {
    position: absolute;
    left: 12px;
    top: 22px;
    bottom: 22px;
    width: 3px;
    border-radius: 999px;
    background-color: #d8e6ff;
    content: '';
    transition:
      background-color 0.2s ease,
      bottom 0.2s ease,
      top 0.2s ease;
  }

  &:hover {
    background-color: #f7faff;
    box-shadow: 0 8px 20px rgba(25, 140, 255, 0.1);
    transform: translateY(-1px);

    &::before {
      top: 18px;
      bottom: 18px;
      background-color: #198cff;
    }
  }
}

.user-avatar {
  flex: 0 0 auto;
  background-color: #eaf3ff;
  color: #198cff;
}

.item-main {
  min-width: 0;
  flex: 1;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.type-tag {
  flex: 0 0 auto;
  padding: 3px 8px;
  border-radius: 999px;
  background-color: #eaf3ff;
  color: #198cff;
  font-size: 13px;
  line-height: 18px;
  font-weight: 600;
}

.item-title {
  min-width: 0;
  color: #111827;
  font-size: 17px;
  line-height: 24px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-description {
  margin-top: 8px;
  color: #8a93a3;
  font-size: 13px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  margin-top: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: #7b8494;
  font-size: 13px;
  line-height: 20px;

  span {
    padding: 2px 8px;
    border-radius: 999px;
    background-color: #f3f6fa;
  }
}

.detail-btn {
  flex: 0 0 auto;
  width: 108px;
  height: 36px;
  border-radius: 8px;
  border-color: #7aa7ff;
  color: #276dff;
  background-color: #fff;
  font-size: 15px;
  font-weight: 500;

  &:hover {
    border-color: #198cff;
    background-color: #198cff;
    color: #fff;
  }
}

</style>

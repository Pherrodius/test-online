<template>
  <div class="document-list">
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
        <el-form-item prop="mimeType">
          <el-select v-model="formData.mimeType" placeholder="类型">
            <el-option label="全部" value="" />
            <el-option label="PDF" value="application/pdf" />
            <el-option
              label="Word"
              value="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
            <el-option
              label="Excel"
              value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
            <el-option label="文本" value="text/plain" />
          </el-select>
        </el-form-item>
        <el-form-item prop="size">
          <el-select v-model="formData.size" placeholder="大小">
            <el-option label="全部" value="" />
            <el-option label="1MB内" value="small" />
            <el-option label="1-10MB" value="medium" />
            <el-option label="10MB+" value="large" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <div class="list-item" v-for="document in documentRecords" :key="document.id">
        <div class="item-main">
          <div class="item-header">
            <span class="type-tag">{{
              getMimeLabel(document.mimeType, document.originalName)
            }}</span>
            <div class="item-title">{{ document.originalName }}</div>
          </div>
          <div class="item-description">
            {{ document.content || '这份资料暂未填写简介。' }}
          </div>
          <div class="item-meta">
            <span>{{ document.uploader?.name || '匿名用户' }}</span>
            <span>{{ formatFileSize(document.size) }}</span>
            <span>下载 {{ document.downloadCount }}</span>
            <span>{{ dayjs(document.createdTime).format('YYYY-MM-DD') }}</span>
          </div>
        </div>
        <el-button class="detail-btn" @click="downloadDocument(document.id)">下载文档</el-button>
      </div>
      <el-skeleton :rows="3" v-for="i in documentRecords.length > 0 ? 0 : 5" :key="i" animated />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { dayjs } from 'element-plus'
import { useSearchStore } from '@/stores/search'
import { filterAttributes } from '@/hooks/useFilterAttributes'
import { SearchType } from '@/types/prisma'
import type { SearchDocumentsReq } from '@/types/reqeust'
import type { SearchDocumentsRes } from '@/types/response'

const searchStore = useSearchStore()
const { currentType, filterOptions, result } = storeToRefs(searchStore)
const formData = reactive<Omit<SearchDocumentsReq, 'page' | 'keyword'>>({
  time: undefined,
  mimeType: undefined,
  size: undefined,
})
const mimeLabels: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/vnd.ms-excel': 'Excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
  'text/plain': '文本',
}

const documentRecords = computed(() =>
  currentType.value === SearchType.Document
    ? ((result.value?.records ?? []) as SearchDocumentsRes['records'])
    : [],
)

const getMimeLabel = (mimeType: string, filename = '') => {
  if (mimeLabels[mimeType]) return mimeLabels[mimeType]

  const extension = filename.split('.').pop()
  return extension ? extension.toUpperCase() : '文件'
}

const formatFileSize = (size: number) => {
  if (!Number.isFinite(size) || size <= 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  let value = size
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  const precision = value >= 10 || unitIndex === 0 ? 0 : 1
  return `${value.toFixed(precision)} ${units[unitIndex]}`
}

const downloadDocument = (id: number) => {
  window.location.href = `/api/files/download/${id}`
}

watch(
  () => formData,
  () => {
    filterOptions.value = filterAttributes(formData)
    searchStore.handleSearchFromFirstPage()
  },
  {
    deep: true,
  },
)
</script>

<style scoped lang="scss">
.document-list {
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
  justify-content: space-between;
  gap: 24px;
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

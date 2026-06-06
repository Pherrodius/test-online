<template>
  <div class="home-documents">
    <div class="container">
      <div class="left">
        <div class="section-head">
          <div>
            <p class="eyebrow">资料中心</p>
            <h2>可下载学习文档</h2>
          </div>
          <el-button class="outline-btn" @click="$router.push('/search/document')"
            >搜索文档</el-button
          >
        </div>

        <div class="document-list">
          <div v-for="document in documents" :key="document.id" class="document-item">
            <div class="item-main">
              <div class="item-title">
                <span>{{ document.originalName }}</span>
                <span class="type-badge">
                  {{ getMimeLabel(document.mimeType, document.originalName) }}
                </span>
              </div>
              <p class="item-desc">{{ document.content || '这份资料暂未填写简介。' }}</p>
              <div class="item-meta">
                <span>{{ document.uploader?.name || '匿名用户' }}</span>
                <span>{{ formatFileSize(document.size) }}</span>
                <span>{{ dayjs(document.createdTime).format('YYYY-MM-DD') }}</span>
              </div>
            </div>
            <el-button class="outline-btn" @click="downloadDocument(document.id)">下载</el-button>
          </div>
        </div>

        <el-empty v-if="!documents.length" description="暂无文档" />
      </div>

      <div class="right">
        <el-image :src="sidebarBanner" alt="文档资料" class="sidebar-banner" fit="cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getFiles } from '@/api/file'
import type { Document } from '@/types/prisma'
import { dayjs } from 'element-plus'
import { onMounted, ref } from 'vue'
import sidebarBanner from '@/assets/images/search-side-illustration.png'

const documents = ref<Document[]>([])
const mimeLabels: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/vnd.ms-excel': 'Excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
  'text/plain': '文本',
}

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

onMounted(async () => {
  documents.value = await getFiles()
})
</script>

<style scoped lang="scss">
.home-documents {
  flex: 1;
  background-color: #f5f5f5;
}

.container {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.left {
  width: 896px;
  padding: 20px;
}

.right {
  padding-top: 20px;
}

.sidebar-banner {
  width: 288px;
  height: 566px;
  border-radius: 4px;
  background-color: #fff;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 30px;
  margin-bottom: 16px;
  border-radius: 4px;
  background-color: #fff;

  h2 {
    margin: 4px 0 0;
    color: #333;
    font-size: 22px;
    font-weight: 400;
  }
}

.eyebrow {
  margin: 0;
  color: #409eff;
  font-size: 13px;
}

.document-list {
  min-height: 400px;
  background-color: #fff;
}

.document-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 104px;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.item-main {
  min-width: 0;
  flex: 1;
}

.item-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: #333;
  font-size: 18px;
  font-weight: 400;

  span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.item-desc {
  overflow: hidden;
  margin: 8px 0 0;
  color: #999;
  font-size: 14px;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 8px;
  color: #999;
  font-size: 14px;
}

.type-badge {
  flex: 0 0 auto;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: #ecf7fe;
  color: #548ef7;
  font-size: 13px;
  font-weight: 400;
}

.outline-btn {
  flex: 0 0 auto;
  border: 1px solid #008cff !important;
  color: #008cff !important;
  padding: 4px 16px !important;
  border-radius: 4px !important;
  background-color: #fff !important;

  &:hover {
    background-color: #008cff !important;
    border-color: #008cff !important;
    color: #fff !important;
  }
}
</style>

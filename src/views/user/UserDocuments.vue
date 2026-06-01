<template>
  <div class="user-page">
    <div class="page-header">
      <div>
        <h2>我的文件</h2>
        <p>上传资料、解析文件并生成可练习题目。</p>
      </div>
      <el-button type="primary" :icon="Upload">上传文件</el-button>
    </div>

    <section class="panel upload-panel">
      <el-upload drag :http-request="handleUpload" accept="application/*">
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">拖拽文件到此处，或点击选择文件</div>
        <template #tip>
          <div class="el-upload__tip">支持 PDF、Word、Excel 等学习资料。</div>
        </template>
      </el-upload>
    </section>

    <section class="panel">
      <div class="panel-title">
        <h3>文件列表</h3>
      </div>
      <el-table
        :data="files"
        stripe
        empty-text="暂无上传文件"
        class="file-table"
        style="width: 100%"
      >
        <el-table-column label="文件名" min-width="280">
          <template #default="{ row }">
            <div class="file-cell" @click="handlePreview(row)">
              <el-icon class="file-icon"><DocumentIcon /></el-icon>
              <div class="file-info">
                <div class="file-name" :title="row.originalName">{{ row.originalName }}</div>
                <div v-if="row.content" class="file-desc">{{ row.content }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getMimeTagType(row.mimeType)" effect="plain">
              {{ getMimeLabel(row.mimeType, row.originalName) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="大小" width="110">
          <template #default="{ row }">
            {{ formatFileSize(row.size) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default>
            <el-tag type="success" effect="light">已上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" width="180">
          <template #default="{ row }">
            {{ dayjs(row.createdTime).format('YYYY/MM/DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <p class="file-delete" @click="handleDelete(row)">删除</p>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { deleteFile, uploadFile } from '@/api/file'
import { Document as DocumentIcon, Upload, UploadFilled } from '@element-plus/icons-vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'
import type { Document } from '@/types/prisma'
import { getMyFiles } from '@/api/user'
const handleUpload = async ({ file }: { file: File }) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入文件简介（可选）', 'Tip', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
    })
    await uploadFile(file, value)
    ElMessage.success('上传成功')
    files.value = await getMyFiles()
  } catch (e) {
    console.log(e)
    ElMessage.error('上传失败')
  }
}
const handlePreview = (row: Document) => {
  window.open('http://localhost:3000' + row.url)
}
const files = ref<Document[]>([])
const handleDelete = async (row: Document) => {
  ElMessageBox.confirm('确定删除该文件吗？', '提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
  }).then(() => {
    deleteFile(row.id)
      .then(() => {
        ElMessage.success('删除成功')
        files.value = files.value.filter((item) => item.id !== row.id)
      })
      .catch(() => {
        ElMessage.error('删除失败')
      })
  })
}
const mimeLabels: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/vnd.ms-excel': 'Excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
  'application/vnd.ms-powerpoint': 'PPT',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPT',
  'text/plain': '文本',
  'text/csv': 'CSV',
  'text/markdown': 'Markdown',
  'application/json': 'JSON',
  'image/jpeg': '图片',
  'image/png': '图片',
  'image/gif': '图片',
  'image/webp': '图片',
}

const getMimeLabel = (mimeType: string, filename = '') => {
  if (mimeLabels[mimeType]) return mimeLabels[mimeType]

  const extension = filename.split('.').pop()
  return extension ? extension.toUpperCase() : '文件'
}

const getMimeTagType = (mimeType: string) => {
  if (mimeType.includes('pdf')) return 'danger'
  if (mimeType.includes('word')) return 'primary'
  if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'success'
  if (mimeType.includes('image')) return 'warning'
  return 'info'
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

onMounted(async () => {
  files.value = await getMyFiles()
})
</script>

<style scoped lang="scss">
.user-page {
  padding: 24px;
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
  padding: 20px;
  margin-bottom: 16px;
}

.upload-panel {
  :deep(.el-upload) {
    width: 100%;
  }

  :deep(.el-upload-dragger) {
    width: 100%;
  }
}

.panel-title h3 {
  margin: 0 0 16px;
}

.file-table {
  :deep(.el-table__cell) {
    vertical-align: middle;
  }
}

.file-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  cursor: pointer;
}

.file-icon {
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: #eef4ff;
  color: #337ecc;
  font-size: 18px;
}

.file-info {
  min-width: 0;
}

.file-name {
  overflow: hidden;
  color: #1f2d3d;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-desc {
  overflow: hidden;
  margin-top: 4px;
  color: #8a96a8;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-delete {
  margin-left: auto;
  color: red;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>

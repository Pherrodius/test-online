<template>
  <div class="user-page" v-loading="loading">
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
          <div class="el-upload__tip">支持解析 PDF、Word、txt 格式的学习资料。</div>
        </template>
      </el-upload>
    </section>

    <section class="panel">
      <div class="panel-title">
        <h3>文件列表</h3>
      </div>
      <el-table :data="files" stripe empty-text="暂无上传文件" class="file-table">
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
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status as DocumentStatus].type" effect="light">{{
              statusMap[row.status as DocumentStatus].label
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" width="180">
          <template #default="{ row }">
            {{ dayjs(row.createdTime).format('YYYY/MM/DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="action">
              <p
                class="file-llm"
                @click="handleOpen(row.id)"
                :disabled="row.status === DocumentStatus.Pending"
              >
                {{ row.status === DocumentStatus.Uploaded ? 'AI解析' : '再次解析' }}
              </p>
              <p class="file-delete" @click="handleDelete(row)">删除</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <el-dialog v-model="dialogVisible" title="Tips" width="640px" class="llm-dialog">
      <template #header>大模型通过解析文件生成题目并导入到指定题库的指定学科分类下</template>
      <div v-loading="loading2">
        <el-form :model="form" label-width="64px">
          <el-form-item label="题库">
            <el-select v-model="form.bankId" placeholder="选择导入的题库">
              <el-option
                v-for="bank in myBanks"
                :key="bank.id"
                :value="bank.id"
                :label="bank.name"
              /> </el-select></el-form-item
          ><el-form-item label="学科">
            <el-select v-model="form.disciplineId" placeholder="选择导入的学科">
              <el-option
                v-for="discipline in myBanks.find((item) => item.id === form.bankId)?.disciplines ||
                []"
                :key="discipline.id"
                :value="discipline.id"
                :label="discipline.name" /></el-select
          ></el-form-item>
          <el-form-item label="描述">
            <el-input
              type="textarea"
              v-model="form.prompt"
              placeholder="请输入你的需求（选填）"
              :rows="5"
            ></el-input>
          </el-form-item>
          <el-form-item label="提示">
            <div class="tips">
              1、AI导题需要消耗一定的时间，可在状态属性查看进度。<br />2、避免将所有题目导入同一个题库，这会拖慢ai助手的解析速度。<br />3、一次性最多导入80题，可重复解析文件以获得更多题目，ai助手会自行避开已有题目。
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit"> 提交 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { deleteFile, LLMAnalysisFile, uploadFile } from '@/api/file'
import { Document as DocumentIcon, Upload, UploadFilled } from '@element-plus/icons-vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'
import type { Bank, Discipline, Document } from '@/types/prisma'
import { DocumentStatus } from '@/types/prisma'
import { getMyFiles } from '@/api/user'
import type { LLMAnalysisFileReq } from '@/types/reqeust'
import { getOwnedBanks } from '@/api/bank'
import { useRouter } from 'vue-router'
const dialogVisible = ref(false)
const router = useRouter()
const form = ref<Partial<LLMAnalysisFileReq>>({
  bankId: undefined,
  disciplineId: undefined,
  prompt: '',
})
const statusMap = {
  [DocumentStatus.Uploaded]: {
    label: '已上传',
    type: 'primary',
  },
  [DocumentStatus.Pending]: {
    label: '解析中',
    type: 'warning',
  },
  [DocumentStatus.Resolved]: {
    label: '已解析',
    type: 'success',
  },
  [DocumentStatus.Rejected]: {
    label: '解析失败',
    type: 'danger',
  },
} as const
const currentFileId = ref<number>(0)
const loading = ref(false)
const loading2 = ref(false)
const myBanks = ref<(Bank & { disciplines: Discipline[] })[]>([])
const handleOpen = async (id: number) => {
  loading.value = true
  try {
    myBanks.value = await getOwnedBanks()
  } catch (e) {
    console.log(e)
    ElMessage.error('获取已有题库失败')
    loading.value = false
  }
  currentFileId.value = id
  if (myBanks.value.length === 0) {
    ElMessage.error('请先创建题库')
    router.push('/user/banks')
  }
  dialogVisible.value = true
  loading.value = false
}
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
const handleSubmit = () => {
  if (!form.value.bankId) return ElMessage.error('请选择题库')
  if (!form.value.disciplineId) return ElMessage.error('请选择学科')
  loading2.value = true
  LLMAnalysisFile(currentFileId.value, form.value as LLMAnalysisFileReq)
    .then(() => {
      ElMessage.success('请求已发送，AI助手全力解析中')
      const file = files.value.find((item) => item.id === currentFileId.value)
      if (file) {
        file.status = DocumentStatus.Pending
      }
      loading2.value = false
      dialogVisible.value = false
    })
    .catch(() => {
      ElMessage.error('题目解析失败')
      loading2.value = false
      dialogVisible.value = false
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
.action {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.file-delete,
.file-llm {
  margin: auto auto auto 8px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.file-table {
  width: 100%;
}
.file-delete {
  flex: 0 0 auto;
  color: red;
}
.file-llm {
  flex: 0 0 auto;
  color: blue;
}

:deep(.llm-dialog) {
  .el-dialog__body {
    padding-top: 8px;
  }

  .el-select,
  .el-input {
    width: 100%;
  }
}

.tips {
  color: #606266;
  line-height: 1.7;
}

@media (max-width: 767px) {
  :global(.llm-dialog) {
    width: calc(100vw - 24px);
    margin-top: 4vh;
  }
}
</style>

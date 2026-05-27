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
      <el-upload drag action="#" :auto-upload="false">
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
      <el-table :data="files" style="width: 100%">
        <el-table-column prop="name" label="文件名" min-width="220" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="size" label="大小" width="100" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.statusType">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="上传时间" width="160" />
      </el-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Upload, UploadFilled } from '@element-plus/icons-vue'

const files = [
  {
    name: '计算机网络复习资料.pdf',
    type: 'PDF',
    size: '2.4 MB',
    status: '已解析',
    statusType: 'success',
    time: '2026-05-24 10:20',
  },
  {
    name: 'Vue 面试题整理.docx',
    type: 'Word',
    size: '860 KB',
    status: '处理中',
    statusType: 'warning',
    time: '2026-05-23 18:40',
  },
  {
    name: '英语词汇表.xlsx',
    type: 'Excel',
    size: '1.1 MB',
    status: '待解析',
    statusType: 'info',
    time: '2026-05-22 09:12',
  },
]
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
</style>

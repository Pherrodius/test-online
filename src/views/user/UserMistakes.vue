<template>
  <div class="user-page">
    <div class="page-header">
      <div>
        <h2>全部错题</h2>
        <p>按题库、题型和掌握状态筛选错题，方便集中复习。</p>
      </div>
      <el-button type="primary" :icon="RefreshRight">开始错题重练</el-button>
    </div>

    <section class="panel">
      <div class="toolbar">
        <el-input placeholder="搜索题目关键词" :prefix-icon="Search" />
        <el-select model-value="all" placeholder="题库">
          <el-option label="全部题库" value="all" />
          <el-option label="Vue 进阶题库" value="vue" />
          <el-option label="计算机基础" value="cs" />
        </el-select>
        <el-select model-value="all" placeholder="题型">
          <el-option label="全部题型" value="all" />
          <el-option label="单选题" value="single" />
          <el-option label="多选题" value="multi" />
          <el-option label="判断题" value="judge" />
        </el-select>
      </div>

      <el-table :data="mistakes" style="width: 100%">
        <el-table-column prop="title" label="题目" min-width="240" />
        <el-table-column prop="bank" label="题库" width="160" />
        <el-table-column prop="type" label="题型" width="100" />
        <el-table-column prop="count" label="错误次数" width="100" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.statusType">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <el-button text type="primary">查看解析</el-button>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RefreshRight, Search } from '@element-plus/icons-vue'

const mistakes = [
  {
    title: 'Vue 响应式系统的核心实现方式是什么？',
    bank: 'Vue 进阶题库',
    type: '单选题',
    count: 3,
    status: '待复习',
    statusType: 'danger',
  },
  {
    title: '以下哪些属于 HTTP 缓存控制头？',
    bank: '计算机基础',
    type: '多选题',
    count: 2,
    status: '复习中',
    statusType: 'warning',
  },
  {
    title: 'Promise 的 then 方法会立即同步执行回调。',
    bank: 'JavaScript',
    type: '判断题',
    count: 1,
    status: '已掌握',
    statusType: 'success',
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
  gap: 16px;
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
}

.toolbar {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 180px 180px;
  gap: 12px;
  margin-bottom: 16px;
}
</style>

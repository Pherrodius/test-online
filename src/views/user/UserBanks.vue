<template>
  <div class="user-page">
    <div class="page-header">
      <div>
        <h2>我的题库</h2>
        <p>管理已创建、已购买和正在学习的题库。</p>
      </div>
      <el-button type="primary" :icon="Plus">新建题库</el-button>
    </div>

    <el-row :gutter="16">
      <el-col v-for="item in banks" :key="item.name" :xs="24" :md="12" :xl="8">
        <article class="bank-card">
          <div class="bank-top">
            <h3>{{ item.name }}</h3>
            <el-tag :type="item.type">{{ item.status }}</el-tag>
          </div>
          <p>{{ item.desc }}</p>
          <el-progress :percentage="item.progress" />
          <div class="bank-foot">
            <span>{{ item.count }} 道题</span>
            <el-button text type="primary">进入题库</el-button>
          </div>
        </article>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'

const banks = [
  {
    name: 'Vue 进阶题库',
    desc: '组件、路由、状态管理与性能优化专题。',
    count: 238,
    progress: 62,
    status: '学习中',
    type: 'success',
  },
  {
    name: '计算机基础',
    desc: '网络、操作系统、数据结构综合练习。',
    count: 520,
    progress: 35,
    status: '已导入',
    type: 'info',
  },
  {
    name: 'JavaScript 高频题',
    desc: '覆盖闭包、异步、原型链和浏览器机制。',
    count: 186,
    progress: 78,
    status: '学习中',
    type: 'success',
  },
]
</script>

<style scoped lang="scss">
.user-page {
  padding: 24px;
}

.page-header,
.bank-card {
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

.bank-card {
  padding: 20px;
  margin-bottom: 16px;

  p {
    min-height: 44px;
    color: #667085;
    line-height: 1.6;
  }
}

.bank-top,
.bank-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 18px;
  }
}

.bank-foot {
  margin-top: 12px;
  color: #98a2b3;
}
</style>

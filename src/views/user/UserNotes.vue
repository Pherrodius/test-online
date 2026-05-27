<template>
  <div class="user-page">
    <div class="page-header">
      <div>
        <h2>我的收藏</h2>
        <p>沉淀重点题目、解析和复习笔记。</p>
      </div>
      <el-button type="primary" :icon="Star">整理收藏</el-button>
    </div>

    <el-row :gutter="16">
      <el-col v-for="item in notes" :key="item.title" :xs="24" :md="12" :xl="8">
        <article class="note-card">
          <div class="note-head">
            <el-tag :type="item.type">{{ item.category }}</el-tag>
            <span>{{ item.time }}</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <div class="note-foot">
            <span>{{ item.bank }}</span>
            <el-button text type="primary">查看</el-button>
          </div>
        </article>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Star } from '@element-plus/icons-vue'

const notes = [
  {
    title: '闭包与作用域链易错点',
    desc: '重点关注变量捕获、执行上下文和内存释放。',
    category: 'JavaScript',
    type: 'warning',
    bank: '前端基础',
    time: '今天',
  },
  {
    title: 'Vue computed 与 watch 区别',
    desc: '适合放入二轮复习清单，配合源码题一起看。',
    category: 'Vue',
    type: 'success',
    bank: 'Vue 进阶题库',
    time: '昨天',
  },
  {
    title: '操作系统进程调度',
    desc: '包含时间片轮转、优先级调度等典型考点。',
    category: '计算机',
    type: 'info',
    bank: '计算机基础',
    time: '周二',
  },
]
</script>

<style scoped lang="scss">
.user-page {
  padding: 24px;
}

.page-header,
.note-card {
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

.note-card {
  padding: 20px;
  margin-bottom: 16px;

  h3 {
    margin: 18px 0 8px;
    font-size: 17px;
  }

  p {
    min-height: 44px;
    margin: 0;
    color: #667085;
    line-height: 1.6;
  }
}

.note-head,
.note-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #98a2b3;
  font-size: 13px;
}
</style>

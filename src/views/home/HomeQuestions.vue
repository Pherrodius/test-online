<template>
  <div class="home-questions">
    <div class="container">
      <div class="left">
        <div class="section-head">
          <div>
            <p class="eyebrow">题目广场</p>
            <h2>最新练习题目</h2>
          </div>
          <el-button class="outline-btn" @click="$router.push('/search/question')">搜索题目</el-button>
        </div>

        <div class="question-list">
          <div v-for="question in questions" :key="question.id" class="question-item">
            <div class="item-main">
              <div class="item-title">
                <span>{{ question.content }}</span>
                <span class="type-badge">{{ questionTypeLabels[question.type] }}</span>
              </div>
              <p class="item-meta">
                <span>{{ question.bank.name }}</span>
                <span>{{ question.discipline.name }}</span>
                <span>{{ dayjs(question.createdTime).format('YYYY-MM-DD') }}</span>
              </p>
            </div>
            <el-button class="outline-btn" @click="$router.push(`/question/${question.id}`)">
              查看
            </el-button>
          </div>
        </div>

        <el-empty v-if="!questions.length" description="暂无题目" />
      </div>

      <div class="right">
        <el-image :src="sidebarBanner" alt="题目练习" class="sidebar-banner" fit="cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { searchQuestions } from '@/api/search'
import { QuestionType } from '@/types/prisma'
import type { SearchQuestionsRes } from '@/types/response'
import { dayjs } from 'element-plus'
import { onMounted, ref } from 'vue'
import sidebarBanner from '@/assets/images/bank-category-sidebar.png'

const questions = ref<SearchQuestionsRes['records']>([])
const questionTypeLabels: Record<QuestionType, string> = {
  [QuestionType.SingleChoice]: '单选题',
  [QuestionType.MultiChoice]: '多选题',
  [QuestionType.TrueFalse]: '判断题',
}

onMounted(async () => {
  const data = await searchQuestions({ page: 1 })
  questions.value = data.records
})
</script>

<style scoped lang="scss">
.home-questions {
  min-height: 560px;
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

.question-list {
  min-height: 400px;
  background-color: #fff;
}

.question-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 92px;
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
  line-height: 24px;
  font-weight: 400;

  span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 8px 0 0;
  color: #999;
  font-size: 14px;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.type-badge {
  flex: 0 0 auto;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: #ecf7fe;
  color: #548ef7;
  font-size: 13px;
  line-height: 20px;
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

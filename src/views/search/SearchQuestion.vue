<template>
  <div class="question-list">
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
        <el-form-item prop="type">
          <el-select v-model="formData.type" placeholder="类型">
            <el-option label="全部" value="" />
            <el-option label="单选题" value="SingleChoice" />
            <el-option label="多选题" value="MultiChoice" />
            <el-option label="判断题" value="TrueFalse" />
            <el-option label="主观题" value="Subjective" />
          </el-select>
        </el-form-item>
        <el-form-item prop="collectedCount">
          <el-select v-model="formData.collectedCount" placeholder="收藏数">
            <el-option label="全部" value="" />
            <el-option label="1-10" value="1-10" />
            <el-option label="11-50" value="11-50" />
            <el-option label="51-100" value="51-100" />
            <el-option label="100+" value="100+" />
          </el-select>
        </el-form-item>
        <el-form-item prop="riskLevel">
          <el-select v-model="formData.riskLevel" placeholder="难度">
            <el-option label="全部" value="" />
            <el-option label="简单" :value="1" />
            <el-option label="中等" :value="2" />
            <el-option label="困难" :value="3" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="list">
      <div class="list-item" v-for="question in questionRecords" :key="question.id">
        <div class="item-main">
          <div class="item-header">
            <span class="type-tag">{{ questionTypeLabels[question.type] }}</span>
            <div class="item-title">{{ question.content }}</div>
          </div>
          <div class="item-description">
            本题来自“{{ question.bank.name }}”题库，考察“{{ question.discipline.name }}”相关内容。
          </div>
          <div class="item-meta">
            <span>{{ question.bank.name }}</span>
            <span>{{ question.discipline.name }}</span>
            <span>收藏 {{ question._count.collected }}</span>
            <span>{{ dayjs(question.createdTime).format('YYYY-MM-DD') }}</span>
          </div>
        </div>
        <el-button class="detail-btn" @click="$router.push(`/question/${question.id}`)">
          查看详情
        </el-button>
      </div>
      <el-skeleton :rows="3" v-for="i in questionRecords.length > 0 ? 0 : 5" :key="i" animated />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { dayjs } from 'element-plus'
import { useSearchStore } from '@/stores/search'
import { filterAttributes } from '@/hooks/useFilterAttributes'
import { QuestionType, SearchType } from '@/types/prisma'
import type { SearchQuestionsReq } from '@/types/reqeust'
import type { SearchQuestionsRes } from '@/types/response'

const searchStore = useSearchStore()
const { currentType, filterOptions, result } = storeToRefs(searchStore)
const formData = reactive<
  Omit<SearchQuestionsReq, 'page' | 'keyword'> & { riskLevel?: number | '' }
>({
  time: undefined,
  type: undefined,
  collectedCount: undefined,
  riskLevel: undefined,
})
const questionTypeLabels: Record<QuestionType, string> = {
  [QuestionType.SingleChoice]: '单选题',
  [QuestionType.MultiChoice]: '多选题',
  [QuestionType.TrueFalse]: '判断题',
  [QuestionType.Subjective]: '主观题',
}
const questionRecords = computed(() =>
  currentType.value === SearchType.Question
    ? ((result.value?.records ?? []) as SearchQuestionsRes['records'])
    : [],
)

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
.question-list {
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

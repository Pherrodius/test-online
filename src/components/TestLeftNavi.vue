<template>
  <div class="left-section">
    <div class="left-section-title">{{ typeMap[props.type] }}</div>
    <div class="left-section-content">
      <div
        v-for="(item, index) in props.typedQuestions"
        :key="item.id"
        class="left-section-item"
        :class="{
          active: currentQuestion?.id === item.id,
          'is-done': answerSheet?.map((item) => item.questionId).includes(item.id),
          'is-correct': result?.find((r) => r.questionId === item.id)?.isCorrect,
          'is-incorrect': result?.find((r) => r.questionId === item.id)?.isCorrect === false,
        }"
        @click="currentQuestion = item"
      >
        <template v-if="props.type === QuestionType.SingleChoice">
          {{ index + 1 }}
        </template>
        <template v-else-if="props.type === QuestionType.MultiChoice">
          {{ index + 1 + singleQuestions.length }}
        </template>
        <template v-else-if="props.type === QuestionType.TrueFalse">
          {{ index + 1 + singleQuestions.length + multiQuestions.length }}
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { GetQuestionListResponse } from '@/types/response'
import { useTestPaperStore } from '@/stores/testpaper'
import { storeToRefs } from 'pinia'
import { QuestionType } from '@/types/prisma'
const testPaperStore = useTestPaperStore()
const { currentQuestion, answerSheet, singleQuestions, multiQuestions, result } =
  storeToRefs(testPaperStore)

const props = defineProps<{
  type: QuestionType
  typedQuestions: GetQuestionListResponse[]
}>()
const typeMap = {
  [QuestionType.SingleChoice]: '单选题',
  [QuestionType.MultiChoice]: '多选题',
  [QuestionType.TrueFalse]: '判断题',
}
</script>

<style scoped lang="scss">
.left-section {
  padding: 12px;

  .left-section-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .left-section-content {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-auto-rows: 1fr;
    grid-auto-columns: 1fr;
    gap: 8px;
  }

  .left-section-item {
    width: 32px;
    height: 32px;
    margin-bottom: 4px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: all 0.1s ease-in-out;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #e6f7ff;
      color: #007bff;
    }

    &.is-done {
      background-color: #e6f7ff;
      color: #007bff;
      box-shadow: 0 0 4px #007bff7e;
    }

    &:active {
      background-color: #007bff7e;
      color: #fff;
      scale: 0.95;
    }

    &.active {
      background-color: #007bff;
      color: #fff;
      font-size: 16px;
    }

    &.is-correct {
      background-color: #6cb77b;
      color: #fff;
    }

    &.is-incorrect {
      background-color: #e57155;
      color: #fff;
    }
  }
}
</style>

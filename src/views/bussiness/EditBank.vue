<template>
  <div class="test-paper" :key="refreshKey">
    <div class="path">
      <el-breadcrumb separator="/" class="breadcrumb" :separator-icon="ArrowRight">
        <el-icon color="#999">
          <LocationInformation />
        </el-icon>
        <el-breadcrumb-item to="/" class="breadcrumb-item">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="`/bank/${$route.params.id}`" class="breadcrumb-item"
          >题库</el-breadcrumb-item
        >
        <el-breadcrumb-item class="breadcrumb-item">编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="left">
        <TestLeftNavi
          :type="QuestionType.SingleChoice"
          :typedQuestions="singleQuestions"
          v-if="singleQuestions.length"
        />
        <TestLeftNavi
          :type="QuestionType.MultiChoice"
          :typedQuestions="multiQuestions"
          v-if="multiQuestions.length"
        />
        <TestLeftNavi
          :type="QuestionType.TrueFalse"
          :typedQuestions="trueFalseQuestions"
          v-if="trueFalseQuestions.length"
        />
        <TestLeftNavi
          :type="QuestionType.Subjective"
          :typedQuestions="subjectiveQuestions"
          v-if="subjectiveQuestions.length"
        />
      </div>
      <EditMain v-if="currentQuestion" v-model:refreshKey="refreshKey" />
    </div>
  </div>
</template>
<script setup lang="ts">
import EditMain from '@/components/EditMain.vue'
import { Answer, QuestionType, type Bank } from '@/types/prisma'
import TestLeftNavi from '@/components/TestLeftNavi.vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTestPaperStore } from '@/stores/testpaper'
import { storeToRefs } from 'pinia'
import { getBank, getDetailedQuestions } from '@/api/bank'
const testPaperStore = useTestPaperStore()
const route = useRoute()
const bank = ref<Bank | null>(null)
const refreshKey = ref(1)
const {
  questions,
  currentQuestion,
  singleQuestions,
  multiQuestions,
  trueFalseQuestions,
  subjectiveQuestions,
} = storeToRefs(testPaperStore)

const render = async () => {
  {
    bank.value = await getBank(Number(route.params.id))
    // 获取题目
    questions.value = await getDetailedQuestions(
      Number(route.params.id),
      Number(route.query.disciplineId),
    )
    if (questions.value.length === 0) {
      questions.value.push({
        id: 0,
        type: QuestionType.SingleChoice,
        content: '点击绿色按钮以新建题目',
        options: [
          { id: 0, questionId: 0, key: Answer.A, text: '占位选项' },
          { id: 0, questionId: 0, key: Answer.B, text: '占位选项' },
          { id: 0, questionId: 0, key: Answer.C, text: '占位选项' },
          { id: 0, questionId: 0, key: Answer.D, text: '占位选项' },
        ],
        explanation: '',
        singleAnswer: null,
        multiChoiceAnswer: [],
        trueFalseAnswer: null,
        subjectiveAnswer: null,
        riskLevel: 2,
        createdTime: '',
        bankId: Number(route.params.id),
        disciplineId: Number(route.query.disciplineId),
        bank: {
          id: 0,
          name: '',
          description: '',
          categoryId: null,
          creatorId: 0,
          createdTime: '',
        },
        discipline: {
          id: 0,
          name: '',
        },
      })
    }
    currentQuestion.value =
      singleQuestions.value[0] ??
      multiQuestions.value[0] ??
      trueFalseQuestions.value[0] ??
      subjectiveQuestions.value[0] ??
      questions.value[0] ??
      null
  }
}
watch(
  () => refreshKey.value,
  () => {
    render()
  },
  { immediate: true },
)
onUnmounted(() => testPaperStore.resetStore())
</script>
<style scoped lang="scss">
.test-paper {
  background-color: #f5f5f5;

  .path {
    padding: 8px;
    margin: 0 auto;
    max-width: 1200px;

    .breadcrumb {
      display: flex;
      align-items: center;
    }

    :deep(.el-breadcrumb__inner.is-link) {
      font-size: 14px;
      color: #999;
      font-weight: 450;
      padding: 4px 8px;

      &:hover {
        color: #007bff;
      }
    }
  }

  .container {
    padding: 0;
    margin: 0 auto;
    display: flex;
    max-width: 1200px;
    padding-bottom: 24px;

    .left {
      width: 240px;
      overflow: auto;
      margin-right: 24px;
      background-color: #fff;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>

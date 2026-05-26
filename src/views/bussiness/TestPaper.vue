<template>
  <div class="test-paper">
    <div class="path">
      <el-breadcrumb separator="/" class="breadcrumb" :separator-icon="ArrowRight">
        <el-icon color="#999">
          <LocationInformation />
        </el-icon>
        <el-breadcrumb-item to="/" class="breadcrumb-item">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="`/bank/${testInfo?.bankId}`" class="breadcrumb-item"
          >题库</el-breadcrumb-item
        >
        <el-breadcrumb-item
          :to="`/collection/${testInfo?.collectionType}/?bankId=${testInfo?.bankId}&disciplineId=${testInfo?.disciplineId}`"
          class="breadcrumb-item"
          v-if="testInfo?.collectionType"
          >{{
            testInfo?.collectionType === CollectionType.Mistake ? '错题集' : '收藏集'
          }}</el-breadcrumb-item
        >
        <el-breadcrumb-item class="breadcrumb-item">{{
          testInfo?.collectionType
            ? testInfo?.collectionType === CollectionType.Mistake
              ? '错题练习'
              : '收藏练习'
            : testInfo?.random === 1
              ? '随机练习'
              : '顺序练习'
        }}</el-breadcrumb-item>
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
      </div>
      <TestMain />
    </div>
  </div>
  <TestResultDialog />
</template>
<script setup lang="ts">
import TestMain from '@/components/TestMain.vue'
import { CollectionType, QuestionType } from '@/types/prisma'
import TestLeftNavi from '@/components/TestLeftNavi.vue'
import { ArrowRight } from '@element-plus/icons-vue'
import TestResultDialog from '@/components/TestResultDialog.vue'
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCollectionList, getQuestionList } from '@/api/question'
import { useTestPaperStore } from '@/stores/testpaper'
import { storeToRefs } from 'pinia'
const testPaperStore = useTestPaperStore()
const route = useRoute()
const {
  testInfo,
  questions,
  currentQuestion,
  singleQuestions,
  multiQuestions,
  trueFalseQuestions,
  answerSheet,
} = storeToRefs(testPaperStore)
onMounted(async () => {
  testInfo.value = {
    bankId: Number(route.query.bankId as string),
    disciplineId: Number(route.query.disciplineId as string) || undefined,
    random: Number(route.query.random as string) || 0,
    isDay: Number(route.query.isDay as string) || 0,
    collectionType: route.query.collectionType as string,
    questionType: route.query.questionType as string,
  }
  if (testInfo.value.collectionType) {
    await getCollectionList({
      bankId: testInfo.value.bankId,
      disciplineId: testInfo.value.disciplineId,
      type: testInfo.value.collectionType as CollectionType,
      isDay: testInfo.value.isDay as 1 | 0,
      questionType: testInfo.value.questionType as QuestionType,
    }).then((res) => {
      const data = res.records
      questions.value = testInfo.value?.random == 1 ? data.sort(() => Math.random() - 0.5) : data
      currentQuestion.value =
        singleQuestions.value[0] || multiQuestions.value[0] || trueFalseQuestions.value[0] || null
    })
  } else {
    const payload: { bankId: number; disciplineId?: number } = {
      bankId: testInfo.value.bankId,
    }
    if (testInfo.value.disciplineId) {
      payload.disciplineId = testInfo.value.disciplineId
    }
    await getQuestionList(payload).then((res) => {
      questions.value = testInfo.value?.random == 1 ? res.sort(() => Math.random() - 0.5) : res
      currentQuestion.value =
        singleQuestions.value[0] || multiQuestions.value[0] || trueFalseQuestions.value[0] || null
    })
  }
  const storedAnswerSheet = localStorage.getItem('answerSheet')
  if (storedAnswerSheet) {
    const historyAnswerSheet = JSON.parse(storedAnswerSheet)
    if (
      JSON.stringify(testInfo.value, null, 2) ===
      JSON.stringify(historyAnswerSheet.testInfo, null, 2)
    ) {
      answerSheet.value = historyAnswerSheet.answerSheet
    }
  }
})
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
      height: 62vh;
      overflow: auto;
      margin-right: 24px;
      background-color: #fff;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>

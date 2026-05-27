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
          testInfo?.model === TestModel.Test
            ? '计时测试'
            : testInfo?.collectionType
              ? testInfo?.collectionType === CollectionType.Mistake
                ? '错题练习'
                : '收藏练习'
              : testInfo?.random === 1
                ? '随机练习'
                : '顺序练习'
        }}</el-breadcrumb-item>
        <el-breadcrumb-item class="breadcrumb-item" v-if="testInfo?.model === TestModel.Test"
          >耗时：{{ dayjs(takenTime * 1000).format('mm:ss') }}</el-breadcrumb-item
        >
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
import { Answer, CollectionType, QuestionType } from '@/types/prisma'
import TestLeftNavi from '@/components/TestLeftNavi.vue'
import { ArrowRight } from '@element-plus/icons-vue'
import TestResultDialog from '@/components/TestResultDialog.vue'
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCollectionList, getQuestionList, getResolutions } from '@/api/question'
import { TestModel, useTestPaperStore } from '@/stores/testpaper'
import { storeToRefs } from 'pinia'
import { dayjs } from 'element-plus'
import type { GetQuestionRequest } from '@/types/reqeust'
const testPaperStore = useTestPaperStore()
const route = useRoute()
const {
  takenTime,
  testInfo,
  questions,
  currentQuestion,
  singleQuestions,
  multiQuestions,
  trueFalseQuestions,
  practicedQuestions,
  result,
  answerSheet,
} = storeToRefs(testPaperStore)
onMounted(async () => {
  // 获取测试信息
  testInfo.value = {
    bankId: Number(route.query.bankId as string),
    disciplineId: Number(route.query.disciplineId as string) || undefined,
    random: Number(route.query.random as string) || 0,
    isDay: Number(route.query.isDay as string) || 0,
    collectionType: route.query.collectionType as CollectionType,
    questionType: route.query.questionType as string,
    model: route.query.model as TestModel,
  }
  const payload: GetQuestionRequest = {
    bankId: testInfo.value.bankId,
    disciplineId: testInfo.value.disciplineId,
  }
  if (!payload.disciplineId) {
    delete payload.disciplineId
  }
  // 获取题目
  if (testInfo.value.collectionType) {
    await getCollectionList({
      bankId: testInfo.value.bankId,
      disciplineId: testInfo.value.disciplineId,
      type: testInfo.value.collectionType as CollectionType,
      isDay: testInfo.value.isDay !== 0 ? 1 : 0,
      questionType: testInfo.value.questionType as QuestionType,
    }).then((res) => {
      const data = res.records
      questions.value = testInfo.value?.random == 1 ? data.sort(() => Math.random() - 0.5) : data
    })
  } else {
    await getQuestionList(payload).then((res) => {
      questions.value = testInfo.value?.random == 1 ? res.sort(() => Math.random() - 0.5) : res
    })
  }
  currentQuestion.value =
    singleQuestions.value[0] || multiQuestions.value[0] || trueFalseQuestions.value[0] || null
  // 获取答题记录
  if (testInfo.value.model === TestModel.Test) {
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
  } else if (testInfo.value.model === TestModel.Practice && !testInfo.value.collectionType) {
    practicedQuestions.value = await getResolutions(payload)
    if (practicedQuestions.value.length > 0) {
      currentQuestion.value =
        questions.value.find((q) => q.id === practicedQuestions.value![0]!.questionId) ??
        currentQuestion.value
      answerSheet.value = practicedQuestions.value.map((q) => {
        return {
          questionId: q.questionId,
          answer: JSON.parse(q.yourAnswer) as Answer | Answer[],
        }
      })
      result.value = practicedQuestions.value
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

<template>
  <div class="test-paper" v-loading="loading">
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
              : practiceConfig?.random
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
        <div class="question-blank">
          <el-scrollbar>
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
          </el-scrollbar>
        </div>
        <div class="question-count" v-if="result.length > 0">
          <p class="result">
            <span
              >答对:
              <span class="correct">
                {{ result.filter((item) => item.isCorrect).length }}题</span
              ></span
            >
            <span
              >答错:
              <span class="incorrect">
                {{ result.filter((item) => item.isCorrect === false).length }}题</span
              >
            </span>
          </p>
          <p>
            正确率：{{
              ((result.filter((item) => item.isCorrect).length / result.length) * 100).toFixed(2) ||
              0
            }}%
          </p>
        </div>
      </div>
      <TestMain />
      <div class="bottom">
        <div class="question-blank">
          <div class="question-count" v-if="result.length > 0">
            <p class="result">
              <span
                >答对:
                <span class="correct">
                  {{ result.filter((item) => item.isCorrect).length }}题</span
                ></span
              >
              <span
                >答错:
                <span class="incorrect">
                  {{ result.filter((item) => item.isCorrect === false).length }}题</span
                >
              </span>
              <span>
                正确率：{{
                  ((result.filter((item) => item.isCorrect).length / result.length) * 100).toFixed(
                    2,
                  ) || 0
                }}%
              </span>
            </p>
          </div>
          <el-scrollbar>
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
          </el-scrollbar>
        </div>
      </div>
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
import { useConfigStore } from '@/stores/config'
import { storeToRefs } from 'pinia'
import { dayjs } from 'element-plus'
import { filterAttributes } from '@/hooks/useFilterAttributes'
const testPaperStore = useTestPaperStore()
const configStore = useConfigStore()
const { practiceConfig, testConfig } = storeToRefs(configStore)
const route = useRoute()
const {
  takenTime,
  testInfo,
  questions,
  currentQuestion,
  singleQuestions,
  multiQuestions,
  trueFalseQuestions,
  subjectiveQuestions,
  practicedQuestions,
  result,
  answerSheet,
  loading,
} = storeToRefs(testPaperStore)
onMounted(async () => {
  loading.value = true
  try {
    // 获取测试信息
    testInfo.value = {
      bankId: Number(route.query.bankId as string),
      disciplineId: Number(route.query.disciplineId as string) || undefined,
      isDay: Number(route.query.isDay as string) || 0,
      collectionType: route.query.collectionType as CollectionType,
      questionType: route.query.questionType as string,
      model: route.query.model as TestModel,
    }

    const payload = filterAttributes({
      bankId: testInfo.value.bankId,
      disciplineId: testInfo.value.disciplineId,
      type: testInfo.value.collectionType as CollectionType,
      isDay: testInfo.value.isDay !== 0 ? 1 : 0,
      questionType: testInfo.value.questionType as QuestionType,
      number: testInfo.value.model === TestModel.Test ? testConfig.value?.amount : null,
    })
    // 获取题目
    if (testInfo.value.collectionType) {
      await getCollectionList(payload).then((res) => {
        const data = res.records
        questions.value = practiceConfig.value?.random ? data.sort(() => Math.random() - 0.5) : data
      })
    } else {
      await getQuestionList(payload).then((res) => {
        questions.value =
          practiceConfig.value?.random && testInfo.value?.model === TestModel.Practice
            ? res.sort(() => Math.random() - 0.5)
            : res
      })
    }
    currentQuestion.value =
      singleQuestions.value[0] ||
      multiQuestions.value[0] ||
      trueFalseQuestions.value[0] ||
      subjectiveQuestions.value[0] ||
      null
    // 获取练习记录
    if (
      testInfo.value.model === TestModel.Practice &&
      practiceConfig.value?.random === false &&
      !testInfo.value.collectionType
    ) {
      practicedQuestions.value = await getResolutions(payload)
      if (practicedQuestions.value.length > 0) {
        currentQuestion.value =
          questions.value.find((q) => q.id === practicedQuestions.value![0]!.questionId) ??
          currentQuestion.value
        answerSheet.value = practicedQuestions.value.map((q) => {
          return {
            questionId: q.questionId,
            answer: JSON.parse(q.yourAnswer) as Answer | Answer[] | string,
          }
        })
        result.value = practicedQuestions.value
      }
    }
  } finally {
    loading.value = false
  }
})
onUnmounted(() => testPaperStore.resetStore())
</script>
<style scoped lang="scss">
.test-paper {
  background-color: #f5f5f5;
  flex: 1;
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
  .bottom {
    display: none;
  }
  .container {
    padding: 0;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    max-width: 1200px;
    padding-bottom: 24px;

    .left {
      position: relative;
      flex: 0 0 240px;
      height: min(75svh, 800px);
      display: flex;
      flex-direction: column;
      overflow: auto;
      margin-right: 24px;
      background-color: #fff;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
      .question-count {
        border-top: #ddd 1px solid;
        padding: 0 12px;
        flex: 0 0 64px;
        font-size: 14px;
        color: #666;
        .result {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 30%;
          .correct {
            margin-left: 6px;
            color: #82b481;
          }
          .incorrect {
            margin-left: 6px;
            color: #ff4d4f;
          }
        }
      }
      .question-blank {
        flex: 1;
        overflow: hidden;
      }
    }
  }
}
@media (max-width: 767px) {
  .test-paper {
    .container {
      box-sizing: border-box;
      width: 100%;
      padding: 0 12px 12px;
      flex-direction: column;

      .left {
        display: none;
      }

      :deep(.right) {
        width: 100%;
        margin: 0;
      }
      .bottom {
        margin-top: 36px;
        position: relative;
        width: 100%;
        height: 400px;
        display: flex;
        flex-direction: column;
        overflow: auto;
        margin-right: 24px;
        background-color: #fff;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
        .question-count {
          position: sticky;
          top: 4px;
          background-color: #fff;
          z-index: 1;
          border-bottom: #ddd 1px solid;
          padding: 0 12px;
          font-size: 14px;
          color: #666;
          .result {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            gap: 20%;
            white-space: nowrap;
            .correct {
              white-space: nowrap;
              margin-left: 6px;
              color: #82b481;
            }
            .incorrect {
              white-space: nowrap;
              margin-left: 6px;
              color: #ff4d4f;
            }
          }
        }
      }
    }
  }
}
</style>

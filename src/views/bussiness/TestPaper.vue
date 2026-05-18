<template>
  <div class="test-paper">
    <div class="path">
      <el-breadcrumb separator="/" class="breadcrumb" :separator-icon="ArrowRight">
        <el-icon color="#999">
          <LocationInformation />
        </el-icon>
        <el-breadcrumb-item to="/" class="breadcrumb-item">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="`/bank/${testInfo?.bankId}`" class="breadcrumb-item">题库</el-breadcrumb-item>
        <el-breadcrumb-item class="breadcrumb-item">顺序练习</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="left">
        <TestLeftNavi :type="QuestionType.SingleChoice" :typedQuestions="singleQuestions" />
        <TestLeftNavi :type="QuestionType.MultiChoice" :typedQuestions="multiQuestions" />
        <TestLeftNavi :type="QuestionType.TrueFalse" :typedQuestions="trueFalseQuestions" />
      </div>
      <div class="main">
        <div class="collect">
          <el-button type="primary" size="large">
            <el-icon style="font-size: 24px;">
              <Star />
            </el-icon>
            <span>加入收藏</span>
          </el-button>
        </div>
        <div class="question" :key="currentQuestion?.id">
          <div class="q-content">
            <div class="label">{{ questionTypeMap[currentQuestion?.type || QuestionType.SingleChoice] }}</div>
            <div class="value">
              <span v-if="currentQuestion?.type === QuestionType.SingleChoice">{{
                singleQuestions.indexOf(currentQuestion) + 1 }}、</span>
              <span v-else-if="currentQuestion?.type === QuestionType.MultiChoice">{{
                multiQuestions.indexOf(currentQuestion) + 1 }}、</span>
              <span v-else-if="currentQuestion?.type === QuestionType.TrueFalse">{{
                trueFalseQuestions.indexOf(currentQuestion) + 1 }}、</span>
              <span>{{ currentQuestion?.content || '' }}（ ）</span>
            </div>
          </div>
          <div class="option">
            <div v-for="item in currentQuestion?.options" :key="item.id" class="option-item" @click="pushAnswer(item)">
              <div class="select-box checkbox" v-if="currentQuestion?.type === QuestionType.MultiChoice">
                <div class="select__label"
                  :class="{ 'is-correct': isCorrect(item), 'is-incorrect': isIncorrect(item), 'is-checked': isChecked(item) }">
                </div>
              </div>
              <div class="select-box radio"
                v-if="currentQuestion?.type === QuestionType.SingleChoice || currentQuestion?.type === QuestionType.TrueFalse"
                :class="{ 'is-checked': isChecked(item) }">
                <div class="select__label"
                  :class="{ 'is-correct': isCorrect(item), 'is-incorrect': isIncorrect(item), 'is-checked': isChecked(item) }">
                </div>
              </div>
              <p class="option-text">{{ item.key }}、 {{ item.text }}</p>
            </div>
          </div>
        </div>
        <div class="btns">
          <el-button class="btn" @click="prevQuestion" :disabled="currentQuestion?.id === singleQuestions[0]?.id"
            size="large">
            <div class="inner">
              <el-icon size="20">
                <Back />
              </el-icon>
              上一题
            </div>
          </el-button>
          <el-button class="btn submit-btn" @click="submitAnswerSheet" size="large">提交</el-button>
          <el-button class="btn" @click="nextQuestion"
            :disabled="currentQuestion?.id === trueFalseQuestions[trueFalseQuestions.length - 1]?.id" size="large">
            <div class="inner">
              下一题
              <el-icon size="20">
                <Right />
              </el-icon>
            </div>
          </el-button>
        </div>
      </div>
    </div>
  </div>
  <TestResultDialog />
</template>
<script setup lang="ts">
import { getQuestionList } from '@/api/question'
import { QuestionType } from '@/types/prisma'
import type { Option } from '@/types/prisma'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTestPaperStore } from '@/stores/testpaper'
import TestLeftNavi from '@/components/TestLeftNavi.vue'
import { ArrowRight } from '@element-plus/icons-vue'
import TestResultDialog from '@/components/TestResultDialog.vue'

const testPaperStore = useTestPaperStore()
const route = useRoute()

const { questions, currentQuestion, answerSheet } = storeToRefs(testPaperStore)
const { pushAnswer, submitAnswerSheet, prevQuestion, nextQuestion, resetStore } = testPaperStore
const { singleQuestions, multiQuestions, trueFalseQuestions, testInfo, testResult } = storeToRefs(testPaperStore)
const questionTypeMap = ref({
  [QuestionType.SingleChoice]: '单选题',
  [QuestionType.MultiChoice]: '多选题',
  [QuestionType.TrueFalse]: '判断题'
})
const isCorrect = (item: Option) => {
  const isFound = testResult.value?.results?.find((r) => r.questionId === currentQuestion.value?.id)
  return isFound?.correctAnswer === item.key || isFound?.correctAnswer.includes(item.key)
}
const isChecked = (item: Option) => {
  return answerSheet.value.find((a) => a.questionId === currentQuestion.value?.id && (a.answer === item.key || a.answer.includes(item.key)))
}
const isIncorrect = (item: Option) => {
  const isFound = testResult.value?.results?.find((r) => r.questionId === currentQuestion.value?.id)
  if (isFound) {
    return isFound.correctAnswer === item.key || isFound.correctAnswer.includes(item.key) ? false : true
  }
  return false
}
onMounted(async () => {
  testInfo.value = {
    type: route.query.type as string,
    bankId: Number(route.query.bankId as string),
    disciplineId: Number(route.query.disciplineId as string),
  }
  await getQuestionList({
    bankId: testInfo.value.bankId,
    disciplineId: testInfo.value.disciplineId,
  }).then(res => {
    questions.value = res
    currentQuestion.value = singleQuestions.value[0]
  })
  const storedAnswerSheet = localStorage.getItem('answerSheet')
  if (storedAnswerSheet) {
    const historyAnswerSheet = JSON.parse(storedAnswerSheet)
    if (testInfo.value.type === historyAnswerSheet.testInfo.type && testInfo.value.bankId === historyAnswerSheet.testInfo.bankId && testInfo.value.disciplineId === historyAnswerSheet.testInfo.disciplineId) {
      answerSheet.value = historyAnswerSheet.answerSheet
    }
  }
})
onUnmounted(() => resetStore())
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

    .main {
      padding: 24px;
      height: calc(62vh - 48px);
      overflow: auto;
      width: calc(100% - 264px);
      background-color: #fff;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
      position: relative;

      .collect {
        position: absolute;
        top: 0;
        right: 0;
        padding: 12px;

        :deep(.el-button--large) {
          width: 100px;
          height: 40px;
          background-color: #007bff7e;
          color: #fff;
          transition: all 0.1s ease-in-out;

          &:hover {
            background-color: #005bff;
          }
        }
      }

      .question {
        padding: 12px;
      }

      .q-content {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        height: 48px;
        margin: 12px 0;
        max-width: 85%;

        .label {
          font-size: 16px;
          font-weight: 350;
          line-height: 24px;
          color: #fff;
          background-color: #548EF7;
          white-space: nowrap;
          padding: 2px 4px;
          border-radius: 4px;
          margin-right: 12px;
        }

        .value {
          font-size: 22px;
          line-height: 22px;
        }
      }

      .option {
        padding: 12px;
        font-size: 20px;
        height: 330.667px;
        cursor: pointer;

        .option-text {
          font-size: 20px;
        }

        .select-box {
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 24px;
          background-color: #fff;
          border: 1px solid #548EF7;
          display: flex;
          align-items: center;
          justify-content: center;

          &.radio {
            border-radius: 50%;

            .select__label {
              border-radius: 50%;
            }
          }

          &.checkbox {
            border-radius: 4px;

            .select__label {
              border-radius: 4px;
            }
          }

          .select__label {
            display: inline-block;
            width: 16px;
            height: 16px;
            background-color: #fff;
            transition: all 0.3s ease-in-out;


            &.is-incorrect.is-checked {
              background-color: #E57155 !important;
            }

            &.is-checked {
              background-color: #548EF7;
            }

            &.is-correct {
              background-color: #6CB77B;
            }

            &.is-correct:not(.is-checked) {
              background-color: #6CB77B !important;
            }
          }
        }
      }

      .option-item:has(.select__label.is-checked.is-correct) {
        color: #548EF7;
        box-shadow: 1px 2px 0 -1px #e6f7ff, -1px -2px 0 -1px #e6f7ff;

        &:after {
          position: absolute;
          right: 8px;
          color: #6CB77B;
          font-style: italic;
          font-size: 14px;
          content: '正确';
          border-radius: 4px;
        }
      }

      .option-item:has(.select__label.is-checked.is-incorrect) {
        color: #548EF7;
        box-shadow: 1px 2px 0 -1px #c9f1ff, -1px -2px 0 -1px #c9f1ff;

        &:after {
          position: absolute;
          right: 8px;
          color: #E57155;
          font-style: italic;
          font-size: 14px;
          content: '错选';
          border-radius: 4px;
        }
      }

      .option-item:has(.select__label.is-correct:not(.is-checked)) {
        color: #6CB77B;

        &:after {
          position: absolute;
          right: 8px;
          color: #E57155;
          font-style: italic;
          font-size: 14px;
          content: '漏选';
          border-radius: 4px;
        }
      }

      .option-item {
        position: relative;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: flex-start;


        &:hover {
          color: #007bff;
          box-shadow: 1px 2px 0 -1px #e6f7ff, -1px -2px 0 -1px #e6f7ff;
        }

        &:active {
          color: #002aff;
          transform: translateX(-2px);
        }
      }

      .btns {
        padding: 12px;
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      .inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
      }

      .btn {
        background: #fff;
        color: #548EF7;
        border: 1px solid #548EF7;
        border-radius: 4px;
        padding: 8px 16px;

        &.submit-btn {
          width: 100%;
          background-color: #007bff7e;
          color: #fff;
          transition: all 0.1s ease-in-out;

          &:hover {
            background-color: #005bff;
          }
        }

        &:hover {
          background-color: #EBF4FE;
        }

        &:active:not(:disabled) {
          scale: 0.95;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}
</style>f

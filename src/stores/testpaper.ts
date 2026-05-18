import { checkManyAnswers } from '@/api/question'
import { QuestionType } from '@/types/prisma'
import type { Option } from '@/types/prisma'
import type { CheckAnswerRequest } from '@/types/reqeust'
import type { CheckManyAnswersResponse, GetQuestionListResponse } from '@/types/response'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useTestPaperStore = defineStore('testpaper', () => {
  const currentQuestion = ref<GetQuestionListResponse>()
  const questions = ref<GetQuestionListResponse[]>([])
  const answerSheet = ref<CheckAnswerRequest[]>([])
  const testResult = ref<CheckManyAnswersResponse>()
  const dialogVisible = ref(false)
  interface TestInfo {
    type: string
    bankId: number
    disciplineId: number
  }

  const testInfo = ref<TestInfo>()
  watch(
    () => answerSheet.value,
    (newVal) => {
      localStorage.setItem(
        'answerSheet',
        JSON.stringify({
          testInfo: testInfo.value,
          answerSheet: newVal,
        }),
      )
    },
    { deep: true },
  )
  const singleQuestions = computed(() =>
    questions.value.filter((item) => item.type === QuestionType.SingleChoice),
  )
  const multiQuestions = computed(() =>
    questions.value.filter((item) => item.type === QuestionType.MultiChoice),
  )
  const trueFalseQuestions = computed(() =>
    questions.value.filter((item) => item.type === QuestionType.TrueFalse),
  )
  const resetStore = () => {
    currentQuestion.value = undefined
    questions.value = []
    answerSheet.value = []
    testResult.value = undefined
    testInfo.value = undefined
  }
  const pushAnswer = (item: Option) => {
    if (testResult.value) {
      ElMessage.error('已提交，无法继续作答（刷新页面以重新答题!）')
      return
    }
    const exist = answerSheet.value.find(
      (answer) => answer.questionId === currentQuestion.value?.id,
    )
    if (exist) {
      if (currentQuestion.value?.type === QuestionType.MultiChoice) {
        if (Array.isArray(exist.answer)) {
          if (exist.answer.includes(item.key)) {
            exist.answer = exist.answer.filter((answer) => answer !== item.key)
            if (exist.answer.length === 0) {
              answerSheet.value = answerSheet.value.filter(
                (answer) => answer.questionId !== currentQuestion.value?.id,
              )
            }
          } else {
            exist.answer.push(item.key)
          }
        } else {
          exist.answer = [item.key]
        }
      } else {
        if (exist.answer === item.key) {
          answerSheet.value = answerSheet.value.filter(
            (answer) => answer.questionId !== currentQuestion.value?.id,
          )
        } else {
          exist.answer = item.key
        }
      }
    } else {
      answerSheet.value.push({
        userId: 1,
        questionId: currentQuestion.value?.id || 0,
        answer: currentQuestion.value?.type === QuestionType.MultiChoice ? [item.key] : item.key,
      })
    }
    console.log(answerSheet.value)
  }
  const submitAnswerSheet = async () => {
    if (testResult.value) {
      ElMessage.error('无法重复提交（刷新页面以重新答题!）')
      return
    }
    ElMessageBox.confirm(
      '提交后将无法继续作答，是否继续？',
      `确认提交吗？您还有${questions.value.length - answerSheet.value.length}题未作答`,
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      },
    ).then(async () => {
      testResult.value = await checkManyAnswers(answerSheet.value)
      ElMessage.success('提交成功')
      dialogVisible.value = true
      localStorage.removeItem('answerSheet')
    })
  }
  const prevQuestion = () => {
    let index: number
    switch (currentQuestion.value?.type) {
      case QuestionType.SingleChoice:
        index = singleQuestions.value.findIndex((item) => item.id === currentQuestion.value?.id) - 1
        if (index >= 0) {
          currentQuestion.value = singleQuestions.value[index]
        } else {
          currentQuestion.value = singleQuestions.value[0]
        }
        break
      case QuestionType.MultiChoice:
        index = multiQuestions.value.findIndex((item) => item.id === currentQuestion.value?.id) - 1
        if (index >= 0) {
          currentQuestion.value = multiQuestions.value[index]
        } else {
          currentQuestion.value = singleQuestions.value[singleQuestions.value.length - 1]
        }
        break
      case QuestionType.TrueFalse:
        index =
          trueFalseQuestions.value.findIndex((item) => item.id === currentQuestion.value?.id) - 1
        if (index >= 0) {
          currentQuestion.value = trueFalseQuestions.value[index]
        } else {
          currentQuestion.value = multiQuestions.value[multiQuestions.value.length - 1]
        }
        break
      default:
        currentQuestion.value = undefined
        break
    }
  }
  const nextQuestion = () => {
    let index: number
    switch (currentQuestion.value?.type) {
      case QuestionType.SingleChoice:
        index = singleQuestions.value.findIndex((item) => item.id === currentQuestion.value?.id) + 1
        if (index < singleQuestions.value.length) {
          currentQuestion.value = singleQuestions.value[index]
        } else {
          currentQuestion.value = multiQuestions.value[0]
        }
        break
      case QuestionType.MultiChoice:
        index = multiQuestions.value.findIndex((item) => item.id === currentQuestion.value?.id) + 1
        if (index < multiQuestions.value.length) {
          currentQuestion.value = multiQuestions.value[index]
        } else {
          currentQuestion.value = trueFalseQuestions.value[0]
        }
        break
      case QuestionType.TrueFalse:
        index =
          trueFalseQuestions.value.findIndex((item) => item.id === currentQuestion.value?.id) + 1
        if (index < trueFalseQuestions.value.length) {
          currentQuestion.value = trueFalseQuestions.value[index]
        } else {
          currentQuestion.value = trueFalseQuestions.value[trueFalseQuestions.value.length - 1]
        }
        break
      default:
        currentQuestion.value = undefined
        break
    }
  }
  return {
    currentQuestion,
    questions,
    answerSheet,
    singleQuestions,
    multiQuestions,
    trueFalseQuestions,
    testResult,
    testInfo,
    dialogVisible,
    resetStore,
    pushAnswer,
    submitAnswerSheet,
    prevQuestion,
    nextQuestion,
  }
})

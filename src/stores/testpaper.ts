import { QuestionType } from '@/types/prisma'
import type { Question, Resolution } from '@/types/prisma'
import type { CollectionType, Option } from '@/types/prisma'
import type { CheckAnswerRequest } from '@/types/reqeust'
import type {
  SubmitTestResponse,
  GetQuestionListResponse,
  GetResolutionsResponse,
  GetQuestionDetailResponse,
} from '@/types/response'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { checkAnswer, submitTest } from '@/api/question'
import { useConfigStore } from '@/stores/config'
const configStore = useConfigStore()
const { practiceConfig } = storeToRefs(configStore)
export enum TestModel {
  Practice = 'Practice',
  Test = 'Test',
}
export interface TestInfo {
  bankId: number
  disciplineId?: number
  questionType?: string
  isDay?: number
  collectionType?: CollectionType
  model: TestModel
}
export const useTestPaperStore = defineStore('testpaper', () => {
  const currentQuestion = ref<(Question & { isCollected?: boolean; options: Option[] }) | null>(
    null,
  )
  const loading = ref(false)
  const questions = ref<GetQuestionListResponse[] | GetQuestionDetailResponse[]>([])
  const practicedQuestions = ref<GetResolutionsResponse>()
  const answerSheet = ref<CheckAnswerRequest[]>([])
  const testResult = ref<SubmitTestResponse | null>(null)
  const result = ref<Resolution[]>([])
  const dialogVisible = ref(false)
  const takenTime = ref(0)
  const testInfo = ref<TestInfo | null>(null)
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
  const timer = ref<number | null>(null)
  watch(
    () => testInfo.value?.model,
    () => {
      if (testInfo.value?.model === TestModel.Test)
        timer.value =
          testInfo.value?.model === TestModel.Test
            ? setInterval(() => {
                if (testResult.value) {
                  clearInterval(timer.value as number)
                } else {
                  takenTime.value += 1
                }
              }, 1000)
            : null
    },
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
  const subjectiveQuestions = computed(() =>
    questions.value.filter((item) => item.type === QuestionType.Subjective),
  )
  const resetStore = () => {
    loading.value = false
    currentQuestion.value = null
    questions.value = []
    answerSheet.value = []
    testResult.value = null
    result.value = []
    testInfo.value = null
    takenTime.value = 0
    if (typeof timer.value === 'number') {
      clearInterval(timer.value)
    }
  }
  const pushAnswer = (item: Option) => {
    if (
      (typeof currentQuestion.value?.id === 'number' &&
        result.value.find((r) => r.questionId === currentQuestion.value?.id)) ||
      testResult.value
    ) {
      ElMessage.error('提交后的答案无法修改！')
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
        questionId: currentQuestion.value?.id || 0,
        answer: currentQuestion.value?.type === QuestionType.MultiChoice ? [item.key] : item.key,
      })
    }
    if (
      practiceConfig.value.autoCheck &&
      (currentQuestion.value?.type === QuestionType.SingleChoice ||
        currentQuestion.value?.type === QuestionType.TrueFalse)
    ) {
      checkPracticeAnswer()
    }
    console.log(answerSheet.value)
  }
  const setSubjectiveAnswer = (answer: string) => {
    if (!currentQuestion.value || currentQuestion.value.type !== QuestionType.Subjective) return
    const existing = answerSheet.value.find((item) => item.questionId === currentQuestion.value?.id)
    if (!answer.trim()) {
      answerSheet.value = answerSheet.value.filter(
        (item) => item.questionId !== currentQuestion.value?.id,
      )
    } else if (existing) {
      existing.answer = answer
    } else {
      answerSheet.value.push({ questionId: currentQuestion.value.id, answer })
    }
  }
  const submitAnswerSheet = async () => {
    if (testResult.value) {
      ElMessage.error('不能重复提交，请刷新后再试')
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
      loading.value = true
      try {
        testResult.value = await submitTest({
          answerSheet: answerSheet.value,
          disciplineId: testInfo.value?.disciplineId || 0,
          bankId: testInfo.value?.bankId || 0,
          takenTime: takenTime.value * 1000,
          length: questions.value.length,
        })
        loading.value = false
        result.value = testResult.value.results
        ElMessage.success('提交成功')
        dialogVisible.value = true
        localStorage.removeItem('answerSheet')
      } catch (error) {
        console.log(error)
        ElMessage.error('提交失败')
        loading.value = false
      }
    })
  }
  const checkPracticeAnswer = async () => {
    if (result.value.find((r) => r.questionId === currentQuestion.value?.id)) {
      return
    }
    const item = answerSheet.value.find((item) => item.questionId === currentQuestion.value?.id)
    if (!item) {
      ElMessage.error('请先作答！')
      return
    }
    loading.value = true
    await checkAnswer(item)
      .then((data) => {
        result.value.push(data)
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
  }
  const prevQuestion = () => {
    let index: number
    switch (currentQuestion.value?.type) {
      case QuestionType.SingleChoice:
        index = singleQuestions.value.findIndex((item) => item.id === currentQuestion.value?.id) - 1
        currentQuestion.value = singleQuestions.value[index] ?? currentQuestion.value
        break
      case QuestionType.MultiChoice:
        index = multiQuestions.value.findIndex((item) => item.id === currentQuestion.value?.id) - 1
        if (index >= 0) {
          currentQuestion.value = multiQuestions.value[index] ?? currentQuestion.value
        } else {
          currentQuestion.value =
            singleQuestions.value[singleQuestions.value.length - 1] ?? currentQuestion.value
        }
        break
      case QuestionType.TrueFalse:
        index =
          trueFalseQuestions.value.findIndex((item) => item.id === currentQuestion.value?.id) - 1
        if (index >= 0) {
          currentQuestion.value = trueFalseQuestions.value[index] ?? currentQuestion.value
        } else {
          currentQuestion.value =
            multiQuestions.value[multiQuestions.value.length - 1] ??
            singleQuestions.value[singleQuestions.value.length - 1] ??
            currentQuestion.value
        }
        break
      case QuestionType.Subjective:
        index =
          subjectiveQuestions.value.findIndex((item) => item.id === currentQuestion.value?.id) - 1
        currentQuestion.value =
          subjectiveQuestions.value[index] ??
          trueFalseQuestions.value[trueFalseQuestions.value.length - 1] ??
          multiQuestions.value[multiQuestions.value.length - 1] ??
          singleQuestions.value[singleQuestions.value.length - 1] ??
          currentQuestion.value
        break
      default:
        currentQuestion.value = null
        break
    }
  }
  const nextQuestion = () => {
    let index: number
    switch (currentQuestion.value?.type) {
      case QuestionType.SingleChoice:
        index = singleQuestions.value.findIndex((item) => item.id === currentQuestion.value?.id) + 1
        if (index < singleQuestions.value.length) {
          currentQuestion.value = singleQuestions.value[index] ?? currentQuestion.value
        } else {
          currentQuestion.value =
            multiQuestions.value[0] ?? trueFalseQuestions.value[0] ?? currentQuestion.value
        }
        break
      case QuestionType.MultiChoice:
        index = multiQuestions.value.findIndex((item) => item.id === currentQuestion.value?.id) + 1
        if (index < multiQuestions.value.length) {
          currentQuestion.value = multiQuestions.value[index] ?? currentQuestion.value
        } else {
          currentQuestion.value = trueFalseQuestions.value[0] ?? currentQuestion.value
        }
        break
      case QuestionType.TrueFalse:
        index =
          trueFalseQuestions.value.findIndex((item) => item.id === currentQuestion.value?.id) + 1
        if (index < trueFalseQuestions.value.length) {
          currentQuestion.value = trueFalseQuestions.value[index] ?? currentQuestion.value
        } else {
          currentQuestion.value = subjectiveQuestions.value[0] ?? currentQuestion.value
        }
        break
      case QuestionType.Subjective:
        index =
          subjectiveQuestions.value.findIndex((item) => item.id === currentQuestion.value?.id) + 1
        currentQuestion.value =
          subjectiveQuestions.value[index] ??
          subjectiveQuestions.value[subjectiveQuestions.value.length - 1] ??
          currentQuestion.value
        break
      default:
        currentQuestion.value = null
        break
    }
  }
  return {
    takenTime,
    currentQuestion,
    questions,
    answerSheet,
    singleQuestions,
    multiQuestions,
    trueFalseQuestions,
    subjectiveQuestions,
    testResult,
    result,
    testInfo,
    dialogVisible,
    practicedQuestions,
    loading,
    resetStore,
    pushAnswer,
    setSubjectiveAnswer,
    submitAnswerSheet,
    prevQuestion,
    nextQuestion,
    checkPracticeAnswer,
  }
})

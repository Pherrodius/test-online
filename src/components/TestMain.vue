<template>
  <div class="right">
    <div class="main">
      <div class="collect">
        <el-button
          type="primary"
          :size="buttonSize"
          @click="handleCollect"
          :loading="!currentQuestion"
        >
          <el-icon class="collect-icon">
            <Check v-if="currentQuestion?.isCollected" />
            <Star v-else />
          </el-icon>
          <span>{{ currentQuestion?.isCollected ? '已收藏' : '加入收藏' }}</span>
        </el-button>
      </div>
      <div class="question" :key="currentQuestion?.id">
        <div class="q-content">
          <div class="label">
            {{ questionTypeMap[currentQuestion?.type || QuestionType.SingleChoice] }}
          </div>
          <div class="value">
            <span v-if="currentQuestion?.type === QuestionType.SingleChoice" class="index"
              >{{ singleQuestions.indexOf(currentQuestion) + 1 }}/{{ questions.length }}、</span
            >
            <span v-else-if="currentQuestion?.type === QuestionType.MultiChoice" class="index"
              >{{ multiQuestions.indexOf(currentQuestion) + singleQuestions.length + 1 }}/{{
                questions.length
              }}、</span
            >
            <span v-else-if="currentQuestion?.type === QuestionType.TrueFalse" class="index"
              >{{
                trueFalseQuestions.indexOf(currentQuestion) +
                singleQuestions.length +
                multiQuestions.length +
                1
              }}/{{ questions.length }}、</span
            >
            <span v-else-if="currentQuestion?.type === QuestionType.Subjective" class="index"
              >{{
                subjectiveQuestions.indexOf(currentQuestion) +
                singleQuestions.length +
                multiQuestions.length +
                trueFalseQuestions.length +
                1
              }}/{{ questions.length }}、</span
            >
            <span>{{ currentQuestion?.content || '' }}</span>
          </div>
        </div>
        <div class="option">
          <el-input
            v-if="currentQuestion?.type === QuestionType.Subjective"
            v-model="subjectiveAnswer"
            type="textarea"
            :rows="8"
            placeholder="请输入答案"
            :disabled="!!result.find((r) => r.questionId === currentQuestion?.id) || !!testResult"
          />
          <div
            v-for="item in currentQuestion?.options"
            :key="item.id"
            class="option-item"
            @click="pushAnswer(item)"
          >
            <div
              class="select-box checkbox"
              v-if="currentQuestion?.type === QuestionType.MultiChoice"
            >
              <div
                class="select__label"
                :class="{
                  'is-correct': isCorrect(item),
                  'is-incorrect': isIncorrect(item),
                  'is-checked': isChecked(item),
                }"
              ></div>
            </div>
            <div
              class="select-box radio"
              v-if="
                currentQuestion?.type === QuestionType.SingleChoice ||
                currentQuestion?.type === QuestionType.TrueFalse
              "
              :class="{ 'is-checked': isChecked(item) }"
            >
              <div
                class="select__label"
                :class="{
                  'is-correct': isCorrect(item),
                  'is-incorrect': isIncorrect(item),
                  'is-checked': isChecked(item),
                }"
              ></div>
            </div>
            <p class="option-text">{{ item.key }}、 {{ item.text }}</p>
          </div>
        </div>
      </div>
      <div class="btns">
        <el-button
          class="btn"
          @click="prevQuestion"
          :disabled="currentQuestion?.id === singleQuestions[0]?.id"
          size="large"
        >
          <div class="inner">
            <el-icon size="20">
              <Back />
            </el-icon>
            上一题
          </div>
        </el-button>
        <el-button
          v-if="testInfo?.model === TestModel.Test && !testResult"
          class="btn submit-btn"
          @click="submitAnswerSheet"
          size="large"
          >提交试卷</el-button
        >
        <el-button
          v-else-if="testInfo?.model === TestModel.Test && testResult"
          class="btn submit-btn"
          @click="reTest"
          size="large"
          >重新测试</el-button
        >
        <el-button
          v-else-if="
            testInfo?.model === TestModel.Practice &&
            !result.find((r) => r.questionId === currentQuestion?.id)
          "
          class="btn submit-btn"
          @click="checkPracticeAnswer"
          size="large"
          >检查答案</el-button
        >
        <el-button
          v-else-if="!!result.find((r) => r.questionId === currentQuestion?.id)"
          class="btn submit-btn"
          @click="handleRestart(currentQuestion?.id!)"
          size="large"
          >再次练习</el-button
        >
        <el-button v-else class="btn submit-btn" @click="checkPracticeAnswer" size="large" loading
          >加载中</el-button
        >
        <el-button
          class="btn"
          @click="nextQuestion"
          :disabled="
            currentQuestion?.id === subjectiveQuestions[subjectiveQuestions.length - 1]?.id
          "
          size="large"
        >
          <div class="inner">
            下一题
            <el-icon size="20">
              <Right />
            </el-icon>
          </div>
        </el-button>
      </div>
    </div>
    <section
      class="ai-consult"
      :class="{ 'is-expanded': chatExpanded }"
      v-if="testInfo?.model === TestModel.Practice"
    >
      <div v-if="chatExpanded" class="chat-panel">
        <div class="chat-header">
          <div>
            <strong>AI 答疑</strong>
            <span>基于当前题目继续提问</span>
          </div>
          <div class="chat-actions">
            <button
              class="chat-clear"
              type="button"
              :disabled="!sessionMessages.length || isConsulting || isClearingHistory"
              @click="handleClearConsultationHistory"
            >
              {{ isClearingHistory ? '清空中' : '清空' }}
            </button>
            <button
              class="chat-close"
              type="button"
              aria-label="收起答疑"
              @click="chatExpanded = false"
            >
              ×
            </button>
          </div>
        </div>

        <div class="chat-messages">
          <div v-if="!sessionMessages.length" class="chat-empty">
            <span class="chat-empty-icon">AI</span>
            <p>哪里没想明白？我可以帮你梳理解题思路。</p>
          </div>
          <div
            v-for="message in sessionMessages"
            :key="message.id"
            class="chat-message"
            :class="`is-${message.role}`"
          >
            <span class="message-role">{{ message.role === 'user' ? '你' : 'AI' }}</span>
            <div class="message-content">
              {{ message.content || '网络连接中...' }}
            </div>
          </div>
        </div>
      </div>

      <form class="consult-input" @submit.prevent="handleConsultSubmit">
        <span class="consult-badge">AI</span>
        <input
          v-model="inputMessage"
          type="text"
          placeholder="对这道题有疑问？问问 AI"
          @focus="chatExpanded = true"
        />
        <button type="submit" :disabled="!inputMessage.trim() || isConsulting">
          {{ isConsulting ? '思考中' : '发送' }}
        </button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { CollectionType, QuestionType } from '@/types/prisma'
import type { Option } from '@/types/prisma'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { TestModel, useTestPaperStore } from '@/stores/testpaper'
import { createCollection, deleteCollection, isCollectionExist } from '@/api/question'
import {
  clearConsultationHistory,
  getConsultationHistory,
  getConsultationStreamUrl,
} from '@/api/consultation'
import { ElMessageBox, ElMessage } from 'element-plus'
import { fetchEventSource } from '@microsoft/fetch-event-source'
const buttonSize = computed(() => {
  if (window.innerWidth <= 767) return 'small'
  if (window.innerWidth <= 1200) return 'medium'
  return 'large'
})
const reTest = () => {
  ElMessageBox.confirm('确定重新测试吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    location.reload()
  })
}
const testPaperStore = useTestPaperStore()
const { currentQuestion, answerSheet, result } = storeToRefs(testPaperStore)
const {
  pushAnswer,
  setSubjectiveAnswer,
  submitAnswerSheet,
  prevQuestion,
  nextQuestion,
  checkPracticeAnswer,
} = testPaperStore
const {
  testInfo,
  singleQuestions,
  multiQuestions,
  trueFalseQuestions,
  subjectiveQuestions,
  testResult,
  questions,
} = storeToRefs(testPaperStore)
const subjectiveAnswer = computed({
  get: () => {
    const answer = answerSheet.value.find(
      (item) => item.questionId === currentQuestion.value?.id,
    )?.answer
    return typeof answer === 'string' ? answer : ''
  },
  set: setSubjectiveAnswer,
})
const questionTypeMap = ref({
  [QuestionType.SingleChoice]: '单选题',
  [QuestionType.MultiChoice]: '多选题',
  [QuestionType.TrueFalse]: '判断题',
  [QuestionType.Subjective]: '主观题',
})
const handleCollect = async () => {
  if (currentQuestion.value?.isCollected) {
    ElMessageBox.confirm('您想删除收藏吗？', '该题目已加入收藏，', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      deleteCollection(currentQuestion.value!.id!)
        .then(() => {
          ElMessage.success('删除收藏成功')
          currentQuestion.value!.isCollected = false
        })
        .catch((err) => {
          ElMessage.error('删除收藏失败')
          console.error(err)
        })
    })
    return
  }
  try {
    await createCollection({
      questionId: currentQuestion.value!.id,
      type: CollectionType.Note,
    })
    currentQuestion.value!.isCollected = true
    ElMessage.success('加入收藏成功')
  } catch (err) {
    console.log(err)
    ElMessage.error('加入收藏失败')
  }
}
const isCollected = () => {
  isCollectionExist(currentQuestion.value!.id)
    .then((res) => {
      if (res.isNoted) {
        currentQuestion.value!.isCollected = true
      } else {
        currentQuestion.value!.isCollected = false
      }
    })
    .catch((err) => {
      console.error('查询收藏状态失败', err)
    })
}
watch(currentQuestion, () => {
  if (currentQuestion.value?.id) {
    isCollected()
  }
})
const isCorrect = (item: Option) => {
  const isFound = result.value?.find((r) => r.questionId === currentQuestion.value?.id)
  return isFound?.correctAnswer === item.key || isFound?.correctAnswer.includes(item.key)
}
const isChecked = (item: Option) => {
  return answerSheet.value.find(
    (a) =>
      a.questionId === currentQuestion.value?.id &&
      (a.answer === item.key || a.answer.includes(item.key)),
  )
}
const isIncorrect = (item: Option) => {
  const isFound = result.value?.find((r) => r.questionId === currentQuestion.value?.id)
  if (isFound) {
    return isFound.correctAnswer === item.key || isFound.correctAnswer.includes(item.key)
      ? false
      : true
  }
  return false
}
const handleRestart = (id: number) => {
  result.value = result.value.filter((r) => r.questionId !== id)
  answerSheet.value = answerSheet.value.filter((r) => r.questionId !== id)
}
const sessionMessages = ref<{ id: string; role: string; content: string }[]>([])
const inputMessage = ref<string>('')
const chatExpanded = ref(false)
const isConsulting = ref(false)
const isClearingHistory = ref(false)

const loadConsultationHistory = async () => {
  try {
    const history = await getConsultationHistory()
    sessionMessages.value = history.map((item) => ({
      id: item.id.toString(),
      role: item.role,
      content: item.content,
    }))
  } catch (error) {
    console.error('加载咨询历史失败', error)
  }
}

watch(
  () => testInfo.value,
  () => {
    if (testInfo.value?.model === TestModel.Practice) loadConsultationHistory()
  },
  { immediate: true },
)

const handleClearConsultationHistory = async () => {
  if (!sessionMessages.value.length || isConsulting.value || isClearingHistory.value) return

  try {
    await ElMessageBox.confirm('清空后无法恢复，确定清空全部咨询历史吗？', '清空咨询历史', {
      confirmButtonText: '确定清空',
      cancelButtonText: '取消',
      type: 'warning',
    })
    isClearingHistory.value = true
    await clearConsultationHistory()
    sessionMessages.value = []
    ElMessage.success('咨询历史已清空')
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      console.error('清空咨询历史失败', error)
      ElMessage.error('清空咨询历史失败')
    }
  } finally {
    isClearingHistory.value = false
  }
}

const handleConsultSubmit = async () => {
  if (!inputMessage.value.trim() || isConsulting.value || !currentQuestion.value?.id) return
  chatExpanded.value = true
  await AiConsultation()
}

const AiConsultation = async () => {
  const message = inputMessage.value.trim()
  if (!message) return

  const controller = new AbortController()
  let retryCount = 0
  isConsulting.value = true
  sessionMessages.value.push({
    id: new Date().getTime().toString() + '1',
    role: 'user',
    content: message,
  })
  inputMessage.value = ''
  const newRes = {
    id: new Date().getTime().toString() + '2',
    role: 'assistant',
    content: '',
  }
  sessionMessages.value.push(newRes)
  const aiResponse = sessionMessages.value.find((item) => item.id === newRes.id)
  const token = localStorage.getItem('token')
  await fetchEventSource(getConsultationStreamUrl(currentQuestion.value!.id), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content: message,
    }),
    signal: controller.signal,
    onmessage: (event) => {
      const delta = event.data
      try {
        if (!aiResponse) {
          controller.abort()
          ElMessage.error('未知错误')
          return
        }
        const data = JSON.parse(delta)
        if (data?.type === 'done') {
          controller.abort()
          return
        }
        if (data?.type === 'error') {
          controller.abort()
          ElMessage.error(data.message)
          aiResponse.content = data.message
          return
        }
        if (data?.type === 'delta' && data?.content) {
          aiResponse.content +=
            typeof data.content === 'string' ? data.content : (data.content.content ?? '')
        }
      } catch (e) {
        if (aiResponse) aiResponse.content = 'Invalid JSON in event data'
        console.error('Invalid JSON in event data', e)
      }
    },
    onclose() {
      controller.abort()
    },
    onerror(err) {
      if (retryCount < 3) {
        retryCount++
        return 3000
      }
      if (aiResponse) aiResponse.content = err
      controller.abort()
      throw new Error(err)
    },
  }).finally(() => {
    controller.abort()
    retryCount = 0
    isConsulting.value = false
  })
}
</script>
<style scoped lang="scss">
.collect-icon {
  font-size: 24px;
  @media screen and (max-width: 768px) {
    font-size: 20px;
  }
}

.right {
  width: calc(100% - 264px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
}
.main {
  box-sizing: border-box;
  padding: 24px;
  max-height: calc(100svh - 86px);
  min-height: 550px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
  width: 100%;
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
    flex: 1;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .q-content {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 12px 0;
    max-width: 85%;

    .label {
      font-size: 16px;
      font-weight: 350;
      line-height: 24px;
      color: #fff;
      background-color: #548ef7;
      white-space: nowrap;
      padding: 2px 4px;
      border-radius: 4px;
      margin-right: 12px;
    }

    .value {
      font-size: 20px;
      font-weight: normal;
      line-height: 20px;
      .index {
        font-weight: 550;
      }
    }
  }

  .option {
    padding: 12px;
    font-size: 20px;
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
      border: 1px solid #548ef7;
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
          background-color: #e57155 !important;
        }

        &.is-checked {
          background-color: #548ef7;
        }

        &.is-correct {
          background-color: #6cb77b;
        }

        &.is-correct:not(.is-checked) {
          background-color: #6cb77b !important;
        }
      }
    }
  }

  .option-item:has(.select__label.is-checked.is-correct) {
    color: #548ef7;
    box-shadow:
      1px 2px 0 -1px #e6f7ff,
      -1px -2px 0 -1px #e6f7ff;

    &:after {
      position: absolute;
      right: 8px;
      color: #6cb77b;
      font-style: italic;
      font-size: 14px;
      content: '正确';
      border-radius: 4px;
    }
  }

  .option-item:has(.select__label.is-checked.is-incorrect) {
    color: #548ef7;
    box-shadow:
      1px 2px 0 -1px #c9f1ff,
      -1px -2px 0 -1px #c9f1ff;

    &:after {
      position: absolute;
      right: 8px;
      color: #e57155;
      font-style: italic;
      font-size: 14px;
      content: '错选';
      border-radius: 4px;
    }
  }

  .option-item:has(.select__label.is-correct:not(.is-checked)) {
    color: #6cb77b;

    &:after {
      position: absolute;
      right: 8px;
      color: #e57155;
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
      box-shadow:
        1px 2px 0 -1px #e6f7ff,
        -1px -2px 0 -1px #e6f7ff;
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

  .ai-consult {
    flex: 1;
    box-sizing: border-box;
    width: 100%;
    margin: 0 0 4px;
    border: 1px solid #dfe8f6;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 8px 24px rgba(48, 91, 154, 0.08);
    overflow: hidden;
    transition: box-shadow 0.2s ease;

    &.is-expanded {
      box-shadow: 0 12px 32px rgba(48, 91, 154, 0.14);
    }
  }

  .chat-panel {
    border-bottom: 1px solid #edf1f7;
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 10px;

    div {
      display: flex;
      align-items: baseline;
      gap: 10px;
    }

    strong {
      color: #234064;
      font-size: 15px;
    }

    span {
      color: #8a98aa;
      font-size: 12px;
    }
  }

  .chat-close {
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 8px;
    color: #8795a8;
    background: transparent;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;

    &:hover {
      color: #548ef7;
      background: #f2f6fc;
    }
  }

  .chat-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .chat-clear {
    border: 0;
    border-radius: 7px;
    padding: 5px 8px;
    color: #8997aa;
    background: transparent;
    font-size: 12px;
    cursor: pointer;

    &:hover:not(:disabled) {
      color: #e06b63;
      background: #fff1f0;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }
  }

  .chat-messages {
    max-height: 260px;
    padding: 8px 16px 16px;
    overflow-y: auto;
  }

  .chat-empty {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 64px;
    color: #718096;
    font-size: 13px;

    p {
      margin: 0;
    }
  }

  .chat-empty-icon,
  .message-role,
  .consult-badge {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 9px;
    color: #fff;
    background: linear-gradient(135deg, #6ba4ff, #477be9);
    font-size: 11px;
    font-weight: 700;
  }

  .chat-message {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 12px;

    &.is-user {
      flex-direction: row-reverse;

      .message-role {
        color: #58708e;
        background: #edf3fb;
      }

      .message-content {
        color: #fff;
        background: #548ef7;
      }
    }
  }

  .message-role {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }

  .message-content {
    max-width: min(78%, 620px);
    padding: 9px 12px;
    border-radius: 12px;
    color: #3d5168;
    background: #f3f6fa;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  .consult-input {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;

    input {
      min-width: 0;
      flex: 1;
      border: 0;
      outline: none;
      color: #34495e;
      background: transparent;
      font-size: 14px;

      &::placeholder {
        color: #a1adbc;
      }
    }

    button {
      border: 0;
      border-radius: 9px;
      padding: 8px 16px;
      color: #fff;
      background: #548ef7;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover:not(:disabled) {
        background: #3d78e5;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.45;
      }
    }
  }

  .consult-badge {
    width: 28px;
    height: 28px;
  }

  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
  }

  .btn {
    background: #fff;
    color: #548ef7;
    border: 1px solid #548ef7;
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
      background-color: #ebf4fe;
    }

    &:active:not(:disabled) {
      scale: 0.95;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>

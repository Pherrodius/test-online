<template>
  <div class="main">
    <div class="collect">
      <el-button type="primary" size="large" @click="handleCollect" :loading="!currentQuestion">
        <el-icon style="font-size: 24px">
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
            >{{ multiQuestions.indexOf(currentQuestion) + 1 }}/{{ questions.length }}、</span
          >
          <span v-else-if="currentQuestion?.type === QuestionType.TrueFalse" class="index"
            >{{ trueFalseQuestions.indexOf(currentQuestion) + 1 }}/{{ questions.length }}、</span
          >
          <span>{{ currentQuestion?.content || '' }}（ ）</span>
        </div>
      </div>
      <div class="option">
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
        :disabled="currentQuestion?.id === trueFalseQuestions[trueFalseQuestions.length - 1]?.id"
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
</template>

<script setup lang="ts">
import { CollectionType, QuestionType } from '@/types/prisma'
import type { Option } from '@/types/prisma'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { TestModel, useTestPaperStore } from '@/stores/testpaper'
import { createCollection, deleteCollection, isCollectionExist } from '@/api/question'
import { ElMessageBox, ElMessage } from 'element-plus'
import { fetchEventSource } from '@microsoft/fetch-event-source'
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
const { pushAnswer, submitAnswerSheet, prevQuestion, nextQuestion, checkPracticeAnswer } =
  testPaperStore
const { testInfo, singleQuestions, multiQuestions, trueFalseQuestions, testResult, questions } =
  storeToRefs(testPaperStore)
const questionTypeMap = ref({
  [QuestionType.SingleChoice]: '单选题',
  [QuestionType.MultiChoice]: '多选题',
  [QuestionType.TrueFalse]: '判断题',
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
const aiResponse = ref<string>('')
const inputMessage = ref<string>('')
const controller: AbortController = new AbortController()
const AiConsultation = async () => {
  try {
    inputMessage.value = await ElMessageBox.prompt('', 'AI助手在线答疑', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入疑惑内容',
    })
  } catch (e) {
    return e
  }

  let retryCount = 0
  await fetchEventSource('/api/question/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      `问题情况如下：${{
        content: currentQuestion.value?.content,
        options: currentQuestion.value?.options.map((o) => o.text),
        myAnswer: result.value?.find((r) => r.questionId === currentQuestion.value?.id)?.yourAnswer,
        correctAnswer: result.value?.find((r) => r.questionId === currentQuestion.value?.id)
          ?.correctAnswer,
      }}\n
      我想咨询：${inputMessage.value}\n
      `,
    ),
    signal: controller.signal,
    onmessage: (event) => {
      const raw = event.data
      // event.data may be a plain string (e.g. '[DONE]') or a JSON string with a `type` field
      if (raw === '[DONE]') {
        controller.abort()
        return
      }
      try {
        const data = JSON.parse(raw)
        if (data?.type === '[DONE]') {
          controller.abort()
          return
        }
        if (data?.type === 'delta' && data?.content) {
          aiResponse.value += data.content
        }
      } catch (e) {
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
      controller.abort()
      throw new Error(err)
    },
  }).finally(() => {
    retryCount = 0
  })
}
</script>
<style scoped lang="scss">
.main {
  padding: 24px;
  max-height: calc(100svh - 86px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

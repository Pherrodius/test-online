<template>
  <div class="main">
    <div class="edit-toolbar">
      <div class="toolbar-title">
        <span>题目编辑</span>
        <em>{{ currentQuestion ? questionTypeText : '未选择题目' }}</em>
      </div>
      <div class="toolbar-actions">
        <el-button type="success" @click="addQuestion">
          <el-icon size="18">
            <Plus />
          </el-icon>
          新建题目
        </el-button>
        <el-button type="danger" :disabled="!currentQuestion" @click="delQuestion">
          <el-icon size="18">
            <Close />
          </el-icon>
          删除题目
        </el-button>
      </div>
    </div>
    <div v-if="currentQuestion" class="edit-section">
      <div class="question">
        <div class="q-content">
          <div class="label">
            <el-select v-model="currentQuestion.type" suffix-icon="">
              <el-option label="单选题" :value="QuestionType.SingleChoice" />
              <el-option label="多选题" :value="QuestionType.MultiChoice" />
              <el-option label="判断题" :value="QuestionType.TrueFalse" />
              <el-option label="主观题" :value="QuestionType.Subjective" />
            </el-select>
          </div>
          <el-input
            v-model="currentQuestion.content"
            class="content-input"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 4 }"
          />
        </div>

        <div class="q-option">
          <el-checkbox-group
            v-if="currentQuestion.type === QuestionType.MultiChoice"
            v-model="multiAnswerKeys"
            class="answer-editor"
          >
            <div class="edit-option" v-for="item in currentQuestion.options" :key="item.id">
              <el-checkbox :value="item.key" size="large" />
              <span class="option-key">{{ item.key }}、</span>
              <el-input v-model="item.text" />
            </div>
          </el-checkbox-group>
          <el-radio-group
            v-else-if="currentQuestion.type === QuestionType.SingleChoice"
            v-model="singleAnswerKey"
            class="answer-editor"
          >
            <div class="edit-option" v-for="item in currentQuestion.options" :key="item.id">
              <el-radio :value="item.key" size="large" />
              <span class="option-key">{{ item.key }}、</span>
              <el-input v-model="item.text" />
            </div>
          </el-radio-group>
          <el-input
            v-else-if="currentQuestion.type === QuestionType.Subjective"
            v-model="subjectiveReference"
            type="textarea"
            :rows="6"
            placeholder="请输入参考答案"
          />
          <el-radio-group
            v-else-if="currentQuestion.type === QuestionType.TrueFalse"
            v-model="trueFalseAnswerKey"
            class="answer-editor"
          >
            <div class="edit-option" v-for="item in currentQuestion.options" :key="item.id">
              <el-radio :value="item.key" size="large" />
              <span class="option-key">{{ item.key }}、</span>
              <el-input v-model="item.text" />
            </div>
          </el-radio-group>
        </div>
      </div>

      <div class="explain">
        <div class="correct-answer">
          <span class="title">正确答案：</span>
          <span class="answer-text">{{ correctAnswerText || '未设置' }}</span>
        </div>
        <div class="explanation">
          <span class="title">答案解析：</span
          ><el-input v-model="currentQuestion.explanation" placeholder="该题目暂无解析内容~" />
        </div>
        <div class="explanation">
          <span class="title">题目难度：</span
          ><el-rate v-model="currentQuestion.riskLevel" :max="3" />
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
      <el-button class="btn submit-btn" @click="saveEdit" size="large">保存更改</el-button>
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

    <el-dialog v-model="createDialogVisible" title="创建题目" width="760px" class="create-dialog">
      <div class="create-section">
        <div class="question">
          <div class="q-content">
            <div class="label">
              <el-select v-model="createForm.type" suffix-icon="" @change="resetCreateAnswer">
                <el-option label="单选题" :value="QuestionType.SingleChoice" />
                <el-option label="多选题" :value="QuestionType.MultiChoice" />
                <el-option label="判断题" :value="QuestionType.TrueFalse" />
                <el-option label="主观题" :value="QuestionType.Subjective" />
              </el-select>
            </div>
            <el-input
              v-model="createForm.content"
              class="content-input"
              type="textarea"
              placeholder="请输入题干"
              :autosize="{ minRows: 2, maxRows: 5 }"
            />
          </div>

          <div class="q-option">
            <el-checkbox-group
              v-if="createForm.type === QuestionType.MultiChoice"
              v-model="createForm.multiChoiceAnswer"
              class="answer-editor"
            >
              <div class="edit-option" v-for="item in createForm.options" :key="item.key">
                <el-checkbox :value="item.key" size="large" />
                <span class="option-key">{{ item.key }}、</span>
                <el-input v-model="item.text" placeholder="请输入选项内容" />
              </div>
            </el-checkbox-group>

            <el-radio-group
              v-else-if="createForm.type === QuestionType.SingleChoice"
              v-model="createForm.singleAnswer"
              class="answer-editor"
            >
              <div class="edit-option" v-for="item in createForm.options" :key="item.key">
                <el-radio :value="item.key" size="large" />
                <span class="option-key">{{ item.key }}、</span>
                <el-input v-model="item.text" placeholder="请输入选项内容" />
              </div>
            </el-radio-group>
            <el-input
              v-else-if="createForm.type === QuestionType.Subjective"
              v-model="createForm.subjectiveAnswer"
              type="textarea"
              :rows="6"
              placeholder="请输入参考答案"
            />

            <el-radio-group
              v-else-if="createForm.type === QuestionType.TrueFalse"
              v-model="createForm.trueFalseAnswer"
              class="answer-editor"
            >
              <div class="edit-option" v-for="item in createForm.options" :key="item.key">
                <el-radio :value="item.key" size="large" />
                <span class="option-key">{{ item.key }}、</span>
                <el-input v-model="item.text" placeholder="请输入选项内容" />
              </div>
            </el-radio-group>
          </div>
        </div>

        <div class="explain">
          <div class="correct-answer">
            <span class="title">正确答案：</span>
            <span class="answer-text">{{ createCorrectAnswerText || '未设置' }}</span>
          </div>
          <div class="explanation">
            <span class="title">答案解析：</span>
            <el-input v-model="createForm.explanation" placeholder="请输入答案解析" />
          </div>
          <div class="explanation">
            <span class="title">题目难度：</span>
            <el-rate v-model="createForm.riskLevel" :max="3" />
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createNewQuestion">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Answer, QuestionType } from '@/types/prisma'
import { computed, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTestPaperStore } from '@/stores/testpaper'
import { createQuestion, deleteQuestion, editQuestion } from '@/api/question'
import { useRoute } from 'vue-router'
import type { CreateQuestionRequest } from '@/types/reqeust'
const props = defineProps<{
  refreshKey: number
}>()
const emits = defineEmits(['update:refreshKey'])
const route = useRoute()
const testPaperStore = useTestPaperStore()
const { currentQuestion } = storeToRefs(testPaperStore)
const { prevQuestion, nextQuestion } = testPaperStore
const { singleQuestions, trueFalseQuestions, questions } = storeToRefs(testPaperStore)
const createDialogVisible = ref(false)
const createForm = reactive({
  type: QuestionType.SingleChoice,
  content: '',
  explanation: '',
  riskLevel: 2,
  options: [
    { key: Answer.A, text: '' },
    { key: Answer.B, text: '' },
    { key: Answer.C, text: '' },
    { key: Answer.D, text: '' },
  ],
  singleAnswer: undefined as Answer | undefined,
  multiChoiceAnswer: [] as Answer[],
  trueFalseAnswer: undefined as Answer | undefined,
  subjectiveAnswer: '',
})

const subjectiveReference = computed({
  get: () => currentQuestion.value?.subjectiveAnswer?.reference ?? '',
  set: (reference: string) => {
    if (!currentQuestion.value) return
    currentQuestion.value.subjectiveAnswer = { questionId: currentQuestion.value.id, reference }
  },
})

const singleAnswerKey = computed({
  get: () => currentQuestion.value?.singleAnswer?.answerKey,
  set: (answerKey: Answer | undefined) => {
    if (!currentQuestion.value || !answerKey) return
    currentQuestion.value.singleAnswer = {
      questionId: currentQuestion.value.id,
      answerKey,
    }
  },
})

const trueFalseAnswerKey = computed({
  get: () => currentQuestion.value?.trueFalseAnswer?.answerKey,
  set: (answerKey: Answer | undefined) => {
    if (!currentQuestion.value || !answerKey) return
    currentQuestion.value.trueFalseAnswer = {
      questionId: currentQuestion.value.id,
      answerKey,
    }
  },
})

const multiAnswerKeys = computed({
  get: () => currentQuestion.value?.multiChoiceAnswer?.map((ans) => ans.answerKey) ?? [],
  set: (answerKeys: Answer[]) => {
    if (!currentQuestion.value) return
    currentQuestion.value.multiChoiceAnswer = answerKeys.map((answerKey) => {
      const existingAnswer = currentQuestion.value?.multiChoiceAnswer?.find(
        (answer) => answer.answerKey === answerKey,
      )

      return {
        id: existingAnswer?.id ?? 0,
        questionId: currentQuestion.value!.id,
        answerKey,
      }
    })
  },
})

const correctAnswerText = computed(() => {
  if (!currentQuestion.value) return ''
  switch (currentQuestion.value.type) {
    case QuestionType.SingleChoice:
      return currentQuestion.value.singleAnswer?.answerKey
    case QuestionType.MultiChoice:
      return currentQuestion.value.multiChoiceAnswer?.map((ans) => ans.answerKey).join(',')
    case QuestionType.TrueFalse:
      return currentQuestion.value.trueFalseAnswer?.answerKey
    case QuestionType.Subjective:
      return currentQuestion.value.subjectiveAnswer?.reference
    default:
      return ''
  }
})
const questionTypeText = computed(() => {
  switch (currentQuestion.value?.type) {
    case QuestionType.SingleChoice:
      return '单选题'
    case QuestionType.MultiChoice:
      return '多选题'
    case QuestionType.TrueFalse:
      return '判断题'
    case QuestionType.Subjective:
      return '主观题'
    default:
      return ''
  }
})
const createCorrectAnswerText = computed(() => {
  switch (createForm.type) {
    case QuestionType.SingleChoice:
      return createForm.singleAnswer
    case QuestionType.MultiChoice:
      return createForm.multiChoiceAnswer.join(',')
    case QuestionType.TrueFalse:
      return createForm.trueFalseAnswer
    case QuestionType.Subjective:
      return createForm.subjectiveAnswer
    default:
      return ''
  }
})

const resetCreateAnswer = () => {
  createForm.singleAnswer = undefined
  createForm.multiChoiceAnswer = []
  createForm.trueFalseAnswer = undefined
  createForm.subjectiveAnswer = ''
}

const resetCreateForm = () => {
  createForm.type = QuestionType.SingleChoice
  createForm.content = ''
  createForm.explanation = ''
  createForm.riskLevel = 2
  createForm.options.forEach((option) => {
    option.text = ''
  })
  resetCreateAnswer()
}

const addQuestion = () => {
  resetCreateForm()
  createDialogVisible.value = true
}
const delQuestion = () => {
  if (!currentQuestion.value) return
  ElMessageBox.confirm('确定删除该题目吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteQuestion(currentQuestion.value!.id)
      .then(() => {
        ElMessage.success('删除成功')
        questions.value = questions.value.filter((item) => item.id !== currentQuestion.value!.id)
      })
      .catch(() => {
        ElMessage.error('删除失败')
      })
  })
}
const getCreateAnswer = () => {
  switch (createForm.type) {
    case QuestionType.MultiChoice:
      return createForm.multiChoiceAnswer
    case QuestionType.TrueFalse:
      return createForm.trueFalseAnswer
    case QuestionType.Subjective:
      return createForm.subjectiveAnswer
    default:
      return createForm.singleAnswer
  }
}

const createNewQuestion = async () => {
  const answer = getCreateAnswer()

  if (!createForm.content.trim()) {
    ElMessage.error('请输入题干')
    return
  }

  if (
    createForm.type !== QuestionType.Subjective &&
    createForm.options.some((option) => !option.text.trim())
  ) {
    ElMessage.error('请填写完整选项')
    return
  }

  if (!answer || (Array.isArray(answer) && answer.length === 0)) {
    ElMessage.error('请设置正确答案')
    return
  }

  const payload: CreateQuestionRequest = {
    type: createForm.type,
    content: createForm.content,
    options:
      createForm.type === QuestionType.Subjective
        ? []
        : createForm.options.map((option) => ({
            key: option.key,
            text: option.text,
          })),
    answer,
    bankId: Number(route.params.id as string) || 0,
    disciplineId: Number(route.query.disciplineId as string) || 0,
  }

  if (!payload.bankId || !payload.disciplineId) {
    ElMessage.error('缺少题库或学科信息')
    return
  }

  await createQuestion(payload)
  createDialogVisible.value = false
  ElMessage.success('创建成功')
  emits('update:refreshKey', props.refreshKey + 1)
}

const saveEdit = async () => {
  if (!currentQuestion.value) return
  const payload = {
    content: currentQuestion.value.content,
    explanation: currentQuestion.value.explanation,
    riskLevel: currentQuestion.value.riskLevel,
    options: currentQuestion.value.options.map((option) => ({
      key: option.key,
      text: option.text,
    })),
    singleAnswer: currentQuestion.value.singleAnswer?.answerKey,
    multiChoiceAnswer: currentQuestion.value.multiChoiceAnswer?.map((ans) => ans.answerKey),
    trueFalseAnswer: currentQuestion.value.trueFalseAnswer?.answerKey,
    subjectiveAnswer: currentQuestion.value.subjectiveAnswer?.reference,
  }
  await editQuestion(currentQuestion.value.id, payload)
  ElMessage.success('保存成功')
  emits('update:refreshKey', props.refreshKey + 1)
}
</script>

<style scoped lang="scss">
.main {
  padding: 24px;
  height: auto;
  overflow: auto;
  width: calc(100% - 264px);
  background-color: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.edit-toolbar {
  min-height: 52px;
  margin-bottom: 18px;
  padding: 0 4px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #eef2f7;
}

.toolbar-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;

  span {
    color: #1f2a3d;
    font-size: 20px;
    line-height: 28px;
    font-weight: 700;
  }

  em {
    color: #8a93a3;
    font-size: 14px;
    font-style: normal;
    line-height: 22px;
  }
}

.toolbar-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex: 0 0 auto;

  :deep(.el-button) {
    margin-left: 0;
    height: 36px;
    border-radius: 6px;
  }
}

.edit-section {
  background-color: #fff;
  padding: 8px 4px 0;
  margin-bottom: 18px;
}

.question {
  border-radius: 8px;
  border-bottom: 1px solid #ebebeb;
  padding-bottom: 8px;
}

.q-content {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 28px;
  position: relative;
  gap: 12px;

  .label {
    flex: 0 0 auto;
    background-color: #548ef7;
    border-radius: 4px;
    :deep(.el-select__wrapper) {
      width: 70px;
      font-size: 14px;
      font-weight: 500;
      line-height: 28px;
      padding: 0 8px;
      background-color: #548ef7;
      span {
        color: #fff;
      }
      svg {
        color: #fff;
      }
    }
  }

  .content-input {
    flex: 1;

    &:deep(.el-textarea__inner) {
      min-height: 44px !important;
      font-size: 20px;
      line-height: 30px;
    }
  }
}

.q-option {
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  .answer-editor {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .edit-option {
    width: 100%;
    display: grid;
    grid-template-columns: 40px 40px minmax(0, 1fr);
    align-items: center;
    gap: 10px;
  }

  .option-key {
    color: #333;
    font-size: 20px;
    line-height: 30px;
    font-weight: 500;
  }

  &:deep(.el-radio),
  &:deep(.el-checkbox) {
    height: 32px;
  }

  &:deep(.el-radio__inner),
  &:deep(.el-checkbox__inner) {
    width: 20px;
    height: 20px;
  }

  &:deep(.el-radio__inner::after) {
    width: 8px;
    height: 8px;
  }

  &:deep(.el-checkbox__inner::after) {
    left: 7px;
    top: 3px;
    width: 5px;
    height: 10px;
  }

  &:deep(.el-input__wrapper) {
    min-height: 42px;
  }

  &:deep(.el-input__inner) {
    font-size: 18px;
    line-height: 28px;
  }
}

.explanation {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  width: 100%;

  :deep(.el-input) {
    max-width: 520px;
  }
}

.explain {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid #ebebeb;
  .title {
    font-size: 16px;
    font-weight: bolder;
    line-height: 24px;
    color: #333;
    white-space: nowrap;
  }

  .answer-text {
    color: #63be64;
  }
}

.btns {
  padding: 14px 4px 0;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid #eef2f7;
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
  border-radius: 6px;
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
</style>

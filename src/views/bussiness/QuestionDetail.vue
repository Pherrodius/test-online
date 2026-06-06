<template>
  <div class="question-detail" :key="$route.fullPath">
    <div class="container">
      <DetailedQuestion v-if="question" :question="question" />
      <div v-else>加载中...</div>
      <BankRecord v-if="question" :bank="question.bank" :title="true" />
      <div v-else>加载中...</div>
      <div class="relatedQuestions">
        <div class="title">相关题目推荐</div>
        <div class="question">
          <div
            v-for="(item, index) in relatedQuestions?.filter((item) => item.id !== question?.id)"
            :key="index"
            class="list-item"
          >
            <div class="q-content">
              <div class="label">{{ questionTypeMap[item.type] }}</div>
              <div class="value">{{ item.content }}</div>
            </div>
            <div class="option">
              <div v-for="(option, index) in item.options" :key="index" class="option-item">
                {{ option.key }}、 {{ option.text }}
              </div>
            </div>
            <div class="btn">
              <el-button type="primary" size="default" @click="reloadQuestion(item.id)"
                >查看答案</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { QuestionType } from '@/types/prisma'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getQuestionDetail, getQuestionList } from '@/api/question'
import type { GetQuestionDetailResponse, GetQuestionListResponse } from '@/types/response'
import { useRouter } from 'vue-router'
import DetailedQuestion from '@/components/DetailedQuestion.vue'
import BankRecord from '@/components/BankRecord.vue'
const router = useRouter()
const route = useRoute()
const question = ref<GetQuestionDetailResponse | null>(null)
const relatedQuestions = ref<GetQuestionListResponse[]>([])
const questionTypeMap = ref({
  [QuestionType.SingleChoice]: '单选题',
  [QuestionType.MultiChoice]: '多选题',
  [QuestionType.TrueFalse]: '判断题',
  [QuestionType.Subjective]: '主观题',
})
const initialize = async () => {
  question.value = await getQuestionDetail(Number(route.params.id))
  relatedQuestions.value = await getQuestionList({
    bankId: question.value?.bankId,
    disciplineId: question.value?.disciplineId,
    number: 6,
  })
}
const reloadQuestion = async (id: number) => {
  await router.push(`/question/${id}`)
}
onMounted(async () => {
  await initialize()
})
</script>
<style scoped lang="scss">
.question-detail {
  background-color: #f5f5f5;
  padding: 24px;

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .main-section {
    background-color: #fff;
    padding: 24px;
  }

  .question {
    border-radius: 8px;
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 4px;

    .q-content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 24px;

      .label {
        font-size: 12px;
        font-weight: 350;
        line-height: 24px;
        color: #fff;
        background-color: #548ef7;
        padding: 2px 4px;
        border-radius: 4px;
        margin-right: 8px;
      }

      .value {
        font-size: 16px;
        line-height: 24px;
      }
    }

    .q-option {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;

      .checkbox {
        display: flex;
        align-items: center;

        .checkbox__label {
          display: inline-block;
          border-radius: 4px;
          width: 18px;
          height: 18px;
          margin-right: 12px;
          background-color: #fff;
          border: 1px solid #548ef7;
        }

        &.is-checked {
          .checkbox__label {
            background-color: #63be64;
          }
        }
      }

      .radio {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .radio__label {
          display: inline-block;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          margin-right: 12px;
          background-color: #fff;
          border: 1px solid #548ef7;
        }

        &.is-checked {
          .radio__label {
            background-color: #63be64;
          }
        }
      }
    }
  }

  .explain {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 16px;
    padding-bottom: 24px;
    border-bottom: 1px solid #ebebeb;

    .title {
      font-size: 16px;
      font-weight: bolder;
      line-height: 24px;
      color: #333;
    }
  }

  .log {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;

    .right {
      display: flex;
      align-items: center;
      gap: 16px;

      .log-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        line-height: 24px;
        color: #a9a9a9;
      }
    }
  }

  .relatedQuestions {
    padding: 24px;
    background-color: #fff;
    margin-top: 16px;

    .title {
      font-size: 16px;
      font-weight: bolder;
      line-height: 24px;
      color: #333;
      border-bottom: 1px solid #ebebeb;
      padding-bottom: 12px;
    }

    .list-item {
      border-bottom: 1px solid #ebebeb;
      padding-bottom: 16px;
      margin-bottom: 12px;

      &:last-child {
        border-bottom: none;
      }
    }

    .btn {
      margin-top: 24px;

      :deep(.el-button) {
        width: 12%;
      }
    }

    .option {
      margin-top: -8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 16px;

      .option-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}
</style>

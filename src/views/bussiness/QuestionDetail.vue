<template>
  <div class="question-detail" :key="route.fullPath">
    <div class="container">
      <div class="main-section">
        <div class="question">
          <div class="q-content">
            <div class="label">{{ questionTypeMap[question?.type || QuestionType.SingleChoice] }}</div>
            <div class="value">{{ question?.content || '' }}（ ）</div>
          </div>
          <div class="q-option" v-if="question?.type === QuestionType.MultiChoice">
            <div class="checkbox" v-for="(item, index) in question?.options" :value="item.key" :key="index" size="large"
              :class="{ 'is-checked': question?.multiChoiceAnswer?.map(ans => ans.answerKey).includes(item.key) || null }">
              <div class="checkbox__label">
                <el-icon size="16" color="#fff">
                  <Check />
                </el-icon>
              </div>
              <div>{{ item.key }}、 {{ item.text }}</div>
            </div>
          </div>
          <div class="q-option" v-if="question?.type === QuestionType.SingleChoice">
            <div class="radio" v-for="(item, index) in question?.options" :value="item.key" :key="index" size="large"
              :class="{ 'is-checked': question?.singleAnswer?.answerKey === item.key || null }">
              <div class="radio__label">
                <el-icon size="16" color="#fff">
                  <Check />
                </el-icon>
              </div>
              <div>{{ item.key }}、 {{ item.text }}</div>
            </div>
          </div>
          <div class="q-option" v-if="question?.type === QuestionType.TrueFalse">
            <div class="radio" v-for="(item, index) in question?.options" :value="item.key" :key="index" size="large"
              :class="{ 'is-checked': question?.trueFalseAnswer?.answerKey === item.key || null }">
              <div class="radio__label">
                <el-icon size="16" color="#fff">
                  <Check />
                </el-icon>
              </div>
              <div>{{ item.key }}、 {{ item.text }}</div>
            </div>
          </div>
        </div>
        <div class="explain">
          <div class="correct-answer"><span class="title">正确答案：</span><span
              style="color: #63BE64;">{{question?.singleAnswer?.answerKey ||
                question?.multiChoiceAnswer?.map(ans => ans.answerKey).join(',') ||
                question?.trueFalseAnswer?.answerKey || ''}}</span>
          </div>
          <div class="explanation"><span class="title">答案解析：</span>{{ question?.explanation || '该题目暂无解析内容~' }}</div>
        </div>
        <div class="log">
          <el-button type="warning" size="large">
            <el-icon style="font-size: 24px;">
              <Star />
            </el-icon>
            <span>加入收藏</span>
          </el-button>
          <div class="right">
            <div class="log-item">
              <el-icon size="16" color="#A9A9A9">
                <User />
              </el-icon>
              <div class="value">{{ question?.bank?.name || '' }}</div>
            </div>
            <div class="log-item">
              <el-icon size="16" color="#A9A9A9">
                <Clock />
              </el-icon>
              <div class="value">{{ dayjs(question?.createdTime).format('YYYY-MM-DD HH:mm:ss') || '' }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="bank">
        <div class="title">相关题库推荐</div>
        <div class="value" @click="router.push(`/bank/${question?.bankId}`)">
          <el-image :src="bankIcon" fit="contain" style="width: 32px; height: 32px; margin-right: 8px;" />
          <div class="text">
            <div class="upper">
              {{ question?.bank?.name || '' }}
            </div>
            <div class="lower">
              <div class="front">
                <el-icon size="16" color="#A9A9A9">
                  <Document />
                </el-icon> {{ question?.bank?.description || '' }}
              </div>
              <div class="back">
                <el-icon size="16" color="#A9A9A9">
                  <Clock />
                </el-icon> {{ dayjs(question?.createdTime).format('YYYY-MM-DD') || '' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="relatedQuestions">
        <div class="title">相关题目推荐</div>
        <div class="question">
          <div v-for="(item, index) in relatedQuestions?.filter(item => item.id !== question?.id)" :key="index"
            class="list-item">
            <div class="q-content">
              <div class="label">{{ questionTypeMap[item.type] }}</div>
              <div class="value">{{ item.content }}（ ）</div>
            </div>
            <div class="option">
              <div v-for="(option, index) in item.options" :key="index" class="option-item">
                {{ option.key }}、 {{ option.text }}
              </div>
            </div>
            <div class="btn">
              <el-button type="primary" size="default" @click="reloadQuestion(item.id)">查看答案</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { QuestionType } from '@/types/prisma';
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getQuestionDetail, getQuestionList } from '@/api/question'
import type { GetQuestionDetailResponse, GetQuestionsResponse } from '@/types/response'
import { dayjs } from 'element-plus';
import { useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const question = ref<GetQuestionDetailResponse>()
const relatedQuestions = ref<GetQuestionsResponse>()
const bankIcon = new URL('@/assets/icon/bank.png', import.meta.url).href
const questionTypeMap = ref({
  [QuestionType.SingleChoice]: '单选题',
  [QuestionType.MultiChoice]: '多选题',
  [QuestionType.TrueFalse]: '判断题'
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
  location.reload()
}
onMounted(async () => {
  await initialize()
})
</script>
<style scoped lang="scss">
.question-detail {
  background-color: #F5F5F5;
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
        background-color: #548EF7;
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
          border: 1px solid #548EF7;
        }

        &.is-checked {
          .checkbox__label {
            background-color: #63BE64;
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
          border: 1px solid #548EF7;
        }

        &.is-checked {
          .radio__label {
            background-color: #63BE64;
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
        color: #A9A9A9;
      }
    }
  }

  .bank {
    padding: 24px;
    background-color: #fff;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 16px;

    .title {
      font-size: 16px;
      font-weight: bolder;
      line-height: 24px;
      color: #333;
      border-bottom: 1px solid #ebebeb;
      padding-bottom: 12px;
    }

    .value {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;

      &:hover {
        .upper {
          color: #548EF7;
        }
      }

      &:hover {
        .lower {
          color: #548EF7;
        }
      }

      .upper {
        font-size: 16px;
        font-weight: bolder;
        line-height: 24px;
        color: #333;
      }

      .lower {
        width: 100%;
        font-size: 12px;
        line-height: 24px;
        color: #A9A9A9;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 16px;

        .front {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .back {
          display: flex;
          align-items: center;
          gap: 4px;
        }
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

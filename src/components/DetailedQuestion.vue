<template>
  <div class="main-section">
    <div class="question">
      <div class="q-content">
        <div class="index" v-if="index !== undefined">{{ index + 1 }}、</div>
        <div class="label">{{ questionTypeMap[question?.type || QuestionType.SingleChoice] }}</div>
        <div class="value">{{ question?.content || '' }}</div>
      </div>
      <div class="q-option" v-if="question?.type === QuestionType.MultiChoice">
        <div
          class="checkbox"
          v-for="(item, index) in question?.options"
          :value="item.key"
          :key="index"
          size="large"
          :class="{
            'is-checked':
              question?.multiChoiceAnswer?.map((ans) => ans.answerKey).includes(item.key) || null,
          }"
        >
          <div class="checkbox__label">
            <el-icon size="16" color="#fff">
              <Check />
            </el-icon>
          </div>
          <div>{{ item.key }}、 {{ item.text }}</div>
        </div>
      </div>
      <div class="q-option" v-if="question?.type === QuestionType.SingleChoice">
        <div
          class="radio"
          v-for="(item, index) in question?.options"
          :value="item.key"
          :key="index"
          size="large"
          :class="{ 'is-checked': question?.singleAnswer?.answerKey === item.key || null }"
        >
          <div class="radio__label">
            <el-icon size="16" color="#fff">
              <Check />
            </el-icon>
          </div>
          <div>{{ item.key }}、 {{ item.text }}</div>
        </div>
      </div>
      <div class="q-option" v-if="question?.type === QuestionType.TrueFalse">
        <div
          class="radio"
          v-for="(item, index) in question?.options"
          :value="item.key"
          :key="index"
          size="large"
          :class="{ 'is-checked': question?.trueFalseAnswer?.answerKey === item.key || null }"
        >
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
      <div class="correct-answer">
        <span class="title">正确答案：</span
        ><span style="color: #63be64">{{
          question?.singleAnswer?.answerKey ||
          question?.multiChoiceAnswer?.map((ans) => ans.answerKey).join(',') ||
          question?.trueFalseAnswer?.answerKey ||
          question?.subjectiveAnswer?.reference ||
          ''
        }}</span>
      </div>
      <div class="explanation"><span class="title">答案解析：</span>该题目暂无解析内容~</div>
      <div class="risklevel">
        <span>题目难度：</span>
        <el-rate v-model="question.riskLevel" :max="3" />
      </div>
    </div>
    <div class="log">
      <div>
        <el-button type="warning" size="large" @click="handleCollect">
          <el-icon style="font-size: 24px">
            <Check v-if="isCollected?.isNoted" />
            <Star v-else />
          </el-icon>
          <span>{{ isCollected?.isNoted ? '已收藏' : '加入收藏' }}</span>
        </el-button>
        <el-button type="danger" size="large" @click="handleMistake" v-if="isCollected?.isMistake">
          <el-icon style="font-size: 24px">
            <Close />
          </el-icon>
          <span>删除错题</span>
        </el-button>
      </div>
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
          <div class="value">
            {{ dayjs(question?.createdTime).format('YYYY-MM-DD HH:mm:ss') || '' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { QuestionType } from '@/types/prisma'
import { onMounted, ref } from 'vue'
import type { GetQuestionDetailResponse, isCollectionExistResponse } from '@/types/response'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { createCollection, deleteCollection, isCollectionExist } from '@/api/question'
const props = defineProps<{
  question: GetQuestionDetailResponse
  index?: number
}>()
const question = ref(props.question)
const isCollected = ref<isCollectionExistResponse | null>(null)
const questionTypeMap = ref({
  [QuestionType.SingleChoice]: '单选题',
  [QuestionType.MultiChoice]: '多选题',
  [QuestionType.TrueFalse]: '判断题',
  [QuestionType.Subjective]: '主观题',
})
const handleCollect = async () => {
  if (isCollected.value?.isNoted) {
    ElMessageBox.confirm('您想删除收藏吗？', '该题目已加入收藏，', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      deleteCollection(isCollected.value!.notedId!).then(() => {
        ElMessage.success('删除收藏成功')
        isCollected.value!.isNoted = false
        isCollected.value!.notedId = undefined
      })
    })
    return
  }
  try {
    await createCollection({
      questionId: question.value.id,
    })
    ElMessage.success('加入收藏成功')
  } catch (err) {
    console.log(err)
    ElMessage.error('加入收藏失败')
  }
}
const handleMistake = async () => {
  if (!isCollected.value?.isMistake) return
  ElMessageBox.confirm('您想删除错题吗？', '该题目已加入错题集，', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteCollection(isCollected.value!.mistakeId!).then(() => {
        ElMessage.success('删除错题成功')
        isCollected.value!.isMistake = false
        isCollected.value!.mistakeId = undefined
      })
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
onMounted(() => {
  question.value = props.question
  isCollectionExist(question.value.id).then((res) => {
    isCollected.value = res
  })
})
</script>
<style scoped lang="scss">
.main-section {
  background-color: #fff;
  padding: 24px;
  margin-bottom: 16px;
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
    position: relative;

    .index {
      position: absolute;
      top: 0;
      left: -24px;
      font-size: 16px;
      font-weight: 350;
      line-height: 24px;
      padding: 2px 4px;
      border-radius: 4px;
    }

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
  .risklevel {
    font-size: 16px;
    font-weight: bolder;
    line-height: 24px;
    color: #333;
    display: flex;
    align-items: center;
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
</style>

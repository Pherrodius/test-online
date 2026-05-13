<template>
  <div class="question-list">
    <el-menu :default-active="activeIndex" class="demo-menu-vertical-demo" mode="horizontal">
      <el-menu-item v-for="item in questionTypes" :key="item.index" :index="item.index"
        @click="activeIndex = item.index">{{ item.label }}</el-menu-item>
    </el-menu>
    <div class="list">
      <div class="list-item" v-for="item in paginatedQuestions" :key="item.id"
        @click="router.push(`/question/${item.id}`)">
        <div class="label">{{ questionTypeMap[item.type] }}</div>
        <div class="value">{{ item.content }}（ ）</div>
      </div>
    </div>
  </div>
  <el-pagination style="margin-top: 24px;display: flex;justify-content: center;" layout="  prev,pager, next,total"
    v-model:total="pagination.total" v-model:current-page="pagination.page" v-model:page-size="pagination.size"
    background=true @current-change="(page: number) => pagination.page = page" />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { QuestionType } from '@/types/prisma'
import { useRouter } from 'vue-router'
const router = useRouter()
const questionTypes = ref([
  { label: '全部', index: 'all' },
  { label: '单选', index: QuestionType.SingleChoice },
  { label: '多选', index: QuestionType.MultiChoice },
  { label: '判断', index: QuestionType.TrueFalse }
])
const questionTypeMap = ref({
  [QuestionType.SingleChoice]: '单选题',
  [QuestionType.MultiChoice]: '多选题',
  [QuestionType.TrueFalse]: '判断题'
})
const props = defineProps<{
  questions: {
    id: number
    type: QuestionType
    content: string
  }[],
}>()

const activeIndex = ref('all')
const filteredQuestions = computed(() => props.questions.filter(item => activeIndex.value === 'all' || item.type === activeIndex.value))
const pagination = ref({
  total: computed(() => props.questions.length),
  size: 5,
  page: 1,
})
const paginatedQuestions = computed(() => filteredQuestions.value.slice((pagination.value.page - 1) * pagination.value.size, pagination.value.page * pagination.value.size))
</script>
<style scoped lang="scss">
.question-list {
  background-color: #fff;

  .list-item {
    padding: 16px 0;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;

    &:hover {
      .value {
        color: #548EF7;
      }
    }

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

}
</style>

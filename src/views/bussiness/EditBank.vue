<template>
  <div class="test-paper">
    <div class="path">
      <el-breadcrumb separator="/" class="breadcrumb" :separator-icon="ArrowRight">
        <el-icon color="#999">
          <LocationInformation />
        </el-icon>
        <el-breadcrumb-item to="/" class="breadcrumb-item">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="`/bank/${testInfo?.bankId}`" class="breadcrumb-item"
          >题库</el-breadcrumb-item
        >
        <el-breadcrumb-item class="breadcrumb-item">编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="left">
        <TestLeftNavi
          :type="QuestionType.SingleChoice"
          :typedQuestions="singleQuestions"
          v-if="singleQuestions.length"
        />
        <TestLeftNavi
          :type="QuestionType.MultiChoice"
          :typedQuestions="multiQuestions"
          v-if="multiQuestions.length"
        />
        <TestLeftNavi
          :type="QuestionType.TrueFalse"
          :typedQuestions="trueFalseQuestions"
          v-if="trueFalseQuestions.length"
        />
      </div>
      <EditMain v-if="currentQuestion" />
    </div>
  </div>
</template>
<script setup lang="ts">
import EditMain from '@/components/EditMain.vue'
import { QuestionType, type Bank } from '@/types/prisma'
import TestLeftNavi from '@/components/TestLeftNavi.vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTestPaperStore } from '@/stores/testpaper'
import { storeToRefs } from 'pinia'
import { getBank, getDetailedQuestions } from '@/api/bank'
const testPaperStore = useTestPaperStore()
const route = useRoute()
const bank = ref<Bank | null>(null)
const {
  testInfo,
  questions,
  currentQuestion,
  singleQuestions,
  multiQuestions,
  trueFalseQuestions,
} = storeToRefs(testPaperStore)
onMounted(async () => {
  bank.value = await getBank(Number(route.params.id))
  // 获取题目
  questions.value = await getDetailedQuestions(
    Number(route.params.id),
    Number(route.query.disciplineId),
  )
  currentQuestion.value =
    singleQuestions.value[0] ??
    multiQuestions.value[0] ??
    trueFalseQuestions.value[0] ??
    questions.value[0] ??
    null
})
onUnmounted(() => testPaperStore.resetStore())
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
      overflow: auto;
      margin-right: 24px;
      background-color: #fff;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>

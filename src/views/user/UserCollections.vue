<template>
  <div class="user-page" :key="Number(isNote)" v-loading="loading">
    <div class="page-header">
      <div>
        <h2>{{ isNote ? '我的收藏' : '我的错题' }}</h2>
        <p>沉淀重点题目、解析和复习笔记。</p>
      </div>
      <el-button
        type="primary"
        :icon="RefreshRight"
        @click="$router.push({ path: '/test', query: { collectionType: type } })"
        >重新练习</el-button
      >
    </div>
    <section class="panel">
      <el-table :data="notes" row-key="id" style="width: 100%">
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="question-list">
              <el-table
                v-if="row.questions.length"
                :data="row.questions"
                row-key="id"
                size="small"
                border
              >
                <el-table-column label="题型" width="120">
                  <template #default="{ row: question }">
                    {{ getQuestionTypeText(question.type) }}
                  </template>
                </el-table-column>
                <el-table-column prop="content" label="题目内容" show-overflow-tooltip />
                <el-table-column prop="createdTime" label="创建时间" width="180">
                  <template #default="{ row: question }">
                    {{ dayjs(question.createdTime).format('YYYY-MM-DD HH:mm') }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                  <template #default="{ row: question }">
                    <span class="detail" @click="$router.push(`/question/${row.id}`)"
                      >查看答案</span
                    >
                    <span class="delete" @click="handleDelete(question)">删除</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-empty v-else description="暂无收藏题目" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="题库名称" />
        <el-table-column label="作者" width="180">
          <template #default="{ row }">
            <div class="large">{{ row.creator.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="收藏数量" width="180">
          <template #default="{ row }">
            <div class="large">{{ row.questions.length }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <span
              class="detail large"
              @click="
                $router.push({
                  path: `/collection/${type}`,
                  query: { bankId: row.id },
                })
              "
              >详情</span
            >
            <span
              class="detail large"
              @click="
                $router.push({
                  path: `/test`,
                  query: { bankId: row.id, collectionType: type },
                })
              "
              >练习</span
            >
            <span class="delete large" @click="handleClear(row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getGroupedCollections } from '@/api/user'
import { CollectionType, QuestionType, type Bank, type Question } from '@/types/prisma'
import { RefreshRight } from '@element-plus/icons-vue'
import type { GetGroupedCollectionsRes } from '@/types/response'
import { computed, ref, watch } from 'vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { deleteAllCollections } from '@/api/question'
const route = useRoute()
const loading = ref(false)
const notes = ref<GetGroupedCollectionsRes[]>([])
const type = computed(() => route.params.type as CollectionType)
const isNote = computed(() => type.value === CollectionType.Note)
const questionTypeMap = {
  [QuestionType.SingleChoice]: '单选题',
  [QuestionType.MultiChoice]: '多选题',
  [QuestionType.TrueFalse]: '判断题',
}

const getQuestionTypeText = (type: QuestionType) => questionTypeMap[type] ?? type
const handleDelete = (row: Question) => {
  ElMessageBox.confirm(`确定删除该${isNote.value ? '收藏' : '错题'}吗？`, '提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
  }).then(() => {
    deleteAllCollections({
      questionId: row.id,
      type: type.value,
    }).catch(() => {
      ElMessage.error('删除失败')
    })
  })
}
const handleClear = (row: Bank) => {
  ElMessageBox.confirm(`确定删除所有'${row.name}'${isNote.value ? '收藏' : '错题'}吗？`, '提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
  }).then(() => {
    deleteAllCollections({
      bankId: row.id,
      type: type.value,
    }).catch(() => {
      ElMessage.error('删除失败')
    })
  })
}
watch(
  type,
  async () => {
    loading.value = true
    notes.value = await getGroupedCollections(type.value)
    loading.value = false
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.user-page {
  padding: 24px;
}

.page-header,
.note-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(31, 45, 61, 0.06);
}

.page-header {
  display: flex;
  justify-content: space-between;
  padding: 24px;
  margin-bottom: 16px;

  h2 {
    margin: 0 0 8px;
  }

  p {
    margin: 0;
    color: #7a8699;
  }
}

.note-card {
  padding: 20px;
  margin-bottom: 16px;

  h3 {
    margin: 18px 0 8px;
    font-size: 17px;
  }

  p {
    min-height: 44px;
    margin: 0;
    color: #667085;
    line-height: 1.6;
  }
}

.note-head,
.note-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #98a2b3;
  font-size: 13px;
}

.panel {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(31, 45, 61, 0.06);
  padding: 16px;
}

.question-list {
  padding: 12px;
  background-color: #f8fafc;
}
.delete,
.detail {
  font-size: 12px;
  margin: 8px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.detail {
  color: #689ff7;
}
.delete {
  color: red;
}
.large {
  font-size: 16px;
  margin: 8px 16px;
}
</style>

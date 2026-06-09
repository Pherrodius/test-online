<template>
  <div class="user-page">
    <div class="page-header">
      <div>
        <h2>斩题记录</h2>
        <p>回顾每次练习结果，追踪正确答案和错误原因。</p>
      </div>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        clearable
      />
    </div>

    <section class="panel">
      <el-table class="full-width-table" :data="filteredResolutions">
        <el-table-column prop="updatedTime" label="日期" width="220">
          <template #default="{ row }">
            {{ dayjs(row.createdTime).format('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="题目" class="question-content" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="a-label" @click="$router.push(`/question/${row.questionId}`)">
              {{ row.question.content }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="题库" width="150">
          <template #default="{ row }">
            <div class="a-label" @click="$router.push(`/bank/${row.question.bankId}`)">
              {{ row.question.bank.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="学科" width="150">
          <template #default="{ row }">
            {{ row.question.discipline.name }}
          </template>
        </el-table-column>
        <el-table-column label="正误" width="120">
          <template #default="{ row }">
            {{ row.isCorrect ? '正确' : '错误' }}
          </template>
        </el-table-column>
        <el-table-column prop="takenTime" label="正确答案" show-overflow-tooltip width="120">
          <template #default="{ row }">
            {{
              Array.isArray(JSON.parse(row.correctAnswer))
                ? JSON.parse(row.correctAnswer).join(', ')
                : JSON.parse(row.correctAnswer)
            }}
          </template>
        </el-table-column>
        <el-table-column label="我的答案" width="120" show-overflow-tooltip>
          <template #default="{ row }">
            {{
              Array.isArray(JSON.parse(row.yourAnswer))
                ? JSON.parse(row.yourAnswer).join(', ')
                : JSON.parse(row.yourAnswer)
            }}
          </template>
        </el-table-column>
        <el-table-column label="删除记录" width="80">
          <template #default="{ row }">
            <el-button class="del-btn" @click="handleDelete(row.id)">
              <el-icon size="20px">
                <Delete />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Resolution } from '@/types/prisma'
import { Delete } from '@element-plus/icons-vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { deleteResolution, getResolutions } from '@/api/question'
const resolutions = ref<Resolution[]>([])
const dateRange = ref<[Date, Date] | null>(null)

const filteredResolutions = computed(() => {
  if (!dateRange.value) {
    return resolutions.value
  }

  const [startDate, endDate] = dateRange.value
  const startTime = dayjs(startDate).startOf('day').valueOf()
  const endTime = dayjs(endDate).endOf('day').valueOf()

  return resolutions.value.filter((item) => {
    const updatedTime = dayjs(item.updatedTime).valueOf()
    return updatedTime >= startTime && updatedTime <= endTime
  })
})

const handleDelete = (id: number) => {
  ElMessageBox.confirm('删除做题记录可能导致部分数据异常，确定继续吗？', '确定删除吗?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      try {
        deleteResolution(id)
      } catch (e) {
        console.log(e)
        ElMessage.error('删除失败')
      }
    })
    .then(() => {
      ElMessage.success('删除成功')
      resolutions.value = resolutions.value.filter((item) => item.id !== id)
    })
}
onMounted(async () => {
  resolutions.value = await getResolutions({ detailed: true })
})
</script>

<style scoped lang="scss">
.user-page {
  padding: 24px;
  flex: 1;
}

.page-header,
.panel {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(31, 45, 61, 0.06);
}
.a-label {
  margin: 0;
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
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

.panel {
  padding: 20px;
}
.full-width-table {
  width: 100%;
}
.del-btn {
  &:hover {
    background-color: red;
    :deep(.el-icon) {
      color: #fff;
    }
  }
}
.question-content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>

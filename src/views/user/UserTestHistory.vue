<template>
  <div class="user-page">
    <div class="page-header">
      <div>
        <h2>测试记录</h2>
        <p>回顾每次测试结果，追踪正确率和用时变化。</p>
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
      <el-table class="full-width-table" :data="filteredTestHistory">
        <el-table-column prop="createdTime" label="日期" width="220">
          <template #default="{ row }">
            {{ dayjs(row.createdTime).format('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="题库" width="150">
          <template #default="{ row }">
            <div class="a-label" @click="$router.push(`/bank/${row.bankId}`)">
              {{ row.bank.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="学科" width="150">
          <template #default="{ row }">
            {{ row.discipline.name }}
          </template>
        </el-table-column>
        <el-table-column prop="length" label="题量" width="120" />
        <el-table-column prop="takenTime" label="用时" width="180">
          <template #default="{ row }">
            {{ dayjs(row.takenTime).format('mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="正确率" min-width="150">
          <template #default="{ row }">
            <el-progress
              :percentage="Math.round(row.accuracy * 100)"
              :stroke-width="8"
              :color="row.accuracy >= 0.85 ? 'green' : row.accuracy >= 0.6 ? 'yellow' : 'red'"
            />
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
import { getTestHistory } from '@/api/user'
import type { TestHistory } from '@/types/prisma'
import { Delete } from '@element-plus/icons-vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { deleteTestHistory } from '@/api/user'
import { computed, onMounted, ref } from 'vue'
const testHistory = ref<TestHistory[]>([])
const dateRange = ref<[Date, Date] | null>(null)

const filteredTestHistory = computed(() => {
  if (!dateRange.value) {
    return testHistory.value
  }

  const [startDate, endDate] = dateRange.value
  const startTime = dayjs(startDate).startOf('day').valueOf()
  const endTime = dayjs(endDate).endOf('day').valueOf()

  return testHistory.value.filter((item) => {
    const createdTime = dayjs(item.createdTime).valueOf()
    return createdTime >= startTime && createdTime <= endTime
  })
})

const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      try {
        deleteTestHistory(id)
      } catch (e) {
        console.log(e)
        ElMessage.error('删除失败')
      }
    })
    .then(() => {
      ElMessage.success('删除成功')
      testHistory.value = testHistory.value.filter((item) => item.id !== id)
    })
}
onMounted(async () => {
  testHistory.value = await getTestHistory()
})
</script>

<style scoped lang="scss">
.user-page {
  padding: 24px;
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
</style>

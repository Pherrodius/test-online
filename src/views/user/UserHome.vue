<template>
  <div class="user-page">
    <div class="page-header">
      <div>
        <p class="eyebrow">学习概览</p>
        <h2>欢迎回来，继续保持节奏</h2>
      </div>
      <el-button type="primary" :icon="EditPen" @click="dialogVisible = true">开始练习</el-button>
    </div>

    <el-row :gutter="16" class="stats">
      <el-col v-for="item in stats" :key="item.label" :xs="24" :sm="12" :lg="6">
        <div class="stat-card">
          <el-icon :size="24" :color="item.color">
            <component :is="item.icon" />
          </el-icon>
          <div>
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="15">
        <section class="panel">
          <div class="panel-title">
            <h3>最近的测试</h3>
            <el-button text>查看全部</el-button>
          </div>
          <el-table :data="overview?.recentRecords" style="width: 100%">
            <el-table-column label="题库">
              <template #default="{ row }">
                {{ row.bank.name }}
              </template>
            </el-table-column>
            <el-table-column label="学科">
              <template #default="{ row }">
                {{ row.discipline.name }}
              </template>
            </el-table-column>
            <el-table-column label="正确率">
              <template #default="{ row }"> {{ row.accuracy * 100 }}% </template>
            </el-table-column>
            <el-table-column prop="takenTime" label="时间">
              <template #default="{ row }">
                {{ dayjs(row.takenTime).format('mm:ss') }}
              </template>
            </el-table-column>
          </el-table>
        </section>
      </el-col>
      <el-col :xs="24" :lg="9">
        <section class="panel">
          <div class="panel-title">
            <h3>待办提醒</h3>
          </div>
          <el-timeline>
            <el-timeline-item v-for="item in todos" :key="item" type="primary">
              {{ item }}
            </el-timeline-item>
          </el-timeline>
        </section>
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" title="Tips" width="500px" :before-close="handleDialogClose">
      <template #header>
        <h3>从收藏的题库开始吧</h3>
      </template>
      <div
        v-for="bank in overview?.collectedBank.map((b) => b.bank)"
        :key="bank.id"
        class="bank-item"
      >
        <BankRecord :bank="bank" :title="false" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getOverview } from '@/api/user'
import type { getOverviewResponse } from '@/types/response'
import { Collection, EditPen, Star, WarningFilled } from '@element-plus/icons-vue'
import { dayjs } from 'element-plus'
import { computed, markRaw, onMounted, ref } from 'vue'
import BankRecord from '@/components/BankRecord.vue'
const dialogVisible = ref(false)
const overview = ref<getOverviewResponse>()
const handleDialogClose = (done: () => void) => {
  done()
}
const stats = ref([
  {
    label: '累计练习',
    value: computed(() => `${overview.value?.practiceCount || 0}题`),
    icon: markRaw(EditPen),
    color: '#409eff',
  },
  {
    label: '错题数量',
    value: computed(() => `${overview.value?.mistakeCount || 0}题`),
    icon: markRaw(WarningFilled),
    color: '#f56c6c',
  },
  {
    label: '收藏题目',
    value: computed(() => `${overview.value?.noteCount || 0}题`),
    icon: markRaw(Star),
    color: '#e6a23c',
  },
  {
    label: '收藏题库',
    value: computed(() => `${overview.value?.collectedBank.length || 0}个`),
    icon: markRaw(Collection),
    color: '#67c23a',
  },
])
const todos = ['复习 12 道高频错题', '完善个人学习目标', '整理本周收藏题目', '上传新的练习文件']
onMounted(async () => {
  overview.value = await getOverview()
})
</script>

<style scoped lang="scss">
.user-page {
  padding: 24px;
}

.page-header,
.panel,
.stat-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(31, 45, 61, 0.06);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  margin-bottom: 16px;

  h2 {
    margin: 4px 0 0;
    font-size: 24px;
  }
}

.eyebrow {
  margin: 0;
  color: #409eff;
  font-size: 13px;
}

.stats {
  margin-bottom: 16px;
}

.stat-card {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 20px;
  margin-bottom: 16px;

  strong,
  span {
    display: block;
  }

  strong {
    font-size: 22px;
    color: #1f2d3d;
  }

  span {
    color: #7a8699;
    margin-top: 4px;
  }
}

.panel {
  padding: 20px;
  min-height: 320px;
  margin-bottom: 16px;
}

.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  h3 {
    margin: 0;
    font-size: 18px;
  }
}
:deep(.el-dialog) {
  padding: 12px 36px;
  border-radius: 24px;
  .el-dialog__body {
    min-height: 50vh;
    display: flex;
    gap: 12px;
    flex-direction: column;
    justify-content: flex-start;
  }
}
.bank-item {
  overflow: hidden;
  border-radius: 40px;
  background-color: #fff;
  box-shadow: 1px 2px 4px 1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 2px 4px 8px 2px rgba(84, 142, 247, 0.2);
    scale: 1.02;
  }
}
</style>

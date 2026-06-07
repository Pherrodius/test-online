<template>
  <div class="user-page">
    <div class="page-header">
      <div>
        <h2>我的题库</h2>
        <p>管理已创建、已收藏和正在学习的题库。</p>
      </div>
      <el-button type="primary" :icon="Plus" @click="dialogVisible = true">新建题库</el-button>
    </div>

    <el-menu default-active="全部" class="el-menu-demo" mode="horizontal">
      <el-menu-item
        v-for="item in menuItems"
        :key="item.index"
        :index="item.label"
        @click="fillterIndex = item.index"
        >{{ item.label }}</el-menu-item
      >
    </el-menu>
    <el-row class="bank-grid" :gutter="16">
      <el-col v-for="item in filterBanks" :key="item.name" :xs="24" :md="12" :xl="8">
        <article class="bank-card">
          <div class="bank-top">
            <h3>{{ item.name }}</h3>
            <div class="bank-tags">
              <el-tag type="success" v-if="item.created">已创建</el-tag>
              <el-tag type="warning" v-if="item.collected">已收藏</el-tag>
              <el-tag :type="typeMap(getProgress(item))" v-if="item.progress > 0"
                >{{ statusMap(getProgress(item)) }}
              </el-tag>
            </div>
          </div>
          <p>{{ item.description }}</p>
          <el-progress :percentage="getProgress(item)" />
          <div class="bank-foot">
            <span>{{ item.count }} 道题</span>
            <div class="bank-actions">
              <el-button
                v-if="item.created"
                text
                type="danger"
                :icon="Delete"
                @click="handleDelete(item)"
                >删除</el-button
              >
              <el-button text type="primary" @click="$router.push(`/bank/${item.id}`)"
                >进入题库</el-button
              >
            </div>
          </div>
        </article>
      </el-col>
      <el-col v-if="filterBanks?.length === 0" :span="24">
        <el-empty class="empty" description="暂无没有符合条件的题库~" />
      </el-col>
    </el-row>
    <EditBankDialog v-model="dialogVisible" />
  </div>
</template>

<script setup lang="ts">
import { deleteBank } from '@/api/bank'
import { getMyBanks } from '@/api/user'
import { Delete, Plus } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { GetMyBanksRes } from '@/types/response'
import EditBankDialog from '@/components/EditBankDialog.vue'
const dialogVisible = ref(false)
const banks = ref<GetMyBanksRes[]>()
const getProgress = (bank: GetMyBanksRes) => {
  if (bank.count <= 0) return 0

  return Math.min(Math.max(Math.round((100 * bank.progress) / bank.count), 0), 100)
}
const typeMap = (rate: number) => {
  if (rate >= 80) return 'success'
  if (rate >= 50) return 'warning'
  return 'danger'
}
const statusMap = (rate: number) => {
  if (rate >= 100) return '已完成'
  if (rate > 0) return '练习中'
}
const fillterIndex = ref(0)
const menuItems = [
  {
    label: '全部',
    index: 0,
  },
  {
    label: '创建',
    index: 1,
  },
  {
    label: '收藏',
    index: 2,
  },
  {
    label: '练习',
    index: 3,
  },
]

const filterBanks = computed(() => {
  switch (fillterIndex.value) {
    case 0:
      return banks.value
        ?.slice()
        .sort((a, b) => Number(b.collected) - Number(a.collected))
        .sort((a, b) => Number(b.created) - Number(a.created))
    case 1:
      return banks.value?.filter((item) => item.created)
    case 2:
      return banks.value?.filter((item) => item.collected)
    case 3:
      return banks.value?.filter((item) => item.progress > 0)
    default:
      return banks.value
  }
})
const handleDelete = (item: GetMyBanksRes) => {
  ElMessageBox.confirm(
    `该题库下的所有题目会被一并清除，无法恢复，是否继续`,
    `确定删除“${item.name}”题库吗？`,
    {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      type: 'warning',
    },
  )
    .then(async () => {
      await deleteBank(item.id)
      banks.value = banks.value?.filter((bank) => bank.id !== item.id)
      ElMessage.success('删除成功')
    })
    .catch(() => undefined)
}
onMounted(async () => {
  banks.value = await getMyBanks()
})
</script>

<style scoped lang="scss">
.user-page {
  padding: 24px;
}

.bank-grid {
  margin-top: 12px;
}

.page-header,
.bank-card {
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

.bank-card {
  padding: 20px;
  margin-bottom: 16px;

  p {
    min-height: 44px;
    color: #667085;
    line-height: 1.6;
  }
}

.bank-top,
.bank-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 18px;
  }
}

.bank-foot {
  margin-top: 12px;
  color: #98a2b3;
}
.bank-actions {
  display: flex;
  align-items: center;
  gap: 8px;

  :deep(.el-button) {
    margin-left: 0;
  }
}
.bank-tags {
  display: flex;
  gap: 8px;
}
.empty {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(31, 45, 61, 0.06);
  padding: 48px 24px;
  margin-top: 12px;
}
</style>

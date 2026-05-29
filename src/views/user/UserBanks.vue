<template>
  <div class="user-page">
    <div class="page-header">
      <div>
        <h2>我的题库</h2>
        <p>管理已创建、已购买和正在学习的题库。</p>
      </div>
      <el-button type="primary" :icon="Plus">新建题库</el-button>
    </div>

    <el-row :gutter="16">
      <el-col v-for="item in banks" :key="item.name" :xs="24" :md="12" :xl="8">
        <article class="bank-card">
          <div class="bank-top">
            <h3>{{ item.name }}</h3>
            <div class="bank-tags">
              <el-tag type="success" v-if="item.created">已创建</el-tag>
              <el-tag type="warning" v-if="item.collected">已收藏</el-tag>
              <el-tag :type="typeMap(item.progress / item.count)"
                >{{ statusMap(item.progress / item.count) }}
              </el-tag>
            </div>
          </div>
          <p>{{ item.description }}</p>
          <el-progress :percentage="item.progress" />
          <div class="bank-foot">
            <span>{{ item.count }} 道题</span>
            <el-button text type="primary" @click="$router.push(`/bank/${item.id}`)"
              >进入题库</el-button
            >
          </div>
        </article>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { getMyBanks } from '@/api/user'
import { Plus } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import type { GetMyBanksRes } from '@/types/response'
const banks = ref<GetMyBanksRes[]>()
const typeMap = (rate: number) => {
  if (rate >= 80) return 'success'
  if (rate >= 50) return 'warning'
  return 'danger'
}
const statusMap = (rate: number) => {
  if (rate >= 100) return '完成了！'
  return '练习中'
}
onMounted(async () => {
  banks.value = await getMyBanks()
})
</script>

<style scoped lang="scss">
.user-page {
  padding: 24px;
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
.bank-tags {
  display: flex;
  gap: 8px;
}
</style>

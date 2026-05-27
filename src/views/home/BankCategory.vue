<template>
  <div class="question-bank">
    <div class="container">
      <div class="left">
        <div class="left-top">
          <div
            class="bank-item"
            v-for="item in bankCategories"
            :key="item.id"
            :class="{ active: item.id === activeTab }"
            @click="$router.push(`/bank/category/${item.id}`)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="left-bottom">
          <div class="list-item" v-for="item in paginatedRecords" :key="item.id">
            <div class="item-content">
              <h3 class="item-title">{{ item.name }}</h3>
              <p class="item-meta">
                <span>{{ item.disciplines.length }}个科目</span>
                <span>{{ item.bankCollections?.length || 0 }}人收藏</span>
                <span>创建时间: {{ dayjs(item.createdTime).format('YYYY-MM-DD') }}</span>
              </p>
            </div>
            <el-button class="outline-btn" @click="$router.push(`/bank/${item.id}`)"
              >查看详情</el-button
            >
          </div>
        </div>
        <el-pagination
          style=" display: flex; justify-content: center;background-color : #fff;padding: 20px 0;border-radius: 4px;"
          layout="  prev,pager, next,total"
          :total="courseList?.length || 0"
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          background
          @current-change="(page: number) => (pagination.page = page)"
        />
      </div>
      <div class="right">
        <el-image :src="sidebarBanner" alt="题库学习推广" class="sidebar-banner" fit="cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllCategories, getBankList } from '@/api/bank'
import type { Category } from '@/types/prisma'
import type { GetBanksResponse } from '@/types/response'
import { dayjs } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import sidebarBanner from '@/assets/images/bank-category-sidebar.png'
const route = useRoute()
const activeTab = ref(0)
const pagination = ref({
  page: 1,
  size: 8,
})
const bankCategories = ref<Category[]>([{ id: 0, name: '全部题库' }])
const courseList = ref<GetBanksResponse['records']>()
watch(
  () => route.params.id,
  (newId) => {
    const id = Number(newId)
    if (isNaN(id) || id === 0) {
      activeTab.value = 0
      getBankList({}).then((data) => {
        courseList.value = data.records
      })
    } else {
      activeTab.value = id
      getBankList({ categoryId: id }).then((data) => {
        courseList.value = data.records
      })
    }
  },
  {
    immediate: true,
  },
)
const paginatedRecords = computed(() => {
  if (!courseList.value) return []
  const start = (pagination.value.page - 1) * pagination.value.size
  return courseList.value.slice(start, start + pagination.value.size)
})
onMounted(() => {
  getAllCategories().then((data) => {
    bankCategories.value = [{ id: 0, name: '全部题库' }, ...data].splice(0, 16)
  })
})
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

.question-bank {
  background-color: #f5f5f5;
}

.container {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;

  .left {
    width: 896px;
    padding: 20px;

    .left-top {
      padding: 24px 30px;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      background-color: #fff;
    }

    .left-bottom {
      margin-top: 16px;
        background-color: #fff;
      padding: 0;
      min-height: 400px;
      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
        .item-content {
          .item-title {
            font-size: 18px;
            font-weight: 400;
            color: #333;
            margin: 0 0 8px;
          }

          .item-meta {
            font-size: 14px;
            color: #999;
            margin: 0;

            span {
              margin-right: 20px;

              &:last-child {
                margin-right: 0;
              }
            }
          }
        }

        .outline-btn {
          border: 1px solid #008cff !important;
          color: #008cff !important;
          padding: 4px 16px !important;
          border-radius: 4px !important;
          background-color: #fff !important;

          &:hover {
            background-color: #008cff !important;
            border-color: #008cff !important;
            color: #fff !important;
          }
        }
      }
    }

    .bank-item {
      font-size: 16px;
      color: #666;
      padding: 5px 16px;
      margin: 0 0 8px;
      cursor: pointer;
      text-align: center;

      &:hover {
        color: #548ef7;
      }

      &.active {
        font-weight: bold;
        color: #548ef7;
        background-color: #ecf7fe;
      }
    }
  }

  .right {
    padding-top: 20px;

    .sidebar-banner {
      width: 288px;
      height: 566px;
      border-radius: 4px;
      background-color: #fff;
    }
  }
}
</style>

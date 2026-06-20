<template>
  <div class="bank-list">
    <div class="filter">
      <div class="dash">筛选</div>
      <el-form ref="formRef" :model="formData" :inline="true">
        <el-form-item prop="time">
          <el-select v-model="formData.time" placeholder="时间">
            <el-option label="全部" value="" />
            <el-option label="一周内" value="week" />
            <el-option label="一个月内" value="month" />
            <el-option label="一年内" value="year" />
          </el-select>
        </el-form-item>
        <el-form-item prop="questionCount">
          <el-select v-model="formData.questionCount" placeholder="题量">
            <el-option label="全部" value="" />
            <el-option label="1-100" value="1-100" />
            <el-option label="101-200" value="101-200" />
            <el-option label="201-500" value="201-500" />
            <el-option label="500+" value="500+" />
          </el-select>
        </el-form-item>
        <el-form-item prop="collectedCount">
          <el-select v-model="formData.collectedCount" placeholder="收藏数">
            <el-option label="全部" value="" />
            <el-option label="1-10" value="1-10" />
            <el-option label="11-25" value="11-25" />
            <el-option label="26-100" value="26-100" />
            <el-option label="100+" value="100+" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <div
        class="list-item"
        v-for="bank in result?.records as import('@/types/response').SearchBanksRes['records']"
        :key="bank.id"
      >
        <div class="item-main">
          <div class="item-title">
            <span>{{ bank.name }}</span>
            <span class="type-tag">{{ bank._count.disciplines }}个学科</span>
          </div>
          <div class="item-description">{{ bank.description }}</div>
          <div class="item-meta">
            <span>{{ bank.creator.name }}</span>
            <span>{{ bank._count.questions }}题</span>
            <span>{{ bank._count.bankCollections }}人收藏</span>
            <span>{{ dayjs(bank.createdTime).format('YYYY-MM-DD') }}</span>
          </div>
        </div>
        <el-button class="detail-btn" @click="$router.push(`/bank/${bank.id}`)">查看详情</el-button>
      </div>
      <el-skeleton
        :rows="3"
        v-for="i in result?.records && result?.records?.length > 0 ? 0 : 5"
        :key="i"
        animated
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { SearchBanksReq } from '@/types/reqeust'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'
import { dayjs } from 'element-plus'
import { filterAttributes } from '@/hooks/useFilterAttributes'
const searchStore = useSearchStore()
const { filterOptions, result } = storeToRefs(searchStore)
const formData = reactive<Omit<SearchBanksReq, 'page' | 'keyword'>>({
  time: undefined,
  questionCount: undefined,
  collectedCount: undefined,
})
watch(
  () => formData,
  () => {
    filterOptions.value = filterAttributes(formData)
    searchStore.handleSearchFromFirstPage()
  },
  {
    deep: true,
  },
)
</script>
<style scoped lang="scss">
.bank-list {
  margin-top: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.filter {
  min-height: 76px;
  padding: 0 36px;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #e5e7eb;
  gap: 40px;
}

.dash {
  flex: 0 0 auto;
  color: #8a8f99;
  font-size: 16px;
  line-height: 1;
}

:deep(.el-form) {
  display: flex;
  align-items: center;
  gap: 56px;
}

:deep(.el-form--inline .el-form-item) {
  margin: 0;
}

:deep(.el-select) {
  width: 78px;
}

:deep(.el-select__wrapper) {
  min-height: 36px;
  padding: 0;
  box-shadow: none;
  background-color: transparent;
}

:deep(.el-select__placeholder),
:deep(.el-select__selected-item) {
  color: #111827;
  font-size: 16px;
  font-weight: 400;
}

:deep(.el-select__caret) {
  color: #111827;
  font-size: 16px;
}

.list {
  min-height: 240px;
  padding: 8px 12px;
}

.list-item {
  position: relative;
  min-height: 104px;
  padding: 18px 24px 18px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border-radius: 8px;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &::before {
    position: absolute;
    left: 12px;
    top: 22px;
    bottom: 22px;
    width: 3px;
    border-radius: 999px;
    background-color: #d8e6ff;
    content: '';
    transition:
      background-color 0.2s ease,
      bottom 0.2s ease,
      top 0.2s ease;
  }

  & + .list-item {
    margin-top: 8px;
  }

  &:hover {
    background-color: #f7faff;
    box-shadow: 0 8px 20px rgba(25, 140, 255, 0.1);
    transform: translateY(-1px);

    &::before {
      top: 18px;
      bottom: 18px;
      background-color: #198cff;
    }
  }
}

.item-main {
  min-width: 0;
  flex: 1;
}

.item-title {
  color: #111827;
  font-size: 17px;
  line-height: 24px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-description {
  margin-top: 6px;
  color: #8a93a3;
  font-size: 13px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  margin-top: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: #7b8494;
  font-size: 13px;
  line-height: 20px;

  span {
    padding: 2px 8px;
    border-radius: 999px;
    background-color: #f3f6fa;
  }
}

.detail-btn {
  flex: 0 0 auto;
  width: 108px;
  height: 36px;
  border-radius: 8px;
  border-color: #7aa7ff;
  color: #276dff;
  background-color: #fff;
  font-size: 15px;
  font-weight: 500;

  &:hover {
    border-color: #198cff;
    background-color: #198cff;
    color: #fff;
  }
}
.type-tag {
  margin-left: 8px;
  flex: 0 0 auto;
  padding: 3px 8px;
  border-radius: 999px;
  background-color: #eaf3ff;
  color: #198cff;
  font-size: 13px;
  line-height: 18px;
  font-weight: 600;
}
</style>

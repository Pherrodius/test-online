<template>
  <div class="bank">
    <div class="title" v-if="props.title">相关题库推荐</div>
    <div class="value" @click="router.push(`/bank/${bank?.id}`)">
      <div class="bank-icon">
        <el-image :src="bankIcon" fit="contain" />
      </div>
      <div class="text">
        <div class="upper">
          {{ bank?.name || '' }}
        </div>
        <div class="lower">
          <div class="front">
            <el-icon size="16" color="#A9A9A9">
              <Document />
            </el-icon>
            {{ bank?.description || '' }}
          </div>
          <div class="back">
            <el-icon size="16" color="#A9A9A9">
              <Clock />
            </el-icon>
            {{ dayjs(bank?.createdTime).format('YYYY-MM-DD') || '' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Bank } from '@/types/prisma'
import { dayjs } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps<{
  bank: Bank | null
  title: boolean
}>()
const bankIcon = new URL('@/assets/icon/bank.png', import.meta.url).href
</script>
<style lang="scss" scoped>
.bank {
  padding: 24px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;

  .title {
    font-size: 16px;
    font-weight: bolder;
    line-height: 24px;
    color: #333;
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 12px;
  }

  .value {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    cursor: pointer;

    &:hover {
      .upper {
        color: #548ef7;
      }
    }

    &:hover {
      .lower {
        color: #548ef7;
      }
    }

    .bank-icon {
      width: 32px;
      height: 32px;
      margin-right: 8px;
      flex: 0 0 32px;
    }

    .text {
      min-width: 0;
      flex: 1;
    }

    .upper {
      font-size: 16px;
      font-weight: bolder;
      line-height: 24px;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .lower {
      width: 100%;
      font-size: 12px;
      line-height: 24px;
      color: #a9a9a9;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 16px;
      .front {
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        max-width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .back {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}
</style>

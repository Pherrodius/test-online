<template>
  <div class="question-bank">
    <div class="container">
      <div class="left">
        <div class="left-top">
          <div class="bank-item" v-for="item in bankList" :key="item.key" :class="{ 'active': item.key === activeTab }"
            @click="activeTab = item.key">
            {{ item.label }}</div>
        </div>
        <div class="left-bottom">
          <div class="list-item" v-for="item in courseList" :key="item.id">
            <div class="item-content">
              <h3 class="item-title">{{ item.title }}</h3>
              <p class="item-meta">
                <span>{{ item.subjects }}个科目</span>
                <span>{{ item.favorites }}人收藏</span>
                <span>{{ item.date }}</span>
              </p>
            </div>
            <el-button class="outline-btn">查看详情</el-button>
          </div>
        </div>
      </div>
      <div class="right">
        <el-image :src="logoImg" alt="logo" style="width: 288px;height: 566px;background-color: #fff;" cover />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('全部题库')

const logoImg = new URL('https://resource-cdn.kaoshibao.com/pc/logo/www.kaoshibao.com2.svg', import.meta.url).href
const bankList = ref([
  { key: '全部题库', label: '全部题库' },
  { key: '计算机', label: '计算机' },
  { key: 'web开发', label: 'web开发' },
])

const courseList = ref([
  { id: 1, title: '建筑焊工', subjects: 1, favorites: 447, date: '2026-03-26' },
  { id: 2, title: '供水管道检漏工', subjects: 1, favorites: 114, date: '2025-04-17' },
  { id: 3, title: '注册电气工程师', subjects: 5, favorites: 6077, date: '2026-04-14' },
])
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

.question-bank {
  background-color: #F5F5F5;
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
      padding: 0 20px;

      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

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
          border: 1px solid #008CFF !important;
          color: #008CFF !important;
          padding: 4px 16px !important;
          border-radius: 4px !important;
          background-color: #fff !important;

          &:hover {
            background-color: #008CFF !important;
            border-color: #008CFF !important;
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
        color: #548EF7;
      }

      &.active {
        font-weight: bold;
        color: #548EF7;
        background-color: #ECF7FE;
      }
    }
  }
}
</style>

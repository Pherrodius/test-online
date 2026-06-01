<template>
  <div class="common-layout">
    <el-container>
      <el-header><SearchNavi /></el-header>
      <el-main>
        <div class="container">
          <div class="left">
            <div class="input-box">
              <div class="tab">
                <div
                  class="tab-item"
                  v-for="item in searchTabs"
                  :key="item.key"
                  :class="{ active: currentType === item.key }"
                  @click="setSearchType(item.key)"
                >
                  {{ item.label }}
                </div>
              </div>
              <div class="text-area">
                <el-input
                  type="textarea"
                  v-model="currentInput"
                  placeholder="搜索题库、题目、文档、用户"
                  @keydown.enter.exact.prevent="handleSearchFromFirstPage()"
                  row="3"
                />
                <div class="clear-btn" v-if="currentInput.length > 0" @click="currentInput = ''">
                  清除
                </div>
              </div>
              <div class="search-btn">
                <el-button @click="handleSearchFromFirstPage()">搜索</el-button>
              </div>
            </div>
            <router-view></router-view>
            <div class="pagination-bar" v-if="hasPagination">
              <el-pagination
                background
                layout="total, prev, pager, next, jumper"
                :total="total"
                :page-size="10"
                v-model:current-page="page"
                @current-change="handlePageChange"
              />
            </div>
          </div>
          <div class="right">
            <el-image :src="searchSideIllustration" alt="" cover />
          </div>
        </div>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import SearchNavi from '@/components/SearchNavi.vue'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'
import searchSideIllustration from '@/assets/images/search-side-illustration.png'
const searchStore = useSearchStore()
const { searchTabs, currentType, currentInput, page, total, hasPagination } =
  storeToRefs(searchStore)
const { setSearchType, handleSearchFromFirstPage, handlePageChange } = searchStore
</script>
<style scoped lang="scss">
.common-layout {
  background-color: #f5f5f5;
}
.el-header,
.el-main,
.el-footer {
  margin: 0;
  padding: 0;
}

.el-main {
  overflow: visible;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.left {
  width: 896px;
  padding: 0;
  min-height: 60vh;
  .input-box {
    display: flex;
    flex-direction: column;
    padding: 24px;
    height: 240px;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    .tab {
      padding: 0 16px;
      display: flex;
      gap: 8px;
      .tab-item {
        position: relative;
        width: 60px;
        height: 32px;
        border-radius: 8px;
        background-color: #fff;
        color: #333;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        &.active {
          background-color: #198cff;
          color: #fff;
          &::after {
            position: absolute;
            bottom: 0;
            transform: translate(0, 110%);
            content: '';
            width: 0;
            height: 0;
            border-top: 8px solid #198cff;
            border-right: 8px solid transparent;
            border-left: 8px solid transparent;
          }
        }
      }
    }
  }
  .text-area {
    position: relative;
    margin-top: 20px;
    height: 96px;
    border-radius: 12px;
    border: #333 1.5px solid;
    padding: 12px 24px;
    :deep(.el-textarea__inner) {
      height: 80%;
      font-size: 16px;
      resize: none;
      box-shadow: none;
      border: none;
      &::placeholder {
        font-size: 16px;
      }
    }
    .clear-btn {
      position: absolute;
      right: 5%;
      bottom: 10%;
      background-color: #f5f5f7;
      width: 52px;
      height: 32px;
      color: #333;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .search-btn {
    :deep(.el-button) {
      margin-top: 24px;
      height: 40px;
      width: 100%;
      background-color: #198cff;
      border-radius: 12px;
      color: #fff;
      font-size: 16px;
      font-weight: 500;
      &:active {
        background-color: #111cff;
      }
    }
  }
}
.pagination-bar {
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0 0;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}
.right {
  position: sticky;
  top: 16px;
  width: 288px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  :deep(.el-image) {
    width: 100%;
    display: block;
  }
}
</style>

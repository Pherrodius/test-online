<template>
  <div class="header">
    <div class="header-container">
      <div class="clear-fix">
        <div class="logo">
          <el-image :src="logoImg" alt="" fit="contain" style="width: 148px;
        height: 80px;" />
        </div>
        <div class="search-container">
          <div class="search-tab">
            <div v-for="tab in tabs" :key="tab.key" class="tab-item" :class="{ active: activeTab === tab.key }"
              @click="handleTabClick(tab.key)">
              {{ tab.label }}
            </div>
          </div>
          <div class="input-box flex-box">
            <div class="input-content">
              <el-input placeholder="请输入搜索内容" />
            </div>
            <el-button type="primary" style="height: 32px;width: 64px; border-radius: 0 4px 4px 0;"
              color="#008CFF">搜索</el-button>
          </div>
        </div>
        <div class="login-box flex-box">
          <el-button class="btn login-btn">登录</el-button>
          <el-button class="btn register-btn" type="primary" color="#008CFF">注册</el-button>
        </div>
      </div>
      <el-menu class="menu" mode="horizontal" default-active="全部" router>
        <el-menu-item class="menu-item" v-for="tab in tabs" :key="tab.key" :index="tab.key">{{ tab.label
        }}</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('全部')

const tabs = ref([
  { key: '/', label: '全部' },
  { key: 'questionBank', label: '题库' },
  { key: 'document', label: '文档' },
  { key: 'author', label: '作者' },
  { key: 'collect', label: '收藏' },
  { key: 'error', label: '错题' },
])

const logoImg = new URL('https://resource-cdn.kaoshibao.com/pc/logo/www.kaoshibao.com2.svg', import.meta.url).href

const handleTabClick = (key: string) => {
  activeTab.value = key
}
</script>

<style scoped lang="scss">
$color-blue: #008CFF;
$color-bg: #F5F5F5;

* {
  box-sizing: border-box;
}

.flex-box {
  display: flex;
}

.header {
  border-bottom: 1px solid #E5E5E5;

  .header-container {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    .menu {
      height: 52.67px;
      border-bottom: 0;
    }

    .menu-item {
      height: 52.67px;
      font-size: 16px;
      font-weight: 350;
      color: #333;
    }

    .clear-fix {
      position: relative;
      display: flex;
      align-items: center;

      .search-container {
        padding: 12px 0 12px 172px;

        .search-tab {
          display: flex;
          height: 24px;
          justify-content: flex-start;
          align-items: center;

          .tab-item {
            height: 24px;
            width: 50px;
            font-size: 13px;
            line-height: 20px;
            padding: 2px 12px;
            border-radius: 4px 4px 0 0;
            cursor: pointer;

            &.active {
              background-color: $color-blue;
              color: #fff;
            }
          }
        }

        .input-box {

          .input-content {
            :deep(.el-input__wrapper) {
              width: 470px;
              height: 30px;
              border-radius: 0;
              border: $color-blue;
            }
          }
        }
      }

      .login-box {
        position: absolute;
        right: 0;
        bottom: 12px;
        width: 142px;
        height: 32px;

        .btn {
          height: 32px;
          width: 65px;
          font-size: 14px;
          font-weight: 350;

          &.login-btn {
            color: rgb(25, 140, 255);
            border-color: rgb(25, 140, 255);
          }

          &.register-btn {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>

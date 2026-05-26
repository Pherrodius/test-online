<template>
  <div class="header">
    <div class="container">
      <div class="menu">
        <div
          v-for="item in menuItems"
          :key="item.path"
          class="menu-item"
          @click="router.push(item.path)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="right">
        <div class="search-box">
          <el-input
            placeholder="请输入搜索内容"
            prefix-icon="el-icon-search"
            v-model="queryItem.input"
          >
            <template #prepend>
              <el-select placeholder="请选择搜索类型" v-model="queryItem.searchType">
                <el-option label="题目" value="question" />
                <el-option label="题库" value="bank" />
                <el-option label="文档" value="document" />
                <el-option label="作者" value="author" />
              </el-select>
            </template>
            <template #append>
              <el-button color="primary">
                <el-icon style="color: black">
                  <Search />
                </el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
        <div class="login-box" v-if="!isLogin">
          <el-button class="login-btn" @click="router.push('/auth/login')">登录</el-button>
          <el-button type="primary" class="register-btn" @click="router.push('/auth/register')"
            >注册</el-button
          >
        </div>
        <div class="login-box" v-else>
          <el-avatar :src="avatar" size="small" />
          <span class="user-name">{{ userInfo!.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
const userInfo = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo')!)
  : null
const isLogin = computed(() => !!userInfo)
const avatar = new URL('@/assets/images/def-head.png', import.meta.url).href
const router = useRouter()
const menuItems = ref([
  {
    name: '首页',
    path: '/',
  },
  {
    name: '题目',
    path: '/question',
  },
  {
    name: '题库',
    path: '/bank',
  },
  {
    name: '文档',
    path: '/document',
  },
  {
    name: '联系我们',
    path: '/contact',
  },
])
const queryItem = ref({
  searchType: 'bank',
  input: '',
})
</script>

<style scoped lang="scss">
html,
* {
  box-sizing: border-box;
}

.header {
  width: 100%;
  height: 48px;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;

  .container {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .menu {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .menu-item {
        font-size: 14px;
        font-weight: 350;
        padding: 12px 16px;
        cursor: pointer;
      }
    }

    .right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 32px;

      &:deep(.el-input__inner) {
        padding-left: 0px;
        width: 360px;
      }

      .el-input-group__append button {
        background-color: #fff;
        border-color: #dddfe5;
        border-left: none;
        border-radius: 0 4px 4px 0;
      }

      &:deep(.el-input__wrapper) {
        border-top: 1px solid #dddfe5;
        border-bottom: 1px solid #dddfe5;
        padding: 0 12px;
        box-shadow: none;
      }

      &:deep(.el-input__prefix-inner) {
        width: 4px;
      }

      .el-input-group__prepend {
        background-color: #fff;
        border-right: none;
        box-shadow: none;

        div.el-select {
          background-color: #fff;
          border: none;
          width: 75px;
        }

        .el-select__wrapper {
          border: none;
        }
      }
    }
  }

  .login-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
  }
}
</style>

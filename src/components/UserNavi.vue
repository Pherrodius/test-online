<template>
  <div class="header">
    <div class="container">
      <div class="menu">
        <el-image
          class="logo"
          style="width: 200px; height: 64px"
          :src="logo"
          fit="cover"
          @click="$router.push('/')"
        />
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
            v-model="currentInput"
          >
            <template #prepend>
              <el-select v-model="currentType" @change="setSearchType">
                <el-option label="题库" :value="SearchType.Bank" />
                <el-option label="题目" :value="SearchType.Question" />
                <el-option label="文档" :value="SearchType.Document" />
                <el-option label="用户" :value="SearchType.User" />
              </el-select>
            </template>
            <template #append>
              <el-button color="primary" @click="handleSearch(currentInput)">
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
        <div v-else>
          <el-dropdown>
            <div class="login-box" @click="$router.push('/user')">
              <el-avatar :src="avatar" />
              <span class="user-name">{{ userInfo!.name }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">
                  <el-icon>
                    <SwitchButton />
                  </el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { SwitchButton } from '@element-plus/icons-vue'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'
import { SearchType } from '@/types/prisma'
const searchStore = useSearchStore()
const logo = new URL('@/assets/images/GPTLOGO.png', import.meta.url).href
const { currentType, currentInput } = storeToRefs(searchStore)
const { handleSearch, setSearchType } = searchStore
const userInfo = computed(() =>
  localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null,
)
const avatar = computed(() =>
  userInfo.value.avatarUrl
    ? new URL(userInfo.value.avatarUrl, import.meta.url).href
    : new URL('@/assets/images/def-head.png', import.meta.url).href,
)
const isLogin = computed(() => !!userInfo.value)
console.log(JSON.parse(localStorage.getItem('userInfo') || '').avatarUrl)
const router = useRouter()
const menuItems = ref([
  {
    name: '题目',
    path: '/questions',
  },
  {
    name: '题库',
    path: '/bank/category',
  },
  {
    name: '文档',
    path: '/documents',
  },
  {
    name: '联系我们',
    path: '/contact',
  },
])
const handleLogout = () => {
  localStorage.removeItem('userInfo')
  localStorage.removeItem('token')
  ElMessage.success('退出登录成功')
  router.push('/auth/login')
}
</script>

<style scoped lang="scss">
html,
* {
  box-sizing: border-box;
}

.header {
  width: 100%;
  height: 64px;
  background-color: #fff;
  border-bottom: 2px solid #e5e5e5;

  .container {
    width: 100%;
    height: 100%;
    padding: 0 36px 0 12px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .menu {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .logo {
        cursor: pointer;
      }
      .menu-item {
        font-size: 16px;
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
    cursor: pointer;
    .user-name {
      padding-left: 12px;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
@media (max-width: 767px) {
  .header {
    .container {
      .menu {
        display: none;
      }
    }
  }
}
</style>

<template>
  <div class="header">
    <div class="container">
      <div class="menu">
        <el-image class="logo" :src="logo" fit="cover" @click="$router.push('/')" />
        <div
          v-for="item in menuItems"
          :key="item.path"
          class="menu-item"
          @click="router.push(item.path)"
        >
          {{ item.name }}
        </div>
        <div class="expand" @click="expandVisible = !expandVisible"><span></span></div>
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
                <el-icon class="search-icon">
                  <Search />
                </el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
        <div class="login-box" v-if="!isLogin">
          <el-button class="login-btn" :size="buttonSize" @click="router.push('/auth/login')"
            >登录</el-button
          >
          <el-button
            type="primary"
            class="register-btn"
            :size="buttonSize"
            @click="router.push('/auth/register')"
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
      <div v-if="expandVisible" class="expand-menu">
        <el-menu :default-active="activeMenu" class="el-menu-vertical" @select="handleSelect">
          <el-menu-item v-for="item in menuList" :key="item.path" :index="item.path">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            {{ item.name }}
          </el-menu-item>
        </el-menu>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, markRaw, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Clock,
  CloseBold,
  Collection,
  Document,
  Setting,
  Star,
  User,
  House,
  EditPen,
  SwitchButton,
} from '@element-plus/icons-vue'
import { useSearchStore } from '@/stores/search'
import { useUserSessionStore } from '@/stores/userSession'
import { storeToRefs } from 'pinia'
import { SearchType } from '@/types/prisma'
import { ElMessageBox } from 'element-plus'
const expandVisible = ref(false)
const searchStore = useSearchStore()
const userSessionStore = useUserSessionStore()
const logo = new URL('@/assets/images/GPTLOGO.png', import.meta.url).href
const { currentType, currentInput } = storeToRefs(searchStore)
const { userInfo, avatar, isLogin, buttonSize } = storeToRefs(userSessionStore)
const { handleSearch, setSearchType } = searchStore
const { logout: handleLogout } = userSessionStore
const router = useRouter()
const route = useRoute()
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

const menuList = ref([
  { name: '首页', path: '/user', icon: markRaw(House) },
  { name: '我的题库', path: '/user/banks', icon: markRaw(Collection) },
  { name: '我的文件', path: '/user/documents', icon: markRaw(Document) },
  { name: '全部错题', path: '/user/collections/Mistake', icon: markRaw(CloseBold) },
  { name: '我的收藏', path: '/user/collections/Note', icon: markRaw(Star) },
  { name: '测试记录', path: '/user/testHistory', icon: markRaw(Clock) },
  { name: '斩题记录', path: '/user/resolutions', icon: markRaw(EditPen) },
  { name: '个人信息', path: '/user/profile', icon: markRaw(User) },
  { name: '设置', path: '/user/settings', icon: markRaw(Setting) },
  { name: '退出登录', path: '/logout', icon: markRaw(SwitchButton) },
])

const activeMenu = computed(() => route.path)

const handleSelect = async (path: string) => {
  if (path === '/logout') {
    await ElMessageBox.confirm('确定退出登录吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    return
  }
  router.push(path)
  expandVisible.value = false
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
        width: 200px;
        height: 64px;
        cursor: pointer;
      }
      .menu-item {
        white-space: nowrap;
        font-size: 16px;
        font-weight: 350;
        padding: 12px 16px;
        cursor: pointer;
      }
      .expand {
        display: none;
        @media (max-width: 767px) {
          position: absolute;
          width: 40px;
          height: 40px;
          cursor: pointer;
          border-radius: 50%;
          background-color: #fff;
          box-shadow: #dddfe5 0 0 8px 0;
          border: 0.0625rem solid rgba(17, 24, 39, 0.08);
          right: 12px;
          display: block;
        }
        ::before {
          position: absolute;
          content: '';
          display: block;
          top: 33%;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          background-color: #333;
          border-radius: 2px;
        }
        ::after {
          position: absolute;
          content: '';
          bottom: 33%;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          background-color: #333;
          border-radius: 2px;
        }
      }
    }

    .right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 32px;

      .search-icon {
        color: #000;
      }

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
      .menu-item {
        padding: 8px 12px !important;
      }
      .right {
        display: none;
      }
    }
  }
  .expand-menu {
    transition: all 0.3s ease;
  }
  .el-menu-vertical {
    z-index: 999;
    position: absolute;
    top: 62px;
    right: 0;
    height: calc(100svh - 62px);
    width: 100svw;
    border-left: 2px solid #eee;
    border-top: 1px solid #eee;
  }
}
</style>

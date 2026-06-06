<template>
  <div class="header">
    <div class="header-container">
      <div class="clear-fix">
        <div class="logo" @click="$router.push('/')">
          <el-image :src="logoImg" alt="" fit="contain" style="width: 210px; height: 80px" />
        </div>
        <div class="search-container">
          <div class="search-tab">
            <div
              v-for="tab in searchTabs"
              :key="tab.key"
              class="tab-item"
              :class="{ active: currentType === tab.key }"
              @click="setSearchType(tab.key)"
            >
              {{ tab.label }}
            </div>
          </div>
          <div class="input-box flex-box">
            <div class="input-content">
              <el-input placeholder="请输入搜索内容" />
            </div>
            <el-button
              type="primary"
              style="height: 32px; width: 64px; border-radius: 0 4px 4px 0"
              color="#008CFF"
              @click="handleSearch(currentInput)"
              >搜索</el-button
            >
          </div>
        </div>
        <div class="login-box flex-box" v-if="!isLogin">
          <el-button class="btn login-btn" @click="$router.push('/auth/login')">登录</el-button>
          <el-button
            class="btn register-btn"
            type="primary"
            color="#008CFF"
            @click="$router.push('/auth/register')"
            >注册</el-button
          >
        </div>
        <div class="login-box" v-else>
          <div class="flex-box">
            <div class="flex-box mine" @click="$router.push('/user/profile')">
              <svg
                t="1779690311235"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="13163"
                width="20"
                height="16"
              >
                <path
                  d="M928 832l-64 32-352 160-352-160-64-32a96 96 0 0 1-96-96V96a96 96 0 0 1 96-96l64 32 352 160 352-160 64-32a96 96 0 0 1 96 96v640a96 96 0 0 1-96 96z m-480 0V288L128 192v544l320 128v-32zM896 192L576 288v576l320-128V192z"
                  fill="#0090FF"
                  p-id="13164"
                ></path>
              </svg>
              <span>个人中心</span>
            </div>
            <el-dropdown>
              <el-avatar
                :src="avatar"
                style="width: 36px; height: 36px; cursor: pointer"
                @click="$router.push('/user')"
              />
              <template #dropdown>
                <el-dropdown-menu class="drop-item">
                  <el-dropdown-item
                    v-for="item in dropdownItems"
                    :key="item.path"
                    @click="$router.push(item.path)"
                  >
                    <el-icon>
                      <component :is="item.icon" />
                    </el-icon>
                    {{ item.name }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleLogout">
                    <el-icon>
                      <component :is="markRaw(SwitchButton)" />
                    </el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
      <el-menu
        class="menu"
        mode="horizontal"
        default-active="/home"
        active-index="$route.path"
        router
      >
        <el-menu-item class="menu-item" v-for="tab in menutabs" :key="tab.key" :index="tab.key">{{
          tab.label
        }}</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, markRaw, ref } from 'vue'
import { CircleClose, Collection, Star, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'
const searchStore = useSearchStore()
const { currentType, currentInput, searchTabs } = storeToRefs(searchStore)
const { handleSearch, setSearchType } = searchStore
const router = useRouter()
const avatar = new URL(
  JSON.parse(localStorage.getItem('userInfo') || '').avatarUrl,
  import.meta.url,
).href
const userInfo = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo')!)
  : null
const isLogin = computed(() => !!userInfo)
const menutabs = ref([
  { key: '/home', label: '全部' },
  { key: '/bank/category', label: '专业题库' },
  { key: '/questions', label: '题目集市' },
  { key: '/documents', label: '文档下载' },
  { key: '/user/documents', label: 'AI导题' },
  { key: '/user/collections/Mistake', label: '查看错题' },
])

const dropdownItems = ref([
  {
    name: '我的题库',
    path: '/user/bank',
    icon: markRaw(Collection),
  },
  {
    name: '全部错题',
    path: '/user/collections/Mistake',
    icon: markRaw(CircleClose),
  },
  {
    name: '我的收藏',
    path: '/user/collections/Note',
    icon: markRaw(Star),
  },
])
const logoImg = new URL('@/assets/images/GPTLOGO.png', import.meta.url).href
const handleLogout = () => {
  localStorage.removeItem('userInfo')
  localStorage.removeItem('token')
  ElMessage.success('退出登录成功')
  router.push('/auth/login')
}
</script>

<style scoped lang="scss">
$color-blue: #008cff;
$color-bg: #f5f5f5;

* {
  box-sizing: border-box;
}

.flex-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.mine {
  white-space: nowrap;
  gap: 4px;
  font-size: 14px;
  color: #198cff;
  background-color: #ecf7fe;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 16px;
}
.drop-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.header {
  border-bottom: 1px solid #e5e5e5;

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
      .logo {
        cursor: pointer;
      }
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

        .user-name {
          margin-left: 8px;
          height: 32px;
          line-height: 32px;
          font-size: 14px;
          font-weight: 350;
          color: #333;
        }

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

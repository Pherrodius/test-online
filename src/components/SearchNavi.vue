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
      <div class="login-box" v-if="!isLogin">
        <el-button class="login-btn" @click="router.push('/auth/login')">登录</el-button>
        <el-button type="primary" class="register-btn" @click="router.push('/auth/register')"
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
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, markRaw, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CircleClose, Collection, SwitchButton, User } from '@element-plus/icons-vue'
const userInfo = computed(() =>
  localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null,
)
const avatar = computed(() =>
  userInfo.value.avatarUrl
    ? new URL(userInfo.value.avatarUrl, import.meta.url).href
    : new URL('@/assets/images/def-head.png', import.meta.url).href,
)
const isLogin = computed(() => !!userInfo.value)
const router = useRouter()
const menuItems = ref([
  {
    name: '首页',
    path: '/',
  },
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
const dropdownItems = ref([
  {
    name: '个人中心',
    path: '/user/profile',
    icon: markRaw(User),
  },
  {
    name: '我的题库',
    path: '/user/banks',
    icon: markRaw(Collection),
  },
  {
    name: '全部错题',
    path: '/user/mistakes',
    icon: markRaw(CircleClose),
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
    position: relative;
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
</style>

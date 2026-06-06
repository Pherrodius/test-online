<template>
  <div class="common-layout">
    <user-navi />
    <el-row class="user-layout">
      <el-col :xs="24" :sm="6" :md="4" :lg="3">
        <el-menu :default-active="activeMenu" class="el-menu-vertical" @select="handleSelect">
          <el-menu-item v-for="item in menuList" :key="item.path" :index="item.path">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            {{ item.name }}
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :xs="24" :sm="18" :md="20" :lg="21" class="content">
        <el-scrollbar>
          <router-view />
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import UserNavi from '@/components/UserNavi.vue'
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
} from '@element-plus/icons-vue'
import { computed, markRaw, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

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
])

const activeMenu = computed(() => route.path)

const handleSelect = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.common-layout {
  height: 100%;
  overflow: hidden;
}
.user-layout {
  height: 100%;
  background-color: #f5f7fb;
}
.content {
  height: 100%;
}
.el-menu-vertical {
  height: 100%;
  border-right: 1px solid #eee;
}

@media (max-width: 767px) {
  .el-menu-vertical {
    display: none;
  }
}
</style>

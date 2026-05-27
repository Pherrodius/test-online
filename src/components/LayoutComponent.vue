<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <NavibarComponent v-if="$route.meta.home" />
        <BussinessNavi v-else />
      </el-header>
      <el-main>
        <router-view :key="$route.path"></router-view>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import NavibarComponent from './HomeNavi.vue'
import BussinessNavi from './BussinessNavi.vue'
</script>
<style scoped>
html,
* {
  box-sizing: border-box;
}

.el-header {
  padding: 0;
  height: auto;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
}

.el-main {
  padding: 0;
  background-color: #f5f5f5;
}

.el-footer {
  padding: 0;
  height: auto;
}
</style>

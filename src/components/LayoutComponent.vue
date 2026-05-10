<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <NavibarComponent />
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import NavibarComponent from './NavibarComponent.vue'
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
}

.el-footer {
  padding: 0;
  height: auto;
}
</style>

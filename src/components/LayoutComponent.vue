<template>
  <div class="common-layout">
    <header>
      <NavibarComponent v-if="$route.meta.home" />
      <BussinessNavi v-else />
    </header>
    <div class="main">
      <router-view :key="$route.path"></router-view>
    </div>
    <CommonFooter />
  </div>
</template>

<script setup lang="ts">
import NavibarComponent from './HomeNavi.vue'
import BussinessNavi from './BussinessNavi.vue'
import CommonFooter from './CommonFooter.vue'
</script>
<style scoped>
html,
* {
  box-sizing: border-box;
}
.common-layout {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
.main {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>

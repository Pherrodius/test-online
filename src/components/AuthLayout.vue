<template>
  <div class="auth-layout">
    <div class="auth-left">
      <div class="logo-section">
        <div class="logo">
          <el-icon size="48" color="#409eff">
            <Collection />
          </el-icon>
        </div>
        <h1 class="title">题库宝</h1>
        <p class="subtitle">专业的在线学习平台</p>
      </div>
      <div class="illustration">
        <el-image :src="bgImageUrl" fit="cover" class="bg-image" />
      </div>
      <div class="features">
        <div class="feature-item">
          <el-icon size="24" color="#409eff">
            <CircleCheck />
          </el-icon>
          <span>海量题库资源</span>
        </div>
        <div class="feature-item">
          <el-icon size="24" color="#67c23a">
            <CircleCheck />
          </el-icon>
          <span>智能学习分析</span>
        </div>
        <div class="feature-item">
          <el-icon size="24" color="#f5a623">
            <CircleCheck />
          </el-icon>
          <span>个性化推荐</span>
        </div>
      </div>
    </div>
    <div class="auth-right">
      <div class="form-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleCheck, Collection } from '@element-plus/icons-vue'

const bgImageUrl = new URL('@/assets/images/1.webp', import.meta.url).href
</script>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.auth-left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 60px 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }
}

.logo-section {
  position: relative;
  z-index: 1;
  margin-bottom: 60px;

  .logo {
    margin-bottom: 20px;
  }

  .title {
    font-size: 36px;
    font-weight: bold;
    margin: 0 0 8px 0;
  }

  .subtitle {
    font-size: 16px;
    opacity: 0.8;
    margin: 0;
  }
}

.illustration {
  position: relative;
  z-index: 1;
  margin-bottom: 40px;

  .bg-image {
    width: 100%;
    max-width: 400px;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
}

.features {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    opacity: 0.9;
  }
}

.auth-right {
  flex: 1;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.form-container {
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>

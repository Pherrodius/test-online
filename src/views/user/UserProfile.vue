<template>
  <div class="user-page">
    <section class="panel profile-card">
      <el-avatar :size="80">用户</el-avatar>
      <div>
        <h2>学习用户</h2>
        <p>坚持学习第 32 天，当前目标：每日完成 20 道练习题。</p>
        <el-tag type="success">普通会员</el-tag>
      </div>
    </section>

    <section class="panel">
      <div class="panel-title">
        <h3>基本信息</h3>
        <el-button type="primary" plain>编辑资料</el-button>
      </div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="昵称">学习用户</el-descriptions-item>
        <el-descriptions-item label="手机号">138****8888</el-descriptions-item>
        <el-descriptions-item label="邮箱">student@example.com</el-descriptions-item>
        <el-descriptions-item label="学习方向">前端开发 / 考试刷题</el-descriptions-item>
        <el-descriptions-item label="所在地区">上海</el-descriptions-item>
        <el-descriptions-item label="注册时间">2026-05-01</el-descriptions-item>
      </el-descriptions>
    </section>

    <section class="panel">
      <div class="panel-title">
        <h3>学习偏好</h3>
      </div>
      <el-space wrap>
        <el-tag>随机练习</el-tag>
        <el-tag type="success">错题重练</el-tag>
        <el-tag type="warning">每日提醒</el-tag>
        <el-tag type="info">章节复习</el-tag>
      </el-space>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.user-page {
  padding: 24px;
}

.panel {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(31, 45, 61, 0.06);
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 20px;

  h2 {
    margin: 0 0 8px;
  }

  p {
    margin: 0 0 12px;
    color: #7a8699;
  }
}

.panel-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    margin: 0;
  }
}
</style>

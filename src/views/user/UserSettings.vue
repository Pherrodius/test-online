<template>
  <div class="user-page">
    <div class="page-header">
      <div>
        <h2>设置</h2>
        <p>管理账号安全、通知和练习偏好。</p>
      </div>
      <el-button type="primary">保存设置</el-button>
    </div>

    <section class="panel">
      <h3>账号安全</h3>
      <el-form label-width="120px">
        <el-form-item label="登录密码">
          <el-button plain>修改密码</el-button>
        </el-form-item>
        <el-form-item label="绑定手机">
          <span>138****8888</span>
          <el-button text type="primary">更换</el-button>
        </el-form-item>
      </el-form>
    </section>

    <section class="panel">
      <h3>通知偏好</h3>
      <div class="setting-row">
        <div>
          <strong>每日练习提醒</strong>
          <p>每天固定时间提醒完成练习计划。</p>
        </div>
        <el-switch model-value />
      </div>
      <div class="setting-row">
        <div>
          <strong>错题复习提醒</strong>
          <p>错题超过设定数量时自动提醒。</p>
        </div>
        <el-switch />
      </div>
    </section>

    <section class="panel">
      <h3>练习设置</h3>
      <el-form label-width="120px">
        <el-form-item label="默认题量">
          <el-input-number model-value="20" :min="5" :max="100" />
        </el-form-item>
        <el-form-item label="出题顺序">
          <el-radio-group model-value="random">
            <el-radio-button label="random">随机</el-radio-button>
            <el-radio-button label="sequence">顺序</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.user-page {
  padding: 24px;
}

.page-header,
.panel {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(31, 45, 61, 0.06);
}

.page-header {
  display: flex;
  justify-content: space-between;
  padding: 24px;
  margin-bottom: 16px;

  h2 {
    margin: 0 0 8px;
  }

  p {
    margin: 0;
    color: #7a8699;
  }
}

.panel {
  padding: 24px;
  margin-bottom: 16px;

  h3 {
    margin: 0 0 18px;
  }
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #eef0f5;

  &:last-child {
    border-bottom: 0;
  }

  p {
    margin: 6px 0 0;
    color: #7a8699;
  }
}
</style>

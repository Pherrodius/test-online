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
      <h3>练习设置</h3>
      <el-form label-width="120px" :model="practiceConfig">
        <el-form-item label="自动检查答案">
          <el-radio-group v-model="practiceConfig.autoCheck">
            <el-radio-button :value="true">开启</el-radio-button>
            <el-radio-button :value="false">关闭</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出题顺序">
          <el-radio-group v-model="practiceConfig.random">
            <el-radio-button :value="false">顺序</el-radio-button>
            <el-radio-button :value="true">随机</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </section>

    <section class="panel">
      <h3>测试设置</h3>
      <el-form label-width="120px" :model="testConfig">
        <el-form-item label="默认题量">
          <el-input-number v-model="testConfig.amount" :step="5" :min="5" :max="100" />
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/config.ts'
import { storeToRefs } from 'pinia'
const useConfig = useConfigStore()
const { practiceConfig, testConfig } = storeToRefs(useConfig)
</script>
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

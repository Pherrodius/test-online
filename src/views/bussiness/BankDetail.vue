<template>
  <div class="bank-detail">
    <div class="container">
      <div class="section">
        <div class="main-title">
          <p class="text">{{ bank?.name || 'loading...' }}</p>
          <div class="line"></div>
          <p class="text">{{ currentDiscipline?.name || 'loading...' }}</p>
          <el-button type="primary" size="small" color="#548EF7" style="font-size: 16px;margin: auto 12px 12px;">
            <el-icon style="color: #fff;">
              <Switch />
            </el-icon>
            <span style="color: #fff;">{{ bank?.disciplines?.length || 0 }}个科目</span>
          </el-button>
        </div>
        <div class="info">
          <p class="info-item">创建时间：{{ dayjs(bank?.createdTime).format('YYYY-MM-DD HH:mm:ss') || 'loading...' }}</p>
          <p class="info-item">题目数量：{{ bank?.questions?.length || 'loading...' }}</p>
          <p class="info-item">提供作者：<a :href="`https://www.kaoshibao.com/user/${bank?.creator?.id || 'loading...'}`"
              target="_blank">{{ bank?.creator?.name || 'loading...' }}</a></p>
        </div>
        <div class="btn-box">
          <el-button type="warning" size="large">
            <el-icon style="font-size: 24px;">
              <Star />
            </el-icon>
            <span>收藏</span>
          </el-button>
          <el-button type="success" size="large">
            <el-icon style="font-size: 24px;">
              <Promotion />
            </el-icon>
            <span>分享</span>
          </el-button>
        </div>
      </div>
      <div class="section">
        <div class="sub-title">我的练习</div>
        <div class="option-box">
          <div class="option-item" v-for="item in options" :key="item.path" @click="router.push({
            path: item.path,
            query: item.query,
          })">
            <el-image :src="item.icon" style="width: 40px; height: 40px;" />
            <div>
              <p class="label">{{ item.label }}</p>
              <p class="value">{{ item.value }}</p>
            </div>
            <div v-if="item.label === '我的错题'" class="delete-btn">
              <el-button type="primary" size="small" @click.stop="clearMistakes">清空错题 </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <p class="sub-title" style="border-bottom: none;padding: 0;margin: 0;">题库预览</p>
        <QuestionList :questions="bank?.questions.filter(item => item.disciplineId === currentDiscipline?.id) || []" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deleteAllCollections, getBank, getCollectionList } from '@/api/question'
import type { GetBankResponse } from '@/types/response'
import { CollectionType, type Discipline } from '@/types/prisma'
import QuestionList from '@/components/QuestionList.vue'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
const route = useRoute()
const router = useRouter()
const bank = ref<GetBankResponse>()
const currentDiscipline = ref<Discipline>()
const mistakes = ref<number>(0)
const notes = ref<number>(0)
const options = reactive({
  sequential: {
    icon: new URL('@/assets/icon/sequential.png', import.meta.url).href,
    label: '顺序练习',
    path: '/test',
    query: {
      type: 'sequential',
      bankId: route.params.id,
      disciplineId: computed(() => currentDiscipline.value?.id),
    },
    value: computed(() => `1 / ${bank.value?.questions.filter(item => item.disciplineId === currentDiscipline.value?.id).length || 0}`)
  },
  random: {
    icon: new URL('@/assets/icon/random.png', import.meta.url).href,
    label: '随机练习',
    path: '/test',
    query: {
      type: 'random',
      bankId: route.params.id,
      disciplineId: computed(() => currentDiscipline.value?.id),
    },
    value: `开始随机练习`
  },
  collect: {
    icon: new URL('@/assets/icon/collect.png', import.meta.url).href,
    label: '我的收藏',
    path: '/collection',
    query: {
      bankId: route.params.id,
      disciplineId: computed(() => currentDiscipline.value?.id),
    },
    value: computed(() => `(共有${notes.value}题)`)
  },
  error: {
    icon: new URL('@/assets/icon/error.png', import.meta.url).href,
    label: '我的错题',
    path: '/error',
    query: {
      bankId: route.params.id,
      disciplineId: computed(() => currentDiscipline.value?.id),
    },
    value: computed(() => `(共有${mistakes.value}题)`)
  },
})
const clearMistakes = async () => {
  ElMessageBox.confirm('确定清空错题吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteAllCollections({
      userId: Number(localStorage.getItem('userId') || 1),
      bankId: Number(route.params.id),
      disciplineId: currentDiscipline.value?.id,
      type: CollectionType.Mistake,
    }).then(() => {
      mistakes.value = 0
      ElMessage.success('清空成功')
    })
  })
}
const render = async () => {
  await getBank(Number(route.params.id)).then(data => {
    bank.value = data
    currentDiscipline.value = data.disciplines[0]!
  })
  await getCollectionList({
    userId: Number(localStorage.getItem('userId') || 1),
    bankId: Number(route.params.id),
  }).then(data => {
    mistakes.value = data.mistakes
    notes.value = data.notes
  })
}
onMounted(async () => {
  try {
    await render()
  } catch (error) {
    console.error('加载失败', error)
    ElMessage.error('加载失败')
  }
})
</script>
<style scoped lang="scss">
.bank-detail {
  background-color: #F5F5F5;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .section {
      background-color: #fff;
      padding: 20px;

      .sub-title {
        color: #262626;
        font-size: 18px;
        font-style: normal;
        font-weight: 450;
        line-height: 24px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ebebeb;
      }

      .option-box {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0px;

        .delete-btn {
          :deep(.el-button--small) {
            font-size: 16px;
            background-color: transparent;
            color: #f56c6c;
            border: none;

            &:hover {
              background-color: #fff;
            }
          }
        }

        .option-item {
          flex: 1;
          padding: 16px 24px;
          margin-top: 20px;
          text-align: center;
          display: flex;
          align-items: center;
          gap: 20px;
          border-right: 1px solid #ebebeb;
          cursor: pointer;

          &:hover {
            background-color: #F5F5F5;
          }

          &:last-child {
            border-right: none;
          }

          .label {
            font-size: 16px;
            font-weight: bolder;
            line-height: 24px;
            margin: 0 0 4px 0;
          }

          .value {
            margin: 4px 0 0 0;
            line-height: 22px;
            font-size: 14px;
            color: #8c8c8c;
          }
        }
      }

      .main-title {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .text {
          color: #262626;
          font-size: 24px;
          font-style: normal;
          font-weight: 500;
          line-height: 24px;
          margin-top: 12px;
          margin-bottom: 12px;
        }

        .line {
          width: 2px;
          height: 24px;
          background-color: #ebebeb;
          margin: 0 12px;
        }
      }

      .info {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;

        .info-item {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #8c8c8c;
          margin: 0 12px 0 0;

          a {
            text-decoration: none;
          }
        }
      }

      .el-button--large {
        height: 48px;
        width: 160px;
      }

      .el-button--large [class*=el-icon]+span {
        font-size: 16px;
        color: #fff;
        line-height: 24px;
        font-weight: 400;
        margin-left: 4px;
      }
    }
  }
}
</style>

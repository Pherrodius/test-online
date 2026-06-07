<template>
  <div class="bank-detail">
    <div class="container">
      <div class="section">
        <div class="main-title">
          <p class="text">{{ bank?.name || 'loading...' }}</p>
          <div class="line"></div>
          <p class="text">{{ currentDiscipline?.name || 'loading...' }}</p>
          <el-button
            type="primary"
            size="small"
            color="#548EF7"
            class="discipline-button"
            @click="dialogVisible = true"
          >
            <el-icon class="white-icon">
              <Switch />
            </el-icon>
            <span class="white-text">{{ bank?.disciplines?.length || 0 }}个科目</span>
          </el-button>
        </div>
        <div class="info">
          <p class="info-item">
            创建时间：{{ dayjs(bank?.createdTime).format('YYYY-MM-DD HH:mm:ss') || 'loading...' }}
          </p>
          <p class="info-item">题目数量：{{ bank?.questions?.length || 'loading...' }}</p>
          <p class="info-item">
            提供作者：<a href="#" @click="dialogVisible2 = true">{{
              bank?.creator?.name || 'loading...'
            }}</a>
          </p>
        </div>
        <div class="desc">题库简介：{{ bank?.description || 'loading...' }}</div>
        <div class="btn-box">
          <div class="btn">
            <el-button type="warning" size="large" @click="handleCollectBank">
              <el-icon class="action-icon">
                <Check v-if="isCollected" />
                <Star v-else />
              </el-icon>
              <span>{{ isCollected ? '已收藏' : '收藏' }}</span>
            </el-button>
          </div>
          <div class="btn">
            <el-button type="success" size="large" @click="handleShare">
              <el-icon class="action-icon">
                <Promotion />
              </el-icon>
              <span>分享</span>
            </el-button>
          </div>
          <div class="btn">
            <el-button
              type="primary"
              size="large"
              @click="
                $router.push({
                  path: `/bank/edit/${bank?.id}`,
                  query: { disciplineId: currentDiscipline?.id },
                })
              "
              v-if="isOwned"
            >
              <el-icon class="action-icon">
                <Edit />
              </el-icon>
              <span>编辑题目</span>
            </el-button>
          </div>
          <div class="btn">
            <el-button type="danger" size="large" @click="dialogVisible3 = true" v-if="isOwned">
              <el-icon class="action-icon">
                <EditPen />
              </el-icon>
              <span>编辑基本信息</span>
            </el-button>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="sub-title">我的练习</div>
        <div class="option-box">
          <div
            class="option-item"
            v-for="item in options"
            :key="item.path"
            @click="
              $router.push({
                path: item.path,
                query: item.query,
              })
            "
          >
            <el-image :src="item.icon" class="option-icon" />
            <div>
              <p class="label">{{ item.label }}</p>
              <p class="value">{{ item.value }}</p>
            </div>
            <div v-if="item.label === '我的错题' && mistakes > 0" class="delete-btn">
              <el-button
                type="primary"
                size="small"
                @click.stop="clearCollection(CollectionType.Mistake)"
                >清空错题
              </el-button>
            </div>
            <div v-if="item.label === '我的收藏' && notes > 0" class="delete-btn">
              <el-button
                type="primary"
                size="small"
                @click.stop="clearCollection(CollectionType.Note)"
                >清空收藏
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <p class="sub-title preview-title">题库预览</p>
        <QuestionList
          :questions="
            bank?.questions.filter((item) => item.disciplineId === currentDiscipline?.id) || []
          "
        />
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="提示"
      width="400px"
      :before-close="() => (dialogVisible = false)"
    >
      <template #header>
        <div>科目选择</div>
      </template>
      <div
        class="discipline"
        v-for="item in bank?.disciplines || []"
        :key="item.id"
        @dblclick="((currentDiscipline = item), (dialogVisible = false))"
        title="双击选择该科目"
      >
        <div class="value">
          <el-image :src="bankIcon" fit="contain" class="discipline-icon" />
          <div class="text">
            <div class="upper">
              {{ item.name || '' }}
            </div>
          </div>
        </div>
        <div class="count">
          共{{
            bank?.questions.filter((question) => question.disciplineId === item.id).length || 0
          }}题
        </div>
      </div>
    </el-dialog>
    <UserInfoDialog v-model="dialogVisible2" :user="bank?.creator" v-if="bank?.creator" />
    <EditBankDialog v-model="dialogVisible3" :bank="bank" v-if="bank" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { deleteAllCollections, getCollectionList } from '@/api/question'
import { getBank, collectBank, uncollectBank, isBankCollected } from '@/api/bank'
import type { GetBankResponse } from '@/types/response'
import { CollectionType, type Discipline } from '@/types/prisma'
import QuestionList from '@/components/QuestionList.vue'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { TestModel } from '@/stores/testpaper'
import UserInfoDialog from '@/components/UserInfoDialog.vue'
import EditBankDialog from '@/components/EditBankDialog.vue'

const dialogVisible2 = ref(false)
const dialogVisible3 = ref(false)
const route = useRoute()
const bank = ref<GetBankResponse | null>(null)
const currentDiscipline = ref<Discipline>()
const mistakes = ref<number>(0)
const notes = ref<number>(0)
const bankIcon = new URL('@/assets/icon/bank.png', import.meta.url).href
const isOwned = computed(() => {
  if (!localStorage.getItem('userInfo') || !localStorage.getItem('token')) return false
  return bank.value?.creatorId == JSON.parse(localStorage.getItem('userInfo')!).id
})
const options = reactive({
  sequential: {
    icon: new URL('@/assets/icon/sequential.png', import.meta.url).href,
    label: '练习模式',
    path: '/test',
    query: {
      model: TestModel.Practice,
      random: 0,
      bankId: route.params.id,
      disciplineId: computed(() => currentDiscipline.value?.id),
    },
    value: computed(
      () =>
        `1 / ${bank.value?.questions.filter((item) => item.disciplineId === currentDiscipline.value?.id).length || 0}`,
    ),
  },
  random: {
    icon: new URL('@/assets/icon/random.png', import.meta.url).href,
    label: '模拟测试',
    path: '/test',
    query: {
      model: TestModel.Test,
      random: 1,
      bankId: route.params.id,
      disciplineId: computed(() => currentDiscipline.value?.id),
    },
    value: `根据设置的题量进行考试`,
  },
  collect: {
    icon: new URL('@/assets/icon/collect.png', import.meta.url).href,
    label: '我的收藏',
    path: '/collection/Note',
    query: {
      bankId: route.params.id,
    },
    value: computed(() => `(共有${notes.value}题)`),
  },
  error: {
    icon: new URL('@/assets/icon/error.png', import.meta.url).href,
    label: '我的错题',
    path: '/collection/Mistake',
    query: {
      bankId: route.params.id,
    },
    value: computed(() => `(共有${mistakes.value}题)`),
  },
})
const dialogVisible = ref(false)
const isCollected = ref(false)
const handleCollectBank = () => {
  if (!bank.value) {
    ElMessage.error('题库信息加载中，请稍后再试')
    return
  }
  if (isCollected.value) {
    ElMessageBox.confirm('确定取消收藏吗？', '您已收藏该题库', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      uncollectBank(Number(route.params.id))
        .then(() => {
          isCollected.value = false
          ElMessage.success('已取消收藏')
        })
        .catch((error) => {
          console.error('取消收藏失败', error)
          ElMessage.error('取消收藏失败')
        })
    })
  } else {
    collectBank(Number(route.params.id))
      .then(() => {
        isCollected.value = true
        ElMessage.success('收藏成功')
      })
      .catch((error) => {
        console.error('收藏失败', error)
        ElMessage.error('收藏失败')
      })
  }
}

const handleShare = async () => {
  if (!bank.value) {
    ElMessage.warning('题库信息加载中，请稍后再试')
    return
  }

  const url = window.location.href
  const title = bank.value.name

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: `分享题库：${title}`,
        url,
      })
      return
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }
    }
  }
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success('题库链接已复制')
  } catch {
    ElMessage.error('分享失败，请手动复制当前页面链接')
  }
}
watch(
  () => currentDiscipline.value,
  () => {
    localStorage.setItem('currentDiscipline', JSON.stringify(currentDiscipline.value))
  },
)
const clearCollection = async (item: CollectionType) => {
  ElMessageBox.confirm(`确定清空${item === CollectionType.Mistake ? '错题' : '收藏'}吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteAllCollections({
      bankId: Number(route.params.id),
      disciplineId: currentDiscipline.value?.id,
      type: item,
    }).then(() => {
      if (item === CollectionType.Mistake) {
        mistakes.value = 0
      } else {
        notes.value = 0
      }
      ElMessage.success('清空成功')
    })
  })
}
const render = async () => {
  await getBank(Number(route.params.id))
    .then((data) => {
      bank.value = data
      if (!data) {
        currentDiscipline.value = undefined
        return
      }
      if (localStorage.getItem('currentDiscipline')) {
        const savedDiscipline = JSON.parse(localStorage.getItem('currentDiscipline')!)
        if (data.disciplines.some((discipline) => discipline.id === savedDiscipline.id)) {
          currentDiscipline.value = savedDiscipline
          return
        }
      }
      currentDiscipline.value = data.disciplines[0]!
    })
    .catch((error) => {
      console.error('获取题库信息失败', error)
      ElMessage.error('获取题库信息失败')
    })
  if (localStorage.getItem('token')) {
    await getCollectionList({
      bankId: Number(route.params.id),
      detailed: false,
    })
      .then((data) => {
        mistakes.value = data.mistakes
        notes.value = data.notes
      })
      .catch((error) => {
        console.error('获取收藏信息失败', error)
        ElMessage.error('获取收藏信息失败')
      })
    await isBankCollected(Number(route.params.id))
      .then((data) => {
        isCollected.value = data
      })
      .catch((error) => {
        console.error('获取收藏状态失败', error)
        ElMessage.error('获取收藏状态失败')
      })
  }
}
watch(
  () => route.params.id,
  () => {
    render()
  },
  { immediate: true },
)
</script>
<style scoped lang="scss">
.discipline-button {
  margin: auto 12px 12px;
  font-size: 16px;
}

.white-icon,
.white-text {
  color: #fff;
}

.action-icon {
  font-size: 24px;
}

.option-icon {
  width: 40px;
  height: 40px;
}

.preview-title {
  margin: 0;
  padding: 0;
  border-bottom: none !important;
}

.discipline-icon {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}
.btn-box {
  display: grid;
  grid-template-columns: repeat(auto-fill, 160px);
  justify-content: flex-start;
  justify-items: flex-start;
  align-items: center;
  gap: 16px;
}
.bank-detail {
  flex: 1;
  background-color: #f5f5f5;
  .desc {
    font-size: 15px;
    color: #666;
    margin-bottom: 24px;
  }
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
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        justify-content: center;
        align-items: center;
        gap: 0px;
        .delete-btn {
          :deep(.el-button--small) {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 2%;
            font-size: 14px;
            background-color: transparent;
            color: #f56c6c;
            border: none;

            &:hover {
              background-color: #fff;
            }
          }
        }

        .option-item {
          position: relative;
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
            background-color: #f5f5f5;
          }

          &:last-child {
            border-right: none;
          }

          .label {
            text-align: left;
            font-size: 16px;
            font-weight: bolder;
            line-height: 24px;
            margin: 0 0 4px 0;
          }

          .value {
            margin: 4px 0 0 0;
            text-align: left;
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
        margin-bottom: 8px;

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

      .el-button--large [class*='el-icon'] + span {
        font-size: 16px;
        color: #fff;
        line-height: 24px;
        font-weight: 400;
        margin-left: 4px;
      }
    }
  }
}
.discipline {
  padding: 12px;
  background-color: #fff;
  margin-top: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 1px 2px 4px 1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 2px 4px 8px 2px rgba(84, 142, 247, 0.2);
    scale: 1.02;
  }
  .title {
    font-size: 16px;
    font-weight: bolder;
    line-height: 24px;
    color: #333;
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 12px;
  }
  .count {
    white-space: nowrap;
    font-size: 14px;
    line-height: 22px;
    color: #8c8c8c;
  }
  .value {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    &:hover {
      .upper {
        color: #548ef7;
      }
    }

    .upper {
      font-size: 16px;
      font-weight: bolder;
      line-height: 24px;
      color: #333;
    }
  }
}
@media (max-width: 768px) {
  .bank-detail {
    width: 100%;
    padding: 0;
  }
  .option-item {
    &:nth-child(2) {
      border-right: none !important;
    }
  }
}
</style>

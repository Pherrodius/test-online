<template>
  <div class="collection">
    <div class="path">
      <el-breadcrumb separator="/" class="breadcrumb" :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/bank/${$route.query.bankId}` }">题库</el-breadcrumb-item>
        <el-breadcrumb-item
          >{{ type === CollectionType.Mistake ? '错题' : '收藏' }}详情</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="top-stats">
      <div class="stat-card all-collection">
        <div class="stat-icon">
          <el-icon size="24">
            <Collection />
          </el-icon>
        </div>
        <div class="stat-content">
          <span class="stat-number">{{ allCollectionCount }}</span>
          <span class="stat-label"
            >全部{{ type === CollectionType.Mistake ? '错题' : '收藏' }}</span
          >
        </div>
        <a href="#" class="stat-link" @click="pushTest(TimeType.All)">查看 &gt;</a>
      </div>
      <div class="stat-card today-collection">
        <div class="stat-icon">
          <el-icon size="24">
            <Calendar />
          </el-icon>
        </div>
        <div class="stat-content">
          <span class="stat-number">{{ todayCollectionCount }}</span>
          <span class="stat-label"
            >今日{{ type === CollectionType.Mistake ? '错题' : '收藏' }}</span
          >
        </div>
        <a href="#" class="stat-link" @click="pushTest(TimeType.Day)">查看 &gt;</a>
      </div>
      <div class="stat-card extend">
        <div class="stat-icon">
          <el-icon size="24">
            <Lightning />
          </el-icon>
        </div>
        <div class="stat-content">
          <span class="stat-number"
            >{{
              collectionList?.total && resolutionCount != 0
                ? ((collectionList.total / resolutionCount) * 100).toFixed(2)
                : 0
            }}%</span
          >
          <span class="stat-label">{{
            collectionList?.type === CollectionType.Mistake ? '错误率' : '收藏率'
          }}</span>
        </div>
        <el-popover placement="bottom" :width="275" trigger="hover">
          <template #reference>
            <el-icon color="#fff" size="18"><QuestionFilled /></el-icon>
          </template>
          <h3 style="margin: 8px">
            {{
              type === CollectionType.Mistake
                ? '错误率=实时错题数/历史已做题'
                : '收藏率=实时收藏数/历史已做题'
            }}
          </h3>
          <p style="margin: 8px">
            清空{{ type === CollectionType.Mistake ? '错题' : '收藏' }}后{{
              type === CollectionType.Mistake ? '错误率' : '收藏率'
            }}为0%
          </p>
        </el-popover>
      </div>
      <div class="stat-card ad-card">
        <p class="ad-title">错题没有解析？不理解答案？</p>
        <p class="ad-desc">AI深度解析，助你快速掌握解题技巧</p>
        <el-button type="primary" class="ad-btn">立即体验</el-button>
        <span class="vip-badge">VIP</span>
      </div>
    </div>

    <div class="collection-distribution">
      <div class="section-header">
        <h3>{{ type === CollectionType.Mistake ? '错题' : '收藏' }}分布</h3>
        <button class="clear-btn" @click="clearCollection">
          <el-icon size="14">
            <Delete />
          </el-icon>
          <span>清空{{ type === CollectionType.Mistake ? '错题' : '收藏' }}</span>
        </button>
      </div>
      <div class="category-list">
        <div class="category-card" v-for="item in categoryList" :key="item.type">
          <div class="category-header">
            <div :class="['category-icon', item.type]">
              <el-image :src="item.icon" alt="图标" :size="item.iconSize" />
            </div>
            <span class="category-name">{{ item.name }}</span>
            <span class="category-count">{{ item.count }}</span>
          </div>
          <div>
            <el-button
              :disabled="item.count === 0"
              class="info-btn"
              type="primary"
              @click="pushDetail(item.list)"
              >详情</el-button
            >
            <el-button
              :disabled="item.count === 0"
              class="practice-btn"
              @click="pushTest(TimeType.All, item.questionType)"
              >练习</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    title="详情"
    v-model="dialogVisible"
    width="50%"
    top="5vh"
    :loading="loading"
    style="height: 90svh; overflow: auto"
    @close="((dialogVisible = false), (currentList = []), render())"
  >
    <DetailedQuestion
      v-for="(item, index) in currentList"
      :key="item.id"
      :question="item"
      :index="index"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import {
  Collection,
  Calendar,
  Lightning,
  Delete,
  ArrowRight,
  QuestionFilled,
} from '@element-plus/icons-vue'
import { deleteAllCollections, getCollectionList, getResolutions } from '@/api/question'
import { CollectionType, QuestionType } from '@/types/prisma'
import { useRoute } from 'vue-router'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import type { GetCollectionListResponse, GetQuestionDetailResponse } from '@/types/response'
import { useRouter } from 'vue-router'
import DetailedQuestion from '@/components/DetailedQuestion.vue'
const router = useRouter()
const allCollectionCount = ref(0)
const todayCollectionCount = ref(0)
const route = useRoute()
const type = computed(() => route.params.type as CollectionType)
const bankId = Number(route.query.bankId)
const dialogVisible = ref(false)
const collectionList = ref<GetCollectionListResponse | null>(null)
const categoryList = ref([
  {
    type: 'single',
    name: '单选题',
    list: computed(
      () =>
        collectionList.value?.records?.filter((item) => item.type === QuestionType.SingleChoice) ||
        [],
    ),
    count: computed(
      () =>
        collectionList.value?.records?.filter((item) => item.type === QuestionType.SingleChoice)
          .length || 0,
    ),
    icon: new URL('@/assets/icon/questionType/q1.png', import.meta.url).href,
    iconSize: 18,
    questionType: QuestionType.SingleChoice,
  },
  {
    type: 'TrueFalse',
    name: '判断题',
    list: computed(
      () =>
        collectionList.value?.records?.filter((item) => item.type === QuestionType.TrueFalse) || [],
    ),
    count: computed(
      () =>
        collectionList.value?.records?.filter((item) => item.type === QuestionType.TrueFalse)
          .length || 0,
    ),
    icon: new URL('@/assets/icon/questionType/q3.png', import.meta.url).href,
    iconSize: 18,
    questionType: QuestionType.TrueFalse,
  },
  {
    type: 'multi',
    name: '多选题',
    list: computed(
      () =>
        collectionList.value?.records?.filter((item) => item.type === QuestionType.MultiChoice) ||
        [],
    ),
    count: computed(
      () =>
        collectionList.value?.records?.filter((item) => item.type === QuestionType.MultiChoice)
          .length || 0,
    ),
    icon: new URL('@/assets/icon/questionType/q5.png', import.meta.url).href,
    iconSize: 18,
    questionType: QuestionType.MultiChoice,
  },
])
enum TimeType {
  All = 0,
  Day = 1,
}
const resolutionCount = ref<number>(0)
const loading = ref(false)
const currentList = ref<GetQuestionDetailResponse[]>([])
const pushDetail = async (item: GetCollectionListResponse['records']) => {
  loading.value = true
  for (const question of item) {
    currentList.value.push(question)
  }
  loading.value = false
  await nextTick()
  dialogVisible.value = true
}
const pushTest = (timeType?: TimeType, questionType?: QuestionType) => {
  const query = {
    bankId: bankId,
    collectionType: type.value,
    isDay: timeType || TimeType.All,
    questionType: questionType || undefined,
    random: 0,
  }
  if (!query) {
    return
  }
  router.push({ path: '/test', query })
}
const clearCollection = async () => {
  ElMessageBox.confirm(
    `确定清空${type.value === CollectionType.Mistake ? '错题' : '收藏'}吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(() => {
    deleteAllCollections({
      bankId: bankId,
      type: type.value,
    }).then(() => {
      render()
      ElMessage.success('清空成功')
    })
  })
}
const render = async () => {
  try {
    collectionList.value = await getCollectionList({ type: type.value, detailed: true })
    allCollectionCount.value = collectionList.value?.total || 0
    todayCollectionCount.value =
      collectionList.value?.records?.filter((item) =>
        dayjs(item.updatedTime).isSame(dayjs(), 'day'),
      ).length || 0
  } catch (error) {
    console.error('获取收藏列表失败', error)
  }
  try {
    const resolutions = await getResolutions({ bankId })
    resolutionCount.value = resolutions.length
  } catch (error) {
    console.error('获取错误率失败', error)
  }
}
onMounted(async () => {
  render()
})
</script>

<style scoped lang="scss">
.collection {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 24px;
  padding-top: 0;
}
.path {
  padding: 8px;
  margin: 0 auto;
  max-width: 1200px;

  .breadcrumb {
    display: flex;
    align-items: center;
  }

  :deep(.el-breadcrumb__inner.is-link) {
    font-size: 14px;
    color: #999;
    font-weight: 450;
    padding: 4px 8px;

    &:hover {
      color: #007bff;
    }
  }
}

.top-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.stat-card {
  flex: 1;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    right: -20px;
    bottom: -20px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    opacity: 0.2;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .stat-number {
      font-size: 32px;
      font-weight: bold;
      line-height: 1;
    }

    .stat-label {
      font-size: 14px;
      margin-top: 4px;
      opacity: 0.9;
    }
  }
  .stat-link {
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #fff;
    }
  }
}

.all-collection {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  &::before {
    background-color: #fff;
  }
}

.today-collection {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

  &::before {
    background-color: #fff;
  }
}

.extend {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);

  &::before {
    background-color: #fff;
  }
}

.ad-card {
  flex: 1;
  padding: 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ff6a00 0%, #ee0979 100%);
  position: relative;
  overflow: hidden;

  .vip-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #ffd700;
    color: #ff6a00;
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
  }

  .ad-title {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
  }

  .ad-desc {
    margin: 0 0 12px 0;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
  }

  .ad-btn {
    background-color: #fff;
    color: #ff6a00;
    border: none;
    padding: 6px 16px;
    font-size: 14px;
    border-radius: 4px;

    &:hover {
      background-color: #fff;
      color: #ff6a00;
    }
  }
}

.collection-distribution {
  box-sizing: border-box;
  max-width: 1200px;
  min-height: 40vh;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .clear-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border: none;
    background: none;
    color: #999;
    font-size: 14px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f5f5f5;
      color: #666;
    }
  }
}

.category-list {
  display: flex;
  gap: 16px;
}

.category-card {
  flex: 1;
  min-width: 280px;
  font-size: 20px;
  padding: 20px 24px;
  background-color: #fafafa;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .category-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &.single {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    &.judge {
      background-color: #e8f5e9;
      color: #388e3c;
    }

    &.essay {
      background-color: #ffebee;
      color: #c62828;
    }
  }

  .category-name {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }

  .category-count {
    font-size: 14px;
    color: #999;
    background-color: #fff;
    padding: 2px 8px;
    border-radius: 10px;
  }

  .info-btn {
    color: #fff;
    font-size: 12px;
    padding: 4px 12px;
    background-color: #007bff7e;
    border: 1px solid #e3f2fd;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      background-color: #005bff;
    }
  }

  .practice-btn {
    color: #1976d2;
    font-size: 12px;
    padding: 4px 12px;
    background-color: #fff;
    border: 1px solid #e3f2fd;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      background-color: #e3f2fd;
    }
  }
}
</style>

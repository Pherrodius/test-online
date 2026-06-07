<template>
  <el-dialog
    v-model="dialogVisible"
    width="720px"
    class="test-result-dialog"
    :show-close="false"
    @open="handleDialogOpen"
  >
    <div class="result-shell">
      <header class="result-header">
        <div>
          <div class="eyebrow">测试完成</div>
          <h2>{{ resultTitle }}</h2>
          <p>共 {{ totalCount }} 题，已完成 {{ answeredCount }} 题</p>
        </div>
        <div class="time-pill">
          <el-icon><Timer /></el-icon>
          <span>{{ takenTimeText }}</span>
        </div>
      </header>

      <main class="result-body">
        <section class="score-panel">
          <div ref="pieChartRef" class="chart-container"></div>
          <div class="score-copy">
            <strong>{{ score }}</strong>
            <span>分</span>
          </div>
        </section>

        <section class="stats-panel">
          <div v-for="item in stats" :key="item.label" class="stat-card">
            <div class="stat-icon" :class="item.iconClass">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div>
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-label">{{ item.label }}</div>
            </div>
          </div>
        </section>
      </main>

      <section class="answer-strip">
        <div class="strip-head">
          <span>答题概览</span>
          <em>正确率 {{ accuracyText }}</em>
        </div>
        <div class="question-dots">
          <span
            v-for="item in questionOverview"
            :key="item.questionId"
            class="question-dot"
            :class="item.status"
          >
            {{ item.index }}
          </span>
        </div>
      </section>

      <section v-if="wrongRows.length" class="wrong-panel">
        <div class="strip-head">
          <span>需要回看</span>
          <em>{{ wrongRows.length }} 题</em>
        </div>
        <div class="wrong-list">
          <div v-for="item in wrongRows" :key="item.questionId" class="wrong-item">
            <span class="wrong-index">第 {{ item.index }} 题</span>
            <span>你的答案 {{ item.yourAnswer }}</span>
            <span>正确答案 {{ item.correctAnswer }}</span>
          </div>
        </div>
      </section>
    </div>

    <template #footer>
      <el-button class="confirm-btn" type="primary" @click="dialogVisible = false">
        知道了
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useTestPaperStore } from '@/stores/testpaper'
import type { Answer } from '@/types/prisma'
import { CircleCheck, CircleClose, MoreFilled, Timer, TrendCharts } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onUnmounted, ref, shallowRef } from 'vue'
import * as echarts from 'echarts'

const { dialogVisible, testResult, questions, takenTime } = storeToRefs(useTestPaperStore())
const pieChartRef = ref<HTMLDivElement>()
const pieChart = shallowRef<echarts.ECharts>()

const totalCount = computed(() => questions.value.length)
const correctCount = computed(() => testResult.value?.correctCount ?? 0)
const wrongCount = computed(() => testResult.value?.wrongCount ?? 0)
const answeredCount = computed(() => testResult.value?.results.length ?? 0)
const unansweredCount = computed(() =>
  Math.max(totalCount.value - correctCount.value - wrongCount.value, 0),
)
const accuracy = computed(() => {
  if (totalCount.value === 0) return 0
  return correctCount.value / totalCount.value
})
const score = computed(() => Math.round(accuracy.value * 100))
const accuracyText = computed(() => `${score.value}%`)
const resultTitle = computed(() => {
  if (score.value >= 90) return '状态很好，继续保持'
  if (score.value >= 75) return '掌握不错，再补几题'
  if (score.value >= 60) return '已经及格，还能更稳'
  return '先把错题吃透'
})
const takenTimeText = computed(() => formatDuration(takenTime.value * 1000))
const stats = computed(() => [
  { label: '正确', value: correctCount.value, iconClass: 'is-correct', icon: CircleCheck },
  { label: '错误', value: wrongCount.value, iconClass: 'is-wrong', icon: CircleClose },
  {
    label: '未答',
    value: unansweredCount.value,
    iconClass: 'is-unanswered',
    icon: MoreFilled,
  },
  {
    label: '正确率',
    value: accuracyText.value,
    iconClass: 'is-accuracy',
    icon: TrendCharts,
  },
])
const resultMap = computed(
  () => new Map(testResult.value?.results.map((item) => [item.questionId, item]) ?? []),
)
const questionOverview = computed(() =>
  questions.value.map((question, index) => {
    const result = resultMap.value.get(question.id)
    return {
      questionId: question.id,
      index: index + 1,
      status: !result ? 'unanswered' : result.isCorrect ? 'correct' : 'wrong',
    }
  }),
)
const wrongRows = computed(() =>
  questionOverview.value
    .filter((item) => item.status === 'wrong')
    .map((item) => {
      const result = resultMap.value.get(item.questionId)
      return {
        ...item,
        yourAnswer: formatAnswer(JSON.parse(result?.yourAnswer ?? '') as Answer | Answer[]),
        correctAnswer: formatAnswer(JSON.parse(result?.correctAnswer ?? '') as Answer | Answer[]),
      }
    }),
)

function formatAnswer(answer?: Answer | Answer[]) {
  if (!answer) return '-'
  return Array.isArray(answer) ? answer.join('、') : answer
}

function formatDuration(milliseconds: number) {
  const totalSeconds = Math.max(Math.floor(milliseconds / 1000), 0)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function initChart() {
  if (!pieChartRef.value) return

  pieChart.value?.dispose()
  pieChart.value = echarts.init(pieChartRef.value)
  pieChart.value.setOption({
    color: ['#548ef7', '#2fb06f'],
    series: [
      {
        type: 'pie',
        radius: ['78%', '92%'],
        silent: true,
        label: { show: false },
        data: [
          {
            value: score.value,
            name: 'score',
            itemStyle: { color: score.value >= 60 ? '#548ef7' : '#e35d5d' },
          },
          {
            value: Math.max(100 - score.value, 0),
            name: 'rest',
            itemStyle: { color: '#edf1f7' },
          },
        ],
      },
    ],
  })
  pieChart.value.resize()
}

async function handleDialogOpen() {
  await nextTick()
  initChart()
}

onUnmounted(() => {
  pieChart.value?.dispose()
  pieChart.value = undefined
})
</script>

<style>
.test-result-dialog {
  max-width: calc(100vw - 28px);
  border-radius: 8px;
}

.test-result-dialog .el-dialog__header {
  display: none;
}

.test-result-dialog .el-dialog__body {
  padding: 0;
}

.test-result-dialog .el-dialog__footer {
  padding: 14px 24px 22px;
}

.result-shell {
  padding: 24px;
}

.result-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #edf1f7;
}

.eyebrow {
  width: fit-content;
  margin-bottom: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #edf4ff;
  color: #548ef7;
  font-size: 13px;
  font-weight: 600;
}

.result-header h2 {
  margin: 0;
  color: #1f2a3d;
  font-size: 26px;
  line-height: 1.25;
  font-weight: 700;
}

.result-header p {
  margin: 8px 0 0;
  color: #7b8494;
  font-size: 14px;
}

.time-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  background: #f7f9fc;
  color: #4b5870;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.result-body {
  display: grid;
  grid-template-columns: minmax(220px, 0.82fr) 1fr;
  gap: 22px;
  align-items: center;
  padding: 24px 0 18px;
}

.score-panel {
  position: relative;
  min-height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container {
  width: 230px;
  height: 230px;
}

.score-copy {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  pointer-events: none;
}

.score-copy strong {
  color: #1f2a3d;
  font-size: 54px;
  line-height: 230px;
}

.score-copy span {
  color: #7b8494;
  font-size: 18px;
  font-weight: 600;
}

.stats-panel {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 72px;
  padding: 14px;
  border: 1px solid #edf1f7;
  border-radius: 8px;
  background: #ffffff;
}

.stat-icon {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 18px;
  flex: 0 0 auto;
}

.stat-icon.is-correct {
  color: #2fb06f;
  background-color: #eaf8f1;
}

.stat-icon.is-wrong {
  color: #e35d5d;
  background-color: #fff0f0;
}

.stat-icon.is-unanswered {
  color: #8b95a5;
  background-color: #f1f4f8;
}

.stat-icon.is-accuracy {
  color: #548ef7;
  background-color: #edf4ff;
}

.stat-value {
  color: #1f2a3d;
  font-size: 24px;
  line-height: 1;
  font-weight: 700;
}

.stat-label {
  margin-top: 6px;
  color: #8a94a6;
  font-size: 13px;
}

.answer-strip,
.wrong-panel {
  padding: 16px;
  border-radius: 8px;
  background: #f8fafc;
}

.wrong-panel {
  margin-top: 12px;
  background: #fff8f8;
}

.strip-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.strip-head span {
  color: #1f2a3d;
  font-size: 15px;
  font-weight: 700;
}

.strip-head em {
  color: #8a94a6;
  font-size: 13px;
  font-style: normal;
}

.question-dots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
  gap: 8px;
}

.question-dot {
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
}

.question-dot.correct {
  background: #2fb06f;
}

.question-dot.wrong {
  background: #e35d5d;
}

.question-dot.unanswered {
  background: #a8b0bd;
}

.wrong-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 126px;
  overflow: auto;
}

.wrong-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  background: #ffffff;
  color: #6b7485;
  font-size: 13px;
}

.wrong-index {
  color: #e35d5d;
  font-weight: 700;
}

.confirm-btn {
  min-width: 112px;
}

@media (max-width: 640px) {
  .result-shell {
    padding: 18px;
  }

  .result-header,
  .result-body {
    display: flex;
    flex-direction: column;
  }

  .result-body {
    gap: 14px;
    padding-top: 18px;
  }

  .time-pill {
    align-self: flex-start;
  }

  .score-panel {
    width: 100%;
    min-height: 200px;
  }

  .chart-container {
    width: 200px;
    height: 200px;
  }

  .score-copy strong {
    font-size: 46px;
    line-height: 200px;
  }

  .stats-panel {
    width: 100%;
  }

  .wrong-item {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
}
</style>

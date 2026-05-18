<template>
  <el-dialog title="测试结果" v-model="dialogVisible" width="50%" @open="handleDialogOpen">
    <template #footer>
      <el-button type="primary" @click="dialogVisible = false">确定</el-button>
    </template>
    <el-row :gutter="24">
      <el-col :span="16">
        <div ref="pieChartRef" class="chart-container"></div>
      </el-col>
      <el-col :span="8" class="result-container">
        <el-card class="result-item" shadow="never">
          <template #header>
            <div class="result-item-label">正确数</div>
          </template>
          <div class="result-item-value">{{ testResult?.correctCount || 0 }}</div>
        </el-card>
        <el-card class="result-item" shadow="never">
          <template #header>
            <div class="result-item-label">错误数</div>
          </template>
          <div class="result-item-value">{{ testResult?.wrongCount || 0 }}</div>
        </el-card>
        <el-card class="result-item" shadow="never">
          <template #header>
            <div class="result-item-label">未回答</div>
          </template>
          <div class="result-item-value">{{ (questions?.length || 0) - (testResult?.correctCount || 0) -
            (testResult?.wrongCount || 0) }}</div>
        </el-card>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script setup lang="ts">
import { useTestPaperStore } from '@/stores/testpaper'
import { storeToRefs } from 'pinia';
import { ref, onUnmounted, nextTick, computed } from 'vue';
import * as echarts from 'echarts';
const { dialogVisible, testResult, questions } = storeToRefs(useTestPaperStore())
const pieChartRef = ref<HTMLDivElement>()
const score = computed(() => Math.round((testResult.value?.correctCount || 0) / (questions.value?.length || 0) * 100))
const pieChart = ref<echarts.ECharts>()
const initChart = () => {
  if (!pieChartRef.value) {
    console.warn('Chart container not found')
    return
  }
  if (pieChart.value) {
    pieChart.value.dispose()
  }
  try {
    pieChart.value = echarts.init(pieChartRef.value)
    const option = {
      title: {
        text: `${score.value}分`,
        textStyle: {
          fontSize: 36,
          fontWeight: '600',
          color: score.value >= 60 ? '#6CB77B' : '#F56C6C'
        },
        left: 'center',
        top: 'center'
      },
      legend: {
        data: ['正确数', '错误数', '未回答']
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      color: ['#67C23A', '#F56C6C', '#909399'],
      series: [
        {
          name: '测试结果',
          type: 'pie',
          radius: ['40%', '60%'],
          data: [
            {
              value: testResult.value?.correctCount || 0,
              name: '正确数',
              itemStyle: {
                color: '#67C23A'
              }
            },
            {
              value: testResult.value?.wrongCount || 0,
              name: '错误数',
              itemStyle: {
                color: '#F56C6C'
              }
            },
            {
              value: (questions.value?.length || 0) - (testResult.value?.correctCount || 0) - (testResult.value?.wrongCount || 0),
              name: '未回答',
              itemStyle: {
                color: '#909399'
              }
            }
          ]
        }
      ]
    }
    pieChart.value.setOption(option)
    pieChart.value.resize()
  } catch (error) {
    console.error('Failed to init chart:', error)
  }
}
const handleDialogOpen = async () => {
  await nextTick()
  initChart()
}
onUnmounted(() => {
  if (pieChart.value) {
    pieChart.value.dispose()
    pieChart.value = undefined
  }
})
</script>
<style scoped>
.chart-container {
  flex: 1;
  height: 450px;
  transform: translateY(-10%);
}

.result-container {
  flex: 1;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.result-item {
  width: 100%;
  margin-bottom: 20px;
}

.result-item-label {
  font-size: 16px;
  font-weight: bold;
}

.result-item-value {
  font-size: 24px;
  font-weight: bold;
}

.container {}
</style>

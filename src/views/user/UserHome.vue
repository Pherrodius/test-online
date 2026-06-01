<template>
  <div class="user-page">
    <div class="page-header">
      <div>
        <p class="eyebrow">学习概览</p>
        <h2>欢迎回来，继续保持节奏</h2>
      </div>
      <el-button type="primary" :icon="EditPen" @click="startPractice">开始练习</el-button>
    </div>

    <el-row :gutter="16" class="stats">
      <el-col v-for="item in stats" :key="item.label" :xs="24" :sm="12" :lg="6">
        <div class="stat-card">
          <el-icon :size="24" :color="item.color">
            <component :is="item.icon" />
          </el-icon>
          <div>
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="15">
        <section class="panel">
          <div class="panel-title">
            <h3>最近的测试</h3>
            <el-button text>查看全部</el-button>
          </div>
          <el-table :data="overview?.recentRecords" style="width: 100%">
            <el-table-column label="题库">
              <template #default="{ row }">
                {{ row.bank.name }}
              </template>
            </el-table-column>
            <el-table-column label="学科">
              <template #default="{ row }">
                {{ row.discipline.name }}
              </template>
            </el-table-column>
            <el-table-column label="正确率">
              <template #default="{ row }"> {{ row.accuracy * 100 }}% </template>
            </el-table-column>
            <el-table-column prop="takenTime" label="时间">
              <template #default="{ row }">
                {{ dayjs(row.takenTime).format('mm:ss') }}
              </template>
            </el-table-column>
          </el-table>
        </section>
      </el-col>
      <el-col :xs="24" :lg="9">
        <section class="panel">
          <div class="panel-title">
            <h3>待办提醒</h3>
            <el-button text type="primary" :icon="Plus" @click="addTodo">新增</el-button>
          </div>
          <div class="todo-editor">
            <el-input
              v-model="newTodoText"
              placeholder="添加新的待办提醒"
              clearable
              @keyup.enter="addTodo"
            />
          </div>
          <div v-if="todos.length" class="todo-list">
            <div v-for="item in todos" :key="item.id" class="todo-item">
              <el-checkbox v-model="item.done" @change="saveTodos" />
              <el-input
                v-if="editingTodoId === item.id"
                v-model="editingTodoText"
                class="todo-edit-input"
                size="small"
                maxlength="40"
                @keyup.enter="confirmEditTodo(item)"
                @keyup.esc="cancelEditTodo"
              />
              <button
                v-else
                type="button"
                class="todo-text"
                :class="{ done: item.done }"
                @click="startEditTodo(item)"
              >
                {{ item.text }}
              </button>
              <div class="todo-actions">
                <el-button
                  v-if="editingTodoId === item.id"
                  link
                  type="primary"
                  :icon="Check"
                  @click="confirmEditTodo(item)"
                />
                <el-button v-else link type="primary" :icon="Edit" @click="startEditTodo(item)" />
                <el-button link type="danger" :icon="Delete" @click="removeTodo(item.id)" />
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无待办" :image-size="80" />
        </section>
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" title="Tips" width="500px" :before-close="handleDialogClose">
      <template #header>
        <h3>从收藏的题库开始吧</h3>
      </template>
      <div
        v-for="bank in overview?.collectedBank.map((b) => b.bank)"
        :key="bank.id"
        class="bank-item"
      >
        <BankRecord :bank="bank" :title="false" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getOverview } from '@/api/user'
import type { getOverviewResponse } from '@/types/response'
import {
  Check,
  Collection,
  Delete,
  Edit,
  EditPen,
  Plus,
  Star,
  WarningFilled,
} from '@element-plus/icons-vue'
import { dayjs } from 'element-plus'
import { computed, markRaw, onMounted, ref } from 'vue'
import BankRecord from '@/components/BankRecord.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const dialogVisible = ref(false)
const overview = ref<getOverviewResponse>()
const handleDialogClose = (done: () => void) => {
  done()
}

const stats = ref([
  {
    label: '累计练习',
    value: computed(() => `${overview.value?.practiceCount || 0}题`),
    icon: markRaw(EditPen),
    color: '#409eff',
  },
  {
    label: '错题数量',
    value: computed(() => `${overview.value?.mistakeCount || 0}题`),
    icon: markRaw(WarningFilled),
    color: '#f56c6c',
  },
  {
    label: '收藏题目',
    value: computed(() => `${overview.value?.noteCount || 0}题`),
    icon: markRaw(Star),
    color: '#e6a23c',
  },
  {
    label: '收藏题库',
    value: computed(() => `${overview.value?.collectedBank.length || 0}个`),
    icon: markRaw(Collection),
    color: '#67c23a',
  },
])

const startPractice = () => {
  if (stats.value[3]?.value) {
    dialogVisible.value = true
    return
  }
  router.push('/bank/category/0')
}
interface TodoItem {
  id: number
  text: string
  done: boolean
}

const todoStorageKey = 'user-home-todos'
const defaultTodos: TodoItem[] = [
  { id: 1, text: '复习 12 道高频错题', done: false },
  { id: 2, text: '完善个人学习目标', done: false },
  { id: 3, text: '整理本周收藏题目', done: false },
  { id: 4, text: '上传新的练习文件', done: false },
]
const todos = ref<TodoItem[]>([])
const newTodoText = ref('')
const editingTodoId = ref<number | null>(null)
const editingTodoText = ref('')

const saveTodos = () => {
  localStorage.setItem(todoStorageKey, JSON.stringify(todos.value))
}

const loadTodos = () => {
  const savedTodos = localStorage.getItem(todoStorageKey)
  if (!savedTodos) {
    todos.value = [...defaultTodos]
    saveTodos()
    return
  }

  try {
    const parsedTodos = JSON.parse(savedTodos) as TodoItem[]
    todos.value = parsedTodos.length ? parsedTodos : []
  } catch {
    todos.value = [...defaultTodos]
    saveTodos()
  }
}

const addTodo = () => {
  const text = newTodoText.value.trim()
  if (!text) return

  todos.value.unshift({
    id: Date.now(),
    text,
    done: false,
  })
  newTodoText.value = ''
  saveTodos()
}

const startEditTodo = (item: TodoItem) => {
  editingTodoId.value = item.id
  editingTodoText.value = item.text
}

const cancelEditTodo = () => {
  editingTodoId.value = null
  editingTodoText.value = ''
}

const confirmEditTodo = (item: TodoItem) => {
  const text = editingTodoText.value.trim()
  if (!text) return

  item.text = text
  cancelEditTodo()
  saveTodos()
}

const removeTodo = (id: number) => {
  todos.value = todos.value.filter((item) => item.id !== id)
  saveTodos()
}
onMounted(async () => {
  loadTodos()
  overview.value = await getOverview()
})
</script>

<style scoped lang="scss">
.user-page {
  padding: 24px;
}

.page-header,
.panel,
.stat-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(31, 45, 61, 0.06);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  margin-bottom: 16px;

  h2 {
    margin: 4px 0 0;
    font-size: 24px;
  }
}

.eyebrow {
  margin: 0;
  color: #409eff;
  font-size: 13px;
}

.stats {
  margin-bottom: 16px;
}

.stat-card {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 20px;
  margin-bottom: 16px;

  strong,
  span {
    display: block;
  }

  strong {
    font-size: 22px;
    color: #1f2d3d;
  }

  span {
    color: #7a8699;
    margin-top: 4px;
  }
}

.panel {
  padding: 20px;
  min-height: 320px;
  margin-bottom: 16px;
}

.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  h3 {
    margin: 0;
    font-size: 18px;
  }
}

.todo-editor {
  margin-bottom: 14px;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  min-height: 40px;
  padding: 8px 10px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #fafcff;
}

.todo-text {
  overflow: hidden;
  padding: 0;
  border: 0;
  color: #1f2d3d;
  font: inherit;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: transparent;
  cursor: pointer;

  &.done {
    color: #a8abb2;
    text-decoration: line-through;
  }
}

.todo-edit-input {
  min-width: 0;
}

.todo-actions {
  display: flex;
  align-items: center;
}

:deep(.el-dialog) {
  padding: 12px 36px;
  border-radius: 24px;
  .el-dialog__body {
    min-height: 50vh;
    display: flex;
    gap: 12px;
    flex-direction: column;
    justify-content: flex-start;
  }
}
.bank-item {
  overflow: hidden;
  border-radius: 40px;
  background-color: #fff;
  box-shadow: 1px 2px 4px 1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 2px 4px 8px 2px rgba(84, 142, 247, 0.2);
    scale: 1.02;
  }
}
</style>

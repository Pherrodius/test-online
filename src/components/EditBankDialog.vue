<template>
  <el-dialog
    :width="dialogWidth"
    class="edit-bank-dialog"
    @close="handleDialogClose"
    :draggable="true"
  >
    <template #header v-if="form.id !== 0">编辑 {{ form.name }}</template>
    <template #header v-else>新建题库</template>
    <template #footer>
      <el-button type="primary" @click="saveEdit" v-if="form.id !== 0">保存</el-button>
      <el-button type="primary" @click="createNewBank" v-else>创建</el-button>
    </template>
    <el-form ref="formRef" :model="form" label-width="90px" class="bank-form">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入题库名称"></el-input>
      </el-form-item>

      <el-form-item label="简介" prop="description">
        <el-input v-model="form.description" placeholder="请输入题库简介"></el-input>
      </el-form-item>

      <el-form-item
        v-for="(d, index) in form.disciplines"
        :key="index"
        :label="`学科${index + 1}`"
        prop="disciplines"
      >
        <div class="discipline-row">
          <el-input
            v-model="d.name"
            placeholder="请输入该学科名称"
            @blur="!d.name && removeDiscipline(index)"
          ></el-input>
          <el-button
            class="delete-button"
            type="danger"
            circle
            plain
            @click="removeDiscipline(index)"
          >
            <el-icon size="18px">
              <Close />
            </el-icon>
          </el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" plain @click="form.disciplines.push({ id: 0, name: '' })">
          <el-icon size="18px">
            <Plus />
          </el-icon>
          添加学科
        </el-button>
      </el-form-item>

      <el-form-item label="分类名" prop="categoryName">
        <el-input v-model="form.categoryName" placeholder="请输入分类（可选）"></el-input>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { createBank, updateBank } from '@/api/bank'
import type { Bank, Discipline } from '@/types/prisma'
import type { CreateBankRequest } from '@/types/reqeust'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
const dialogWidth = computed(() => {
  if (window.innerWidth <= 767) return '92vw'
  if (window.innerWidth <= 1200) return '70vw'
  return '600px'
})
const resetForm = () => ({
  id: 0,
  name: '',
  description: '',
  disciplines: [] as Discipline[],
  categoryName: '',
})
const form = ref(resetForm())

const props = defineProps<{
  bank?: Bank & { disciplines: Discipline[] }
}>()

const removeDiscipline = (index: number) => {
  form.value.disciplines.splice(index, 1)
}

watch(
  () => form.value,
  () => {
    console.log(form.value)
  },
  { deep: true },
)
onMounted(() => {
  if (!props.bank) return
  form.value = {
    ...props.bank,
    disciplines: JSON.parse(JSON.stringify(props.bank.disciplines)),
    categoryName: props.bank.category?.name || '',
  }
})
const handleDialogClose = () => {
  if (!props.bank) {
    form.value = resetForm()
    return
  }
  form.value = {
    ...props.bank,
    disciplines: JSON.parse(JSON.stringify(props.bank.disciplines)),
    categoryName: props.bank.category?.name || '',
  }
}
const createNewBank = () => {
  if (!form.value.name) return ElMessage.error('请输入题库名称')
  if (!form.value.disciplines.length) return ElMessage.error('至少添加一个学科')
  const payload: CreateBankRequest = {
    name: form.value.name,
    description: form.value.description,
    disciplines: form.value.disciplines.map((d) => d.name),
    categoryName: form.value.categoryName,
  }
  createBank(payload)
    .then(() => {
      handleDialogClose()
      ElMessage.success('创建成功')
    })
    .catch((err) => {
      console.error(err)
      ElMessage.error('创建失败')
    })
}
const saveEdit = () => {
  if (!form.value.name) return ElMessage.error('请输入题库名称')
  if (!form.value.disciplines.length) return ElMessage.error('至少添加一个学科')
  const payload: CreateBankRequest = {
    name: form.value.name,
    description: form.value.description,
    disciplines: form.value.disciplines.map((d) => d.name),
    categoryName: form.value.categoryName,
  }
  updateBank(form.value.id, payload)
    .then(() => {
      handleDialogClose()
      ElMessage.success('保存成功')
    })
    .catch((err) => {
      console.error(err)
      ElMessage.error('保存失败')
    })
}
</script>

<style scoped>
.bank-form {
  padding-top: 8px;
}

.discipline-row {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
}

.discipline-row .el-input {
  flex: 1;
}

.delete-button {
  flex: 0 0 32px;
}
</style>

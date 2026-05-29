import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const practiceConfig = ref(
    localStorage.getItem('practiceConfig')
      ? JSON.parse(localStorage.getItem('practiceConfig')!)
      : {
          autoCheck: true,
          random: false,
        },
  )
  const testConfig = ref(
    localStorage.getItem('testConfig')
      ? JSON.parse(localStorage.getItem('testConfig')!)
      : {
          amount: 20,
        },
  )
  watch(
    () => practiceConfig.value,
    (newVal) => {
      localStorage.setItem('practiceConfig', JSON.stringify(newVal))
    },
    { deep: true, immediate: true },
  )
  watch(
    () => testConfig.value,
    (newVal) => {
      localStorage.setItem('testConfig', JSON.stringify(newVal))
    },
    { deep: true, immediate: true },
  )
  return { practiceConfig, testConfig }
})

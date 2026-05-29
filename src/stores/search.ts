import { defineStore } from 'pinia'
import { SearchType } from '@/types/prisma'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchBanks, searchDocuments, searchQuestions, searchUsers } from '@/api/search'
import type {
  SearchBanksReq,
  SearchDocumentsReq,
  SearchQuestionsReq,
  SearchUsersReq,
} from '@/types/reqeust'
export const useSearchStore = defineStore('search', () => {
  const route = useRoute()
  const router = useRouter()
  const isHome = computed(() => route.meta.home)
  const searchTabs = ref([
    {
      label: '题库',
      key: SearchType.Bank,
    },
    {
      label: '题目',
      key: SearchType.Question,
    },
    {
      label: '文档',
      key: SearchType.Document,
    },
    {
      label: '用户',
      key: SearchType.User,
    },
  ])
  const filterOptions = ref<
    SearchBanksReq | SearchQuestionsReq | SearchDocumentsReq | SearchUsersReq | null
  >(null)
  const currentType = ref<SearchType>((route.meta.type as SearchType) || SearchType.Bank)
  const currentInput = ref<string>((route.query.keyword as string) || '')
  const setSearchType = (type: SearchType) => {
    currentType.value = type
    if (!isHome.value) {
      filterOptions.value = null
      router.push(`/search/${type.toLowerCase()}`)
      handleSearch(currentInput.value)
    }
  }
  const handleSearch = (keyword?: string) => {
    const palyload = {
      keyword,
      ...filterOptions.value,
    }
    router.push(`/search/${currentType.value.toLowerCase()}?keyword=${keyword}`)
    switch (currentType.value) {
      case SearchType.Bank:
        searchBanks(palyload)
        break
      case SearchType.Question:
        searchQuestions(palyload)
        break
      case SearchType.Document:
        searchDocuments(palyload)
        break
      case SearchType.User:
        searchUsers(palyload)
        break
    }
  }

  return {
    searchTabs,
    currentType,
    currentInput,
    filterOptions,
    handleSearch,
    setSearchType,
  }
})

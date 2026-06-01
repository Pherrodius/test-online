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
import type {
  SearchBanksRes,
  SearchDocumentsRes,
  SearchQuestionsRes,
  SearchUsersRes,
} from '@/types/response'
export type Filter = Omit<
  SearchBanksReq & SearchQuestionsReq & SearchDocumentsReq & SearchUsersReq,
  'page' | 'keyword'
>
export const useSearchStore = defineStore('search', () => {
  const route = useRoute()
  const router = useRouter()
  const isHome = computed(() => route.meta.home)
  const page = ref<number>(1)
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
  const filterOptions = ref<Filter | null>(null)
  const currentType = ref<SearchType>((route.meta.type as SearchType) || SearchType.Bank)
  const currentInput = ref<string>((route.query.keyword as string) || '')
  const setSearchType = (type: SearchType) => {
    currentType.value = type
    if (!isHome.value) {
      page.value = 1
      result.value = null
      filterOptions.value = null
      router.push(`/search/${type.toLowerCase()}`)
      handleSearch()
    }
  }
  const result = ref<
    SearchQuestionsRes | SearchBanksRes | SearchDocumentsRes | SearchUsersRes | null
  >(null)
  const total = computed(() => result.value?.total ?? 0)
  const hasPagination = computed(() => total.value > 0)
  const handleSearch = async (payload?: number | string) => {
    if (typeof payload === 'number') {
      page.value = payload
    }
    if (typeof payload === 'string') {
      currentInput.value = payload
      page.value = 1
    }
    const palyload = {
      keyword: currentInput.value,
      ...filterOptions.value,
      page: page.value,
    }
    router.push(`/search/${currentType.value.toLowerCase()}?keyword=${currentInput.value}`)
    switch (currentType.value) {
      case SearchType.Bank:
        result.value = await searchBanks(palyload)
        break
      case SearchType.Question:
        result.value = await searchQuestions(palyload)
        break
      case SearchType.Document:
        result.value = await searchDocuments(palyload)
        break
      case SearchType.User:
        result.value = await searchUsers(palyload)
        break
    }
  }
  const handleSearchFromFirstPage = async () => {
    page.value = 1
    await handleSearch()
  }
  const handlePageChange = async (nextPage: number) => {
    await handleSearch(nextPage)
  }

  return {
    searchTabs,
    currentType,
    currentInput,
    filterOptions,
    result,
    page,
    total,
    hasPagination,
    handleSearch,
    handleSearchFromFirstPage,
    handlePageChange,
    setSearchType,
  }
})

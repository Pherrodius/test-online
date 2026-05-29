import { SearchType } from '@/types/prisma'
import { ElMessage } from 'element-plus'
import { createRouter, createWebHistory } from 'vue-router'
const homeRoutes = [
  {
    path: '/',
    alias: '/home',
    component: () => import('@/views/home/HomeComponent.vue'),
    meta: {
      home: true,
    },
  },
  {
    path: '/bank/category',
    redirect: '/bank/category/0',
    meta: {
      home: true,
    },
  },
  {
    path: '/bank/category/:id',
    component: () => import('@/views/home/BankCategory.vue'),
    meta: {
      home: true,
    },
  },
]
const authRoutes = [
  {
    path: '/auth',
    component: () => import('@/components/AuthLayout.vue'),
    redirect: '/auth/login',
    children: [
      {
        path: '/auth/login',
        component: () => import('@/views/auth/LoginComponent.vue'),
        meta: {
          home: false,
          auth: false,
        },
      },
      {
        path: '/auth/register',
        component: () => import('@/views/auth/RegisterComponent.vue'),
        meta: {
          home: false,
          auth: false,
        },
      },
    ],
  },
]
const bussinessRoutes = [
  {
    path: '/collection/:type',
    component: () => import('@/views/bussiness/QCIB.vue'),
    meta: {
      home: false,
      auth: true,
    },
  },
  {
    path: '/bank/:id',
    component: () => import('@/views/bussiness/BankDetail.vue'),
    meta: {
      home: false,
      auth: false,
    },
    props: true,
  },
  {
    path: '/question/:id',
    component: () => import('@/views/bussiness/QuestionDetail.vue'),
    meta: {
      home: false,
      auth: false,
    },
    props: true,
  },
  {
    path: '/test',
    component: () => import('@/views/bussiness/TestPaper.vue'),
    meta: {
      home: false,
      auth: true,
    },
  },
]
const userRoutes = [
  {
    path: '/mine',
    redirect: '/user',
  },
  {
    path: '/user',
    component: () => import('@/views/user/UserLayout.vue'),
    meta: {
      home: false,
      auth: true,
    },
    children: [
      {
        path: '',
        component: () => import('@/views/user/UserHome.vue'),
      },
      {
        path: 'profile',
        component: () => import('@/views/user/UserProfile.vue'),
      },
      {
        path: 'collections/:type',
        component: () => import('@/views/user/UserCollections.vue'),
      },
      {
        path: 'testHistory',
        component: () => import('@/views/user/UserTestHistory.vue'),
      },
      {
        path: 'resolutions',
        component: () => import('@/views/user/UserResolutions.vue'),
      },
      {
        path: 'banks',
        component: () => import('@/views/user/UserBanks.vue'),
      },
      {
        path: 'documents',
        component: () => import('@/views/user/UserDocuments.vue'),
      },
      {
        path: 'settings',
        component: () => import('@/views/user/UserSettings.vue'),
      },
    ],
  },
]
const searchRoutes = [
  {
    path: '/search',
    component: () => import('@/views/search/SearchLayout.vue'),
    meta: {
      home: false,
      auth: false,
    },
    children: [
      {
        path: 'question',
        component: () => import('@/views/search/SearchQuestion.vue'),
        meta: {
          home: false,
          auth: false,
          type: SearchType.Question,
        },
      },
      {
        path: 'bank',
        component: () => import('@/views/search/SearchBank.vue'),
        meta: {
          home: false,
          auth: false,
          type: SearchType.Bank,
        },
      },
      {
        path: 'document',
        component: () => import('@/views/search/SearchDocument.vue'),
        meta: {
          home: false,
          auth: false,
          type: SearchType.Document,
        },
      },
      {
        path: 'user',
        component: () => import('@/views/search/SearchUser.vue'),
        meta: {
          home: false,
          auth: false,
          type: SearchType.User,
        },
      },
    ],
  },
]
const routes = [
  {
    path: '/',
    component: () => import('@/components/LayoutComponent.vue'),
    children: [...homeRoutes, ...bussinessRoutes, ...authRoutes, ...userRoutes],
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...routes, ...searchRoutes],
})
router.beforeEach((to) => {
  if (!to.meta.auth) {
    return true
  } else {
    if (localStorage.getItem('token')) {
      return true
    } else {
      ElMessage.warning('请先登录')
      return `/auth/login?redirect=${to.fullPath}`
    }
  }
})
export default router

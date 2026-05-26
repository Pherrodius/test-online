import { createRouter, createWebHistory } from 'vue-router'
const homeRoutes = [
  {
    path: '/',
    component: () => import('@/views/HomeComponent.vue'),
    meta: {
      home: true,
    },
  },
  {
    path: '/bank/category',
    component: () => import('@/views/BankCategory.vue'),
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
    component: () => import('@/views/bussiness/BankCollection.vue'),
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
const routes = [
  {
    path: '/',
    component: () => import('@/components/LayoutComponent.vue'),
    children: [...homeRoutes, ...bussinessRoutes, ...authRoutes],
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})
router.beforeEach((to) => {
  if (!to.meta.auth) {
    return true
  } else {
    if (localStorage.getItem('token')) {
      return true
    } else {
      return `/auth/login?redirect=${to.fullPath}`
    }
  }
})
export default router

import { createRouter, createWebHistory } from 'vue-router'
const homeRoutes = [
  {
    path: '/',
    component: () => import('@/components/LayoutComponent.vue'),
    children: [
      {
        path: '/',
        component: () => import('@/views/HomeComponent.vue'),
        meta: {
          home: true,
        },
      },
      {
        path: '/collection',
        component: () => import('@/views/CollectionComponent.vue'),
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
      {
        path: '/bank/:id',
        component: () => import('@/views/bussiness/BankDetail.vue'),
        meta: {
          home: false,
        },
        props: true,
      },
      {
        path: '/question/:id',
        component: () => import('@/views/bussiness/QuestionDetail.vue'),
        meta: {
          home: false,
        },
        props: true,
      },
    ],
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: homeRoutes,
})

export default router

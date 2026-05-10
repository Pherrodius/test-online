import { createRouter, createWebHistory } from 'vue-router'
const frontRoutes = [
  {
    path: '/',
    component: () => import('@/components/LayoutComponent.vue'),
    children: [
      {
        path: '/',
        component: () => import('@/views/HomeComponent.vue'),
      },
      {
        path: '/collection',
        component: () => import('@/views/CollectionComponent.vue'),
      },
      {
        path: '/questionBank',
        component: () => import('@/views/QuestionBank.vue'),
      },
    ],
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: frontRoutes,
})

export default router

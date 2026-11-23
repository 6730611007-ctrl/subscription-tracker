const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../pages/SubscriptionsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('../pages/AddSubPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'edit/:id',
        name: 'edit',
        component: () => import('../pages/EditSubPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../pages/UsersPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('../pages/LoginPage.vue'),
        meta: { requiresAuth: false },
      },
      
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
]

export default routes

import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from '../stores/authStore'
import { Notify } from 'quasar'

export default route(function () {
  const createHistory = import.meta.env.SSR
    ? createMemoryHistory
    : import.meta.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    Notify.create({
      type: 'warning',
      message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน',
      position: 'top-right'
    })
    next({ name: 'login' })
  } else if (to.meta.requiresAdmin && authStore.role !== 'admin') {
    Notify.create({
      type: 'negative',
      message: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้',
      position: 'top-right'
    })
    next({ name: 'home' })
  } else if (to.name === 'login' && authStore.isLoggedIn) {
    next({ name: 'home' })
  } else {
    next()
  }
})

  return Router
})

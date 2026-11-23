<template>
  <q-layout view="lHh Lpr lFf" class="app-layout">
    <q-header class="main-header">
      <q-toolbar class="header-toolbar">
        <q-btn
          v-if="authStore.isLoggedIn"
          flat
          round
          dense
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="menu-toggle-btn"
        />

        <q-toolbar-title class="header-brand cursor-pointer" @click="router.push('/')">
          <div class="brand-badge">
            <q-icon name="subscriptions" size="18px" />
          </div>
          <span class="brand-text">Sub<span class="brand-highlight">Tracker</span></span>
        </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          :color="$q.dark.isActive ? 'amber-4' : 'grey-7'"
          @click="toggleDarkMode"
          class="dark-toggle-btn"
        >
          <q-tooltip>
            {{ $q.dark.isActive ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด' }}
          </q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="authStore.isLoggedIn"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="280"
      class="nav-drawer"
    >
      <div class="drawer-container">
        <div v-if="authStore.user" class="profile-card">
          <div class="avatar-wrapper">
            <q-avatar size="60px" class="profile-avatar">
              <q-icon name="person" size="32px" />
            </q-avatar>
          </div>

          <div class="user-info">
            <h4 class="user-name">{{ authStore.user.name }}</h4>
            <div class="role-badge">
              <span class="role-dot"></span>
              <span>Role: {{ authStore.role || 'user' }}</span>
            </div>
          </div>

          <button type="button" @click="onLogout" class="btn-logout">
            <q-icon name="logout" size="16px" />
            <span>ออกจากระบบ</span>
          </button>
        </div>

        <q-separator v-if="authStore.user" class="drawer-divider" />

        <div class="menu-section-label">เมนูหลัก</div>
        <q-list class="nav-list">
          <q-item
            clickable
            v-ripple
            @click="router.push('/')"
            :active="$route.path === '/'"
            active-class="nav-item-active"
            class="nav-item"
          >
            <q-item-section avatar class="nav-icon-sec">
              <q-icon name="dashboard" class="nav-icon" />
            </q-item-section>
            <q-item-section class="nav-label">รายการ Subscription</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="router.push('/add')"
            :active="$route.path === '/add'"
            active-class="nav-item-active"
            class="nav-item"
          >
            <q-item-section avatar class="nav-icon-sec">
              <q-icon name="add_circle" class="nav-icon" />
            </q-item-section>
            <q-item-section class="nav-label">เพิ่มรายการใหม่</q-item-section>
          </q-item>

          <q-item
            v-if="authStore.role === 'admin'"
            clickable
            v-ripple
            @click="router.push('/users')"
            :active="$route.path === '/users'"
            active-class="nav-item-active"
            class="nav-item"
          >
            <q-item-section avatar class="nav-icon-sec">
              <q-icon name="group" class="nav-icon" />
            </q-item-section>
            <q-item-section class="nav-label">จัดการผู้ใช้งาน</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container class="main-page-container">
      <router-view />
    </q-page-container>

    <q-dialog v-model="logoutDialog" persistent>
      <q-card style="min-width: 320px; border-radius: 16px" class="q-pa-sm shadow-4 logout-card">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="logout" color="red-1" text-color="negative" size="48px" class="q-mr-md" />
          <div>
            <div class="text-h6 text-weight-bold" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">ออกจากระบบ</div>
            <div class="text-body2 text-grey-7 q-mt-xs">คุณแน่ใจหรือไม่ที่จะออกจากระบบ?</div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-mt-md q-mb-xs q-mr-xs">
          <q-btn flat label="ยกเลิก" color="grey-7" v-close-popup class="text-weight-bold" style="border-radius: 8px" />
          <q-btn unelevated label="ยืนยันออกจากระบบ" color="negative" @click="confirmLogout" class="text-weight-bold q-px-md" style="border-radius: 8px" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/authStore'

const leftDrawerOpen = ref(false)
const router = useRouter()
const $q = useQuasar()
const logoutDialog = ref(false)
const authStore = useAuthStore()

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleDarkMode = () => {
  $q.dark.toggle()
  localStorage.setItem('darkMode', $q.dark.isActive)
}

onMounted(() => {
  if (localStorage.getItem('darkMode') === 'true') {
    $q.dark.set(true)
  }
})

const onLogout = () => {
  logoutDialog.value = true
}

const confirmLogout = () => {
  authStore.logout()
  logoutDialog.value = false

  $q.notify({
    type: 'positive',
    message: 'ออกจากระบบเรียบร้อยแล้ว',
    position: 'top-right',
    timeout: 2000,
    icon: 'check_circle'
  })

  router.replace('/login')
}
</script>

<style scoped>
.app-layout {
  background-color: #f8fafc;
  min-height: 100vh;
}

.main-page-container {
  background-color: #f8fafc;
}

.main-header {
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.15);
}

.header-toolbar {
  min-height: 2.75rem;
  padding: 0 1rem;
}

.menu-toggle-btn {
  color: #94a3b8;
  transition: color 0.2s ease;
}

.menu-toggle-btn:hover {
  color: #0284c7;
}

.dark-toggle-btn {
  transition: transform 0.2s ease;
}

.dark-toggle-btn:hover {
  transform: scale(1.08);
}

.header-brand {
  display: flex;
  align-items: center;
}

.brand-badge {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 0.625rem;
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.35);
}

.brand-text {
  font-size: 1rem;
  font-weight: 800;
  color: #010101;
  letter-spacing: -0.01em;
}

.brand-highlight {
  color: #38bdf8;
}

.nav-drawer {
  background-color: #ffffff;
  border-right: 1px solid #f1f5f9;
}

.drawer-container {
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem 1rem;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
  margin-bottom: 1rem;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 0.75rem;
}

.profile-avatar {
  background: linear-gradient(135deg, #0284c7, #0369a1) !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
  border: 3px solid #ffffff;
}

.user-info {
  text-align: center;
  margin-bottom: 1rem;
}

.user-name {
  font-size: 0.9375rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.2rem 0.625rem;
  border-radius: 9999px;
  background-color: #e0f2fe;
  color: #0369a1;
  font-size: 0.6875rem;
  font-weight: 700;
}

.role-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background-color: #0284c7;
}

.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #fecdd3;
  background-color: #fff1f2;
  color: #e11d48;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background-color: #ffe4e6;
  border-color: #fda4af;
  transform: translateY(-1px);
}

.drawer-divider {
  background-color: #f1f5f9;
  margin: 0.5rem 0 1.25rem 0;
}

.menu-section-label {
  font-size: 0.6875rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0 0.75rem;
  margin-bottom: 0.5rem;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0;
}

.nav-item {
  border-radius: 0.875rem;
  min-height: 2.75rem;
  padding: 0.5rem 0.875rem;
  color: #475569;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: #f8fafc;
  color: #0284c7;
}

.nav-icon-sec {
  min-width: 2.25rem;
}

.nav-icon {
  font-size: 1.25rem;
  color: #64748b;
  transition: color 0.2s ease;
}

.nav-item:hover .nav-icon {
  color: #0284c7;
}

.nav-label {
  font-size: 0.8125rem;
  font-weight: 700;
}

.nav-item-active {
  background-color: #f0f9ff !important;
  color: #0284c7 !important;
  border-left: 4px solid #0284c7;
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.08);
}

.nav-item-active .nav-icon {
  color: #0284c7 !important;
}

:global(.body--dark) .app-layout,
:global(.body--dark) .main-page-container {
  background-color: #000000;
  color: #ffffff;
}

:global(.body--dark) .main-header {
  background: #000000 !important;
  border-bottom: 1px solid #27272a;
  box-shadow: none;
}

:global(.body--dark) .brand-text,
:global(.body--dark) .menu-toggle-btn,
:global(.body--dark) .user-name,
:global(.body--dark) .menu-section-label,
:global(.body--dark) .nav-item,
:global(.body--dark) .nav-icon,
:global(.body--dark) .nav-label {
  color: #ffffff !important;
}

:global(.body--dark) .nav-drawer {
  background-color: #000000;
  border-right: 1px solid #27272a;
}

:global(.body--dark) .profile-card {
  background: #000000;
  border: 1px solid #27272a;
  box-shadow: none;
}

:global(.body--dark) .profile-avatar {
  border-color: #27272a;
}

:global(.body--dark) .role-badge {
  background-color: #111111;
  border: 1px solid #27272a;
  color: #ffffff;
}

:global(.body--dark) .btn-logout {
  background-color: #000000;
  border: 1px solid #e11d48;
  color: #ffffff;
}

:global(.body--dark) .btn-logout:hover {
  background-color: #e11d48;
  color: #ffffff;
}

:global(.body--dark) .drawer-divider {
  background-color: #27272a;
}

:global(.body--dark) .nav-item:hover {
  background-color: #111111;
}

:global(.body--dark) .nav-item-active {
  background-color: #111111 !important;
  color: #ffffff !important;
  border-left: 4px solid #38bdf8;
}

:global(.body--dark) .nav-item-active .nav-icon {
  color: #38bdf8 !important;
}

:global(.body--dark) .logout-card {
  background-color: #000000;
  border: 1px solid #27272a;
  color: #ffffff;
}
</style>
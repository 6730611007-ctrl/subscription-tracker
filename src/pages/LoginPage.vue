<template>
  <q-page class="flex flex-center login-bg q-pa-md">
    <q-card flat class="login-card q-pa-lg q-pa-sm-xl">
      <div class="text-center q-mb-lg">
        <div class="flex flex-center q-mb-sm">
          <q-avatar size="54px" class="brand-avatar">
            <q-icon name="subscriptions" size="28px" color="white" />
          </q-avatar>
        </div>
        <div class="text-h5 text-weight-bolder text-grey-9">Subscription Tracker</div>
        <div class="text-body2 text-grey-6 q-mt-xs">เข้าสู่ระบบเพื่อจัดการค่าบริการรายเดือน</div>
      </div>

      <q-form @submit.prevent="handleLogin" class="q-gutter-y-md">
        <q-input
          v-model="username"
          outlined
          rounded
          bg-color="white"
          label="ชื่อผู้ใช้งาน (Username)"
          lazy-rules
          :rules="[(val) => !!val || 'กรุณากรอกชื่อผู้ใช้งาน']"
        >
          <template v-slot:prepend>
            <q-icon name="person_outline" color="primary" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          outlined
          rounded
          bg-color="white"
          label="รหัสผ่าน (Password)"
          :type="showPassword ? 'text' : 'password'"
          lazy-rules
          :rules="[(val) => !!val || 'กรุณากรอกรหัสผ่าน']"
        >
          <template v-slot:prepend>
            <q-icon name="lock_outline" color="primary" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer text-grey-6"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-btn
          unelevated
          rounded
          color="primary"
          label="เข้าสู่ระบบ"
          type="submit"
          size="md"
          class="full-width q-py-sm text-weight-bold login-btn"
          :loading="isLoading"
        />
      </q-form>

      <div class="demo-box q-mt-lg q-pt-md">
        <div class="text-caption text-grey-7 text-weight-bold text-center q-mb-sm">
          บัญชีสำหรับทดสอบระบบ (คลิกเพื่อกรอกอัตโนมัติ)
        </div>

        <div class="q-gutter-y-sm">
          
            <div class="role-badge role-admin">
              <span class="role-dot"></span>
              <span>ADMIN</span>
            </div>
            <div class="text-caption text-weight-bold text-grey-8">
              admin / 123456
            </div>
          </div>

          
            <div class="role-badge role-user">
              <span class="role-dot"></span>
              <span>USER</span>
            </div>
            <div class="text-caption text-weight-bold text-grey-8">
              user / 123456
            </div>
          </div>
        
      
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  try {
    const success = await authStore.login(username.value, password.value)
    if (success) {
      $q.notify({
        type: 'positive',
        message: 'เข้าสู่ระบบสำเร็จ',
        position: 'top-right',
        timeout: 1500
      })
      router.push('/')
    } else if (success === false) {
      $q.notify({
        type: 'negative',
        message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง',
        position: 'top-right',
        timeout: 2000
      })
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-bg {
  background: radial-gradient(circle at top left, #e0f2fe 0%, #f8fafc 45%, #eff6ff 100%);
}

.brand-avatar {
  background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
  border-radius: 16px;
  box-shadow: 0 8px 18px -4px rgba(2, 132, 199, 0.35);
}

.login-card {
  width: 100%;
  max-width: 430px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 20px 40px -15px rgba(2, 132, 199, 0.12);
}

.login-btn {
  box-shadow: 0 8px 18px -6px rgba(2, 132, 199, 0.45);
}

.demo-box {
  background: transparent;
  border: none;
  border-top: 1px solid #e2e8f0;
  border-radius: 0;
}

.demo-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  transition: all 0.2s ease;
}

.demo-item:hover {
  background: #f0f9ff;
  border-color: #38bdf8;
  transform: translateY(-1px);
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
}

.role-dot {
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 9999px;
}

.role-admin {
  background-color: #ffedd5;
  color: #c2410c;
}

.role-admin .role-dot {
  background-color: #ea580c;
}

.role-user {
  background-color: #e0f2fe;
  color: #0369a1;
}

.role-user .role-dot {
  background-color: #0284c7;
}

:global(body.body--dark) .login-card .demo-box {
  background: transparent !important;
  border: none !important;
  border-top: 1px solid #27272a !important;
  border-radius: 0 !important;
}

:global(body.body--dark) .login-card .demo-item {
  background: #000000 !important;
  border: 1px solid #27272a !important;
}

:global(body.body--dark) .login-card .demo-item:hover {
  border-color: #38bdf8 !important;
}
</style>
<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card class="q-pa-lg shadow-4" style="width: 100%; max-width: 400px; border-radius: 12px;">
      <q-card-section class="text-center">
        <q-avatar size="60px" color="primary" text-color="white" icon="lock" class="q-mb-md" />
        <div class="text-h5 text-weight-bold">เข้าสู่ระบบ</div>
        <div class="text-caption text-grey-6">Subscription Tracker Management</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onLogin" class="q-gutter-md">
          <q-input
            v-model="username"
            label="Username"
            outlined
            dense
            :rules="[val => !!val || 'กรุณากรอก Username']"
          >
            <template #prepend><q-icon name="person" /></template>
          </q-input>

          <q-input
            v-model="password"
            type="password"
            label="Password"
            outlined
            dense
            :rules="[val => !!val || 'กรุณากรอก Password']"
          >
            <template #prepend><q-icon name="key" /></template>
          </q-input>

          <q-banner v-if="authStore.errorMessage" class="bg-red-1 text-negative rounded-borders">
            {{ authStore.errorMessage }}
          </q-banner>

          <q-btn
            type="submit"
            label="Login"
            color="primary"
            class="full-width"
            size="md"
            :loading="authStore.loading"
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center text-caption text-grey-7 q-pt-none">
        Demo Account: <strong>admin</strong> / <strong>123456</strong>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/authStore.js'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')

const onLogin = async () => {
  try {
    await authStore.login(username.value, password.value)
    $q.notify({ type: 'positive', message: `ยินดีต้อนรับ ${authStore.user.name}` })
    router.push({ name: 'home' })
  } catch {
    // Error handled in store
  }
}
</script>
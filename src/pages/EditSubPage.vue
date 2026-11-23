<template>
  <q-page padding class="q-pa-md" style="max-width: 600px; margin: auto">
    <q-card flat bordered class="q-pa-lg custom-form-card">
      <div class="text-h5 text-weight-bold q-mb-md">แก้ไขข้อมูล Subscription</div>

      <div v-if="isLoadingData" class="flex flex-center q-pa-xl">
        <q-spinner-tail color="primary" size="40px" />
      </div>

      <q-form v-else @submit.prevent="saveEdit" class="q-gutter-md">
        <q-input
          v-model="form.name"
          outlined
          label="ชื่อบริการ"
          :rules="[val => !!val || 'กรุณากรอกชื่อบริการ']"
        />

        <q-select
          v-model="form.category"
          :options="['Entertainment', 'AI & Dev', 'Cloud Storage', 'Music', 'Other']"
          outlined
          label="หมวดหมู่"
        />

        <q-input
          v-model.number="form.cost"
          type="number"
          outlined
          label="ค่าบริการ (บาท)"
          :rules="[val => val > 0 || 'ค่าบริการต้องมากกว่า 0']"
        />

        <q-select
          v-model="form.billingCycle"
          :options="['Monthly', 'Yearly']"
          outlined
          label="รอบการชำระเงิน"
        />

        <q-toggle v-model="form.active" label="สถานะกำลังใช้งาน (Active)" color="primary" />

        <div class="row justify-end q-gutter-sm q-mt-md">
          <q-btn flat rounded label="ยกเลิก" color="grey-7" @click="router.push('/')" />
          <q-btn unelevated rounded type="submit" label="บันทึกการแก้ไข" color="primary" :loading="isSaving" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useSubscriptionStore } from '../stores/subscriptionStore.js'
import { useAuthStore } from '../stores/authStore'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const subStore = useSubscriptionStore()
const authStore = useAuthStore()

const isLoadingData = ref(true)
const isSaving = ref(false)
const form = ref({
  name: '',
  category: '',
  cost: null,
  billingCycle: 'Monthly',
  active: true
})

onMounted(async () => {
  try {
    const data = await subStore.fetchSubscriptionById(route.params.id)
    if (authStore.role !== 'admin' && data.userId !== authStore.user?.id) {
      $q.notify({
        type: 'negative',
        message: 'คุณไม่มีสิทธิ์แก้ไขรายการของผู้อื่น',
        position: 'top-right'
      })
      router.replace('/')
      return
    }
    form.value = { ...data }
  } catch {
    router.replace('/')
  } finally {
    isLoadingData.value = false
  }
})

const saveEdit = async () => {
  isSaving.value = true
  try {
    await subStore.updateSubscription(route.params.id, { ...form.value })
    $q.notify({
      type: 'positive',
      message: 'แก้ไขข้อมูลเรียบร้อยแล้ว',
      position: 'top-right',
      timeout: 2000,
      icon: 'check_circle'
    })
    router.push('/')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
:deep(.q-field--outlined .q-field__control) {
  border-radius: 20px;
}

.custom-form-card {
  border: 1px solid #e0e0e0;
  border-radius: 30px;
  background-color: #ffffff;
}
</style>
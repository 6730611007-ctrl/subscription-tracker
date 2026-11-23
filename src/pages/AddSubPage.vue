<template>
  <q-page padding class="q-pa-md" style="max-width: 600px; margin: auto">
    <q-card flat bordered class="q-pa-lg custom-form-card">
      <div class="text-h5 text-weight-bold q-mb-md">เพิ่มรายการ Subscription</div>

      <q-form @submit.prevent="submitSub" class="q-gutter-md">
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
          :rules="[val => !!val || 'กรุณาเลือกหมวดหมู่']"
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
          <q-btn unelevated rounded type="submit" label="บันทึกข้อมูล" color="primary" :loading="subStore.isAdding" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useSubscriptionStore } from '../stores/subscriptionStore.js'

const router = useRouter()
const $q = useQuasar()
const subStore = useSubscriptionStore()

const form = ref({
  name: '',
  category: 'Entertainment',
  cost: null,
  billingCycle: 'Monthly',
  active: true
})

const submitSub = async () => {
  await subStore.addSubscription({ ...form.value })
  $q.notify({
    type: 'positive',
    message: 'เพิ่มรายการเรียบร้อยแล้ว',
    position: 'top-right',
    timeout: 2000,
    icon: 'check_circle'
  })
  router.push('/')
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
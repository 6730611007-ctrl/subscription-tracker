<template>
  <q-page padding class="q-pa-md" style="max-width: 800px; margin: auto">
    <div class="text-center q-mb-lg">
      <div class="flex flex-center q-mb-sm">
        <AppLogo :size="46" />
      </div>
      <div class="text-h4 text-weight-bold">Subscription Tracker</div>
      <div class="text-subtitle1 text-grey-7">ระบบจัดการและคำนวณค่าบริการรายเดือน</div>
    </div>

    <div v-if="subStore.isLoading" class="flex flex-center text-center q-my-xl" style="min-height: 200px">
      <q-spinner-tail color="primary" size="50px" />
    </div>

    <div v-else-if="subStore.errorMessage" class="text-center text-negative q-my-xl">
      <q-icon name="error" size="50px" />
      <div class="text-h6">{{ subStore.errorMessage }}</div>
    </div>

    <div v-else>
      <div class="row justify-between items-center q-mb-md q-gutter-sm">
        <div class="text-subtitle1 text-weight-bold">
          {{ authStore.role === 'admin' ? 'รายการทั้งหมดในระบบ' : 'รายการของฉัน' }} ({{ filteredList.length }})
        </div>
        <div class="row q-gutter-sm items-center">
          <q-input
            v-model="searchText"
            outlined
            dense
            rounded
            placeholder="ค้นหาชื่อบริการ..."
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            unelevated
            rounded
            color="primary"
            icon="add"
            label="เพิ่มรายการ"
            @click="router.push('/add')"
          />
        </div>
      </div>

      <q-card v-if="filteredList.length === 0" flat bordered class="q-pa-xl text-center" style="border-radius: 30px">
        <q-icon name="inbox" color="grey-5" size="48px" />
        <div class="text-grey-6 q-mt-sm">ยังไม่มีรายการ Subscription</div>
      </q-card>

      <q-list v-else class="bg-transparent">
        <q-item v-for="sub in filteredList" :key="sub.id" class="q-pa-md custom-list-item">
          <q-item-section avatar>
            <q-avatar :color="sub.active ? 'blue-7' : 'grey-5'" text-color="white" class="text-weight-bold">
              {{ sub.name.charAt(0).toUpperCase() }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle1 text-weight-bold">
              {{ sub.name }}
              <q-badge :color="sub.active ? 'positive' : 'grey-6'" class="q-ml-xs">
                {{ sub.active ? 'Active' : 'Cancelled' }}
              </q-badge>
            </q-item-label>
            <q-item-label caption>
              หมวดหมู่: {{ sub.category }} | รอบบิล: {{ sub.billingCycle }}
              <span v-if="authStore.role === 'admin' && sub.ownerName"> | ผู้บันทึก: {{ sub.ownerName }}</span>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center">
              <span class="text-subtitle1 text-weight-bold text-primary q-mr-md">
                ฿{{ Number(sub.cost).toLocaleString() }}
              </span>
              <q-btn
                flat
                dense
                round
                color="primary"
                icon="edit"
                @click="router.push(`/edit/${sub.id}`)"
              />
              <q-btn
                flat
                dense
                round
                color="negative"
                icon="delete_outline"
                @click="openDeleteDialog(sub)"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <q-card flat class="q-mt-lg q-pa-lg summary-card">
        <div class="row q-col-gutter-lg items-center">
          <div class="col-12 col-sm-6">
            <div class="text-caption text-grey-7 text-weight-bold">ค่าใช้จ่ายเฉลี่ย / เดือน</div>
            <div class="text-h4 text-weight-bolder text-primary q-my-xs">
              ฿{{ formattedMonthlyCost }}
            </div>
            <div class="text-caption text-grey-6">
              ประมาณ ฿{{ formattedYearlyCost }} / ปี
            </div>
          </div>

          <div class="col-12 col-sm-6 right-stat-col">
            <div class="row justify-between items-baseline q-mb-xs">
              <span class="text-caption text-grey-7 text-weight-bold">บริการที่ใช้งาน (Active)</span>
              <span class="text-subtitle1 text-weight-bolder text-grey-9">
                {{ subStore.activeCount }} / {{ subStore.visibleSubscriptions.length }} รายการ
              </span>
            </div>
            <q-linear-progress
              rounded
              size="10px"
              :value="activeRatio"
              color="primary"
              track-color="white"
              class="q-mt-sm"
            />
            <div class="text-caption text-grey-6 q-mt-xs text-right">
              ใช้งานอยู่ {{ Math.round(activeRatio * 100) }}% ของทั้งหมด
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="min-width: 300px; border-radius: 16px" class="q-pa-sm">
        <q-card-section class="row items-center">
          <q-icon name="warning" color="orange-5" size="40px" class="q-mr-md" />
          <div>
            <div class="text-h6 text-weight-bold">ยืนยันการลบ</div>
            <div class="text-body2 text-grey-7">ต้องการลบ "{{ itemToDelete?.name }}" ใช่หรือไม่?</div>
          </div>
        </q-card-section>
        <q-card-section class="row justify-end q-gutter-sm">
          <q-btn flat label="ยกเลิก" color="grey-7" v-close-popup />
          <q-btn unelevated label="ยืนยันลบ" color="negative" @click="deleteAction" style="border-radius: 8px" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useSubscriptionStore } from '../stores/subscriptionStore.js'
import { useAuthStore } from '../stores/authStore.js'


const router = useRouter()
const $q = useQuasar()
const subStore = useSubscriptionStore()
const authStore = useAuthStore()

const searchText = ref('')
const confirmDialog = ref(false)
const itemToDelete = ref(null)

const formattedMonthlyCost = computed(() => {
  return Number(subStore.totalMonthlyCost).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

const formattedYearlyCost = computed(() => {
  return (Number(subStore.totalMonthlyCost) * 12).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

const activeRatio = computed(() => {
  const total = subStore.visibleSubscriptions.length
  if (total === 0) return 0
  return subStore.activeCount / total
})

const filteredList = computed(() => {
  if (!searchText.value) return subStore.visibleSubscriptions
  const kw = searchText.value.toLowerCase()
  return subStore.visibleSubscriptions.filter(
    (item) => item.name.toLowerCase().includes(kw) || item.category.toLowerCase().includes(kw)
  )
})

onMounted(() => {
  subStore.fetchSubscriptions()
})

const openDeleteDialog = (sub) => {
  itemToDelete.value = sub
  confirmDialog.value = true
}

const deleteAction = async () => {
  if (itemToDelete.value) {
    await subStore.removeSubscription(itemToDelete.value.id)
    confirmDialog.value = false
    itemToDelete.value = null
    $q.notify({
      type: 'negative',
      message: 'ลบรายการเรียบร้อยแล้ว',
      position: 'top-right',
      timeout: 2000,
      icon: 'check_circle'
    })
  }
}
</script>

<style scoped>
.summary-card {
  background: linear-gradient(80deg, #ffffff, #e0f2fe, #bae6fd, #dbeafe);
  background-size: 300% 300%;
  animation: gradientMove 4s ease infinite;
  border: 1.5px solid #e2e8f0;
  border-radius: 30px;
}

@media (min-width: 600px) {
  .right-stat-col {
    border-left: 1px solid rgba(148, 163, 184, 0.35);
    padding-left: 24px;
  }
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.custom-list-item {
  border: 2px solid #e0e0e0;
  margin-bottom: 10px;
  border-radius: 40px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.custom-list-item:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
}
</style>
<template>
  <q-page padding class="q-pa-md" style="max-width: 800px; margin: auto">
    <div class="text-center q-mb-lg">
      <q-icon name="manage_accounts" color="primary" size="46px" class="q-mb-sm" />
      <div class="text-h4 text-weight-bold">จัดการผู้ใช้งาน</div>
      <div class="text-subtitle1 text-grey-7">รายชื่อสมาชิกและสิทธิ์การเข้าถึงระบบ</div>
    </div>

    <div v-if="isLoading" class="flex flex-center text-center q-my-xl" style="min-height: 200px">
      <q-spinner-tail color="primary" size="50px" />
    </div>

    <div v-else>
      <div class="row justify-between items-center q-mb-md q-gutter-sm">
        <div class="text-subtitle1 text-weight-bold">
          รายชื่อผู้ใช้งานในระบบ ({{ filteredUsers.length }})
        </div>
        <div class="row q-gutter-sm items-center">
          <q-input
            v-model="searchText"
            outlined
            dense
            rounded
            placeholder="ค้นหาชื่อหรือ Username..."
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            outline
            rounded
            color="primary"
            icon="arrow_back"
            label="กลับหน้าหลัก"
            @click="router.push('/')"
          />
        </div>
      </div>

      <q-card v-if="filteredUsers.length === 0" flat bordered class="q-pa-xl text-center" style="border-radius: 30px">
        <q-icon name="person_off" color="grey-5" size="48px" />
        <div class="text-grey-6 q-mt-sm">ไม่พบข้อมูลผู้ใช้งาน</div>
      </q-card>

      <q-list v-else class="bg-transparent">
        <q-item v-for="u in filteredUsers" :key="u.id" class="q-pa-md custom-list-item">
          <q-item-section avatar>
            <q-avatar
              :class="u.role === 'admin' ? 'avatar-admin' : 'avatar-user'"
              text-color="white"
              class="text-weight-bold"
            >
              {{ u.name ? u.name.charAt(0).toUpperCase() : 'U' }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle1 text-weight-bold">
              {{ u.name }}
            </q-item-label>
            <q-item-label caption>
              Username: @{{ u.username }} | รหัสผู้ใช้: #{{ u.id }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div :class="['role-badge', u.role === 'admin' ? 'role-admin' : 'role-user']">
              <span class="role-dot"></span>
              <span>{{ u.role?.toUpperCase() || 'USER' }}</span>
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <q-card flat class="q-mt-lg q-pa-lg summary-card">
        <div class="row q-col-gutter-lg items-center text-center">
          <div class="col-6">
            <div class="text-caption text-grey-7 text-weight-bold">ผู้ดูแลระบบ (Admin)</div>
            <div class="text-h5 text-weight-bolder text-deep-orange-7 q-mt-xs">
              {{ adminCount }} คน
            </div>
          </div>
          <div class="col-6 right-stat-col">
            <div class="text-caption text-grey-7 text-weight-bold">สมาชิกทั่วไป (User)</div>
            <div class="text-h5 text-weight-bolder text-primary q-mt-xs">
              {{ memberCount }} คน
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../boot/axios'

const router = useRouter()
const users = ref([])
const isLoading = ref(false)
const searchText = ref('')

const filteredUsers = computed(() => {
  if (!searchText.value) return users.value
  const kw = searchText.value.toLowerCase()
  return users.value.filter(
    (u) => u.name?.toLowerCase().includes(kw) || u.username?.toLowerCase().includes(kw)
  )
})

const adminCount = computed(() => users.value.filter((u) => u.role === 'admin').length)
const memberCount = computed(() => users.value.filter((u) => u.role !== 'admin').length)

onMounted(async () => {
  isLoading.value = true
  try {
    const res = await api.get('/user')
    users.value = res.data
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
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

.avatar-admin {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.avatar-user {
  background: linear-gradient(135deg, #0284c7, #38bdf8);
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.role-dot {
  width: 0.4rem;
  height: 0.4rem;
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

.summary-card {
  background: linear-gradient(80deg, #ffffff, #e0f2fe, #bae6fd, #dbeafe);
  background-size: 300% 300%;
  animation: gradientMove 4s ease infinite;
  border: 1.5px solid #e2e8f0;
  border-radius: 30px;
}

.right-stat-col {
  border-left: 1px solid rgba(148, 163, 184, 0.35);
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
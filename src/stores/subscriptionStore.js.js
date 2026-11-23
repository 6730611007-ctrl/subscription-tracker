import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../boot/axios'
import { useAuthStore } from './authStore'

export const useSubscriptionStore = defineStore('subscription', () => {
  const subscriptions = ref([])
  const isAdding = ref(false)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const authStore = useAuthStore()

  const visibleSubscriptions = computed(() => {
    if (authStore.role === 'admin') return subscriptions.value
    return subscriptions.value.filter((item) => item.userId === authStore.user?.id)
  })

  const fetchSubscriptions = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      const response = await api.get('/subscriptions')
      subscriptions.value = response.data
    } catch (error) {
      errorMessage.value = 'ไม่สามารถดึงข้อมูลรายการได้ โปรดตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์'
      console.error('Fetch Error:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchSubscriptionById = async (id) => {
    const response = await api.get(`/subscriptions/${id}`)
    return response.data
  }

  const addSubscription = async (newSub) => {
    isAdding.value = true
    try {
      const payload = {
        ...newSub,
        userId: authStore.user?.id,
        ownerName: authStore.user?.name
      }
      const response = await api.post('/subscriptions', payload)
      subscriptions.value.push(response.data)
    } catch (error) {
      console.error('Add Error:', error)
    } finally {
      isAdding.value = false
    }
  }

  const updateSubscription = async (id, updatedSub) => {
    try {
      const response = await api.put(`/subscriptions/${id}`, updatedSub)
      const index = subscriptions.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        subscriptions.value[index] = response.data
      }
    } catch (error) {
      console.error('Update Error:', error)
    }
  }

  const removeSubscription = async (id) => {
    try {
      await api.delete(`/subscriptions/${id}`)
      subscriptions.value = subscriptions.value.filter((item) => item.id !== id)
    } catch (error) {
      console.error('Delete Error:', error)
    }
  }

  const totalMonthlyCost = computed(() => {
    return visibleSubscriptions.value
      .filter((item) => item.active)
      .reduce((sum, item) => {
        const monthly = item.billingCycle === 'Yearly' ? Number(item.cost) / 12 : Number(item.cost)
        return sum + monthly
      }, 0)
      .toFixed(2)
  })

  const activeCount = computed(() => {
    return visibleSubscriptions.value.filter((item) => item.active).length
  })

  return {
    subscriptions,
    visibleSubscriptions,
    isAdding,
    isLoading,
    errorMessage,
    fetchSubscriptions,
    fetchSubscriptionById,
    addSubscription,
    updateSubscription,
    removeSubscription,
    totalMonthlyCost,
    activeCount
  }
})
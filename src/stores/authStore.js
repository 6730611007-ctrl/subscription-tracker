import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../boot/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(null)
  const errorMessage = ref('')

  const isLoggedIn = computed(() => accessToken.value !== null)
  const role = computed(() => user.value?.role ?? null)

  const login = async (username, password) => {
    errorMessage.value = ''
    try {
      const response = await api.get('/user')
      const found = response.data.find(
        (u) => u.username === username && u.password === password
      )
      if (!found) {
        errorMessage.value = 'Username หรือ Password ไม่ถูกต้อง'
        return false
      }
      user.value = found
      accessToken.value = `token-${found.id}-${Date.now()}`
      return true
    } catch (error) {
      errorMessage.value = error.response?.data?.message || 'Login failed'
      return false
    }
  }

  const logout = () => {
    accessToken.value = null
    user.value = null
  }

  return { user, accessToken, errorMessage, isLoggedIn, role, login, logout }
}, {
  persist: true
})
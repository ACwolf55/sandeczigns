import { ref, computed } from 'vue'

// The admin JWT, persisted in localStorage so a refresh keeps you logged in.
const token = ref<string | null>(localStorage.getItem('admin_token'))

// Reactive: true when an admin token is present. Use in templates via v-if="isAdmin".
export const isAdmin = computed(() => !!token.value)

export function login(newToken: string) {
  token.value = newToken
  localStorage.setItem('admin_token', newToken)
}

export function logout() {
  token.value = null
  localStorage.removeItem('admin_token')
}

export function getToken() {
  return token.value
}

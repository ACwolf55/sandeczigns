<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../lib/api'
import { login, logout, isAdmin } from '../lib/auth'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const res = await api.post('/auth/login', {
      username: username.value,
      password: password.value,
    })
    login(res.data.token)
    router.push('/')
  } catch (e) {
    error.value = 'Invalid username or password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-yellow-50 text-stone-800 flex flex-col items-center justify-center px-6">
    <div class="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 border-4 border-pink-200">
      <h1 class="text-3xl font-extrabold text-center mb-6">Admin Login</h1>

      <template v-if="!isAdmin">
        <input
          v-model="username"
          placeholder="Username"
          class="w-full mb-4 px-4 py-3 rounded-xl border-2 border-pink-200 focus:outline-none focus:border-pink-400"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          @keyup.enter="submit"
          class="w-full mb-4 px-4 py-3 rounded-xl border-2 border-pink-200 focus:outline-none focus:border-pink-400"
        />
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>
        <button
          @click="submit"
          :disabled="loading"
          class="w-full bg-pink-400 text-white font-bold px-6 py-3 rounded-full shadow-md hover:scale-105 transition disabled:opacity-50"
        >
          {{ loading ? 'Logging in...' : 'Log In' }}
        </button>
      </template>

      <template v-else>
        <p class="text-center mb-6">You're logged in as admin. ✅</p>
        <button
          @click="logout"
          class="w-full bg-stone-300 text-stone-900 font-bold px-6 py-3 rounded-full shadow-md hover:scale-105 transition"
        >
          Log Out
        </button>
      </template>

      <router-link to="/" class="block text-center mt-6 font-semibold underline">← Home</router-link>
    </div>
  </div>
</template>

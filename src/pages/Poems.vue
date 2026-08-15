<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../lib/api'
import { isAdmin, logout } from '../lib/auth'

type Poem = { _id: string; title: string; body: string; createdAt?: string }

const poems = ref<Poem[]>([])
const title = ref('')
const body = ref('')
const loading = ref(false)

async function loadPoems() {
  poems.value = (await api.get('/poems')).data
}

async function addPoem() {
  if (!title.value.trim() && !body.value.trim()) return
  loading.value = true
  try {
    await api.post('/poems', { title: title.value, body: body.value })
    title.value = ''
    body.value = ''
    await loadPoems()
  } catch (e) {
    console.error(e)
    alert('Could not save poem. Is the server running?')
  } finally {
    loading.value = false
  }
}

async function deletePoem(id: string) {
  if (!confirm('Delete this poem?')) return
  await api.delete(`/poems/${id}`)
  await loadPoems()
}

onMounted(loadPoems)
</script>

<template>
  <div class="min-h-screen bg-yellow-50 text-stone-800">
    <header class="flex items-center justify-between px-8 py-6 bg-pink-100 border-b-4 border-pink-200 shadow-sm">
      <h1 class="text-3xl md:text-4xl font-extrabold text-stone-900">Poems</h1>
      <div class="flex items-center gap-4">
        <button v-if="isAdmin" @click="logout" class="text-sm font-semibold text-stone-500 hover:text-stone-800">Log out</button>
        <router-link to="/" class="font-semibold underline">← Home</router-link>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-6 py-12">
      <!-- Add poem form -->
      <section v-if="isAdmin" class="bg-pink-100 rounded-3xl shadow-xl p-8 border-4 border-pink-200 mb-12">
        <h2 class="text-2xl font-bold mb-4">Add a Poem</h2>
        <input
          v-model="title"
          placeholder="Title"
          class="w-full mb-4 px-4 py-3 rounded-xl border-2 border-pink-200 bg-white focus:outline-none focus:border-pink-400"
        />
        <textarea
          v-model="body"
          placeholder="Write your poem here..."
          rows="10"
          class="w-full mb-4 px-4 py-3 rounded-xl border-2 border-pink-200 bg-white focus:outline-none focus:border-pink-400 whitespace-pre-line"
        ></textarea>
        <button
          @click="addPoem"
          :disabled="loading"
          class="bg-pink-400 text-white font-bold px-6 py-3 rounded-full shadow-md hover:scale-105 transition disabled:opacity-50"
        >
          {{ loading ? 'Saving...' : 'Post Poem' }}
        </button>
      </section>

      <!-- List -->
      <section class="space-y-6">
        <p v-if="poems.length === 0" class="text-center text-stone-500">No poems yet.</p>
        <article
          v-for="poem in poems"
          :key="poem._id"
          class="bg-white rounded-3xl shadow-md p-8 border-4 border-pink-100"
        >
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-2xl font-bold">{{ poem.title }}</h3>
            <button
              v-if="isAdmin"
              @click="deletePoem(poem._id)"
              class="text-sm text-red-500 hover:text-red-700 font-semibold"
            >
              Delete
            </button>
          </div>
          <p class="text-stone-700 whitespace-pre-line">{{ poem.body }}</p>
        </article>
      </section>
    </main>
  </div>
</template>

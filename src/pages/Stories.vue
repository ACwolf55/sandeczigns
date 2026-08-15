<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../lib/api'
import { isAdmin, logout } from '../lib/auth'

type Story = { _id: string; title: string; body: string; createdAt?: string }

const stories = ref<Story[]>([])
const title = ref('')
const body = ref('')
const loading = ref(false)

async function loadStories() {
  stories.value = (await api.get('/stories')).data
}

async function addStory() {
  if (!title.value.trim() && !body.value.trim()) return
  loading.value = true
  try {
    await api.post('/stories', { title: title.value, body: body.value })
    title.value = ''
    body.value = ''
    await loadStories()
  } catch (e) {
    console.error(e)
    alert('Could not save story. Is the server running?')
  } finally {
    loading.value = false
  }
}

async function deleteStory(id: string) {
  if (!confirm('Delete this story?')) return
  await api.delete(`/stories/${id}`)
  await loadStories()
}

onMounted(loadStories)
</script>

<template>
  <div class="min-h-screen bg-yellow-50 text-stone-800">
    <header class="flex items-center justify-between px-8 py-6 bg-cyan-100 border-b-4 border-cyan-200 shadow-sm">
      <h1 class="text-3xl md:text-4xl font-extrabold text-stone-900">Stories</h1>
      <div class="flex items-center gap-4">
        <button v-if="isAdmin" @click="logout" class="text-sm font-semibold text-stone-500 hover:text-stone-800">Log out</button>
        <router-link to="/" class="font-semibold underline">← Home</router-link>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-6 py-12">
      <!-- Add story form -->
      <section v-if="isAdmin" class="bg-cyan-100 rounded-3xl shadow-xl p-8 border-4 border-cyan-200 mb-12">
        <h2 class="text-2xl font-bold mb-4">Add a Story</h2>
        <input
          v-model="title"
          placeholder="Title"
          class="w-full mb-4 px-4 py-3 rounded-xl border-2 border-cyan-200 bg-white focus:outline-none focus:border-cyan-400"
        />
        <textarea
          v-model="body"
          placeholder="Write your story here..."
          rows="14"
          class="w-full mb-4 px-4 py-3 rounded-xl border-2 border-cyan-200 bg-white focus:outline-none focus:border-cyan-400 whitespace-pre-line"
        ></textarea>
        <button
          @click="addStory"
          :disabled="loading"
          class="bg-cyan-400 text-white font-bold px-6 py-3 rounded-full shadow-md hover:scale-105 transition disabled:opacity-50"
        >
          {{ loading ? 'Saving...' : 'Post Story' }}
        </button>
      </section>

      <!-- List -->
      <section class="space-y-6">
        <p v-if="stories.length === 0" class="text-center text-stone-500">No stories yet.</p>
        <article
          v-for="story in stories"
          :key="story._id"
          class="bg-white rounded-3xl shadow-md p-8 border-4 border-cyan-100"
        >
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-2xl font-bold">{{ story.title }}</h3>
            <button
              v-if="isAdmin"
              @click="deleteStory(story._id)"
              class="text-sm text-red-500 hover:text-red-700 font-semibold"
            >
              Delete
            </button>
          </div>
          <p class="text-stone-700 whitespace-pre-line">{{ story.body }}</p>
        </article>
      </section>
    </main>
  </div>
</template>

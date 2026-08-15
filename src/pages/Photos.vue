<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../lib/api'
import { isAdmin, logout } from '../lib/auth'

type Photo = { _id: string; title: string; caption: string; pic_url: string; createdAt?: string }

const photos = ref<Photo[]>([])
const title = ref('')
const caption = ref('')
const dataUrl = ref('')   // base64 image string
const fileName = ref('')  // name of the chosen file (for display)
const loading = ref(false)

async function loadPhotos() {
  photos.value = (await api.get('/photos')).data
}

// read the chosen file into a base64 string (same as MyVCF's FileReader.readAsDataURL)
function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  fileName.value = file.name
  const reader = new FileReader()
  reader.onloadend = () => { dataUrl.value = reader.result as string }
  reader.readAsDataURL(file)
}

async function uploadPhoto() {
  if (!dataUrl.value) { alert('Please choose an image first.'); return }
  loading.value = true
  try {
    await api.post('/photos', { title: title.value, caption: caption.value, data: dataUrl.value })
    title.value = ''
    caption.value = ''
    dataUrl.value = ''
    fileName.value = ''
    await loadPhotos()
  } catch (e) {
    console.error(e)
    alert('Upload failed. Is the server running and Cloudinary configured?')
  } finally {
    loading.value = false
  }
}

async function deletePhoto(id: string) {
  if (!confirm('Delete this photo?')) return
  await api.delete(`/photos/${id}`)
  await loadPhotos()
}

onMounted(loadPhotos)
</script>

<template>
  <div class="min-h-screen bg-yellow-50 text-stone-800">
    <header class="flex items-center justify-between px-8 py-6 bg-blue-100 border-b-4 border-blue-200 shadow-sm">
      <h1 class="text-3xl md:text-4xl font-extrabold text-stone-900">Photos</h1>
      <div class="flex items-center gap-4">
        <button v-if="isAdmin" @click="logout" class="text-sm font-semibold text-stone-500 hover:text-stone-800">Log out</button>
        <router-link to="/" class="font-semibold underline">← Home</router-link>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-12">
      <!-- Upload form -->
      <section v-if="isAdmin" class="bg-blue-100 rounded-3xl shadow-xl p-8 border-4 border-blue-200 mb-12 max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-4">Upload a Photo</h2>
        <input
          v-model="title"
          placeholder="Title"
          class="w-full mb-4 px-4 py-3 rounded-xl border-2 border-blue-200 bg-white focus:outline-none focus:border-blue-400"
        />
        <input
          v-model="caption"
          placeholder="Caption"
          class="w-full mb-4 px-4 py-3 rounded-xl border-2 border-blue-200 bg-white focus:outline-none focus:border-blue-400"
        />
        <div class="flex items-center gap-3 mb-4">
          <label
            class="inline-block cursor-pointer bg-blue-400 text-white font-bold px-5 py-2.5 rounded-full shadow-md hover:scale-105 transition"
          >
            Choose File
            <input type="file" accept="image/*" @change="onFile" class="hidden" />
          </label>
          <span class="text-sm text-stone-600 truncate">{{ fileName || 'No file chosen' }}</span>
        </div>

        <!-- preview -->
        <img
          v-if="dataUrl"
          :src="dataUrl"
          alt="preview"
          class="w-full max-h-64 object-contain rounded-xl mb-4 border-2 border-blue-200 bg-white"
        />

        <button
          @click="uploadPhoto"
          :disabled="loading"
          class="bg-blue-400 text-white font-bold px-6 py-3 rounded-full shadow-md hover:scale-105 transition disabled:opacity-50"
        >
          {{ loading ? 'Uploading...' : 'Upload Photo' }}
        </button>
      </section>

      <!-- Gallery -->
      <section>
        <p v-if="photos.length === 0" class="text-center text-stone-500">No photos yet.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <figure
            v-for="photo in photos"
            :key="photo._id"
            class="bg-white rounded-3xl shadow-md overflow-hidden border-4 border-blue-100"
          >
            <img :src="photo.pic_url" :alt="photo.title" class="w-full h-56 object-cover" />
            <figcaption class="p-4">
              <div class="flex items-start justify-between">
                <h3 class="text-lg font-bold">{{ photo.title }}</h3>
                <button
                  v-if="isAdmin"
                  @click="deletePhoto(photo._id)"
                  class="text-sm text-red-500 hover:text-red-700 font-semibold"
                >
                  Delete
                </button>
              </div>
              <p class="text-stone-600 text-sm mt-1">{{ photo.caption }}</p>
            </figcaption>
          </figure>
        </div>
      </section>
    </main>
  </div>
</template>

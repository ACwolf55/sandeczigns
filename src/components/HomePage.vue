<template>
  <div class="min-h-screen bg-yellow-50 text-stone-800">

    <!-- HEADER -->
    <header class="relative flex items-center justify-between px-8 py-6 bg-yellow-100 border-b-4 border-yellow-300 shadow-sm">

      <!-- Main Title -->
      <h1 class="text-3xl md:text-5xl font-extrabold tracking-wide text-stone-900">
        SANDECZIGNS
      </h1>

      <!-- Comic Chat Bubble Blog Link -->
      <a
        href="/blog"
        class="relative bg-pink-300 text-stone-900 px-6 py-3 rounded-full font-bold shadow-md hover:scale-105 transition"

      >
        Just Sayin ~

        <!-- Bubble Tail -->
        <span
          class="absolute -bottom-2 right-6 w-4 h-4 bg-pink-300 rotate-45"
        ></span>
      </a>

    </header>

    <!-- MAIN BODY (HORIZONTAL SECTIONS) -->
    <main class="max-w-7xl mx-auto px-6 py-16">

      <div class="flex flex-col md:flex-row gap-10">

        <!-- POEMS -->
        <section
          class="flex-1 group bg-pink-100 rounded-3xl shadow-xl p-10 hover:-translate-y-1 transition border-4 border-pink-200"
        >
          <h2 class="text-3xl font-bold mb-4">Poems</h2>
          <p class="text-stone-700 mb-8">
            Words from the heart. Original poetry and soulful reflections.
          </p>
          <router-link
            to="/poems"
            class="inline-block font-semibold underline group-hover:text-stone-900"
          >
            Enter Poems →
          </router-link>
        </section>

        <!-- PHOTOS -->
        <section
          class="flex-1 group bg-blue-100 rounded-3xl shadow-xl p-10 hover:-translate-y-1 transition border-4 border-blue-200"
        >
          <h2 class="text-3xl font-bold mb-4">Photos</h2>
          <p class="text-stone-700 mb-8">
            Visual stories, emotions captured in still moments.
          </p>
          <router-link
            to="/photos"
            class="inline-block font-semibold underline group-hover:text-stone-900"
          >
            Enter Photos →
          </router-link>
        </section>

        <!-- STORIES -->
        <section
          class="flex-1 group bg-purple-100 rounded-3xl shadow-xl p-10 hover:-translate-y-1 transition border-4 border-purple-200"
        >
          <h2 class="text-3xl font-bold mb-4">Stories</h2>
          <p class="text-stone-700 mb-8">
            Short stories, memories, and imaginative journeys.
          </p>
          <router-link
            to="/stories"
            class="inline-block font-semibold underline group-hover:text-stone-900"
          >
            Enter Stories →
          </router-link>
        </section>

      </div>

    </main>

  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomePage',
})
</script>
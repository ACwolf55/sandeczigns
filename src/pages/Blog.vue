<template>
  <div class="min-h-screen bg-yellow-50 text-stone-800 flex flex-col">
    <header class="flex items-center justify-between px-8 py-6 bg-pink-100 border-b-4 border-pink-200 shadow-sm">
      <h1 class="text-3xl md:text-4xl font-extrabold text-stone-900">Just Sayin</h1>
      <router-link to="/" class="font-semibold underline">← Home</router-link>
    </header>

    <main class="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
      <div class="text-6xl mb-6">🚧 🏗️ ✍️</div>
      <h2 class="text-4xl font-extrabold mb-4">Under Construction</h2>
      <p class="text-lg text-stone-600 max-w-md">
        The blog is still cooking. Come back soon for thoughts, rambles, and just sayin's. 💭✨🙊
      </p>
      <router-link
        to="/"
        class="mt-8 inline-block bg-pink-300 text-stone-900 px-6 py-3 rounded-full font-bold shadow-md hover:scale-105 transition"
      >
        ← Back Home
      </router-link>
    </main>
  </div>
</template>

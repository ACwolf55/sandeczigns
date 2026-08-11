import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/HomePage.vue'
import Poems from './pages/Poems.vue'
import Stories from './pages/Stories.vue'
import Photos from './pages/Photos.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/poems', name: 'poems', component: Poems },
  { path: '/stories', name: 'stories', component: Stories },
  { path: '/photos', name: 'photos', component: Photos },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})

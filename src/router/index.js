import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/Home.vue'
import About from '@/views/About.vue'
import ProducerMap from '../views/ProducerMap.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/about', name: 'About', component: About },
  { path: '/producer-map', name: 'ProducerMap', component: ProducerMap },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/Home.vue'
import About from '@/pages/About.vue'
import ProducerMap from '@/pages/ProducerMap.vue'
import ProductList from '@/pages/ProductList.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/about', name: 'About', component: About },
  { path: '/producer-map', name: 'ProducerMap', component: ProducerMap },
  { path: '/product-list', name: 'ProductList', component: ProductList },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/Home.vue'
import ProducerMap from '@/pages/ProducerMap.vue'
import ProductList from '@/pages/ProductList.vue'
import ProducerDetail from '@/pages/ProducerDetail.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import ProfilEdit from '@/pages/ProfilEdit.vue'
import ContactForm from '@/pages/ContactForm.vue'
import GeneralCondition from '@/pages/GeneralCondition.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/producer-map', name: 'ProducerMap', component: ProducerMap },
  { path: '/product-list', name: 'ProductList', component: ProductList },
  {
    path: '/producteur/:id',
    name: 'ProducerDetail',
    component: ProducerDetail,
    props: true,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/profil',
    name: 'Profil',
    component: ProfilEdit,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactForm,
  },
  {
    path: '/conditions-generales',
    name: 'GeneralConditions',
    component: GeneralCondition,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

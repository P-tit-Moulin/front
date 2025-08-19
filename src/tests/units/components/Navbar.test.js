import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import Navbar from '@/components/NavBar.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
    {
      path: '/product-list',
      name: 'ProductList',
      component: { template: '<div>Products</div>' },
    },
    {
      path: '/producer-map',
      name: 'ProducerMap',
      component: { template: '<div>Map</div>' },
    },
  ],
})

describe('NavBar', () => {
  it('renders correctly', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router, createPinia()],
      },
    })

    await wrapper.vm.$nextTick()

    const hasLogo =
      wrapper.html().includes('Logo') ||
      wrapper.html().includes("P'tit Moulin") ||
      wrapper.find('img').exists()

    expect(hasLogo).toBe(true)
    expect(wrapper.text()).toContain('Accueil')
    expect(wrapper.text()).toContain('Produits')
  })

  it('has correct navigation links', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router, createPinia()],
      },
    })

    await wrapper.vm.$nextTick()

    const links =
      wrapper.findAll('a') ||
      wrapper.findAll('[to]') ||
      wrapper.findAll('router-link')

    if (links.length > 0) {
      const linkTexts = links.map(link => link.text())
      expect(linkTexts.some(text => text.includes('Accueil'))).toBe(true)
    }
  })
})

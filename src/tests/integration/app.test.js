import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from '@/App.vue'

describe('App Integration', () => {
  it('renders main layout components', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
    })

    const wrapper = mount(App, {
      global: {
        plugins: [router, createPinia()],
        stubs: {
          NavBar: { template: '<div />', name: 'NavBar' },
          Footer: { template: '<div />', name: 'Footer' },
          ProductCard: true,
          PrimaryButton: true,
          VIcon: true,
        },
      },
    })

    await router.isReady()
    await flushPromises()

    expect(wrapper.findComponent({ name: 'NavBar' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'Footer' }).exists()).toBe(true)
  })

  it('displays router-view content', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home Page Content</div>' } },
        {
          path: '/test',
          component: { template: '<div>Test Page Content</div>' },
        },
      ],
    })

    const wrapper = mount(App, {
      global: {
        plugins: [router, createPinia()],
        stubs: ['ProductCard', 'PrimaryButton', 'VIcon'],
      },
    })

    await router.push('/test')
    await router.isReady()
    await flushPromises()

    expect(wrapper.text()).toContain('Test Page Content')
  })
})

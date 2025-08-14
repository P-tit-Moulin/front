import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import Home from '@/pages/Home.vue'

describe('App Integration', () => {
  it('renders main layout components', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: Home }],
    })

    const wrapper = mount(App, {
      global: {
        plugins: [router, createPinia()],
      },
    })

    expect(wrapper.findComponent({ name: 'NavBar' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'Footer' }).exists()).toBe(true)
    expect(wrapper.find('.app-container').exists()).toBe(true)
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
      },
    })

    await router.push('/test')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Test Page Content')
  })
})

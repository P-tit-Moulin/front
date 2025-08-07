import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'

describe('Router Integration', () => {
  it('navigates to different routes', async () => {
    const testRouter = createRouter({
      history: createWebHistory(),
      routes: router.options.routes,
    })

    const wrapper = mount(App, {
      global: {
        plugins: [testRouter, createPinia()],
      },
    })

    // Test navigation to product list
    await testRouter.push('/product-list')
    await wrapper.vm.$nextTick()
    expect(testRouter.currentRoute.value.path).toBe('/product-list')

    // Test navigation to producer map
    await testRouter.push('/producer-map')
    await wrapper.vm.$nextTick()
    expect(testRouter.currentRoute.value.path).toBe('/producer-map')

    // Test navigation to producer detail with params
    await testRouter.push('/producteur/123')
    await wrapper.vm.$nextTick()
    expect(testRouter.currentRoute.value.path).toBe('/producteur/123')
    expect(testRouter.currentRoute.value.params.id).toBe('123')
  })
})

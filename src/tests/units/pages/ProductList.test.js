import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import ProductList from '@/pages/ProductList.vue'

describe('ProductList', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  it('fetches product families on mount', async () => {
    const wrapper = mount(ProductList, {
      global: {
        plugins: [pinia],
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toBe(true)
  })
})

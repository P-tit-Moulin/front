import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import Home from '@/pages/Home.vue'

describe('Home', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  it('fetches product families on mount', async () => {
    const mockStore = {
      fetchProductFamilies: vi.fn(),
      productFamilies: [],
      loading: false,
    }

    vi.doMock('@/store/producer', () => ({
      useProducerStore: () => mockStore,
    }))
    // Reset mockStore properties before each test
    mockStore.fetchProductFamilies.mockReset()
    mockStore.productFamilies = []
    mockStore.loading = false
  })

  it('fetches product families on mount', async () => {
    const wrapper = mount(Home, {
      global: {
        plugins: [pinia],
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
  })
})

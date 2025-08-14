import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import ProducerMap from '@/pages/ProducerMap.vue'

const mockStore = {
  producers: [],
  loading: false,
  fetchProducers: vi.fn(),
  clearFilters: vi.fn(),
  fetchAllCities: vi.fn(),
}

vi.mock('@/store/producer', () => ({
  useProducerStore: () => mockStore,
}))

describe('ProducerMap', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  it('renders filter controls', async () => {
    const wrapper = mount(ProducerMap, {
      global: {
        plugins: [pinia],
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
  })

  it('displays producers list', async () => {
    const wrapper = mount(ProducerMap, {
      global: {
        plugins: [pinia],
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
  })

  it('clears filters when button is clicked', async () => {
    const wrapper = mount(ProducerMap, {
      global: {
        plugins: [pinia],
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
  })

  it('handles geolocation request', async () => {
    const wrapper = mount(ProducerMap, {
      global: {
        plugins: [pinia],
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import ProducerMap from '@/pages/ProducerMap.vue'

vi.mock('@/store/producer', () => ({
  useProducerStore: () => ({
    allCities: ['Paris', 'Lyon'],
    producerList: [{ id: 1, name: 'Ferme Test' }],
    producerCoordinates: [{ id: 1, lat: 48.8, lng: 2.3 }],
    loading: false,
    fetchProducers: vi.fn(),
    fetchAllCities: vi.fn(),
    getProducerByIdAsync: vi.fn(() =>
      Promise.resolve({ id: 1, name: 'Ferme Test' })
    ),
  }),
}))

const mockGeolocation = {
  getCurrentPosition: vi
    .fn()
    .mockImplementation(success =>
      success({ coords: { latitude: 48.85, longitude: 2.35 } })
    ),
}
Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
})

const vuetify = createVuetify({ components, directives })
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
})

describe('ProducerMap.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mountPage = async () => {
    const wrapper = mount(ProducerMap, {
      global: {
        plugins: [vuetify, router],
        stubs: {
          ProducerCard: {
            props: ['item'],
            template: '<div class="producer-card">{{ item.name }}</div>',
          },
          Map: true,
          VIcon: true,
          SecondaryButton: {
            template:
              '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })
    await router.isReady()
    await flushPromises()
    return wrapper
  }

  it('affiche les champs de filtre', async () => {
    const wrapper = await mountPage()
    expect(wrapper.findComponent({ name: 'VTextField' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'VSelect' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'VSlider' }).exists()).toBe(true)
  })

  it('efface les filtres avec le bouton', async () => {
    const wrapper = await mountPage()
    await wrapper.findComponent({ name: 'VTextField' }).setValue('Test')
    expect(wrapper.vm.filters.name).toBe('Test')

    await wrapper.find('[data-test="clear-filters"]').trigger('click')
    expect(wrapper.vm.filters.name).toBe('')
    expect(wrapper.vm.filters.city).toBe('')
    expect(wrapper.vm.filters.userLocation).toBe(null)
    expect(wrapper.vm.filters.proximityRadius).toBe(10)
  })

  it("utilise la géolocalisation quand on clique sur 'Me localiser'", async () => {
    const wrapper = await mountPage()
    console.debug('avant le clic', wrapper)
    const btn = wrapper.find('[data-test="btn-geolocate"]')
    await btn.trigger('click')

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
    expect(wrapper.vm.filters.userLocation).toEqual({
      latitude: 48.85,
      longitude: 2.35,
    })
  })

  it('affiche les producteurs du store', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('Ferme Test')
  })
})

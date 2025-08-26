import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Map from '@/components/Map.vue'

describe('Map', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the map container element', () => {
    const wrapper = shallowMount(Map, {
      props: {
        coordinates: [],
      },
    })

    expect(wrapper.find('[data-testid="map-element"]').exists()).toBe(true)
  })

  it('has the correct props interface', () => {
    const wrapper = shallowMount(Map)
    const propsDefinitions = wrapper.vm.$options.props

    expect(propsDefinitions.coordinates).toBeDefined()
    expect(propsDefinitions.userLocation).toBeDefined()
  })

  it('defines the marker-click event', () => {
    const wrapper = shallowMount(Map)
    const emitsDefinitions = wrapper.vm.$options.emits

    expect(emitsDefinitions).toContain('marker-click')
  })
})

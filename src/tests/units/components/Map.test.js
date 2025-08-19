import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Map from '@/components/Map.vue'

describe('Map', () => {
  const mockCoordinates = [
    { id: 1, name: 'Producer 1', lat: 48.8566, lng: 2.3522 },
    { id: 2, name: 'Producer 2', lat: 48.8606, lng: 2.3376 },
  ]

  const mockUserLocation = {
    latitude: 48.8566,
    longitude: 2.3522,
    radius: 10,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders map container', () => {
    const wrapper = mount(Map, {
      props: {
        coordinates: mockCoordinates,
      },
    })

    const mapElement = wrapper.find('[data-testid="map-element"]')
    expect(mapElement.exists()).toBe(true)
    expect(mapElement.attributes('class')).toContain('map-class')
  })

  it('accepts coordinates prop', () => {
    const wrapper = mount(Map, {
      props: {
        coordinates: mockCoordinates,
      },
    })

    expect(wrapper.props('coordinates')).toEqual(mockCoordinates)
  })

  it('accepts userLocation prop', () => {
    const wrapper = mount(Map, {
      props: {
        coordinates: mockCoordinates,
        userLocation: mockUserLocation,
      },
    })

    expect(wrapper.props('userLocation')).toEqual(mockUserLocation)
  })

  it('emits marker-click event', async () => {
    const wrapper = mount(Map, {
      props: {
        coordinates: mockCoordinates,
      },
    })

    await wrapper.vm.$emit('marker-click', mockCoordinates[0])
    expect(wrapper.emitted('marker-click')).toBeTruthy()
    expect(wrapper.emitted('marker-click')[0][0]).toEqual(mockCoordinates[0])
  })
})

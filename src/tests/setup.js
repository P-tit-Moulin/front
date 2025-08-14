import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('vuetify/lib/components/VCode/VCode.css', () => ({}))
vi.mock('vuetify/styles', () => ({}))

const pinia = createPinia()
setActivePinia(pinia)

Object.defineProperty(global.navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn(success => {
      success({
        coords: {
          latitude: 48.8566,
          longitude: 2.3522,
        },
      })
    }),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
  writable: true,
  configurable: true,
})

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({
      setView: vi.fn(),
      addTo: vi.fn(),
      fitBounds: vi.fn(),
      remove: vi.fn(),
    })),
    tileLayer: vi.fn(() => ({
      addTo: vi.fn(),
    })),
    marker: vi.fn(() => ({
      bindPopup: vi.fn(),
      on: vi.fn(),
      addTo: vi.fn(),
    })),
    layerGroup: vi.fn(() => ({
      addTo: vi.fn(),
      clearLayers: vi.fn(),
      addLayer: vi.fn(),
    })),
    featureGroup: vi.fn(() => ({
      getBounds: vi.fn(() => ({
        pad: vi.fn(),
      })),
    })),
    circle: vi.fn(() => ({
      addTo: vi.fn(),
      remove: vi.fn(),
    })),
  },
  map: vi.fn(() => ({
    setView: vi.fn(),
    addTo: vi.fn(),
    fitBounds: vi.fn(),
    remove: vi.fn(),
  })),
  tileLayer: vi.fn(() => ({
    addTo: vi.fn(),
  })),
  marker: vi.fn(() => ({
    bindPopup: vi.fn(),
    on: vi.fn(),
    addTo: vi.fn(),
  })),
  layerGroup: vi.fn(() => ({
    addTo: vi.fn(),
    clearLayers: vi.fn(),
    addLayer: vi.fn(),
  })),
  featureGroup: vi.fn(() => ({
    getBounds: vi.fn(() => ({
      pad: vi.fn(),
    })),
  })),
  circle: vi.fn(() => ({
    addTo: vi.fn(),
    remove: vi.fn(),
  })),
}))

const { createVuetify } = await import('vuetify')
const components = await import('vuetify/components')
const directives = await import('vuetify/directives')

const vuetify = createVuetify({
  components: components.default || components,
  directives: directives.default || directives,
})

config.global.plugins = [vuetify, pinia]

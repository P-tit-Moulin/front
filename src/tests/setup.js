class ResizeObserver {
  constructor() {
    global.ResizeObserverInstances = global.ResizeObserverInstances || []
    global.ResizeObserverInstances.push(this)
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver

if (!global.window) {
  global.window = global
}

import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach } from 'vitest'

vi.mock('vuetify/lib/components/VCode/VCode.css', () => ({}))
vi.mock('vuetify/styles', () => ({}))

if (!global.window) {
  global.window = global
}

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

vi.mock('leaflet', () => {
  const leafletMock = {
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
  }
  return { __esModule: true, ...leafletMock, default: leafletMock }
})

const { createVuetify } = await import('vuetify')
const components = await import('vuetify/components')
const directives = await import('vuetify/directives')

const vuetify = createVuetify({
  components: components.default || components,
  directives: directives.default || directives,
})

config.global.plugins = [vuetify, pinia]

afterEach(() => {
  if (global.ResizeObserverInstances) {
    global.ResizeObserverInstances.forEach(instance => {
      if (instance.disconnect) {
        instance.disconnect()
      }
    })
    global.ResizeObserverInstances = []
  }
})

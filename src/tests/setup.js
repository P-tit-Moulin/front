import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

// Mock spécifiquement les CSS de Vuetify
vi.mock('vuetify/lib/components/VCode/VCode.css', () => ({}))
vi.mock('vuetify/styles', () => ({}))

// Setup Pinia pour les tests
const pinia = createPinia()
setActivePinia(pinia)

// Mock géolocalisation
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

// Mock Leaflet
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

// Import Vuetify APRÈS tous les mocks
const { createVuetify } = await import('vuetify')
const components = await import('vuetify/components')
const directives = await import('vuetify/directives')

// Créer l'instance Vuetify
const vuetify = createVuetify({
  components: components.default || components,
  directives: directives.default || directives,
})

// Configuration globale
config.global.plugins = [vuetify, pinia]

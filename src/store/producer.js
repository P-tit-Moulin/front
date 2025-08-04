import { defineStore } from 'pinia'
import api from '@/config/api'

export const useProducerStore = defineStore('producerStore', {
  state: () => ({
    producerList: [],
    loading: false,
    allCities: [],
  }),

  getters: {
    producerCoordinates(state) {
      if (!Array.isArray(state.producerList)) return []

      return state.producerList
        .filter(p => p.geometry && Array.isArray(p.geometry.coordinates))
        .map(p => ({
          id: p.id,
          name: p.nom || 'Producteur sans nom',
          lat: p.geometry.coordinates[1],
          lng: p.geometry.coordinates[0],
        }))
    },
  },

  actions: {
    async fetchProducers(filters = {}) {
      this.loading = true
      try {
        const params = {}

        if (filters.name) params.nom = filters.name
        if (filters.city) params.com_name = filters.city

        if (filters.userLocation && filters.proximityRadius) {
          const { latitude, longitude } = filters.userLocation
          params.geometry = `${longitude},${latitude}`
          params.radius = filters.proximityRadius
        }

        const response = await api.get('/producers', { params })
        this.producerList = Array.isArray(response.data?.data)
          ? response.data.data
          : []
      } catch (error) {
        console.error('Erreur fetchProducers:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchAllCities() {
      try {
        const res = await api.get('/producers')

        const rawData = Array.isArray(res.data?.data) ? res.data.data : []

        const cities = rawData.map(p => p.com_name).filter(Boolean)
        this.allCities = [...new Set(cities)].sort()
      } catch (e) {
        console.error('Erreur fetchAllCities', e)
      }
    },

    async getProducerByIdAsync(id) {
      try {
        const res = await api.get(`/producers/${id}`)
        return res.data?.data || null
      } catch (e) {
        console.error(`Erreur getProducerByIdAsync(${id})`, e)
        return null
      }
    },
  },
})

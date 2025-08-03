import { defineStore } from 'pinia'
import api from '@/config/api'

export const useMapStore = defineStore('map', {
  state: () => ({
    coordinates: [],
    loading: false,
    loaded: false,
    page: 1,
    limit: 100,
    total: 0,
  }),

  getters: {
    hasMore: state => state.page * state.limit < state.total,
  },

  actions: {
    async fetchCoordinates({
      longitude,
      latitude,
      radius = 10,
      geo = false,
      page = this.page,
      limit = this.limit,
    } = {}) {
      this.loading = true

      try {
        let url = '/producers'
        const params = {}

        if (geo && longitude != null && latitude != null) {
          params.geometry = `${longitude},${latitude}`
          params.radius = radius
        } else if (longitude != null && latitude != null) {
          url = '/producers/nearby/search'
          params.longitude = longitude
          params.latitude = latitude
          params.radius = radius
        }

        params.page = page
        params.limit = limit

        const response = await api.get(url, { params })

        const { data = [], total = 0 } = response.data

        if (page === 1) {
          this.coordinates = data.map(item => ({
            id: item.id,
            lat: item.geometry.coordinates[1],
            lng: item.geometry.coordinates[0],
            label: item.nom,
          }))
        } else {
          this.coordinates.push(
            ...data.map(item => ({
              id: item.id,
              lat: item.geometry.coordinates[1],
              lng: item.geometry.coordinates[0],
              label: item.nom,
            }))
          )
        }

        this.total = total
        this.page = page
        this.limit = limit
        this.loaded = true
      } catch (error) {
        console.error('Erreur lors du chargement des coordonnées:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchNextPage(options = {}) {
      if (!this.hasMore || this.loading) return
      await this.fetchCoordinates({ ...options, page: this.page + 1 })
    },
  },
})

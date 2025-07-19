import { defineStore } from 'pinia'
import axios from 'axios'

export const useMapStore = defineStore('map', {
  state: () => ({
    coordinates: [],
    producer: null,
    loading: false,
    loaded: false,
  }),

  actions: {
    async fetchCoordinates() {
      if (this.loaded) return

      this.loading = true
      this.error = null

      const allCoordinates = []
      const pageSize = 1000
      let start = 0
      let total = 0
      let fetched = 0

      try {
        do {
          const url = `https://data.opendatasoft.com/api/records/1.0/search/?dataset=flux-toutes-plateformes%40producteursagri&rows=${pageSize}&start=${start}`

          const response = await axios.get(url, {
            headers: { Accept: 'application/json' },
          })
          console.log('response', response)
          const records = response.data.records || []
          total = response.data.nhits || 0

          console.log(
            'start:',
            start,
            'total:',
            total,
            'records:',
            records.length
          )

          records.forEach((record) => {
            const f = record.fields
            const geo = f.geolocalisation
            if (Array.isArray(geo) && geo.length === 2) {
              allCoordinates.push({
                id: record.recordid,
                lat: geo[0],
                lng: geo[1],
                label: f.nom || f.raison_sociale || 'Producteur inconnu',
              })
            }
          })

          fetched += records.length
          start += pageSize
        } while (fetched < 1000)

        this.coordinates = allCoordinates
        this.loaded = true
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    selectProducerById(id) {
      this.selectedProducer = this.coordinates.find((p) => p.id === id) || null
    },
  },
})

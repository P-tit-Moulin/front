import { defineStore } from 'pinia'
import axios from 'axios'

export const useProducerStore = defineStore('producer', {
  state: () => ({
    producers: {},
    loaded: false,
    loading: false,
  }),

  getters: {
    producerList: state => Object.values(state.producers),

    getProducerById: state => id => state.producers[id] || null,

    // Nouveau: Obtenir les producteurs par catégorie
    getProducersByCategory: state => category => {
      return Object.values(state.producers).filter(
        producer => producer.category === category
      )
    },

    // Nouveau: Obtenir toutes les catégories uniques
    allCategories: state => {
      const categories = Object.values(state.producers)
        .map(producer => producer.category)
        .filter(Boolean)
      return [...new Set(categories)]
    },

    // Nouveau: Obtenir toutes les villes uniques
    allCities: state => {
      const cities = Object.values(state.producers)
        .map(producer => producer.address)
        .filter(Boolean)
      return [...new Set(cities)]
    },

    // Nouveau: Recherche de producteurs
    searchProducers: state => query => {
      const searchTerm = query.toLowerCase()
      return Object.values(state.producers).filter(
        producer =>
          producer.label?.toLowerCase().includes(searchTerm) ||
          producer.description?.toLowerCase().includes(searchTerm) ||
          producer.category?.toLowerCase().includes(searchTerm) ||
          producer.address?.toLowerCase().includes(searchTerm)
      )
    },
  },

  actions: {
    async fetchProducers() {
      if (this.loaded) return

      this.loaded = true

      const allProducers = {}
      const pageSize = 1000
      let start = 0
      let fetched = 0

      try {
        do {
          const url = `https://data.opendatasoft.com/api/records/1.0/search/?dataset=flux-toutes-plateformes%40producteursagri&rows=${pageSize}&start=${start}`

          const response = await axios.get(url, {
            headers: { Accept: 'application/json' },
          })

          const records = response.data.records || []

          records.forEach(record => {
            const f = record.fields
            const id = record.recordid

            allProducers[id] = {
              id,
              label: f.nom ?? f.raison_sociale ?? 'Producteur inconnu',
              description: f.description ?? '',
              address: f.com_name ?? '',
              category: f.categorie ?? '',
              familles_des_produits: f.familles_des_produits || [],
              familles_des_produits_restreintes:
                f.familles_des_produits_restreintes || [],
            }
          })

          fetched += records.length
          start += pageSize
        } while (fetched < 1000)

        this.producers = allProducers
      } catch (err) {
        console.error('Failed to fetch producers from the API:', err)
      } finally {
        this.loading = false
      }
    },
  },
})

import { defineStore } from 'pinia'
import api from '@/config/api'

export const useProducerStore = defineStore('producer', {
  state: () => ({
    producers: {},
    loaded: false,
    loading: false,
  }),

  getters: {
    producerList: state => Object.values(state.producers),

    getProducerById: state => id => state.producers[id] || null,

    // Obtenir les producteurs par catégorie
    getProducersByCategory: state => category => {
      return Object.values(state.producers).filter(
        producer => producer.category === category
      )
    },

    // Obtenir toutes les catégories uniques
    allCategories: state => {
      const categories = Object.values(state.producers)
        .map(producer => producer.category)
        .filter(Boolean)
      return [...new Set(categories)]
    },

    // Obtenir toutes les villes uniques
    allCities: state => {
      const cities = Object.values(state.producers)
        .map(producer => producer.address)
        .filter(Boolean)
      return [...new Set(cities)]
    },

    // Recherche de producteurs
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

      this.loading = true

      try {
        // Appel à votre API backend
        const response = await api.get('/producers')

        const allProducers = {}
        console.log(response)
        response.data.data.forEach(producer => {
          allProducers[producer.id] = {
            id: producer.id,
            label: producer.nom || 'Producteur inconnu',
            description: producer.description || '',
            address: producer.adresse || '',
            code_postal: producer.code_postal || '',
            com_name: producer.com_name || '',
            familles_des_produits: producer.familles_des_produits || [],
            familles_des_produits_restreintes:
              producer.familles_des_produits_restreintes || [],
            // Ajoutez d'autres champs selon votre modèle backend
          }
        })

        this.producers = allProducers
        this.loaded = true
      } catch (error) {
        console.error('Erreur lors du chargement des producteurs:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Méthode pour récupérer un producteur spécifique (si besoin)
    async getProducerByIdAsync(id) {
      try {
        const response = await api.get(`/producers/${id}`)
        this.producers[id] = response.data
        return response.data
      } catch (error) {
        console.error(`Erreur lors du chargement du producteur ${id}:`, error)
        throw error
      }
    },
  },
})

import { defineStore } from 'pinia'
import api from '@/config/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  }),
  getters: {
    isLoggedIn: state => !!state.user && !!state.accessToken,
  },
  actions: {
    setUser(user, accessToken, refreshToken = null) {
      this.user = user
      this.accessToken = accessToken

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
      } else {
        localStorage.removeItem('accessToken')
      }

      if (refreshToken) {
        this.refreshToken = refreshToken
        localStorage.setItem('refreshToken', refreshToken)
      } else if (refreshToken === null) {
        this.refreshToken = null
        localStorage.removeItem('refreshToken')
      }
    },

    async login(email, mdp) {
      const { data } = await api.post(
        '/users/login',
        { email, mdp },
        { withCredentials: true }
      )
      if (!data.accessToken)
        throw new Error(data.error || 'Erreur de connexion')

      this.setUser(data.user, data.accessToken, data.refreshToken)
      return data.user
    },

    async logout() {
      await api.post('/users/logout', {}, { withCredentials: true })
      this.setUser(null, null, null)
    },

    async register(payload) {
      try {
        const { data } = await api.post('/users/register', payload)

        if (data.accessToken && data.user) {
          this.setUser(data.user, data.accessToken, data.refreshToken)
        }

        return data
      } catch (error) {
        console.error('Erreur dans store register:', error)
        throw error
      }
    },

    async updateProfile(payload) {
      if (!this.user || !this.accessToken) {
        throw new Error('Utilisateur non connecté')
      }

      const userId = this.user._id

      if (!userId) {
        throw new Error('ID utilisateur non trouvé')
      }

      try {
        const { data } = await api.put(`/users/${userId}`, payload)

        if (data.error) {
          throw new Error(data.error || 'Erreur lors de la modification')
        }

        this.user = { ...this.user, ...data.user }
        return data
      } catch (error) {
        console.error('Erreur updateProfile:', error)
        if (error.response?.status === 401) {
          this.setUser(null, null, null)
        }

        throw error
      }
    },
    async refreshTokens() {
      if (!this.refreshToken) throw new Error('Aucun refresh token disponible')

      try {
        const { data } = await api.post('/users/refresh', {
          refreshToken: this.refreshToken,
        })

        this.setUser(this.user, data.accessToken, data.refreshToken)
        return data
      } catch (error) {
        this.setUser(null, null, null)
        throw error
      }
    },
  },
})

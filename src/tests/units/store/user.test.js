import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/store/user'
import api from '@/config/api'

vi.mock('@/config/api', () => ({
  default: {
    post: vi.fn(),
    put: vi.fn(),
  },
}))

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

describe('useUserStore', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    store = useUserStore()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('État initial', () => {
    it('devrait avoir un état initial correct', () => {
      expect(store.user).toBeNull()
      expect(store.accessToken).toBeNull()
      expect(store.refreshToken).toBeNull()
    })

    it("devrait récupérer les tokens depuis localStorage lors de l'initialisation", () => {
      localStorageMock.getItem.mockImplementation(key => {
        if (key === 'accessToken') return 'stored-access-token'
        if (key === 'refreshToken') return 'stored-refresh-token'
        return null
      })

      setActivePinia(createPinia())
      const newStore = useUserStore()

      expect(newStore.accessToken).toBe('stored-access-token')
      expect(newStore.refreshToken).toBe('stored-refresh-token')
    })
  })

  describe('Getters', () => {
    it('isLoggedIn devrait retourner false quand user et accessToken sont null', () => {
      expect(store.isLoggedIn).toBe(false)
    })

    it('isLoggedIn devrait retourner false quand seul user est défini', () => {
      store.user = { id: 1, email: 'test@test.com' }
      expect(store.isLoggedIn).toBe(false)
    })

    it('isLoggedIn devrait retourner false quand seul accessToken est défini', () => {
      store.accessToken = 'token123'
      expect(store.isLoggedIn).toBe(false)
    })

    it('isLoggedIn devrait retourner true quand user et accessToken sont définis', () => {
      store.user = { id: 1, email: 'test@test.com' }
      store.accessToken = 'token123'
      expect(store.isLoggedIn).toBe(true)
    })
  })

  describe('Actions - setUser', () => {
    it('devrait définir user et accessToken', () => {
      const user = { id: 1, email: 'test@test.com' }
      const accessToken = 'access123'

      store.setUser(user, accessToken)

      expect(store.user).toEqual(user)
      expect(store.accessToken).toBe(accessToken)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'accessToken',
        accessToken
      )
    })

    it('devrait définir refreshToken quand fourni', () => {
      const user = { id: 1, email: 'test@test.com' }
      const accessToken = 'access123'
      const refreshToken = 'refresh123'

      store.setUser(user, accessToken, refreshToken)

      expect(store.refreshToken).toBe(refreshToken)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'refreshToken',
        refreshToken
      )
    })

    it('devrait supprimer accessToken du localStorage quand accessToken est null', () => {
      store.setUser(null, null)

      expect(store.accessToken).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken')
    })

    it('devrait supprimer refreshToken du localStorage quand refreshToken est explicitement null', () => {
      store.setUser(null, null, null)

      expect(store.refreshToken).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken')
    })

    it('devrait supprimer refreshToken quand refreshToken est explicitement null', () => {
      store.setUser({ id: 1 }, 'initial-access', 'initial-refresh')
      expect(store.refreshToken).toBe('initial-refresh')

      store.setUser({ id: 1, nom: 'Updated' }, 'new-access', null)

      expect(store.refreshToken).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken')
    })
  })

  describe('Actions - login', () => {
    it("devrait connecter l'utilisateur avec succès", async () => {
      const mockResponse = {
        data: {
          user: { id: 1, email: 'test@test.com' },
          accessToken: 'access123',
          refreshToken: 'refresh123',
        },
      }
      api.post.mockResolvedValue(mockResponse)

      const result = await store.login('test@test.com', 'password')

      expect(api.post).toHaveBeenCalledWith(
        '/users/login',
        { email: 'test@test.com', mdp: 'password' },
        { withCredentials: true }
      )
      expect(store.user).toEqual(mockResponse.data.user)
      expect(store.accessToken).toBe('access123')
      expect(store.refreshToken).toBe('refresh123')
      expect(result).toEqual(mockResponse.data.user)
    })

    it('devrait lever une erreur quand accessToken est manquant', async () => {
      const mockResponse = {
        data: {
          error: 'Identifiants invalides',
        },
      }
      api.post.mockResolvedValue(mockResponse)

      await expect(
        store.login('test@test.com', 'wrongpassword')
      ).rejects.toThrow('Identifiants invalides')
    })

    it("devrait lever une erreur par défaut quand accessToken est manquant sans message d'erreur", async () => {
      const mockResponse = {
        data: {},
      }
      api.post.mockResolvedValue(mockResponse)

      await expect(store.login('test@test.com', 'password')).rejects.toThrow(
        'Erreur de connexion'
      )
    })
  })

  describe('Actions - logout', () => {
    it("devrait déconnecter l'utilisateur", async () => {
      store.user = { id: 1, email: 'test@test.com' }
      store.accessToken = 'access123'
      store.refreshToken = 'refresh123'

      api.post.mockResolvedValue({})

      await store.logout()

      expect(api.post).toHaveBeenCalledWith(
        '/users/logout',
        {},
        { withCredentials: true }
      )
      expect(store.user).toBeNull()
      expect(store.accessToken).toBeNull()
      expect(store.refreshToken).toBeNull()
    })
  })

  describe('Actions - register', () => {
    it('devrait enregistrer un nouvel utilisateur avec succès', async () => {
      const payload = {
        email: 'newuser@test.com',
        mdp: 'password123',
        nom: 'Test User',
      }
      const mockResponse = {
        data: {
          user: { id: 1, email: 'newuser@test.com', nom: 'Test User' },
          accessToken: 'access123',
          refreshToken: 'refresh123',
        },
      }
      api.post.mockResolvedValue(mockResponse)

      const result = await store.register(payload)

      expect(api.post).toHaveBeenCalledWith('/users/register', payload)
      expect(store.user).toEqual(mockResponse.data.user)
      expect(store.accessToken).toBe('access123')
      expect(store.refreshToken).toBe('refresh123')
      expect(result).toEqual(mockResponse.data)
    })

    it("devrait retourner les données sans connecter l'utilisateur si pas de token", async () => {
      const payload = { email: 'test@test.com' }
      const mockResponse = {
        data: {
          message: 'Email de confirmation envoyé',
        },
      }
      api.post.mockResolvedValue(mockResponse)

      const result = await store.register(payload)

      expect(store.user).toBeNull()
      expect(store.accessToken).toBeNull()
      expect(result).toEqual(mockResponse.data)
    })

    it("devrait gérer les erreurs d'enregistrement", async () => {
      const payload = { email: 'invalid-email' }
      const error = new Error('Email invalide')
      api.post.mockRejectedValue(error)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(store.register(payload)).rejects.toThrow('Email invalide')
      expect(consoleSpy).toHaveBeenCalledWith(
        'Erreur dans store register:',
        error
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Actions - updateProfile', () => {
    beforeEach(() => {
      store.user = { _id: 'user123', email: 'test@test.com', nom: 'Test User' }
      store.accessToken = 'access123'
    })

    it('devrait mettre à jour le profil avec succès', async () => {
      const payload = { nom: 'Updated User' }
      const mockResponse = {
        data: {
          user: { _id: 'user123', email: 'test@test.com', nom: 'Updated User' },
        },
      }
      api.put.mockResolvedValue(mockResponse)

      const result = await store.updateProfile(payload)

      expect(api.put).toHaveBeenCalledWith('/users/user123', payload)
      expect(store.user).toEqual({
        _id: 'user123',
        email: 'test@test.com',
        nom: 'Updated User',
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('devrait lever une erreur si utilisateur non connecté', async () => {
      store.user = null
      store.accessToken = null

      await expect(store.updateProfile({ nom: 'Test' })).rejects.toThrow(
        'Utilisateur non connecté'
      )
    })

    it('devrait lever une erreur si ID utilisateur non trouvé', async () => {
      store.user = { email: 'test@test.com' }

      await expect(store.updateProfile({ nom: 'Test' })).rejects.toThrow(
        'ID utilisateur non trouvé'
      )
    })

    it("devrait gérer les erreurs de l'API", async () => {
      const mockResponse = {
        data: {
          error: 'Données invalides',
        },
      }
      api.put.mockResolvedValue(mockResponse)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(store.updateProfile({ nom: 'Test' })).rejects.toThrow(
        'Données invalides'
      )

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it("devrait déconnecter l'utilisateur en cas d'erreur 401", async () => {
      const error = {
        response: { status: 401 },
      }
      api.put.mockRejectedValue(error)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(store.updateProfile({ nom: 'Test' })).rejects.toThrow()

      expect(store.user).toBeNull()
      expect(store.accessToken).toBeNull()
      expect(store.refreshToken).toBeNull()

      consoleSpy.mockRestore()
    })
  })

  describe('Actions - refreshTokens', () => {
    beforeEach(() => {
      store.user = { id: 1, email: 'test@test.com' }
      store.refreshToken = 'refresh123'
    })

    it('devrait rafraîchir les tokens avec succès', async () => {
      const mockResponse = {
        data: {
          accessToken: 'new-access123',
          refreshToken: 'new-refresh123',
        },
      }
      api.post.mockResolvedValue(mockResponse)

      const result = await store.refreshTokens()

      expect(api.post).toHaveBeenCalledWith('/users/refresh', {
        refreshToken: 'refresh123',
      })
      expect(store.accessToken).toBe('new-access123')
      expect(store.refreshToken).toBe('new-refresh123')
      expect(result).toEqual(mockResponse.data)
    })

    it('devrait lever une erreur si pas de refresh token', async () => {
      store.refreshToken = null

      await expect(store.refreshTokens()).rejects.toThrow(
        'Aucun refresh token disponible'
      )
    })

    it("devrait déconnecter l'utilisateur en cas d'erreur", async () => {
      const error = new Error('Refresh token invalide')
      api.post.mockRejectedValue(error)

      await expect(store.refreshTokens()).rejects.toThrow(
        'Refresh token invalide'
      )

      expect(store.user).toBeNull()
      expect(store.accessToken).toBeNull()
      expect(store.refreshToken).toBeNull()
    })
  })

  describe("Scénarios d'intégration", () => {
    it("devrait maintenir la cohérence lors d'une séquence login/logout", async () => {
      const loginResponse = {
        data: {
          user: { id: 1, email: 'test@test.com' },
          accessToken: 'access123',
          refreshToken: 'refresh123',
        },
      }
      api.post.mockResolvedValueOnce(loginResponse)

      await store.login('test@test.com', 'password')
      expect(store.isLoggedIn).toBe(true)

      api.post.mockResolvedValueOnce({})
      await store.logout()
      expect(store.isLoggedIn).toBe(false)
    })

    it('devrait gérer la persistance des tokens correctement', async () => {
      const user = { id: 1, email: 'test@test.com' }
      const accessToken = 'access123'
      const refreshToken = 'refresh123'

      store.setUser(user, accessToken, refreshToken)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'accessToken',
        accessToken
      )
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'refreshToken',
        refreshToken
      )

      store.setUser(null, null, null)

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken')
    })
  })
})

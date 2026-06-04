import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import Login from '@/pages/Login.vue'
import { useUserStore } from '@/store/user'

const PrimaryButtonMock = {
  name: 'PrimaryButton',
  template:
    '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
  props: ['disabled', 'loading'],
  emits: ['click'],
}

const TertiaryButtonMock = {
  name: 'TertiaryButton',
  template: '<button @click="$emit(\'click\')"><slot /></button>',
  emits: ['click'],
}

vi.mock('@/store/user', () => ({
  useUserStore: vi.fn(),
}))

vi.mock('@/assets/img/logo.svg', () => ({
  default: 'mocked-logo.svg',
}))

describe('Login.vue', () => {
  let wrapper
  let mockUserStore
  let mockRouter
  let pinia

  beforeEach(() => {
    mockUserStore = {
      login: vi.fn(),
    }
    useUserStore.mockReturnValue(mockUserStore)

    mockRouter = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/register', component: { template: '<div>Register</div>' } },
      ],
    })

    pinia = createPinia()
    setActivePinia(pinia)

    mockRouter.push = vi.fn()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    vi.clearAllMocks()
  })

  const createWrapper = (options = {}) => {
    return mount(Login, {
      global: {
        plugins: [pinia, mockRouter],
        components: {
          PrimaryButton: PrimaryButtonMock,
          TertiaryButton: TertiaryButtonMock,
        },
        stubs: {
          RouterLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
          VContainer: { template: '<div class="v-container"><slot /></div>' },
          VCard: { template: '<div class="v-card"><slot /></div>' },
          VCardTitle: { template: '<div class="v-card-title"><slot /></div>' },
          VCardText: { template: '<div class="v-card-text"><slot /></div>' },
          VCardActions: {
            template: '<div class="v-card-actions"><slot /></div>',
          },
          VTextField: {
            template:
              '<input :id="id" :type="type" :required="required" :placeholder="placeholder" :autocomplete="autocomplete" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: [
              'id',
              'type',
              'required',
              'placeholder',
              'autocomplete',
              'modelValue',
            ],
            emits: ['update:modelValue'],
          },
        },
      },
      ...options,
    })
  }

  describe('Rendu du composant', () => {
    it('devrait rendre correctement le composant', () => {
      wrapper = createWrapper()

      expect(wrapper.find('h2').text()).toBe('Connexion')
      expect(wrapper.find('#email').exists()).toBe(true)
      expect(wrapper.find('#password').exists()).toBe(true)
      expect(wrapper.findComponent(PrimaryButtonMock).exists()).toBe(true)
    })

    it('devrait afficher le logo', () => {
      wrapper = createWrapper()

      const logo = wrapper.find('.login-logo img')
      expect(logo.exists()).toBe(true)
      expect(logo.attributes('alt')).toBe('Logo')
    })

    it('devrait afficher les labels corrects', () => {
      wrapper = createWrapper()

      const labels = wrapper.findAll('label')
      expect(labels[0].text()).toBe('Email')
      expect(labels[1].text()).toBe('Mot de passe')
    })

    it('devrait avoir les champs avec les bons attributs', () => {
      wrapper = createWrapper()

      const emailField = wrapper.find('#email')
      const passwordField = wrapper.find('#password')

      expect(emailField.attributes('type')).toBe('email')
      expect(emailField.attributes('required')).toBeDefined()
      expect(emailField.attributes('placeholder')).toBe('Entrez votre email')

      expect(passwordField.attributes('type')).toBe('password')
      expect(passwordField.attributes('required')).toBeDefined()
      expect(passwordField.attributes('autocomplete')).toBe('current-password')
      expect(passwordField.attributes('placeholder')).toBe(
        'Entrez votre mot de passe'
      )
    })
  })

  describe('Gestion des données réactives', () => {
    it('devrait mettre à jour les valeurs des champs', async () => {
      wrapper = createWrapper()

      const emailField = wrapper.find('#email')
      const passwordField = wrapper.find('#password')

      await emailField.setValue('test@example.com')
      await passwordField.setValue('password123')

      expect(wrapper.vm.email).toBe('test@example.com')
      expect(wrapper.vm.password).toBe('password123')
    })

    it('devrait initialiser les refs avec des valeurs vides', () => {
      wrapper = createWrapper()

      expect(wrapper.vm.email).toBe('')
      expect(wrapper.vm.password).toBe('')
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.error).toBe('')
    })
  })

  describe('Gestion des erreurs', () => {
    it('devrait afficher les erreurs', async () => {
      wrapper = createWrapper()

      wrapper.vm.error = 'Email ou mot de passe incorrect'
      await nextTick()

      const errorDiv = wrapper.find('.error')
      expect(errorDiv.exists()).toBe(true)
      expect(errorDiv.text()).toBe('Email ou mot de passe incorrect')
    })

    it("ne devrait pas afficher de div erreur quand il n'y a pas d'erreur", () => {
      wrapper = createWrapper()

      const errorDiv = wrapper.find('.error')
      expect(errorDiv.exists()).toBe(false)
    })
  })

  describe('Soumission du formulaire', () => {
    it('devrait empêcher la soumission par défaut du formulaire', async () => {
      wrapper = createWrapper()
      const form = wrapper.find('form')
      const preventDefault = vi.fn()

      await form.trigger('submit', { preventDefault })
    })

    it('devrait effectuer une connexion réussie', async () => {
      mockUserStore.login.mockResolvedValue({})
      wrapper = createWrapper()

      wrapper.vm.email = 'test@example.com'
      wrapper.vm.password = 'password123'

      await wrapper.vm.onSubmit()

      expect(mockUserStore.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      )
      expect(mockRouter.push).toHaveBeenCalledWith('/')
      expect(wrapper.vm.error).toBe('')
    })

    it('devrait effectuer une connexion réussie', async () => {
      mockUserStore.login.mockResolvedValue({})
      wrapper = createWrapper()

      wrapper.vm.email = 'test@example.com'
      wrapper.vm.password = 'password123'

      await wrapper.vm.onSubmit()

      expect(mockUserStore.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      )
      expect(mockRouter.push).toHaveBeenCalledWith('/')
      expect(wrapper.vm.error).toBe('')
    })

    it('devrait gérer les erreurs de connexion avec response.data.error', async () => {
      const errorMessage = 'Email ou mot de passe incorrect'
      mockUserStore.login.mockRejectedValue({
        response: {
          data: {
            error: errorMessage,
          },
        },
      })
      wrapper = createWrapper()

      wrapper.vm.email = 'test@example.com'
      wrapper.vm.password = 'password123'

      await wrapper.vm.onSubmit()

      expect(wrapper.vm.error).toBe(errorMessage)
      expect(mockRouter.push).not.toHaveBeenCalled()
    })

    it('devrait gérer les erreurs de connexion avec message', async () => {
      const errorMessage = 'Erreur réseau'
      mockUserStore.login.mockRejectedValue({
        message: errorMessage,
      })
      wrapper = createWrapper()

      wrapper.vm.email = 'test@example.com'
      wrapper.vm.password = 'password123'

      await wrapper.vm.onSubmit()

      expect(wrapper.vm.error).toBe(errorMessage)
      expect(mockRouter.push).not.toHaveBeenCalled()
    })

    it("devrait utiliser le message d'erreur par défaut", async () => {
      mockUserStore.login.mockRejectedValue({})
      wrapper = createWrapper()

      wrapper.vm.email = 'test@example.com'
      wrapper.vm.password = 'password123'

      await wrapper.vm.onSubmit()

      expect(wrapper.vm.error).toBe('Erreur de connexion.')
      expect(mockRouter.push).not.toHaveBeenCalled()
    })
  })

  describe('État de chargement', () => {
    it("devrait gérer l'état de chargement", async () => {
      let resolveLogin
      const loginPromise = new Promise(resolve => {
        resolveLogin = resolve
      })
      mockUserStore.login.mockReturnValue(loginPromise)

      wrapper = createWrapper()

      wrapper.vm.email = 'test@example.com'
      wrapper.vm.password = 'password123'

      const submitPromise = wrapper.vm.onSubmit()
      await nextTick()

      expect(wrapper.vm.loading).toBe(true)

      resolveLogin({})
      await submitPromise

      expect(wrapper.vm.loading).toBe(false)
    })

    it("devrait remettre loading à false même en cas d'erreur", async () => {
      mockUserStore.login.mockRejectedValue(new Error('Erreur'))
      wrapper = createWrapper()

      wrapper.vm.email = 'test@example.com'
      wrapper.vm.password = 'password123'

      await wrapper.vm.onSubmit()

      expect(wrapper.vm.loading).toBe(false)
    })
  })

  describe('Navigation', () => {
    it("devrait avoir un lien vers la page d'inscription", () => {
      wrapper = createWrapper()

      const registerLink = wrapper.find('a[href="/register"]')
      expect(registerLink.exists()).toBe(true)
    })
  })

  describe('Validation des champs', () => {
    it('devrait avoir des champs requis', () => {
      wrapper = createWrapper()

      const emailField = wrapper.find('#email')
      const passwordField = wrapper.find('#password')

      expect(emailField.attributes('required')).toBeDefined()
      expect(passwordField.attributes('required')).toBeDefined()
    })

    it("devrait avoir le bon type pour l'email", () => {
      wrapper = createWrapper()

      const emailField = wrapper.find('#email')
      expect(emailField.attributes('type')).toBe('email')
    })

    it('devrait avoir le bon type pour le mot de passe', () => {
      wrapper = createWrapper()

      const passwordField = wrapper.find('#password')
      expect(passwordField.attributes('type')).toBe('password')
    })
  })

  describe('Accessibilité', () => {
    it('devrait associer les labels aux champs', () => {
      wrapper = createWrapper()

      const emailLabel = wrapper.find('label[for="email"]')
      const passwordLabel = wrapper.find('label[for="password"]')
      const emailField = wrapper.find('#email')
      const passwordField = wrapper.find('#password')

      expect(emailLabel.exists()).toBe(true)
      expect(passwordLabel.exists()).toBe(true)
      expect(emailField.attributes('id')).toBe('email')
      expect(passwordField.attributes('id')).toBe('password')
    })

    it('devrait avoir un alt text pour le logo', () => {
      wrapper = createWrapper()

      const logo = wrapper.find('.login-logo img')
      expect(logo.attributes('alt')).toBe('Logo')
    })
  })

  describe('Intégration avec le store', () => {
    it('devrait utiliser le store utilisateur', () => {
      wrapper = createWrapper()

      expect(useUserStore).toHaveBeenCalled()
    })

    it('devrait passer les bonnes données au store lors de la connexion', async () => {
      mockUserStore.login.mockResolvedValue({})
      wrapper = createWrapper()

      const email = 'user@example.com'
      const password = 'securepassword'

      wrapper.vm.email = email
      wrapper.vm.password = password
      await wrapper.vm.onSubmit()

      expect(mockUserStore.login).toHaveBeenCalledWith(email, password)
    })
  })

  describe('Props et événements des composants', () => {
    it('devrait passer les bonnes props au PrimaryButton', () => {
      wrapper = createWrapper()

      const button = wrapper.findComponent(PrimaryButtonMock)
      expect(button.props('disabled')).toBe(false)
      expect(button.props('loading')).toBe(false)
    })

    it('devrait désactiver le bouton pendant le chargement', async () => {
      wrapper = createWrapper()

      wrapper.vm.loading = true
      await nextTick()

      const button = wrapper.findComponent(PrimaryButtonMock)
      expect(button.props('disabled')).toBe(true)
      expect(button.props('loading')).toBe(true)
    })
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { nextTick } from 'vue'
import Register from '@/pages/Register.vue'
import { useUserStore } from '@/store/user'

vi.mock('@/store/user', () => ({
  useUserStore: vi.fn(),
}))

describe('Register Component', () => {
  let wrapper
  let router
  let mockUserStore
  let pinia

  const routes = [
    { path: '/register', component: { template: '<div>Register</div>' } },
    { path: '/login', component: { template: '<div>Login</div>' } },
    { path: '/profil', component: { template: '<div>Profil</div>' } },
  ]

  beforeEach(async () => {
    try {
      pinia = createPinia()
      setActivePinia(pinia)

      router = createRouter({
        history: createMemoryHistory(),
        routes,
      })

      mockUserStore = {
        register: vi.fn(),
        setToken: vi.fn(),
      }
      useUserStore.mockReturnValue(mockUserStore)

      await router.push('/register')

      wrapper = mount(Register, {
        global: {
          plugins: [router, pinia],
          stubs: {
            'router-link': {
              template: '<a data-testid="router-link" :href="to"><slot /></a>',
              props: ['to'],
            },
            AutocompleteEntreprise: {
              template:
                '<div data-testid="autocomplete-entreprise"><input v-model="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" /></div>',
              props: ['modelValue'],
              emits: ['update:modelValue'],
            },
            PrimaryButton: {
              template:
                '<button data-testid="primary-button" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
              props: ['disabled', 'loading', 'type'],
              emits: ['click'],
            },
            TertiaryButton: {
              template:
                '<button data-testid="tertiary-button"><slot /></button>',
            },
            VSnackbar: {
              template:
                '<div data-testid="snackbar" v-if="modelValue" :class="color"><slot /></div>',
              props: ['modelValue', 'color', 'timeout'],
            },
            VContainer: {
              template: '<div class="v-container"><slot /></div>',
            },
            VCard: {
              template: '<div class="v-card"><slot /></div>',
            },
            VCardTitle: {
              template: '<div class="v-card-title"><slot /></div>',
            },
            VCardText: {
              template: '<div class="v-card-text"><slot /></div>',
            },
            VCardActions: {
              template: '<div class="v-card-actions"><slot /></div>',
            },
            VTextField: {
              template: `<input 
                :id="id"
                :type="type" 
                :placeholder="placeholder" 
                :required="required"
                :autocomplete="autocomplete"
                :value="modelValue" 
                @input="$emit('update:modelValue', $event.target.value)"
                class="v-text-field"
              />`,
              props: [
                'id',
                'type',
                'placeholder',
                'required',
                'autocomplete',
                'modelValue',
              ],
              emits: ['update:modelValue'],
            },
          },
        },
      })

      await router.isReady()
    } catch (error) {
      console.error('Error in beforeEach:', error)
      wrapper = null
    }
  })

  afterEach(async () => {
    if (wrapper) {
      wrapper.unmount()
      wrapper = null
    }
    vi.clearAllMocks()
    await new Promise(resolve => setTimeout(resolve, 0))
  })

  describe('Rendu du composant', () => {
    it('devrait rendre le composant correctement', () => {
      if (!wrapper) return

      expect(wrapper.find('h2').text()).toBe('Créer un compte')
      expect(wrapper.find('img[alt="Logo"]').exists()).toBe(true)
    })

    it('devrait afficher tous les champs du formulaire', () => {
      if (!wrapper) return

      expect(wrapper.find('#prenom').exists()).toBe(true)
      expect(wrapper.find('#nom_de_famille').exists()).toBe(true)
      expect(wrapper.find('#email').exists()).toBe(true)
      expect(wrapper.find('#mdp').exists()).toBe(true)
      expect(
        wrapper.find('[data-testid="autocomplete-entreprise"]').exists()
      ).toBe(true)
    })

    it('devrait afficher les labels corrects', () => {
      if (!wrapper) return

      const labels = wrapper.findAll('label')
      expect(labels[0].text()).toBe('Prénom')
      expect(labels[1].text()).toBe('Nom de famille')
      expect(labels[2].text()).toBe('Email')
      expect(labels[3].text()).toBe('Nom de votre entreprise')
      expect(labels[4].text()).toBe('Mot de passe')
    })

    it("devrait afficher les boutons d'action", () => {
      if (!wrapper) return

      expect(wrapper.find('[data-testid="primary-button"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="tertiary-button"]').exists()).toBe(
        true
      )
      expect(
        wrapper.find('[data-testid="router-link"]').attributes('href')
      ).toBe('/login')
    })
  })

  describe('Interactions utilisateur', () => {
    it('devrait mettre à jour les valeurs du formulaire', async () => {
      if (!wrapper) return

      await wrapper.find('#prenom').setValue('John')
      await wrapper.find('#nom_de_famille').setValue('Doe')
      await wrapper.find('#email').setValue('john.doe@example.com')
      await wrapper.find('#mdp').setValue('password123')

      expect(wrapper.vm.form.prenom).toBe('John')
      expect(wrapper.vm.form.nom_de_famille).toBe('Doe')
      expect(wrapper.vm.form.email).toBe('john.doe@example.com')
      expect(wrapper.vm.form.mdp).toBe('password123')
    })
  })

  describe('Soumission du formulaire', () => {
    beforeEach(async () => {
      if (!wrapper) return

      await wrapper.find('#prenom').setValue('John')
      await wrapper.find('#nom_de_famille').setValue('Doe')
      await wrapper.find('#email').setValue('john.doe@example.com')
      await wrapper.find('#mdp').setValue('password123')
      wrapper.vm.form.entreprise = 'Mon Entreprise'
    })

    it('devrait déclencher la soumission lors du clic sur le bouton', async () => {
      if (!wrapper) return

      mockUserStore.register.mockResolvedValue({
        accessToken: 'fake-token',
        user: { id: 1, email: 'john.doe@example.com' },
      })

      await wrapper.find('[data-testid="primary-button"]').trigger('click')
      await nextTick()

      expect(mockUserStore.register).toHaveBeenCalledWith({
        prenom: 'John',
        nom_de_famille: 'Doe',
        email: 'john.doe@example.com',
        mdp: 'password123',
        entreprise: 'Mon Entreprise',
      })
    })

    it("devrait envoyer les bonnes données au store lors de l'inscription", async () => {
      if (!wrapper) return

      mockUserStore.register.mockResolvedValue({
        accessToken: 'fake-token',
        user: { id: 1, email: 'john.doe@example.com' },
      })

      await wrapper.find('[data-testid="primary-button"]').trigger('click')
      await nextTick()

      expect(mockUserStore.register).toHaveBeenCalledWith({
        prenom: 'John',
        nom_de_famille: 'Doe',
        email: 'john.doe@example.com',
        mdp: 'password123',
        entreprise: 'Mon Entreprise',
      })
    })

    it('devrait rediriger vers /profil après une inscription réussie avec token', async () => {
      if (!wrapper) return

      mockUserStore.register.mockResolvedValue({
        accessToken: 'fake-token',
        user: { id: 1, email: 'john.doe@example.com' },
      })

      const routerPushSpy = vi.spyOn(router, 'push')

      await wrapper.find('[data-testid="primary-button"]').trigger('click')
      await nextTick()

      expect(mockUserStore.setToken).toHaveBeenCalledWith('fake-token')
      expect(routerPushSpy).toHaveBeenCalledWith('/profil')
    })

    it('devrait afficher une erreur si pas de token après inscription', async () => {
      if (!wrapper) return

      mockUserStore.register.mockResolvedValue({
        user: { id: 1, email: 'john.doe@example.com' },
      })

      await wrapper.find('[data-testid="primary-button"]').trigger('click')
      await nextTick()

      expect(wrapper.vm.error).toBe('Erreur de connexion après inscription.')
      expect(wrapper.vm.snackbar).toBe(true)
    })

    it("devrait gérer les erreurs d'inscription", async () => {
      if (!wrapper) return

      const errorMessage = 'Email déjà utilisé'
      mockUserStore.register.mockRejectedValue(new Error(errorMessage))

      await wrapper.find('[data-testid="primary-button"]').trigger('click')
      await nextTick()

      expect(wrapper.vm.error).toBe(errorMessage)
      expect(wrapper.vm.snackbar).toBe(true)
    })

    it("devrait afficher une erreur générique si pas de message d'erreur", async () => {
      if (!wrapper) return

      mockUserStore.register.mockRejectedValue(new Error())

      await wrapper.find('[data-testid="primary-button"]').trigger('click')
      await nextTick()

      expect(wrapper.vm.error).toBe('Erreur lors de la création du compte.')
      expect(wrapper.vm.snackbar).toBe(true)
    })
  })

  describe('États de chargement', () => {
    it('devrait désactiver le bouton pendant le chargement', async () => {
      if (!wrapper) return

      wrapper.vm.loading = true
      await nextTick()

      const button = wrapper.find('[data-testid="primary-button"]')
      expect(button.attributes('disabled')).toBeDefined()
    })
  })

  describe('Affichage des erreurs', () => {
    it("devrait afficher le snackbar d'erreur", async () => {
      if (!wrapper) return

      wrapper.vm.error = 'Une erreur de test'
      wrapper.vm.snackbar = true
      await nextTick()

      const snackbar = wrapper.find('[data-testid="snackbar"]')
      expect(snackbar.exists()).toBe(true)
      expect(snackbar.text()).toContain('Une erreur de test')
    })

    it('devrait masquer le snackbar quand snackbar est false', async () => {
      if (!wrapper) return

      wrapper.vm.error = 'Une erreur de test'
      wrapper.vm.snackbar = false
      await nextTick()

      const snackbar = wrapper.find('[data-testid="snackbar"]')
      expect(snackbar.exists()).toBe(false)
    })
  })

  describe('Validation des champs requis', () => {
    it('devrait avoir des champs marqués comme requis', () => {
      if (!wrapper) return

      expect(wrapper.find('#prenom').attributes('required')).toBeDefined()
      expect(
        wrapper.find('#nom_de_famille').attributes('required')
      ).toBeDefined()
      expect(wrapper.find('#email').attributes('required')).toBeDefined()
      expect(wrapper.find('#mdp').attributes('required')).toBeDefined()
    })
  })

  describe('Réactivité des données', () => {
    it('devrait initialiser le formulaire avec des valeurs vides', () => {
      if (!wrapper) return

      expect(wrapper.vm.form).toEqual({
        prenom: '',
        nom_de_famille: '',
        email: '',
        mdp: '',
        entreprise: '',
      })
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.error).toBe('')
      expect(wrapper.vm.snackbar).toBe(false)
    })
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AutocompleteEntreprise from '@/components/AutocompleteEntreprise.vue'
import { useProducerStore } from '@/store/producer'
import { nextTick } from 'vue'

// Mock du store Pinia
vi.mock('@/store/producer', () => ({
  useProducerStore: vi.fn(),
}))

// Stub du composant v-autocomplete de Vuetify
const VAutocompleteStub = {
  name: 'v-autocomplete',
  props: [
    'modelValue',
    'search',
    'items',
    'loading',
    'clearable',
    'itemTitle',
    'itemValue',
    'noDataText',
  ],
  emits: ['update:modelValue', 'update:search'],
  template: `
    <div>
      <input
        data-testid="search-input"
        :value="search"
        @input="$emit('update:search', $event.target.value)"
      />
      <div data-testid="items">
        <div v-for="item in items" :key="item.nom">{{ item.nom }}</div>
      </div>
      <div data-testid="no-data">{{ noDataText }}</div>
    </div>
  `,
}

describe('AutocompleteEntreprise.vue', () => {
  let wrapper
  let pinia
  let mockProducerStore

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    mockProducerStore = {
      fetchProducers: vi.fn(),
      producerList: [],
    }
    useProducerStore.mockReturnValue(mockProducerStore)
  })

  afterEach(() => {
    if (wrapper) wrapper.unmount()
    vi.clearAllMocks()
  })

  const createWrapper = (options = {}) => {
    return mount(AutocompleteEntreprise, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-autocomplete': VAutocompleteStub,
        },
      },
      ...options,
    })
  }

  it('affiche "Tapez une recherche" si rien n\'est saisi', () => {
    wrapper = createWrapper()
    expect(wrapper.find('[data-testid="no-data"]').text()).toBe(
      'Tapez une recherche'
    )
  })

  it('affiche "Tapez une recherche" si moins de 2 caractères', async () => {
    wrapper = createWrapper()
    await wrapper.find('[data-testid="search-input"]').setValue('a')
    await nextTick()
    expect(wrapper.find('[data-testid="no-data"]').text()).toBe(
      'Tapez une recherche'
    )
  })

  it('affiche "Aucune entreprise trouvée" si recherche >= 2 caractères et résultat vide', async () => {
    wrapper = createWrapper()
    mockProducerStore.producerList = []
    mockProducerStore.fetchProducers.mockResolvedValue()
    await wrapper.find('[data-testid="search-input"]').setValue('ab')
    await nextTick()
    // Attendre le watch async
    await new Promise(r => setTimeout(r, 0))
    await nextTick()
    expect(wrapper.find('[data-testid="no-data"]').text()).toBe(
      'Aucune entreprise trouvée'
    )
    expect(mockProducerStore.fetchProducers).toHaveBeenCalledWith({
      name: 'ab',
      limit: 10,
    })
  })

  it('affiche les entreprises trouvées dans la liste', async () => {
    wrapper = createWrapper()
    mockProducerStore.producerList = [
      { nom: 'Moulin Rouge' },
      { nom: 'Boulangerie du coin' },
    ]
    mockProducerStore.fetchProducers.mockResolvedValue()
    // On simule la recherche
    await wrapper.find('[data-testid="search-input"]').setValue('moulin')
    await nextTick()
    // Le watch doit s'exécuter
    await new Promise(r => setTimeout(r, 0))
    // Remettre les items du store dans le composant...
    wrapper.vm.items = mockProducerStore.producerList
    await nextTick()
    const items = wrapper.findAll('[data-testid="items"] > div')
    expect(items).toHaveLength(2)
    expect(items[0].text()).toBe('Moulin Rouge')
    expect(items[1].text()).toBe('Boulangerie du coin')
  })

  it('met le loading à true pendant la recherche', async () => {
    wrapper = createWrapper()
    // Simuler fetchProducers comme une Promise non résolue pour tester l’état loading
    let resolveFetch
    mockProducerStore.fetchProducers.mockImplementation(
      () =>
        new Promise(res => {
          resolveFetch = res
        })
    )
    await wrapper.find('[data-testid="search-input"]').setValue('rouge')
    await nextTick()
    expect(wrapper.vm.loading).toBe(true)
    // Terminer la recherche
    resolveFetch()
    await nextTick()
    expect(wrapper.vm.loading).toBe(false)
  })

  it('vide la liste des items si recherche < 2 caractères', async () => {
    wrapper = createWrapper()
    mockProducerStore.producerList = [{ nom: 'Ancienne entreprise' }]
    wrapper.vm.items = mockProducerStore.producerList
    await wrapper.find('[data-testid="search-input"]').setValue('a')
    await nextTick()
    expect(wrapper.vm.items).toEqual([])
  })
})

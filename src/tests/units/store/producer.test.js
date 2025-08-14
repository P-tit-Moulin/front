import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProducerStore } from '@/store/producer'
import api from '@/config/api'

vi.mock('@/config/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Producer Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initializes with correct default state', () => {
    const store = useProducerStore()

    expect(store.producerList).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.allCities).toEqual([])
  })

  it('producerCoordinates getter filters and maps data correctly', () => {
    const store = useProducerStore()

    store.producerList = [
      {
        id: 1,
        nom: 'Producer 1',
        geometry: { coordinates: [2.3522, 48.8566] },
      },
      {
        id: 2,
        nom: 'Producer 2',
        geometry: null,
      },
      {
        id: 3,
        nom: 'Producer 3',
        geometry: { coordinates: [2.3376, 48.8606] },
      },
    ]

    const coordinates = store.producerCoordinates

    expect(coordinates).toHaveLength(2)
    expect(coordinates[0]).toEqual({
      id: 1,
      name: 'Producer 1',
      lat: 48.8566,
      lng: 2.3522,
    })
  })

  it('fetchProducers calls API with correct parameters', async () => {
    const mockResponse = {
      data: {
        data: [
          { id: 1, nom: 'Producer 1' },
          { id: 2, nom: 'Producer 2' },
        ],
      },
    }

    vi.mocked(api.get).mockResolvedValue(mockResponse)

    const store = useProducerStore()
    await store.fetchProducers({
      name: 'test',
      city: 'Paris',
      family: 'Légumes',
    })

    expect(api.get).toHaveBeenCalledWith('/producers', {
      params: {
        nom: 'test',
        com_name: 'Paris',
        familles_des_produits: 'Légumes',
      },
    })

    expect(store.producerList).toEqual(mockResponse.data.data)
    expect(store.loading).toBe(false)
  })

  it('fetchProducers handles API errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(api.get).mockRejectedValue(new Error('API Error'))

    const store = useProducerStore()
    await store.fetchProducers()

    expect(consoleSpy).toHaveBeenCalledWith(
      'Erreur fetchProducers:',
      expect.any(Error)
    )
    expect(store.loading).toBe(false)

    consoleSpy.mockRestore()
  })

  it('fetchAllCities extracts unique cities', async () => {
    const mockResponse = {
      data: {
        data: [
          { com_name: 'Paris' },
          { com_name: 'Lyon' },
          { com_name: 'Paris' },
          { com_name: null },
          { com_name: 'Marseille' },
        ],
      },
    }

    vi.mocked(api.get).mockResolvedValue(mockResponse)

    const store = useProducerStore()
    await store.fetchAllCities()

    expect(store.allCities).toEqual(['Lyon', 'Marseille', 'Paris'])
  })

  it('getProducerByIdAsync returns producer data', async () => {
    const mockProducer = { id: 1, nom: 'Producer 1' }
    vi.mocked(api.get).mockResolvedValue({ data: { data: mockProducer } })

    const store = useProducerStore()
    const result = await store.getProducerByIdAsync(1)

    expect(api.get).toHaveBeenCalledWith('/producers/1')
    expect(result).toEqual(mockProducer)
  })

  it('fetchProductFamilies returns families data', async () => {
    const mockFamilies = {
      familles_des_produits: ['Légumes', 'Fruits'],
      familles_des_produits_restreintes: ['Bio'],
    }
    vi.mocked(api.get).mockResolvedValue({ data: { data: mockFamilies } })

    const store = useProducerStore()
    const result = await store.fetchProductFamilies()

    expect(api.get).toHaveBeenCalledWith('/producers/families/all')
    expect(result).toEqual(mockFamilies)
  })
})

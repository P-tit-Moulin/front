<template>
  <VRow>
    <!-- Contenu principal -->
    <VCol cols="5">
      <VRow class="my-6">
        <!-- Filtre par nom -->
        <VCol cols="12" md="4">
          <VTextField
            v-model="filters.name"
            label="Rechercher par nom"
            prepend-inner-icon="mdi-magnify"
            clearable
            variant="outlined"
            density="compact"
          />
        </VCol>

        <!-- Filtre par catégorie -->
        <VCol cols="12" md="4">
          <VSelect
            v-model="filters.category"
            :items="producerStore.allCategories"
            label="Filtrer par catégorie"
            prepend-inner-icon="mdi-tag"
            clearable
            variant="outlined"
            density="compact"
          />
        </VCol>

        <!-- Filtre par ville -->
        <VCol cols="12" md="4">
          <VSelect
            v-model="filters.city"
            :items="producerStore.allCities"
            label="Filtrer par ville"
            prepend-inner-icon="mdi-map-marker"
            clearable
            variant="outlined"
            density="compact"
          />
        </VCol>

        <!-- Filtre par proximité -->
        <VCol cols="12">
          <VSlider
            v-model="filters.proximityRadius"
            :min="1"
            :max="100"
            :step="1"
            color="#61c187"
            label="Rayon (km)"
            :disabled="!userLocation"
            thumb-label
          />
        </VCol>
        <VCol cols="auto" class="pl-2">
          <TertiaryButton
            :color="userLocation ? '#61C187' : 'primary'"
            :disabled="locationLoading"
            :loading="locationLoading"
            @click="getUserLocation"
          >
            <VIcon>{{
              userLocation ? 'mdi-check' : 'mdi-crosshairs-gps'
            }}</VIcon>
            {{ userLocation ? 'Localisé' : 'Me localiser' }}
          </TertiaryButton>
        </VCol>
        <VCol cols="auto" class="text-right">
          <SecondaryButton class="mr-2" @click="clearFilters">
            Effacer les filtres
          </SecondaryButton>
          <VChip
            v-if="
              filteredProducers.length !== producerStore.producerList.length
            "
            color="#61C187"
            variant="outlined"
          >
            {{ filteredProducers.length }} /
            {{ producerStore.producerList.length }} producteurs
          </VChip>
        </VCol>
      </VRow>

      <VContainer class="producer-container">
        <!-- Loading state -->
        <VRow v-if="producerStore.loading">
          <VCol cols="12" class="text-center">
            <VProgressCircular indeterminate color="primary" />
            <p class="mt-2">Chargement des producteurs...</p>
          </VCol>
        </VRow>

        <!-- Liste des producteurs -->
        <VRow v-else>
          <VCol
            v-for="producer in filteredProducers"
            :key="producer.id"
            cols="6"
          >
            <ProducerCard
              :item="producer"
              @go-to-producer="goToProducer(producer)"
            />
          </VCol>
        </VRow>

        <!-- Message si aucun résultat -->
        <VRow v-if="!producerStore.loading && filteredProducers.length === 0">
          <VCol cols="12" class="text-center">
            <VAlert type="info" variant="outlined">
              <VIcon>mdi-information-outline</VIcon>
              Aucun producteur ne correspond à vos critères de recherche.
            </VAlert>
          </VCol>
        </VRow>
      </VContainer>
    </VCol>

    <VCol cols="7" class="h-100">
      <Map
        ref="mapRef"
        :coordinates="filteredCoordinates"
        :user-location="userLocationWithRadius"
        @marker-click="handleMarkerClick"
      />
    </VCol>

    <VDialog v-model="dialog" max-width="560">
      <ProducerCard
        :item="producerData"
        close
        @close="dialog = !dialog"
        @go-to-producer="goToProducer(producerData)"
      />
    </VDialog>
  </VRow>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import Map from '@/components/Map.vue'
import ProducerCard from '@/components/ProducerCard.vue'
import { useProducerStore } from '@/store/producer'
import { useMapStore } from '@/store/map'
import { useRouter } from 'vue-router'

const dialog = ref(false)
const producerData = ref(null)
const producerStore = useProducerStore()
const mapStore = useMapStore()
const router = useRouter()
const mapRef = ref(null)

// État des filtres
const filters = ref({
  name: '',
  category: '',
  city: '',
  proximityRadius: 20,
})

// Géolocalisation
const userLocation = ref(null)
const locationLoading = ref(false)

// Fonction pour extraire la ville de l'adresse
function extractCityFromAddress(address) {
  if (!address) return null
  const patterns = [
    /\d{5}\s+(.+?)(?:,|$)/,
    /^(.+?)\s+\d{5}/,
    /,\s*(.+?)(?:,|$)/,
  ]

  for (const pattern of patterns) {
    const match = address.match(pattern)
    if (match) {
      return match[1].trim()
    }
  }

  const parts = address.split(',')
  if (parts.length > 1) {
    return parts[parts.length - 1].trim()
  }

  return address.trim()
}

// Fonction pour calculer la distance entre deux points (formule de Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Producteurs filtrés
const filteredProducers = computed(() => {
  let filtered = [...producerStore.producerList] // Utilise le getter qui retourne un tableau

  // Filtre par nom
  if (filters.value.name) {
    const searchTerm = filters.value.name.toLowerCase()
    filtered = filtered.filter(
      producer =>
        producer.label?.toLowerCase().includes(searchTerm) ||
        producer.categorie?.toLowerCase().includes(searchTerm) ||
        producer.description?.toLowerCase().includes(searchTerm)
    )
  }

  // Filtre par catégorie
  if (filters.value.category) {
    filtered = filtered.filter(
      producer => producer.categorie === filters.value.category
    )
  }

  // Filtre par ville
  if (filters.value.city) {
    filtered = filtered.filter(producer => {
      const city = extractCityFromAddress(producer.address)
      return city === filters.value.city
    })
  }

  // Filtre par proximité
  if (userLocation.value && filters.value.proximityRadius) {
    filtered = filtered.filter(producer => {
      const coordinate = mapStore.coordinates.find(
        coord => coord.id === producer.id
      )
      if (!coordinate) return false

      const distance = calculateDistance(
        userLocation.value.lat,
        userLocation.value.lng,
        coordinate.lat,
        coordinate.lng
      )
      return distance <= filters.value.proximityRadius
    })
  }

  return filtered
})

// Coordonnées filtrées pour la carte
const filteredCoordinates = computed(() => {
  const filteredIds = filteredProducers.value.map(p => p.id)
  return mapStore.coordinates.filter(coord => filteredIds.includes(coord.id))
})

// Computed pour inclure le rayon dans la localisation utilisateur
const userLocationWithRadius = computed(() => {
  if (!userLocation.value) return null

  return {
    ...userLocation.value,
    radius: filters.value.proximityRadius,
  }
})

// Fonction pour obtenir la géolocalisation
async function getUserLocation() {
  if (!navigator.geolocation) {
    alert("La géolocalisation n'est pas supportée par ce navigateur.")
    return
  }

  locationLoading.value = true

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      })
    })

    userLocation.value = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }
  } catch (error) {
    console.error('Erreur de géolocalisation:', error)
    alert(
      "Impossible d'obtenir votre position. Vérifiez vos paramètres de géolocalisation."
    )
  } finally {
    locationLoading.value = false
  }
}

// Fonction pour effacer les filtres
function clearFilters() {
  filters.value = {
    name: '',
    category: '',
    city: '',
    proximityRadius: 20,
  }
  userLocation.value = null
}

async function handleMarkerClick(coord) {
  try {
    // Utilise le getter synchrone ou l'action async selon le besoin
    producerData.value =
      producerStore.getProducerById(coord.id) ||
      (await producerStore.getProducerByIdAsync(coord.id))
    dialog.value = true
  } catch (e) {
    console.error(e)
  }
}

// Watcher pour mettre à jour le cercle de proximité quand le rayon change
watch(
  () => filters.value.proximityRadius,
  newRadius => {
    if (mapRef.value && userLocation.value) {
      mapRef.value.updateProximityRadius(newRadius)
    }
  }
)

// Watcher pour sauvegarder les filtres dans le localStorage (optionnel)
watch(
  filters,
  newFilters => {
    localStorage.setItem('producerFilters', JSON.stringify(newFilters))
  },
  { deep: true }
)

onMounted(async () => {
  // Restaurer les filtres sauvegardés
  const savedFilters = localStorage.getItem('producerFilters')
  if (savedFilters) {
    try {
      const parsed = JSON.parse(savedFilters)
      filters.value = { ...filters.value, ...parsed }
    } catch (e) {
      console.error('Erreur lors de la restauration des filtres:', e)
    }
  }

  // Charger les données de la carte et des producteurs
  if (!mapStore.loading) {
    await mapStore.fetchCoordinates()
    await producerStore.fetchProducers()
  }
})

const goToProducer = producer => {
  router.push(`/producteur/${producer.id}`)
}
</script>

<style lang="scss" scoped>
.producer-container {
  overflow-y: auto;
  max-height: 600px;
}

.filter-card {
  border: 1px solid #61c187;
}
</style>

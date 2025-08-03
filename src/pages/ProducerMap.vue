<template>
  <VRow>
    <!-- Contenu principal -->
    <VCol cols="5">
      <VRow class="my-6">
        <!-- Filtre par nom -->
        <VCol cols="12" md="6">
          <VTextField
            v-model="filters.name"
            label="Rechercher par nom"
            prepend-inner-icon="mdi-magnify"
            clearable
            variant="outlined"
            density="compact"
          />
        </VCol>

        <!-- Filtre par ville (com_name) -->
        <VCol cols="12" md="6">
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
            <VIcon icon="mdi-information" size="48" color="grey" />
            <p class="text-grey mt-2">
              Aucun producteur trouvé avec ces filtres
            </p>
          </VCol>
        </VRow>
      </VContainer>
    </VCol>

    <!-- Carte -->
    <VCol cols="7">
      <VCard class="filter-card" height="600">
        <VCardTitle>
          <VIcon icon="mdi-map" class="mr-2" />
          Carte des producteurs
        </VCardTitle>
        <VCardText>
          <Map
            ref="mapRef"
            :coordinates="filteredCoordinates"
            :user-location="userLocationWithRadius"
            @marker-click="handleMarkerClick"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- Dialog détail producteur -->
  <VDialog v-model="dialog" max-width="500">
    <VCard v-if="producerData">
      <VCardTitle>{{ producerData.label }}</VCardTitle>
      <VCardText>
        <p>
          <strong>Ville:</strong> {{ producerData.com_name || 'Non spécifiée' }}
        </p>
        <p>
          <strong>Adresse:</strong>
          {{ producerData.adresse || 'Non spécifiée' }}
        </p>
        <p>
          <strong>Description:</strong>
          {{ producerData.description || 'Aucune description disponible' }}
        </p>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <TertiaryButton @click="dialog = false">Fermer</TertiaryButton>
        <PrimaryButton @click="goToProducer(producerData)">
          Voir le profil
        </PrimaryButton>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProducerStore } from '@/store/producer'
import { useMapStore } from '@/store/map'
import ProducerCard from '@/components/ProducerCard.vue'
import Map from '@/components/Map.vue'

const router = useRouter()
const producerStore = useProducerStore()
const mapStore = useMapStore()

const dialog = ref(false)
const producerData = ref(null)
const locationLoading = ref(false)
const userLocation = ref(null)
const mapRef = ref(null)

// Filtres : plus de category, on utilise com_name pour la ville
const filters = reactive({
  name: '',
  city: '',
  proximityRadius: 20,
})

// Distance haversine
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Producteurs filtrés
const filteredProducers = computed(() => {
  let result = producerStore.producerList

  if (filters.name) {
    result = producerStore.searchProducers(filters.name)
  }
  if (filters.city) {
    result = result.filter(p => p.com_name === filters.city)
  }
  if (userLocation.value) {
    result = result.filter(p => {
      const coord = mapStore.coordinates.find(c => c.id === p.id)
      if (!coord) return false
      return (
        calculateDistance(
          userLocation.value.lat,
          userLocation.value.lng,
          coord.lat,
          coord.lng
        ) <= filters.proximityRadius
      )
    })
  }
  return result
})

// Coordonnées pour la carte
const filteredCoordinates = computed(() => {
  const ids = filteredProducers.value.map(p => p.id)
  return mapStore.coordinates.filter(c => ids.includes(c.id))
})

const userLocationWithRadius = computed(() => {
  if (!userLocation.value) return null
  return { ...userLocation.value, radius: filters.proximityRadius }
})

// Géolocalisation
async function getUserLocation() {
  if (!navigator.geolocation) {
    alert("La géolocalisation n'est pas supportée par ce navigateur.")
    return
  }
  locationLoading.value = true
  try {
    const pos = await new Promise((res, rej) =>
      navigator.geolocation.getCurrentPosition(res, rej, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      })
    )
    userLocation.value = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    }
  } catch {
    alert("Impossible d'obtenir votre position.")
  } finally {
    locationLoading.value = false
  }
}

// Réinitialiser filtres
function clearFilters() {
  filters.name = ''
  filters.city = ''
  filters.proximityRadius = 20
  userLocation.value = null
}

// Ouverture du dialog au clic sur un marqueur
async function handleMarkerClick(coord) {
  producerData.value = producerStore.getProducerById(coord.id)
  if (!producerData.value) {
    producerData.value = await producerStore.getProducerByIdAsync(coord.id)
  }
  dialog.value = true
}

// Navigation vers la page détail
function goToProducer(p) {
  router.push(`/producteur/${p.id}`)
}

// Sauvegarde des filtres
watch(
  filters,
  f => localStorage.setItem('producerFilters', JSON.stringify(f)),
  { deep: true }
)

onMounted(async () => {
  // restauration des filtres
  const saved = localStorage.getItem('producerFilters')
  if (saved) {
    try {
      Object.assign(filters, JSON.parse(saved))
    } catch (e) {
      console.error('Erreur lors de la restauration des filtres:', e)
    }
  }
  // appels store
  await Promise.all([
    producerStore.fetchProducers(),
    mapStore.fetchCoordinates(),
  ])
})
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

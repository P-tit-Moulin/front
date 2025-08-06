<template>
  <VRow>
    <VCol cols="5">
      <VCard class="filter-card">
        <VContainer fluid>
          <VRow>
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
            <VCol cols="6">
              <VSlider
                v-model="filters.proximityRadius"
                :min="1"
                :max="100"
                :step="1"
                color="#61c187"
                label="Rayon (km)"
                thumb-label
              />
            </VCol>
            <VCol cols="auto" class="pl-2">
              <SecondaryButton
                :color="filters.userLocation ? '#61C187' : 'primary'"
                :disabled="locationLoading"
                :loading="locationLoading"
                @click="getUserLocation"
              >
                <VIcon>{{
                  filters.userLocation ? 'mdi-check' : 'mdi-crosshairs-gps'
                }}</VIcon>
                {{ filters.userLocation ? 'Localisé' : 'Me localiser' }}
              </SecondaryButton>
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
        </VContainer>

        <VContainer class="producer-container">
          <VRow v-if="producerStore.loading">
            <VCol cols="12" class="text-center">
              <VProgressCircular indeterminate color="primary" />
              <p class="mt-2">Chargement des producteurs...</p>
            </VCol>
          </VRow>

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

          <VRow v-if="!producerStore.loading && filteredProducers.length === 0">
            <VCol cols="12" class="text-center">
              <VIcon icon="mdi-information" size="48" color="grey" />
              <p class="text-grey mt-2">
                Aucun producteur trouvé avec ces filtres
              </p>
            </VCol>
          </VRow>
        </VContainer>
      </VCard>
    </VCol>

    <VCol cols="7">
      <Map
        ref="mapRef"
        :coordinates="filteredCoordinates"
        :user-location="userLocationWithRadius"
        @marker-click="handleMarkerClick"
      />
    </VCol>
  </VRow>

  <VDialog v-model="dialog" max-width="500">
    <ProducerCard
      :item="producerData"
      close
      @close="dialog = !dialog"
      @go-to-producer="goToProducer(producer)"
    />
  </VDialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import ProducerCard from '../components/ProducerCard.vue'
import Map from '../components/Map.vue'
import { useProducerStore } from '@/store/producer'
import { useRouter } from 'vue-router'

const producerStore = useProducerStore()
const router = useRouter()

const filters = ref({
  name: '',
  city: '',
  userLocation: null,
  proximityRadius: 10,
})

const filteredProducers = computed(() => producerStore.producerList)

const filteredCoordinates = computed(() => producerStore.producerCoordinates)

const userLocationWithRadius = computed(() => {
  if (!filters.value.userLocation) return null
  return {
    ...filters.value.userLocation,
    radius: filters.value.proximityRadius,
  }
})

const locationLoading = ref(false)
const getUserLocation = async () => {
  locationLoading.value = true
  try {
    const position = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    )
    filters.value.userLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }
  } catch (err) {
    console.error('Erreur localisation:', err)
  } finally {
    locationLoading.value = false
  }
}

const clearFilters = () => {
  filters.value = {
    name: '',
    city: '',
    userLocation: null,
    proximityRadius: 10,
  }
}

const dialog = ref(false)
const producerData = ref(null)
const goToProducer = producer => {
  if (producer?.id) {
    router.push({ name: 'ProducerDetail', params: { id: producer.id } })
  } else {
    console.warn('Impossible de naviguer : ID du producteur manquant')
  }
}

const handleMarkerClick = async coord => {
  let producer = producerStore.producerList.find(p => p.id === coord.id)

  if (!producer) {
    producer = await producerStore.getProducerByIdAsync(coord.id)
  }

  if (producer) {
    producerData.value = producer
    dialog.value = true
  }
}

watch(
  filters,
  () => {
    producerStore.fetchProducers(filters.value)
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  producerStore.fetchAllCities()
})
</script>

<style lang="scss" scoped>
.producer-container {
  overflow-y: auto;
  max-height: 500px;
}
.filter-card {
  border: none !important;
  height: calc(100vh - 180px);
}
</style>

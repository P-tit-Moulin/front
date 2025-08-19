<template>
  <VRow class="ma-0">
    <VCol cols="12" md="5" class="pa-0">
      <VCard class="filter-card pb-3">
        <VContainer fluid>
          <VRow>
            <VCol cols="6" class="pr-2 pb-2 pr-md-3 pb-md-3">
              <VTextField
                v-model="filters.name"
                label="Rechercher par nom"
                prepend-inner-icon="mdi-magnify"
              />
            </VCol>
            <VCol cols="6" class="pl-2 pb-2 pl-md-3 pb-md-3">
              <VSelect
                v-model="filters.city"
                :items="producerStore.allCities"
                label="Filtrer par ville"
                prepend-inner-icon="mdi-map-marker"
              />
            </VCol>
            <VCol cols="12" md="6" class="py-2 py-md-3">
              <VSlider
                v-model="filters.proximityRadius"
                :min="1"
                :max="100"
                :step="1"
                color="#61c187"
                label="Rayon (km)"
                hide-details
                thumb-label
              />
            </VCol>
            <VCol cols="6" md="auto" class="pl-2 pt-2 pt-md-3">
              <SecondaryButton
                :color="filters.userLocation ? '#61C187' : 'primary'"
                :disabled="locationLoading"
                :loading="locationLoading"
                data-test="btn-geolocate"
                @click="getUserLocation"
              >
                <VIcon>{{
                  filters.userLocation ? 'mdi-check' : 'mdi-crosshairs-gps'
                }}</VIcon>
                {{ filters.userLocation ? 'Localisé' : 'Me localiser' }}
              </SecondaryButton>
            </VCol>
            <VCol cols="6" md="auto" class="text-right pt-2 pt-md-3">
              <SecondaryButton
                data-test="clear-filters"
                class="mr-2"
                @click="clearFilters"
              >
                Effacer les filtres
              </SecondaryButton>
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

          <VRow
            v-if="!producerStore.loading && filteredProducers?.length === 0"
          >
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

    <VCol cols="12" md="7" class="d-flex justify-center px-0 py-2 py-md-0">
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
import { defineAsyncComponent } from 'vue'
import { useProducerStore } from '@/store/producer'
import { useRouter } from 'vue-router'
const ProducerCard = defineAsyncComponent(
  () => import('@/components/ProducerCard.vue')
)
const Map = defineAsyncComponent(() => import('@/components/Map.vue'))

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
  max-height: 625px;
}

@media (max-width: 600px) {
  .producer-container {
    height: 300px;
  }
}

@media (min-width: 960px) and (max-width: 1280px) {
  .producer-container {
    height: 425px;
  }
}

.filter-card {
  border: none !important;
  box-shadow: none;
}
</style>

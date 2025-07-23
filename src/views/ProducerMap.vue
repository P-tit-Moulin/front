<template>
  <VRow>
    <VCol cols="5">
      <VContainer class="producer-container">
        <VRow>
          <VCol v-for="producer in producerStore.producers" cols="6">
            <ProducerCard
              :name="producer?.label"
              :business="producer?.categorie"
              :address="producer?.address"
            />
          </VCol>
        </VRow>
      </VContainer>
    </VCol>
    <VCol cols="7">
      <Map :coordinates="getCoordinates" @marker-click="handleMarkerClick" />
    </VCol>
    <VDialog v-model="dialog" max-width="560">
      <ProducerCard
        :name="producerData?.label"
        :business="producerData?.categorie"
        :address="producerData?.address"
        :description="producerData?.description"
        close
        @close="dialog = !dialog"
      />
    </VDialog>
  </VRow>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Map from './components/Map.vue'
import ProducerCard from './components/ProducerCard.vue'
import { useProducerStore } from '../store/producer'
import { useMapStore } from '../store/map'

const dialog = ref(false)
const producerData = ref(null)
const producerStore = useProducerStore()
const mapStore = useMapStore()

const getCoordinates = computed(() => mapStore.coordinates)

async function handleMarkerClick(coord) {
  try {
    producerData.value = await producerStore.getProducerById(coord.id)
    dialog.value = true
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  if (!mapStore.loading) {
    await mapStore.fetchCoordinates()
    await producerStore.fetchProducers()
  }
})
</script>

<style lang="scss" scoped>
.producer-container {
  overflow-y: auto;
  max-height: 600px;
}
</style>

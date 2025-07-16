<template>
  <VRow>
    <VCol cols="5">
      <VContainer class="producer-container">
        <VRow>
          <VCol v-for="producer in producerList" :key="producer.label" cols="6">
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
      <Map :coordinates="coordinates" @marker-click="handleMarkerClick" />
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
import { ref, onMounted } from 'vue'
import Map from './components/Map.vue'
import axios from 'axios'
import ProducerCard from './components/ProducerCard.vue'

const coordinates = ref([])
const dialog = ref(false)
const producerData = ref(null)
const producerList = ref([])

const handleMarkerClick = (coord) => {
  producerData.value = coord
  dialog.value = true
}

onMounted(async () => {
  const response = await axios.get(
    'https://data.opendatasoft.com/api/records/1.0/search/?dataset=flux-toutes-plateformes%40producteursagri&rows=100'
  )

  const records = response.data.records || []

  coordinates.value = records
    .filter(
      (record) =>
        Array.isArray(record.fields?.geolocalisation) &&
        record.fields.geolocalisation.length === 2
    )

  const mapRecordFields = (record) => {
    const f = record.fields
    return {
      label: f.nom ?? f.raison_sociale ?? 'Producteur inconnu',
      address: f.com_name ?? '',
      categorie: f.categorie ?? '',
    }
  }
    .map((record) => {
      const baseFields = mapRecordFields(record)
      return {
        lat: record.fields.geolocalisation[0],
        lng: record.fields.geolocalisation[1],
        ...baseFields,
        url: record.fields.url_sur_la_plateforme_partenaire ?? '',
        description: record.fields.description ?? '',
      }
    })

  producerList.value = records.map((record) => {
    const baseFields = mapRecordFields(record)
    return {
      ...baseFields,
    }
  })
})
</script>

<style lang="scss" scoped>
.producer-container {
  overflow-y: auto;
  max-height: 600px;
}
</style>

<template>
  <VCombobox
    v-model="entreprise"
    v-model:search="search"
    :items="items"
    :loading="loading"
    clearable
    item-title="nom"
    item-value="nom"
    :no-data-text="comboboxNoDataText"
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useProducerStore } from '@/store/producer'

const entreprise = defineModel({ type: String })

const producerStore = useProducerStore()
const search = ref('')
const items = ref([])
const loading = ref(false)
const comboboxload = ref(false)

const comboboxNoDataText = computed(() => {
  if (!search.value || search.value.length < 2) {
    return 'Tapez une recherche'
  }
  if (search.value && items.value.length === 0 && !comboboxload.value) {
    return 'Aucune entreprise trouvée'
  }
  return ''
})

watch(search, async val => {
  if (val && val.length >= 2) {
    loading.value = true
    await producerStore.fetchProducers({ name: val, limit: 10 })
    items.value = producerStore.producerList
    loading.value = false
  } else {
    items.value = []
  }
})
</script>

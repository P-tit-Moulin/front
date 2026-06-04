<template>
  <VRow class="ma-0 px-3 px-sm-0">
    <VCol
      v-for="(family, index) in productFamilies"
      :key="index"
      cols="12"
      sm="4"
      md="3"
      class="mt-4"
    >
      <ProductCard class="mx-auto" hover>
        <template #title>
          {{ family }}
        </template>
        <template #text>
          <div class="text-center">
            <VIcon
              :icon="getFamilyIcon(family)"
              size="80"
              :color="getFamilyColor(family)"
            ></VIcon>
          </div>
        </template>

        <template #actions>
          <PrimaryButton @click="showProducersByFamily(family)">
            Voir les producteurs
          </PrimaryButton>
        </template>
      </ProductCard>
    </VCol>
  </VRow>

  <VDialog v-model="dialog.show" max-width="600" scrollable>
    <VCard>
      <VCardTitle class="d-flex text-h5">
        Producteurs de {{ dialog.product?.name }}
        <VSpacer />
        <TertiaryButton @click="dialog.show = false">
          <VIcon size="24">mdi-close</VIcon>
        </TertiaryButton>
      </VCardTitle>

      <VCardText style="height: 400px">
        <VList v-if="dialog.producers.length > 0">
          <VListItem
            v-for="producer in dialog.producers"
            :key="producer._id"
            class="mb-2"
          >
            <template #prepend>
              <VAvatar color="#61c187">
                <VIcon icon="mdi-account"></VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>{{ producer.nom }}</VListItemTitle>
            <VListItemSubtitle>
              <div class="d-flex align-center">
                <VIcon icon="mdi-map-marker" size="16" class="mr-1" />
                {{ producer.com_name }}
              </div>
            </VListItemSubtitle>

            <template #append>
              <PrimaryButton @click="goToProducer(producer)">
                Voir la page
              </PrimaryButton>
            </template>
          </VListItem>
        </VList>

        <div v-else class="text-center mt-4">
          <VIcon icon="mdi-information" size="48" color="grey"></VIcon>
          <p class="text-grey mt-2">Aucun producteur trouvé pour ce produit</p>
        </div>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <TertiaryButton @click="dialog.show = false"> Fermer </TertiaryButton>
      </VCardActions>
    </VCard>
  </VDialog>

  <VSnackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    {{ snackbar.message }}
  </VSnackbar>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useProducerStore } from '@/store/producer'
import { useRouter } from 'vue-router'
import { getFamilyIcon, getFamilyColor } from '@/utils/familyUtils'
import { defineAsyncComponent } from 'vue'

const ProductCard = defineAsyncComponent(
  () => import('@/components/ProductCard.vue')
)

const router = useRouter()

const producerStore = useProducerStore()
const productFamilies = ref([])

const dialog = reactive({
  show: false,
  product: null,
  producers: [],
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success',
})

const showProducersByFamily = async product => {
  dialog.product = product
  await producerStore.fetchProducers({ family: product })
  dialog.producers = producerStore.producerList
  dialog.show = true
}

const goToProducer = producer => {
  router.push({ name: 'ProducerDetail', params: { id: producer._id } })
  dialog.show = false
}

onMounted(async () => {
  const data = await producerStore.fetchProductFamilies()
  productFamilies.value = data.familles_des_produits
})
</script>

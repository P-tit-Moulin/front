<template>
  <VRow class="ma-0">
    <VCol cols="12" class="px-0">
      <div class="home-banner">
        <div>
          <span class="white-title">Une envie de </span
          ><span class="green-title">légumes </span
          ><span class="white-title">, </span
          ><span class="green-title">fruits </span
          ><span class="white-title">ou de </span
          ><span class="green-title">produits locaux </span
          ><span class="white-title">. </span>
        </div>
        <div>
          <span class="white-title">C'est ici. </span>
        </div>
      </div>
    </VCol>
  </VRow>
  <VRow class="home-product-card ma-0">
    <VCol
      cols="12"
      class="d-flex align-center flex-wrap flex-md-nowrap justify-md-space-between mb-6"
    >
      <div>
        <span class="product-black-title"> Les </span>
        <span class="product-green-title">produits</span>
        <span class="product-black-title"> proposés. </span>
      </div>

      <PrimaryButton
        class="mt-2 mt-md-0"
        @click="$router.push('/product-list')"
      >
        Voir tous les produits
      </PrimaryButton>
    </VCol>
    <VCol
      v-for="(family, index) in productFamilies.slice(0, 4)"
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
      </ProductCard>
    </VCol>
  </VRow>
  <VRow>
    <VCol cols="12" class="home-map d-flex flex-column mb-6 w-100">
      <div class="d-flex flex-column py-6">
        <span class="map-title w-50"
          >Trouver le producteur directement sur la carte</span
        >
        <span class="map-subtitle mt-4"
          >Autour de vous des artisans attende de vous présentez leurs meilleurs
          produits</span
        >
      </div>

      <PrimaryButton
        class="map-button mt-6"
        @click="$router.push('/producer-map')"
        >Voir la carte !</PrimaryButton
      >
    </VCol>
  </VRow>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProducerStore } from '@/store/producer'
import { defineAsyncComponent } from 'vue'
import { getFamilyIcon, getFamilyColor } from '@/utils/familyUtils'
const ProductCard = defineAsyncComponent(
  () => import('@/components/ProductCard.vue')
)

const producerStore = useProducerStore()
const productFamilies = ref([])

onMounted(async () => {
  const data = await producerStore.fetchProductFamilies()
  productFamilies.value = data.familles_des_produits
})
</script>

<style lang="scss" scoped>
.home-banner {
  background-image: url('@/assets/img/p-tit_moulin_banner.svg');
  background-size: cover;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.white-title,
.green-title,
.product-black-title,
.product-green-title,
.map-title {
  font-weight: 600;
  line-height: 100%;
  letter-spacing: 0;
}

.white-title,
.green-title {
  font-size: 4.5rem;
}

.white-title {
  color: #ffffff;
}

.product-black-title,
.map-title,
.map-subtitle {
  color: #363636;
}

.green-title,
.product-green-title {
  color: #61c187;
}

.product-black-title,
.product-green-title,
.map-title {
  font-size: 3rem;
}

.home-banner,
.home-map,
.home-product-card {
  padding-inline: 24px;
}

.home-map {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 1), rgba(196, 196, 196, 0)),
    url('@/assets/img/map_banner.svg');
  background-size: cover;
}
.map-subtitle {
  line-height: 100%;
  letter-spacing: 0%;
  font-weight: 400;
  font-size: 1rem;
}

.map-button {
  width: fit-content;
}
</style>

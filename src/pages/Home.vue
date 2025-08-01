<template>
  <VRow>
    <VCol cols="12" class="px-0 mx-n1">
      <div class="home-banner w-100">
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
  <VRow class="home-product-card">
    <VCol cols="12" class="mb-12">
      <span class="product-black-title"> Les </span>
      <span class="product-green-title">produits</span>
      <span class="product-black-title"> proposés. </span>
    </VCol>
    <VCol cols="4" v-for="product in products" :key="product.id">
      <ProductCard :title="product.title" :image="product.image" />
    </VCol>
  </VRow>
  <VRow>
    <VCol cols="12" class="home-map d-flex flex-column">
      <div class="d-flex flex-column py-6">
        <span class="map-title w-50"
          >Trouver le producteur directement sur la carte</span
        >
        <span class="map-subtitle mt-4"
          >Autour de vous des artisans attende de vous présentez leurs meilleurs
          produits</span
        >
      </div>

      <PrimaryButton class="map-button mt-6">Voir la carte !</PrimaryButton>
    </VCol>
  </VRow>
  <VRow class="home-producer-card">
    <VCol cols="12" class="mb-12 mt-8">
      <span class="product-black-title"> Nos </span>
      <span class="product-green-title">artisans</span>
      <span class="product-black-title"> ont du talent. </span>
    </VCol>
    <VCol cols="3" v-for="producer in producers" :key="producer.id">
      <ProducerCard
        :name="producer.name"
        :business="producer.business"
        :address="producer.address"
        :description="producer.description"
      />
    </VCol>
    <VCol cols="12" class="d-flex justify-center my-8">
      <span class="producer-subtitle-grey">Découvrez l’ensemble de nos</span>
      <span class="producer-subtitle-green">&nbsp;<a>artisans</a>&nbsp; </span>
      <span class="producer-subtitle-grey">à votre service !</span>
    </VCol>
  </VRow>
</template>

<script setup>
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import ProducerCard from '@/components/ProducerCard.vue'

const products = ref([
  {
    id: 1,
    title: 'Pomme',
  },
  {
    id: 2,
    title: 'Carotte',
  },
  {
    id: 3,
    title: 'Tomate',
  },
  {
    id: 4,
    title: 'Banane',
  },
  {
    id: 5,
    title: 'Courgette',
  },
  {
    id: 6,
    title: 'Raisin',
  },
])

const producers = ref([
  {
    id: 1,
    name: 'Julie Moreau',
    business: 'Maraîchère bio',
    address: 'Nantes',
    description:
      'Julie cultive des légumes de saison en permaculture, dans le respect de la biodiversité locale.',
  },
  {
    id: 2,
    name: 'Marc Dubois',
    business: 'Apiculteur',
    address: 'Lyon',
    description:
      'Marc élève des abeilles dans les Monts du Lyonnais et produit un miel naturel et non transformé.',
  },
  {
    id: 3,
    name: 'Sophie Garnier',
    business: 'Productrice de fruits',
    address: 'Avignon',
    description:
      'Sophie cultive des vergers de pêchers, d’abricotiers et de cerisiers dans le Sud de la France.',
  },
  {
    id: 4,
    name: 'Thomas Lefèvre',
    business: 'Éleveur de chèvres',
    address: 'Limoges',
    description:
      'Thomas produit du fromage de chèvre fermier avec passion, dans une ferme familiale depuis trois générations.',
  },
])
</script>

<style lang="scss" scoped>
.home-banner {
  background-image: url('@/assets/img/p-tit_moulin_banner.svg');
  background-size: cover;
  background-position-y: center;
  height: 580px;
  padding-inline: 280px;
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
  color: $primary-white;
}

.product-black-title,
.map-title,
.map-subtitle {
  color: $primary-black;
}

.green-title,
.product-green-title {
  color: $primary-green;
}

.product-black-title,
.product-green-title,
.map-title {
  font-size: 3rem;
}

.home-product-card {
  margin-inline: 256px;
  margin-top: 96px;
  margin-bottom: 96px;
}

.home-map {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 1), rgba(196, 196, 196, 0)),
    url('@/assets/img/map_banner.png');
  background-size: cover;
  background-position-y: center;
  height: 580px;
  padding-inline: 280px;
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

.home-producer-card {
  background-image: url('@/assets/img/vegetable_bg.svg');
  background-color: rgba(97, 193, 135, 0.1);
  background-size: cover;
  background-position-y: center;
  padding-inline: 280px;
  margin-top: 112px;
  margin-bottom: 230px;
}

.producer-subtitle-grey,
.producer-subtitle-green {
  font-size: 0.875rem;
  letter-spacing: 0;
  line-height: 100%;
  font-weight: 400;
}

.producer-subtitle-grey {
  color: $primary-grey;
}

.producer-subtitle-green {
  color: $primary-green;
}
</style>

<template>
  <v-row>
    <v-col cols="12" class="px-0 mx-n1">
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
    </v-col>
  </v-row>
  <v-row class="home-product-card">
    <v-col cols="12" class="mb-12">
      <span class="product-black-title"> Les </span>
      <span class="product-green-title">produits</span>
      <span class="product-black-title"> proposés. </span>
    </v-col>
    <v-col cols="4" v-for="product in products" :key="product.id">
      <ProductCard :title="product.title" :image="product.image" />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue'
import ProductCard from './components/ProductCard.vue'

const products = ref([
  {
    id: 1,
    title: 'Pomme',
    image:
      'https://www.domaine-darmandieu.com/wp-content/uploads/2018/07/Domaine-darmandieu-variete-pomme-Braeburn.png',
  },
  {
    id: 2,
    title: 'Carotte',
    image:
      'https://www.fondation-louisbonduelle.org/wp-content/uploads/2016/10/carotte_222805396.png',
  },
  {
    id: 3,
    title: 'Tomate',
    image:
      'https://static.vecteezy.com/system/resources/thumbnails/041/491/392/small_2x/ai-generated-tomato-png.png',
  },
  {
    id: 4,
    title: 'Banane',
    image:
      'https://croissy-fruits.fr/cdn/shop/files/banane_detouree.webp?v=1745064249&width=1000',
  },
  {
    id: 5,
    title: 'Courgette',
    image:
      'https://www.fondation-louisbonduelle.org/wp-content/uploads/2016/09/courgette_225127714-e1472806852932.png',
  },
  {
    id: 6,
    title: 'Raisin',
    image:
      'https://croissy-fruits.fr/cdn/shop/files/RSPROUGE.webp?v=1745995332&width=1000',
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
.product-green-title {
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

.product-black-title {
  color: $primary-black;
}

.green-title,
.product-green-title {
  color: $primary-green;
}

.product-black-title,
.product-green-title {
  font-size: 3rem;
}

.home-product-card {
  margin-inline: 256px;
  margin-top: 96px;
  margin-bottom: 96px;
}
</style>

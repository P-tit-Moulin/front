<template>
  <VCard class="product-card">
    <VCardText class="d-flex pa-0 h-100">
      <VCol cols="7" class="card-title d-flex flex-column">
        <span class="product-card-title mb-1">{{ title }}</span>
        <span v-if="address" class="product-card-subtitle">
          <VIcon color="$primary-grey" size="8">mdi-map-marker</VIcon
          >{{ address }}</span
        >
      </VCol>
      <VCol cols="5" class="card-image d-flex align-center justify-center">
        <img width="150" :src="image" :alt="title" />
      </VCol>
    </VCardText>
  </VCard>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  image: {
    type: String,
  },
})
</script>

<style lang="scss" scoped>
.product-card {
  height: 137px;
}

.card-title {
  background-image: url('@/assets/img/vegetable_bg.svg');
  background-size: cover;
}

.card-image {
  background-color: $primary-green;
  border-top-left-radius: 30%;
  border-bottom-left-radius: 30%;
}

.product-card-title {
  color: $primary-black;
  font-weight: 600;
  line-height: 100%;
  letter-spacing: 0;
  font-size: 0.875rem;
}

.product-card-subtitle {
  color: $primary-grey;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  font-size: 0.625rem;
}
</style>

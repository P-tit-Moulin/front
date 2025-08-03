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
    default: '',
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

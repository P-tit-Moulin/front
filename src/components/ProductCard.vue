<template>
  <VCard class="product-card fill-height">
    <VCardTitle class="product-card-title">
      <slot name="title"></slot>
    </VCardTitle>
    <VCardText class="product-text pa-4">
      <slot name="text"></slot>
    </VCardText>
    <VCardActions class="justify-end">
      <slot name="actions"></slot>
    </VCardActions>
  </VCard>
</template>

<script setup></script>

<style lang="scss" scoped>
.product-card {
  background-image: url('@/assets/img/vegetable_bg.svg');
  background-size: cover;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateY(-4px);
  }
}

.product-card-title {
  color: $primary-black;
  font-weight: 600;
  line-height: 100%;
  letter-spacing: 0;
  font-size: 0.875rem;
}
</style>

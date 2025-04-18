<template>
  <VCard>
    <VCardText>
      <VRow>
        <VCol cols="8">
          <span class="product-card-title mb-1">{{ title }}</span>
          <span v-if="address" class="product-card-subtitle">
            {{ address }}</span
          >
        </VCol>
        <VCol cols="4">
          <VSheet color="$primary-green" width="100">
            <VImage width="50" :src="image"> </VImage>
          </VSheet>
        </VCol>
      </VRow>
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

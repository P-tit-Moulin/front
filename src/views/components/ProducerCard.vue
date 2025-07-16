<template>
  <VCard class="producer-card">
    <VCardTitle v-if="close" class="d-flex justify-end pb-2">
      <TertiaryButton icon="mdi-close" @click="$emit('close')" />
    </VCardTitle>
    <VCardSubtitle v-if="address" class="px-4 pt-4 pb-0">
      <span class="producer-card-subtitle">
        <VIcon color="$primary-grey" size="8">mdi-map-marker</VIcon
        >{{ address }}</span
      >
    </VCardSubtitle>
    <VCardText class="d-flex flex-column align-center pa-4 h-100">
      <VCol cols="12" class="d-flex justify-center">
        <VAvatar size="91">
          <img
            :alt="name"
            src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
          />
        </VAvatar>
      </VCol>
      <VCol cols="12" class="d-flex flex-column align-center">
        <span class="producer-name">{{ name }}</span>
        <span class="producer-business mt-1">{{ business }}</span>
      </VCol>
      <VCol cols="12" class="producer-description">
        {{ description }}
      </VCol>
    </VCardText>
    <VCardActions class="d-flex justify-center pb-4">
      <PrimaryButton>Voir mes produits</PrimaryButton>
    </VCardActions>
  </VCard>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  business: {
    type: String,
  },
  address: {
    type: String,
  },
  description: {
    type: String,
  },
  profilPicture: {
    type: String,
  },
  close: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.producer-card {
  box-shadow: rgba(55, 55, 55, 0.2);
  border-radius: 16px;
}

.producer-card-subtitle {
  color: $primary-grey;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0;
  font-size: 0.625rem;
}

.producer-name,
.producer-description {
  color: $primary-black;
  line-height: 100%;
  letter-spacing: 0;
  font-size: 0.875rem;
}

.producer-name {
  font-weight: 600;
}

.producer-business {
  font-weight: 400;
  color: $primary-black;
  letter-spacing: 0;
  line-height: 100%;
  font-size: 0.75rem;
}

.producer-description {
  font-weight: 400;
}
</style>

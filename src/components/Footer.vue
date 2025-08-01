<template>
  <VFooter class="footer-bg">
    <VRow class="d-flex">
      <VCol cols="5" class="d-flex flex-column justify-center align-center">
        <img src="@/assets/img/logo.svg" width="177px" height="84px" />
        <span class="img-subtitle"
          >Copyright 2022 - P’tit Moulin - Design par la X Force</span
        >
      </VCol>
      <VCol cols="3">
        <VList density="compact" class="footer-list">
          <VListSubheader class="list-subtitle"> Plan du site </VListSubheader>

          <VListItem
            v-for="(item, i) in itemsSite"
            :key="i"
            :value="item.value"
            :title="item.title"
            color="$primary-black"
            class="list-item"
          />
        </VList>
      </VCol>
      <VCol cols="4">
        <VList density="compact" class="footer-list">
          <VListSubheader class="list-subtitle">Information</VListSubheader>

          <VListItem
            v-for="(item, i) in itemsInfos"
            :key="i"
            :value="item.value"
            :title="item.title"
            color="$primary-black"
            class="list-item"
          />
        </VList>
      </VCol>
    </VRow>
  </VFooter>
</template>

<script setup>
const itemsSite = [
  {
    title: 'Accueil',
    value: 1,
  },
  {
    title: 'Les produits',
    value: 2,
  },
  {
    title: 'Les producteurs',
    value: 2,
  },
  {
    title: 'Les évènements',
    value: 3,
  },
]

const itemsInfos = [
  {
    title: 'Nous contacter',
    value: 1,
  },
  {
    title: 'Mention légales',
    value: 2,
  },
  {
    title: 'Politique de confidentialité',
    value: 2,
  },
  {
    title: 'CGV',
    value: 3,
  },
]
</script>

<style lang="scss" scoped>
.footer-bg {
  background-image: url('@/assets/img/vegetable_bg.svg');
  position: fixed;
  bottom: 0;
  width: 100%;
  max-height: 214px;
}

.img-subtitle {
  font-weight: 400;
  color: $primary-black;
  line-height: 100%;
  letter-spacing: 0;
  font-size: 0.625rem;
  margin-top: 50px;
}

.list-subtitle {
  color: $primary-green;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 100%;
  font-size: 0.875rem;
}

.list-item {
  font-weight: 500;
  letter-spacing: 0;
  line-height: 187%;
  font-size: 0.875rem;
}

.footer-list {
  background-color: transparent;
}
</style>

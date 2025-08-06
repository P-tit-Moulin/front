<template>
  <VFooter class="footer-bg">
    <VRow class="d-flex">
      <VCol cols="5" class="d-flex flex-column justify-end align-end">
        <img
          src="@/assets/img/logo.svg"
          alt="Logo P'tit Moulin"
          width="100px"
          height="84px"
        />
        <span class="img-subtitle"
          >Copyright 2022 - P’tit Moulin - Design par la X Force</span
        >
      </VCol>
      <VCol cols="7" class="d-flex justify-center align-center">
        <span
          v-for="(item, i) in itemsInfos"
          :key="i"
          :value="item.value"
          color="$primary-black"
          class="list-item"
          >{{ item.title }}</span
        >
      </VCol>
    </VRow>
  </VFooter>
</template>

<script setup>
const itemsInfos = [
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
  max-height: 100px;
  height: 100px;
}

.img-subtitle {
  font-weight: 400;
  color: $primary-black;
  line-height: 100%;
  letter-spacing: 0;
  font-size: 0.625rem;
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
  margin-inline: 16px;
}

.footer-list {
  background-color: transparent;
}
</style>

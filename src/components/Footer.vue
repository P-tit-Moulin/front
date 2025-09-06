<template>
  <VFooter class="footer-bg">
    <div class="d-flex flex-column align-center">
      <img
        src="@/assets/img/logo.svg"
        alt="Logo P'tit Moulin"
        width="60px"
        height="50px"
      />
      <span class="img-subtitle"
        >Copyright 2022 - P’tit Moulin - Design par la X Force</span
      >
    </div>

    <RouterLink
      v-for="(item, i) in itemsInfos"
      :key="i"
      :to="item.to"
      color="#363636"
      class="list-item"
      >{{ item.title }}</RouterLink
    >
  </VFooter>
</template>

<script setup>
const itemsInfos = [
  {
    title: 'Mention légales',
    to: '/conditions-generales',
    value: 1,
  },
  {
    title: 'Nous contacter',
    to: '/contact',
    value: 2,
  },
]
</script>

<style lang="scss" scoped>
.footer-bg {
  background-image: url('@/assets/img/vegetable_bg.svg');
  max-height: 60px;
  height: 60px;
  padding: 0 12px;
  justify-content: space-between;
}

.img-subtitle {
  font-weight: 400;
  color: #363636;
  font-size: 0.625rem;
}

.list-subtitle {
  color: #61c187;
  font-weight: 600;
}

.img-subtitle,
.list-subtitle,
.list-item {
  letter-spacing: 0;
  line-height: 100%;
}

.list-subtitle,
.list-item {
  font-size: 0.875rem;
}

.list-item {
  font-weight: 500;
  margin-inline: 16px;
}

.footer-list {
  background-color: transparent;
}
</style>

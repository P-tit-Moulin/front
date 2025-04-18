<template>
  <div class="footer-bg">
    <Row class="d-flex h-100">
      <VCol cols="5" class="d-flex flex-column justify-center align-end">
        <img src="@/assets/img/logo.svg" width="177px" height="84px" />
        <span class="img-subtitle"
          >Copyright 2022 - P’tit Moulin - Design par la X Force</span
        >
      </VCol>
      <VCol cols="2" class="d-flex flex-column align-center">
        <span>hello</span>
        <VList :items="items" class="w-100"> </VList>
      </VCol>
      <VCol cols="5">
        <span>coco</span>
      </VCol>
    </Row>
  </div>
</template>

<script setup>
const items = [
  {
    name: 'Item #1',
    id: 1,
  },
  {
    name: 'Item #2',
    id: 2,
  },
  {
    name: 'Item #3',
    id: 3,
  },
]
</script>

<style lang="scss" scoped>
.footer-bg {
  background-image: url('@/assets/img/vegetable_bg.svg');
  background-color: rgba(97, 193, 135, 0.1);
  margin-inline: -16px;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 214px;
}

.img-subtitle {
  font-weight: 400;
  color: $primary-black;
  line-height: 100%;
  letter-spacing: -4%;
  font-size: 0.625rem;
  margin-top: 50px;
}
</style>

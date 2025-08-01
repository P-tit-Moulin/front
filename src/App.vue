<template>
  <VApp class="app-container">
    <VContainer fluid>
      <NavBar />
      <router-view />
    </VContainer>
    <Footer />
  </VApp>
</template>

<script setup>
import Footer from '@/components/Footer.vue'
import NavBar from '@/components/NavBar.vue'
</script>

<style lang="scss" scoped>
.app-container {
  height: 100vh !important;
}
</style>

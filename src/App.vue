<template>
  <VApp>
    <VContainer fluid class="h-100 w-100 pa-0">
      <NavBar />
      <router-view />
    </VContainer>
    <Footer />
  </VApp>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const Footer = defineAsyncComponent(() => import('@/components/Footer.vue'))
const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'))
</script>

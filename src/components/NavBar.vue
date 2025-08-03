<template>
  <VTabs
    v-model="tab"
    align-tabs="center"
    height="80px"
    hide-slider
    active-color="#61C187"
    fixed
    class="navbar"
  >
    <VTab><img src="@/assets/img/logo.svg" alt="Logo P'tit Moulin" /></VTab>
    <v-spacer />
    <VTab :value="1" to="/" class="navbar-tab">Accueil</VTab>
    <VTab :value="2" to="/product-list" class="navbar-tab">Produits</VTab>
    <VTab :value="3" to="/producer-map" class="navbar-tab">Producteurs</VTab>
    <v-spacer />
    <VTab :value="4" class="navbar-icon-tab"><VIcon>mdi-account</VIcon></VTab>
  </VTabs>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref(1)
</script>

<style lang="scss" scoped>
.navbar {
  margin-inline: -16px;
  margin-top: -16px;
  box-shadow: 0px 1px 20px 0px #0000001a;
}

.navbar-tab {
  color: $primary-black;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 100%;
  font-size: 0.875rem;
  &:hover {
    color: $primary-green;
  }
}
</style>

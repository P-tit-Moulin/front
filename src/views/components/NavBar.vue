<template>
  <v-tabs
    v-model="tab"
    align-tabs="center"
    height="95px"
    hide-slider
    active-color="#61C187"
    fixed
    class="navbar"
  >
    <v-tab><img src="@/assets/img/logo.svg" /></v-tab>
    <v-spacer />
    <v-tab :value="1" to="/" class="navbar-tab">Accueil</v-tab>
    <v-tab :value="2" to="/" class="navbar-tab">Produits</v-tab>
    <v-tab :value="3" to="/" class="navbar-tab">Producteurs</v-tab>
    <v-spacer />
    <v-tab :value="4" class="navbar-icon-tab"
      ><v-icon>mdi-account</v-icon></v-tab
    >
  </v-tabs>
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

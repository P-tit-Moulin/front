<template>
  <VRow class="ma-0">
    <VCol cols="12" class="pa-0">
      <VTabs
        v-model="tab"
        align-tabs="center"
        :height="mdAndUp ? '80px' : 'auto'"
        :width="mdAndUp ? '100%' : 'auto'"
        hide-slider
        active-color="#61C187"
        fixed
        class="navbar"
      >
        <VTab :value="1" to="/" class="py-2">
          <img
            src="@/assets/img/logo.svg"
            height="100%"
            width="100%"
            alt="Logo P'tit Moulin"
          />
        </VTab>
        <v-spacer class="d-none d-sm-flex" />
        <VTab :value="2" to="/" class="navbar-tab">Accueil</VTab>
        <VTab :value="3" to="/product-list" class="navbar-tab">Produits</VTab>
        <VTab :value="4" to="/producer-map" class="navbar-tab"
          >Producteurs</VTab
        >
        <VSpacer class="d-none d-sm-flex" />
      </VTabs>
    </VCol>
  </VRow>
</template>

<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()

const tab = ref(1)
</script>

<style lang="scss" scoped>
.navbar {
  box-shadow: 0px 1px 20px 0px #0000001a;
  .v-tab {
    padding-inline: 8px;
    margin-inline-start: 0px;
  }
}

.navbar-tab {
  color: #363636;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 100%;
  font-size: 0.875rem;
  &:hover {
    color: #61c187;
  }
}
</style>

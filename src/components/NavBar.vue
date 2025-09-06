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
        <VTab
          v-if="userStore.isLoggedIn"
          :value="5"
          to="/profil"
          class="navbar-tab"
        >
          Profil
        </VTab>
        <VSpacer class="d-none d-sm-flex" />
        <VTab
          v-if="!userStore.isLoggedIn"
          :value="6"
          to="/login"
          class="navbar-tab"
        >
          Connexion
        </VTab>
        <VTab v-else :value="7" class="navbar-tab" @click="handleLogout">
          Déconnexion
        </VTab>
      </VTabs>
    </VCol>
  </VRow>
</template>

<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const { mdAndUp } = useDisplay()

const tab = ref(1)
const userStore = useUserStore()
const router = useRouter()

async function handleLogout() {
  try {
    await userStore.logout()
    router.push('/')
  } catch (err) {
    console.error('Erreur lors de la déconnexion:', err)
  }
}
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

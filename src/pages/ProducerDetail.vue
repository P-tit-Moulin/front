<template>
  <VRow v-if="loading" class="justify-center my-12">
    <VCol cols="auto">
      <VProgressCircular indeterminate color="primary" size="64" />
      <p class="text-center mt-4">
        Chargement des informations du producteur...
      </p>
    </VCol>
  </VRow>

  <VRow
    v-else-if="producer"
    class="producer-detail-page"
    style="margin-bottom: 100px"
  >
    <VCol cols="12" class="producer-header">
      <div class="d-flex align-center mb-4">
        <VIcon icon="mdi-store" size="48" color="#61c187" class="mr-4" />
        <div>
          <h1 class="producer-name">{{ producer.nom }}</h1>
        </div>
      </div>
    </VCol>

    <VCol cols="12" md="4" class="d-flex align-center justify-center w-100">
      <VCard class="mb-6">
        <VCardTitle class="d-flex align-center">
          <VIcon icon="mdi-map-marker" color="#61c187" class="mr-2" />
          Localisation
        </VCardTitle>
        <VCardText>
          <div v-if="producer.adresse" class="d-flex align-center">
            <span class="producer-address"
              >{{ producer.adresse }}, {{ producer.com_name }},
              {{ producer.code_postal }}</span
            >
          </div>
          <p v-else class="text-grey text-center py-2">
            <VIcon icon="mdi-map-marker-off" class="mr-2" />
            Adresse non renseignée
          </p>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="8" style="margin-bottom: 100px">
      <VCard class="mb-6">
        <VCardTitle class="d-flex align-center">
          <VIcon icon="mdi-text-box" color="#61c187" class="mr-2" />
          Description
        </VCardTitle>
        <VCardText>
          <p v-if="producer.description" class="producer-description">
            {{ producer.description }}
          </p>
          <p v-else class="text-grey text-center py-4">
            <VIcon icon="mdi-information-outline" class="mr-2" />
            Aucune description disponible pour ce producteur.
          </p>
        </VCardText>
      </VCard>

      <VCard class="mb-8">
        <VCardTitle class="d-flex align-center">
          <VIcon icon="mdi-package" color="#61c187" class="mr-2" />
          Produits proposés
        </VCardTitle>
        <VCardText>
          <div
            v-if="
              producer.familles_des_produits &&
              producer.familles_des_produits.length > 0
            "
            class="mb-4"
          >
            <h4 class="mb-3">
              <VIcon icon="mdi-tag-multiple" class="mr-1" />
              Catégories principales
            </h4>
            <div class="d-flex flex-wrap gap-2">
              <VChip
                v-for="famille in parsedFamillesProduits"
                :key="famille"
                :color="getFamilyColor(famille)"
                variant="outlined"
                size="small"
              >
                <VIcon start :icon="getFamilyIcon(famille)" />
                {{ famille }}
              </VChip>
            </div>
          </div>

          <div
            v-if="
              producer.familles_des_produits_restreintes &&
              producer.familles_des_produits_restreintes.length > 0
            "
          >
            <h4 class="mb-3">
              <VIcon icon="mdi-tag" class="mr-1" />
              Produits spécifiques
            </h4>
            <div class="d-flex flex-wrap gap-2">
              <VChip
                v-for="produit in parsedFamillesRestreintes"
                :key="produit"
                color="primary"
                variant="tonal"
                size="small"
              >
                {{ produit }}
              </VChip>
            </div>
          </div>

          <div v-if="!hasProducts" class="text-center text-grey py-8">
            <VIcon icon="mdi-package-variant-closed" size="48" class="mb-2" />
            <p>Aucune information sur les produits disponible</p>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <VRow v-else class="justify-center my-12">
    <VCol cols="auto" class="text-center">
      <VIcon icon="mdi-alert-circle" size="64" color="error" class="mb-4" />
      <h2>Producteur introuvable</h2>
      <p class="text-grey mb-4">
        Le producteur demandé n'existe pas ou n'a pas encore été chargé.
      </p>
      <div class="d-flex gap-2 justify-center">
        <PrimaryButton class="mr-2" @click="loadProducers">
          Charger les producteurs
        </PrimaryButton>
        <SecondaryButton @click="$router.push('/producer-map')">
          Voir tous les producteurs
        </SecondaryButton>
      </div>
    </VCol>
  </VRow>

  <VSnackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    {{ snackbar.message }}
  </VSnackbar>
</template>

<script setup>
import { reactive, onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/config/api.js'
import { getFamilyIcon, getFamilyColor } from '@/utils/familyUtils'

const route = useRoute()
const loading = ref(false)
const producer = ref({})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success',
})

const parseFamilies = familyData => {
  if (Array.isArray(familyData)) {
    return familyData
  }

  if (typeof familyData === 'string') {
    return familyData
      .split(/[,&]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map(item => {
        return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
      })
  }

  return []
}

const parsedFamillesProduits = computed(() => {
  if (!producer.value) return []
  return parseFamilies(producer.value.familles_des_produits)
})

const parsedFamillesRestreintes = computed(() => {
  if (!producer.value) return []
  return parseFamilies(producer.value.familles_des_produits_restreintes)
})

const hasProducts = computed(() => {
  if (!producer.value) return false
  return (
    (producer.value.familles_des_produits &&
      producer.value.familles_des_produits.length > 0) ||
    (producer.value.familles_des_produits_restreintes &&
      producer.value.familles_des_produits_restreintes.length > 0)
  )
})

onMounted(async () => {
  try {
    const id = route.params.id
    const res = await api.get(`/producers/${id}`)
    producer.value = res.data?.data || null
  } catch (e) {
    console.error('Erreur chargement producteur', e)
  }
})
</script>

<style lang="scss" scoped>
.producer-detail-page {
  padding: 24px;
}

.producer-header {
  background-image:
    url('@/assets/img/vegetable_bg.svg'),
    linear-gradient(135deg, #f5f5f5 0%, #e8f5e8 100%);
  background-size: cover;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.producer-name {
  font-size: 2.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.producer-business {
  font-size: 1.2rem;
  color: #61c187;
  font-weight: 500;
  margin: 0;
}

.producer-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
}

.producer-address {
  font-size: 1rem;
  font-weight: 500;
}

.product-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.product-card:hover {
  transform: translateY(-2px);
}

.sticky-card {
  position: sticky;
  top: 24px;
}

@media (max-width: 768px) {
  .producer-detail-page {
    padding: 16px;
  }

  .producer-name {
    font-size: 2rem;
  }

  .sticky-card {
    position: static;
  }
}
</style>

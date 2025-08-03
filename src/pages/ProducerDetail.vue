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
    <!-- En-tête avec nom et catégorie -->
    <VCol cols="12" class="producer-header">
      <div class="d-flex align-center mb-4">
        <VIcon
          :icon="getCategoryIcon(producer.category)"
          size="48"
          :color="getCategoryColor(producer.category)"
          class="mr-4"
        />
        <div>
          <h1 class="producer-name">{{ producer.label }}</h1>
          <p class="producer-business">{{ producer.category }}</p>
        </div>
      </div>

      <!-- Badge catégorie -->
      <VChip
        :color="getCategoryColor(producer.category)"
        size="large"
        class="mb-4"
      >
        <VIcon start :icon="getCategoryIcon(producer.category)" />
        {{ producer.category }}
      </VChip>
    </VCol>

    <VCol cols="12" md="8" style="margin-bottom: 100px">
      <VCard class="mb-6">
        <VCardTitle class="d-flex align-center">
          <VIcon icon="mdi-text-box" class="mr-2" />
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

      <!-- Adresse -->
      <VCard class="mb-6">
        <VCardTitle class="d-flex align-center">
          <VIcon icon="mdi-map-marker" class="mr-2" />
          Localisation
        </VCardTitle>
        <VCardText>
          <div v-if="producer.adresse" class="d-flex align-center">
            <VIcon icon="mdi-map-marker" color="primary" class="mr-2" />
            <span class="producer-address">{{ producer.adresse }}</span>
          </div>
          <p v-else class="text-grey text-center py-2">
            <VIcon icon="mdi-map-marker-off" class="mr-2" />
            Adresse non renseignée
          </p>
        </VCardText>
      </VCard>

      <VCard class="mb-8">
        <VCardTitle class="d-flex align-center">
          <VIcon icon="mdi-package-variant" class="mr-2" />
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
                :color="getProductFamilyColor(famille)"
                variant="outlined"
                size="small"
              >
                <VIcon start :icon="getProductFamilyIcon(famille)" />
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

      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="mdi-chart-box" class="mr-2" />
          Informations complémentaires
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="6" sm="3">
              <div class="text-center">
                <VIcon
                  icon="mdi-tag-multiple"
                  size="32"
                  color="primary"
                  class="mb-2"
                />
                <div class="text-h6">
                  {{ producer.familles_des_produits?.length || 0 }}
                </div>
                <div class="text-caption">Catégories</div>
              </div>
            </VCol>
            <VCol cols="6" sm="3">
              <div class="text-center">
                <VIcon
                  icon="mdi-package-variant"
                  size="32"
                  color="green"
                  class="mb-2"
                />
                <div class="text-h6">
                  {{ producer.familles_des_produits_restreintes?.length || 0 }}
                </div>
                <div class="text-caption">Produits</div>
              </div>
            </VCol>
            <VCol cols="6" sm="3">
              <div class="text-center">
                <VIcon
                  icon="mdi-identifier"
                  size="32"
                  color="orange"
                  class="mb-2"
                />
                <div class="text-caption">ID</div>
                <div class="text-caption font-mono">
                  {{ producer.id.substring(0, 8) }}...
                </div>
              </div>
            </VCol>
            <VCol cols="6" sm="3">
              <div class="text-center">
                <VIcon
                  :icon="
                    producer.category ? 'mdi-check-circle' : 'mdi-help-circle'
                  "
                  size="32"
                  :color="producer.category ? 'success' : 'grey'"
                  class="mb-2"
                />
                <div class="text-caption">Catégorie</div>
                <div class="text-caption">
                  {{ producer.category ? 'Définie' : 'Non définie' }}
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <!-- Sidebar avec actions -->
    <VCol cols="12" md="4" class="mb-8">
      <VCard class="sticky-card">
        <VCardTitle class="d-flex align-center">
          <VIcon icon="mdi-phone" class="mr-2" />
          Contact & Actions
        </VCardTitle>
        <VCardText>
          <!-- Informations de contact -->
          <div v-if="producer.contact" class="mb-4">
            <div v-if="producer.contact.phone" class="mb-2">
              <SecondaryButton block :href="`tel:${producer.contact.phone}`">
                <VIcon start icon="mdi-phone" />
                {{ producer.contact.phone }}
              </SecondaryButton>
            </div>
            <div v-if="producer.contact.email" class="mb-2">
              <SecondaryButton block :href="`mailto:${producer.contact.email}`">
                <VIcon start icon="mdi-email" />
                Envoyer un email
              </SecondaryButton>
            </div>
            <div v-if="producer.contact.website" class="mb-2">
              <SecondaryButton
                block
                :href="producer.contact.website"
                target="_blank"
              >
                <VIcon start icon="mdi-web" />
                Site web
              </SecondaryButton>
            </div>
          </div>

          <!-- Actions -->
          <VDivider class="my-4" />

          <PrimaryButton block class="mb-3" @click="showOnMap">
            <VIcon start icon="mdi-map" />
            Voir sur la carte
          </PrimaryButton>

          <TertiaryButton block @click="shareProducer">
            <VIcon start icon="mdi-share" />
            Partager
          </TertiaryButton>

          <VDivider class="my-4" />

          <div class="mb-4">
            <h4 class="mb-2">
              <VIcon icon="mdi-account-group" class="mr-1" />
              Producteurs similaires
            </h4>
            <PrimaryButton
              variant="outlined"
              size="small"
              block
              @click="findSimilarProducers"
            >
              <VIcon start icon="mdi-magnify" />
              Rechercher
            </PrimaryButton>
          </div>
        </VCardText>
      </VCard>
      <VCard v-if="similarProducers.length > 0" class="mt-4">
        <VCardTitle class="d-flex align-center">
          <VIcon icon="mdi-account-group" class="mr-2" />
          Même catégorie
        </VCardTitle>
        <VCardText>
          <VList density="compact">
            <VListItem
              v-for="similar in similarProducers.slice(0, 3)"
              :key="similar.id"
              class="similar-producer-item"
              @click="goToProducer(similar.id)"
            >
              <template #prepend>
                <VIcon
                  :icon="getCategoryIcon(similar.category)"
                  :color="getCategoryColor(similar.category)"
                  size="20"
                />
              </template>

              <VListItemTitle class="text-body-2">
                {{ similar.name }}
              </VListItemTitle>

              <VListItemSubtitle v-if="similar.adresse" class="text-caption">
                {{ similar.adresse }}
              </VListItemSubtitle>

              <template #append>
                <VIcon size="16">mdi-chevron-right</VIcon>
              </template>
            </VListItem>
          </VList>

          <div v-if="similarProducers.length > 3" class="text-center mt-2">
            <SecondaryButton
              size="small"
              variant="text"
              @click="showAllSimilar"
            >
              Voir {{ similarProducers.length - 3 }} autres
            </SecondaryButton>
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
import { useRoute, useRouter } from 'vue-router'
import { useProducerStore } from '@/store/producer'

const route = useRoute()
const router = useRouter()
const producerStore = useProducerStore()
const loading = ref(false)

// Snackbar pour les notifications
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

const producer = computed(() => {
  const id = route.params.id
  return producerStore.getProducerById(id)
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

const similarProducers = computed(() => {
  if (!producer.value || !producer.value.category) return []

  return producerStore.producerList
    .filter(
      p => p.id !== producer.value.id && p.category === producer.value.category
    )
    .slice(0, 10)
})

const getCategoryIcon = category => {
  const icons = {
    'Fruits et légumes': 'mdi-carrot',
    'Produits laitiers': 'mdi-cow',
    Boucherie: 'mdi-food-steak',
    Volaille: 'mdi-chicken',
    Charcuterie: 'mdi-sausage',
    Poissons: 'mdi-fish',
    Céréales: 'mdi-barley',
    Légumineuses: 'mdi-peas',
    Épices: 'mdi-chili-mild',
    Boissons: 'mdi-bottle-wine',
    Miel: 'mdi-bee',
    Pain: 'mdi-bread-slice',
    Fromage: 'mdi-cheese',
  }
  return icons[category] || 'mdi-store'
}

const getCategoryColor = category => {
  const colors = {
    'Fruits et légumes': 'green',
    'Produits laitiers': 'blue',
    Boucherie: 'red',
    Volaille: 'orange',
    Charcuterie: 'deep-orange',
    Poissons: 'cyan',
    Céréales: 'amber',
    Légumineuses: 'light-green',
    Épices: 'red-accent-2',
    Boissons: 'purple',
    Miel: 'yellow-darken-2',
    Pain: 'brown',
    Fromage: 'yellow',
  }
  return colors[category] || 'grey'
}

const getProductFamilyIcon = famille => {
  const icons = {
    Légumes: 'mdi-carrot',
    Fruits: 'mdi-apple',
    Viandes: 'mdi-food-steak',
    'Produits laitiers': 'mdi-cow',
    Céréales: 'mdi-barley',
    Boissons: 'mdi-cup',
    Miel: 'mdi-bee',
    Épices: 'mdi-chili-mild',
  }
  return icons[famille] || 'mdi-tag'
}

const getProductFamilyColor = famille => {
  const colors = {
    Légumes: 'green',
    Fruits: 'orange',
    Viandes: 'red',
    'Produits laitiers': 'blue',
    Céréales: 'amber',
    Boissons: 'purple',
    Miel: 'yellow-darken-2',
    Épices: 'red-accent-2',
  }
  return colors[famille] || 'primary'
}

// Actions
const showOnMap = () => {
  router.push({
    name: 'ProducerMap',
    query: { producer: producer.value.id },
  })
}

const shareProducer = () => {
  if (navigator.share) {
    navigator.share({
      title: producer.value.label,
      text: producer.value.description || `Découvrez ${producer.value.label}`,
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    snackbar.message = 'Lien copié dans le presse-papiers'
    snackbar.color = 'info'
    snackbar.show = true
  }
}

const findSimilarProducers = () => {
  if (!producer.value.category) {
    snackbar.message = 'Aucune catégorie définie pour ce producteur'
    snackbar.color = 'warning'
    snackbar.show = true
    return
  }

  router.push({
    name: 'ProducerMap',
    query: {
      category: producer.value.category,
      exclude: producer.value.id,
    },
  })
}

const goToProducer = producerId => {
  router.push(`/producteur/${producerId}`)
}

const showAllSimilar = () => {
  router.push({
    name: 'ProducerMap',
    query: { category: producer.value.category },
  })
}

const loadProducers = async () => {
  try {
    await producerStore.fetchProducers()
    if (!producer.value) {
      snackbar.message = 'Producteur toujours introuvable après chargement'
      snackbar.color = 'error'
      snackbar.show = true
    }
  } catch (error) {
    snackbar.message = `Erreur lors du chargement des producteurs: ${error && error.message ? error.message : error}`
    snackbar.color = 'error'
    snackbar.show = true
  }
}

onMounted(async () => {
  if (!producerStore.loaded) {
    await producerStore.fetchProducers()
  }
})
</script>

<style lang="scss" scoped>
.producer-detail-page {
  padding: 24px;
}

.producer-header {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8f5e8 100%);
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

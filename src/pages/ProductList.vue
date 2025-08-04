<template>
  <VRow>
    <VCol
      v-for="product in products"
      :key="product.id"
      cols="12"
      sm="6"
      md="4"
      class="mt-6"
    >
      <VCard class="mx-auto" max-width="400" hover>
        <div class="text-center pa-4">
          <VIcon
            :icon="getCategoryIcon(product.category)"
            size="80"
            :color="getCategoryColor(product.category)"
          ></VIcon>
        </div>

        <VCardTitle class="text-h6 text-center">
          {{ product.name }}
        </VCardTitle>

        <VCardSubtitle class="text-center">
          {{ product.category }}
        </VCardSubtitle>

        <VCardActions class="justify-end">
          <PrimaryButton @click="showProducers(product)">
            Voir les producteurs
          </PrimaryButton>
        </VCardActions>
      </VCard>
    </VCol>
  </VRow>

  <VDialog v-model="dialog.show" max-width="600" scrollable>
    <VCard>
      <VCardTitle class="d-flex text-h5">
        Producteurs de {{ dialog.product?.name }}
        <VSpacer />
        <TertiaryButton @click="dialog.show = false">
          <VIcon size="24">mdi-close</VIcon>
        </TertiaryButton>
      </VCardTitle>

      <VCardText style="height: 400px">
        <VList v-if="dialog.producers.length > 0">
          <VListItem
            v-for="producer in dialog.producers"
            :key="producer.id"
            class="mb-2"
          >
            <template #prepend>
              <VAvatar color="primary">
                <VIcon icon="mdi-account"></VIcon>
              </VAvatar>
            </template>

            <VListItemTitle>{{ producer.name }}</VListItemTitle>
            <VListItemSubtitle>
              <div class="d-flex align-center">
                <VIcon icon="mdi-map-marker" size="16" class="mr-1" />
                {{ producer.location }}
                <VSpacer />
                <VChip size="small" color="primary" variant="outlined">
                  {{ producer.distance }}
                </VChip>
              </div>
            </VListItemSubtitle>

            <template #append>
              <PrimaryButton @click="goToProducer(producer)">
                Voir la page
              </PrimaryButton>
            </template>
          </VListItem>
        </VList>

        <div v-else class="text-center mt-4">
          <VIcon icon="mdi-information" size="48" color="grey"></VIcon>
          <p class="text-grey mt-2">Aucun producteur trouvé pour ce produit</p>
        </div>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <TertiaryButton @click="dialog.show = false"> Fermer </TertiaryButton>
      </VCardActions>
    </VCard>
  </VDialog>

  <VSnackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    {{ snackbar.message }}
  </VSnackbar>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const products = ref([
  {
    id: 1,
    name: 'Pommes',
    category: 'Fruits',
  },
  {
    id: 2,
    name: 'Lait',
    category: 'Produits laitiers',
  },
  {
    id: 3,
    name: 'Viande',
    category: 'Boucherie',
  },
])

const dialog = reactive({
  show: false,
  product: null,
  producers: [],
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success',
})

// Données simulées des producteurs (à remplacer par un appel API)
const producersDatabase = {
  1: [
    // Pommes
    {
      id: 101,
      name: 'Ferme Martin',
      location: 'Normandie',
      distance: '15 km',
      slug: 'ferme-martin',
    },
    {
      id: 102,
      name: 'Vergers Dupont',
      location: 'Bretagne',
      distance: '25 km',
      slug: 'vergers-dupont',
    },
    {
      id: 103,
      name: 'Bio Fruits Leclerc',
      location: 'Loire',
      distance: '30 km',
      slug: 'bio-fruits-leclerc',
    },
  ],
  2: [
    // Lait
    {
      id: 201,
      name: 'Laiterie Moreau',
      location: 'Pays de la Loire',
      distance: '12 km',
      slug: 'laiterie-moreau',
    },
    {
      id: 202,
      name: 'Ferme Bio Rousseau',
      location: 'Centre',
      distance: '18 km',
      slug: 'ferme-bio-rousseau',
    },
  ],
  3: [
    // Viande
    {
      id: 301,
      name: 'Boucherie Traditionnelle',
      location: 'Local',
      distance: '8 km',
      slug: 'boucherie-traditionnelle',
    },
    {
      id: 302,
      name: 'Élevage Bio Lambert',
      location: 'Champagne',
      distance: '22 km',
      slug: 'elevage-bio-lambert',
    },
  ],
}

const getCategoryIcon = category => {
  const icons = {
    Fruits: 'mdi-apple',
    'Produits laitiers': 'mdi-cow',
    Boucherie: 'mdi-food-steak',
  }
  return icons[category] || 'mdi-package-variant'
}

const getCategoryColor = category => {
  const colors = {
    Fruits: 'green',
    'Produits laitiers': 'blue',
    Boucherie: 'red',
  }
  return colors[category] || 'grey'
}

// Fonction pour afficher les producteurs
const showProducers = product => {
  dialog.product = product
  dialog.producers = producersDatabase[product.id] || []
  dialog.show = true
}

// Fonction pour naviguer vers la page du producteur
const goToProducer = producer => {
  router.push(`/producteur/${producer.id}`)
  dialog.show = false
}
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-4px);
}

.producer-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.producer-item:hover {
  background-color: #f5f5f5;
}
</style>

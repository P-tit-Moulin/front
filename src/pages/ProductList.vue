<template>
  <v-row>
    <v-col
      v-for="product in products"
      :key="product.id"
      cols="12"
      sm="6"
      md="4"
    >
      <v-card class="mx-auto" max-width="400" elevation="4" hover>
        <!-- Icône basée sur la catégorie -->
        <div class="text-center pa-4">
          <v-icon
            :icon="getCategoryIcon(product.category)"
            size="80"
            :color="getCategoryColor(product.category)"
          ></v-icon>
        </div>

        <v-card-title class="text-h6 text-center">
          {{ product.name }}
        </v-card-title>

        <v-card-subtitle class="text-center">
          {{ product.category }}
        </v-card-subtitle>

        <v-card-actions class="justify-end">
          <PrimaryButton @click="showProducers(product)">
            Voir les producteurs
          </PrimaryButton>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

  <!-- Dialog pour afficher la liste des producteurs -->
  <v-dialog v-model="dialog.show" max-width="600" scrollable>
    <v-card>
      <v-card-title class="d-flex text-h5">
        Producteurs de {{ dialog.product?.name }}
        <VSpacer />
        <TertiaryButton @click="dialog.show = false">
          <VIcon size="24">mdi-close</VIcon>
        </TertiaryButton>
      </v-card-title>

      <v-card-text style="height: 400px">
        <v-list>
          <v-list-item
            v-for="producer in dialog.producers"
            :key="producer.id"
            class="mb-2"
          >
            <template v-slot:prepend>
              <v-avatar color="primary">
                <v-icon icon="mdi-account"></v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>{{ producer.name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ producer.location }} • {{ producer.distance }}
            </v-list-item-subtitle>

            <template v-slot:append>
              <PrimaryButton @click="goToProducer(producer)">
                Voir la page
              </PrimaryButton>
            </template>
          </v-list-item>
        </v-list>

        <!-- Message si aucun producteur -->
        <div v-if="dialog.producers.length === 0" class="text-center mt-4">
          <v-icon icon="mdi-information" size="48" color="grey"></v-icon>
          <p class="text-grey mt-2">Aucun producteur trouvé pour ce produit</p>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <TertiaryButton @click="dialog.show = false"> Fermer </TertiaryButton>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Snackbar pour les notifications -->
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
    {{ snackbar.message }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="snackbar.show = false">
        Fermer
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Données des produits (sans images, juste noms et catégories)
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

// État du dialog pour les producteurs
const dialog = reactive({
  show: false,
  product: null,
  producers: [],
})

// Snackbar pour les notifications
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

// Fonctions utilitaires pour les icônes et couleurs
const getCategoryIcon = (category) => {
  const icons = {
    Fruits: 'mdi-apple',
    'Produits laitiers': 'mdi-cow',
    Boucherie: 'mdi-food-steak',
  }
  return icons[category] || 'mdi-package-variant'
}

const getCategoryColor = (category) => {
  const colors = {
    Fruits: 'green',
    'Produits laitiers': 'blue',
    Boucherie: 'red',
  }
  return colors[category] || 'grey'
}

// Fonction pour afficher les producteurs
const showProducers = (product) => {
  dialog.product = product
  dialog.producers = producersDatabase[product.id] || []
  dialog.show = true
}

// Fonction pour naviguer vers la page du producteur
const goToProducer = (producer) => {
  // Ici vous pouvez utiliser Vue Router pour naviguer
  // this.$router.push(`/producteur/${producer.slug}`)

  console.log('Navigation vers le producteur:', producer)

  // Simulation de la navigation
  snackbar.message = `Navigation vers ${producer.name}`
  snackbar.color = 'info'
  snackbar.show = true
}
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-4px);
}

.v-list-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
}
</style>

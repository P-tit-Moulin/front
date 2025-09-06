<template>
  <VContainer fluid class="profile-edit-page">
    <VCard>
      <VCardTitle class="mb-4">
        <h2>Modifier les informations du producteur</h2>
      </VCardTitle>
      <VCardText>
        <VForm v-if="producer && !loadingData">
          <VRow>
            <VCol cols="12" md="6">
              <VTextField v-model="form.prenom" label="Prénom" required />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="form.nom_de_famille"
                label="Nom de famille"
                required
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="form.com_name"
                label="Nom de la société"
                required
              />
            </VCol>
            <VCol cols="12">
              <VTextField v-model="form.adresse" label="Adresse" required />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="form.code_postal"
                label="Code postal"
                required
              />
            </VCol>
            <VCol cols="12">
              <VTextField v-model="form.ville" label="Ville" required />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model.number="form.coordinates[0]"
                label="Longitude"
                type="number"
                required
              />
            </VCol>
            <VCol cols="6">
              <VTextField
                v-model.number="form.coordinates[1]"
                label="Latitude"
                type="number"
                required
              />
            </VCol>
            <VCol cols="12">
              <VTextarea
                v-model="form.description"
                label="Description"
                rows="4"
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="12" md="6">
              <div class="mb-3 font-weight-medium">Familles des produits</div>
              <div v-if="productFamilies.familles_des_produits.length > 0">
                <VCheckbox
                  v-for="famille in productFamilies.familles_des_produits"
                  :key="famille"
                  v-model="form.familles_des_produits"
                  :value="famille"
                  :label="famille"
                  hide-details
                  color="#61C187"
                  class="mb-1"
                >
                  <template #prepend>
                    <VIcon :color="getFamilyColor(famille)" class="mr-2">
                      {{ getFamilyIcon(famille) }}
                    </VIcon>
                  </template>
                </VCheckbox>
              </div>
              <div v-else class="text-grey">
                Aucune famille restreinte disponible
              </div>
            </VCol>

            <VCol cols="12" md="6">
              <div class="mb-3 font-weight-medium">Familles restreintes</div>
              <div
                v-if="
                  productFamilies.familles_des_produits_restreintes.length > 0
                "
              >
                <VCheckbox
                  v-for="famille in productFamilies.familles_des_produits_restreintes"
                  :key="famille"
                  v-model="form.familles_des_produits_restreintes"
                  :value="famille"
                  :label="famille"
                  hide-details
                  color="#61C187"
                  class="mb-1"
                >
                  <template #prepend>
                    <VIcon :color="getFamilyColor(famille)" class="mr-2">
                      {{ getFamilyIcon(famille) }}
                    </VIcon>
                  </template>
                </VCheckbox>
              </div>
              <div v-else class="text-grey">
                Aucune famille restreinte disponible
              </div>
            </VCol>
          </VRow>

          <PrimaryButton :loading="loading" class="mt-3" @click="onSubmit">
            Enregistrer
          </PrimaryButton>
        </VForm>
        <div v-else-if="loadingData">
          <VProgressCircular indeterminate color="primary" class="mr-3" />
          Chargement des données...
        </div>
        <div v-else>Erreur lors du chargement des données</div>
      </VCardText>
    </VCard>

    <VSnackbar v-model="showSuccess" color="success" timeout="3500">
      {{ success }}
      <template #actions>
        <VBtn icon @click="showSuccess = false">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </template>
    </VSnackbar>

    <VSnackbar v-model="showError" color="error" timeout="5500">
      {{ error }}
      <template #actions>
        <VBtn icon @click="showError = false">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </template>
    </VSnackbar>
  </VContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useProducerStore } from '@/store/producer'
import { getFamilyIcon, getFamilyColor } from '@/utils/familyUtils'

const loading = ref(false)
const loadingData = ref(true)
const error = ref('')
const success = ref('')
const showSuccess = ref(false)
const showError = ref(false)
const router = useRouter()
const userStore = useUserStore()
const producerStore = useProducerStore()

const producer = ref(null)
const form = ref({
  prenom: '',
  nom_de_famille: '',
  com_name: '',
  adresse: '',
  code_postal: '',
  ville: '',
  description: '',
  familles_des_produits: [],
  familles_des_produits_restreintes: [],
  coordinates: [0, 0],
})

const productFamilies = ref([])

onMounted(async () => {
  try {
    loadingData.value = true

    if (!userStore.accessToken) {
      router.push('/login')
      return
    }

    const id = userStore.user?.id || userStore.user?._id
    if (!id) {
      throw new Error('ID utilisateur non trouvé')
    }

    const [producerData, familiesData] = await Promise.all([
      producerStore.getProducerByIdAsync(id),
      producerStore.fetchProductFamilies().catch(() => null),
    ])

    producer.value = producerData

    productFamilies.value = familiesData || [
      'Boissons alcoolisées',
      'Crèmerie',
      'Fruits',
      'Produits non alimentaires',
      'Viandes',
      'Épicerie',
      'Jus',
      'Légumes',
      'Poissons',
    ]

    if (producer.value) {
      form.value = {
        prenom: producer.value.prenom || '',
        nom_de_famille: producer.value.nom_de_famille || '',
        com_name: producer.value.com_name || '',
        adresse: producer.value.adresse || '',
        code_postal: producer.value.code_postal || '',
        ville: producer.value.ville || '',
        description: producer.value.description || '',
        familles_des_produits: Array.isArray(
          producer.value.familles_des_produits
        )
          ? [...producer.value.familles_des_produits]
          : [],
        familles_des_produits_restreintes: Array.isArray(
          producer.value.familles_des_produits_restreintes
        )
          ? [...producer.value.familles_des_produits_restreintes]
          : [],
        coordinates: producer.value.geometry?.coordinates
          ? [...producer.value.geometry.coordinates]
          : [0, 0],
      }
    }
  } catch (e) {
    console.error('Erreur lors du chargement des données:', e)
    error.value = 'Erreur lors du chargement des données: ' + e.message
    showError.value = true
  } finally {
    loadingData.value = false
  }
})

async function onSubmit() {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const payload = {
      prenom: form.value.prenom,
      nom_de_famille: form.value.nom_de_famille,
      com_name: form.value.com_name,
      adresse: form.value.adresse,
      code_postal: form.value.code_postal,
      ville: form.value.ville,
      description: form.value.description,
      familles_des_produits: form.value.familles_des_produits,
      familles_des_produits_restreintes:
        form.value.familles_des_produits_restreintes,
      geometry: {
        type: 'Point',
        coordinates: form.value.coordinates,
      },
    }

    await userStore.updateProfile(payload)
    success.value = 'Informations mises à jour !'
    showSuccess.value = true
  } catch (e) {
    console.error('Erreur lors de la sauvegarde:', e)
    error.value = e.message || 'Erreur lors de la sauvegarde'
    showError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-edit-page {
  max-width: 900px;
  padding-top: 2em;
}

.text-grey {
  color: #666;
  font-style: italic;
}
</style>

<template>
  <VContainer class="d-flex justify-center">
    <VCard width="560">
      <VCardTitle class="d-flex flex-column align-center align-items-center">
        <div class="register-logo">
          <img src="@/assets/img/logo.svg" alt="Logo" />
        </div>
        <h2>Créer un compte</h2>
      </VCardTitle>
      <VCardText>
        <form>
          <div class="form-group">
            <label for="prenom">Prénom</label>
            <VTextField
              id="prenom"
              v-model="form.prenom"
              required
              placeholder="Votre prénom"
              class="mb-4"
            />
          </div>
          <div class="form-group">
            <label for="nom_de_famille">Nom de famille</label>
            <VTextField
              id="nom_de_famille"
              v-model="form.nom_de_famille"
              required
              placeholder="Votre nom"
              class="mb-4"
            />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <VTextField
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="Votre email"
              class="mb-4"
            />
          </div>
          <div class="form-group">
            <label for="entreprise">Nom de votre entreprise</label>
            <ComboboxEntreprise v-model="form.entreprise" />
            <p class="mb-4">
              L'entreprise est obligatoire, si vous ne la trouvez pas,
              saisissez-en la.
            </p>
          </div>
          <div class="form-group">
            <label for="mdp">Mot de passe</label>
            <VTextField
              id="mdp"
              v-model="form.mdp"
              type="password"
              autocomplete="new-password"
              required
              placeholder="Mot de passe"
            />
          </div>
        </form>
      </VCardText>
      <VCardActions class="d-flex justify-end">
        <PrimaryButton
          type="submit"
          :disabled="loading"
          :loading="loading"
          @click="submit"
        >
          Créer le compte
        </PrimaryButton>
        <router-link to="/login">
          <TertiaryButton>Déjà inscrit ? Connecte-toi</TertiaryButton>
        </router-link>
      </VCardActions>
    </VCard>
    <v-snackbar v-model="snackbar" color="red" timeout="4000">
      {{ error }}
    </v-snackbar>
  </VContainer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import ComboboxEntreprise from '@/components/ComboboxEntreprise.vue'

const form = ref({
  prenom: '',
  nom_de_famille: '',
  email: '',
  mdp: '',
  entreprise: '',
})

const loading = ref(false)
const error = ref('')
const snackbar = ref(false)
const router = useRouter()
const userStore = useUserStore()

async function submit() {
  try {
    const dataToSend = {
      prenom: form.value.prenom,
      nom_de_famille: form.value.nom_de_famille,
      email: form.value.email,
      mdp: form.value.mdp,
      entreprise: form.value.entreprise,
    }

    const result = await userStore.register(dataToSend)
    if (result) {
      router.push(`/profil/${result.user._id}`)
    } else {
      error.value = 'Erreur de connexion après inscription.'
      snackbar.value = true
    }
  } catch (e) {
    error.value = e.message || 'Erreur lors de la création du compte.'
    snackbar.value = true
  }
}
</script>

<style scoped>
.register-logo {
  width: 91px;
  margin-top: 16px;
}

.register-logo img {
  width: 100%;
  display: block;
}

h2 {
  color: #222;
  font-weight: 700;
  margin-bottom: 16px;
  font-size: 2rem;
  letter-spacing: 0.01em;
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 4px;
  font-size: 1.07rem;
  color: #222;
  font-weight: 500;
}

.error {
  color: #e13a3a;
  margin-top: 1em;
  font-size: 1.05rem;
  text-align: center;
  font-weight: 500;
}

.success {
  color: #61c187;
  margin-top: 1em;
  font-size: 1.05rem;
  text-align: center;
  font-weight: 500;
}

.login-link {
  margin-top: 0.8em;
  width: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: 450px) {
  .register-page {
    padding: 1.5em 0.5em;
  }
  h2 {
    font-size: 1.55rem;
  }
  .register-logo {
    width: 70px;
  }
}
</style>

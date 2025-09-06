<template>
  <VContainer class="d-flex justify-center">
    <VCard width="560">
      <VCardTitle class="d-flex flex-column align-center align-items-center">
        <div class="login-logo d-flex justify-center">
          <img src="@/assets/img/logo.svg" alt="Logo" />
        </div>
        <h2>Connexion</h2>
      </VCardTitle>
      <VCardText>
        <form @submit.prevent="onSubmit">
          <div>
            <label for="email">Email</label>
            <VTextField
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Entrez votre email"
            />
          </div>
          <div class="mt-4">
            <label for="password">Mot de passe</label>
            <VTextField
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              placeholder="Entrez votre mot de passe"
            />
          </div>
          <div v-if="error" class="error mt-3">{{ error }}</div>
        </form>
      </VCardText>
      <VCardActions class="d-flex justify-end">
        <PrimaryButton
          :disabled="loading"
          :loading="loading"
          class="mb-3"
          @click="onSubmit"
        >
          Se connecter
        </PrimaryButton>

        <div class="register-link">
          <router-link to="/register">
            <TertiaryButton>Créer un compte</TertiaryButton>
          </router-link>
        </div>
      </VCardActions>
    </VCard>
  </VContainer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const userStore = useUserStore()

async function onSubmit() {
  loading.value = true
  error.value = ''

  try {
    await userStore.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.error || e.message || 'Erreur de connexion.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-logo {
  margin-top: 16px;
  width: 91px;
}

.login-logo img {
  width: 100%;
  display: block;
}

h2 {
  color: #222;
  font-weight: 700;
  margin-bottom: 2em;
  font-size: 2rem;
  letter-spacing: 0.01em;
}

label {
  margin-bottom: 0.6em;
  font-size: 1.07rem;
  color: #222;
  font-weight: 500;
}

.error {
  color: #e13a3a;
  font-size: 1.05rem;
  text-align: center;
  font-weight: 500;
}

@media (max-width: 450px) {
  .login-page {
    padding: 1.5em 0.5em;
  }
  h2 {
    font-size: 1.55rem;
  }
  .login-logo {
    width: 70px;
  }
}
</style>

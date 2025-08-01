import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.scss'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  aliases: {
    PrimaryButton: components.VBtn,
    SecondaryButton: components.VBtn,
    TertiaryButton: components.VBtn,
  },
  defaults: {
    PrimaryButton: {
      color: '#61C187',
      flat: true,
      class: 'btn-style-primary',
    },
    SecondaryButton: {
      color: '#61C187',
      variant: 'outlined',
      class: 'btn-style',
    },
    TertiaryButton: {
      color: '#333',
      variant: 'text',
      class: 'btn-style',
    },
  },
})

const pinia = createPinia()

createApp(App).use(vuetify).use(pinia).use(router).mount('#app')

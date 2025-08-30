import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'
import { createSentryPiniaPlugin } from '@sentry/vue'
import App from './App.vue'
import router from './router'
import './assets/styles/main.scss'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import {
  VCardActions,
  VCardText,
  VChip,
  VProgressCircular,
  VSelect,
  VSlider,
  VSnackbar,
  VApp,
  VAppBar,
  VAvatar,
  VBtn,
  VCard,
  VTextField,
  VDialog,
  VContainer,
  VFooter,
  VRow,
  VCol,
  VTabs,
  VTab,
  VIcon,
  VSpacer,
  VCardTitle,
  VCardSubtitle,
  VList,
  VListItem,
  VListItemTitle,
  VListItemSubtitle,
} from 'vuetify/components'

const vuetify = createVuetify({
  components: {
    VApp,
    VAppBar,
    VBtn,
    VCard,
    VTextField,
    VDialog,
    VContainer,
    VFooter,
    VRow,
    VCol,
    VTabs,
    VTab,
    VIcon,
    VSpacer,
    VCardTitle,
    VCardSubtitle,
    VCardText,
    VCardActions,
    VAvatar,
    VChip,
    VSnackbar,
    VSelect,
    VSlider,
    VProgressCircular,
    VList,
    VListItem,
    VListItemTitle,
    VListItemSubtitle,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  aliases: {
    PrimaryButton: VBtn,
    SecondaryButton: VBtn,
    TertiaryButton: VBtn,
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
    VCard: {
      flat: true,
      class: 'card-style',
    },
    VSelect: {
      clearable: true,
      variant: 'outlined',
      density: 'compact',
      hideDetails: true,
      clearIcon: 'mdi-close',
    },
    VTextField: {
      clearable: true,
      variant: 'outlined',
      density: 'compact',
      hideDetails: true,
      clearIcon: 'mdi-close',
    },
  },
})

const app = createApp(App)

const pinia = createPinia()

pinia.use(createSentryPiniaPlugin())

Sentry.init({
  app,
  dsn: 'https://97a964c6965b1b737309f27ecc640fe0@o4509911975329792.ingest.de.sentry.io/4509912050892880',
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  sampleRate: 1.0,
})

app.use(vuetify).use(pinia).use(router).mount('#app')

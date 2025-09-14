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
  VCombobox,
  VTextarea,
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
    VCombobox,
    VTextarea,
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
    VCombobox: {
      clearable: true,
      variant: 'outlined',
      density: 'compact',
      hideDetails: true,
      clearIcon: 'mdi-close',
    },
    VTextarea: {
      clearable: true,
      variant: 'outlined',
      density: 'compact',
      hideDetails: true,
    },
  },
})

const app = createApp(App)

const pinia = createPinia()

pinia.use(createSentryPiniaPlugin())

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.2,
  sampleRate: 0.2,
})

app.use(vuetify).use(pinia).use(router).mount('#app')

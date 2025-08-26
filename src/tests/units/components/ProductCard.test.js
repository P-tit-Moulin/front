import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

describe('ProductCard.vue', () => {
  it('se rend correctement', () => {
    const wrapper = mount(ProductCard, {
      global: { plugins: [vuetify] },
    })

    expect(wrapper.classes()).toContain('product-card')
    expect(wrapper.find('.product-card-title').exists()).toBe(true)
    expect(wrapper.find('.product-text').exists()).toBe(true)
    expect(wrapper.find('.justify-end').exists()).toBe(true)
  })

  it('affiche le slot title', () => {
    const wrapper = mount(ProductCard, {
      global: { plugins: [vuetify] },
      slots: {
        title: '<h1>Mon titre</h1>',
      },
    })

    expect(wrapper.find('.product-card-title').html()).toContain('Mon titre')
  })

  it('affiche le slot text', () => {
    const wrapper = mount(ProductCard, {
      global: { plugins: [vuetify] },
      slots: {
        text: '<p>Mon texte descriptif</p>',
      },
    })

    expect(wrapper.find('.product-text').html()).toContain(
      'Mon texte descriptif'
    )
  })

  it('affiche le slot actions', () => {
    const wrapper = mount(ProductCard, {
      global: { plugins: [vuetify] },
      slots: {
        actions: '<button>Cliquer</button>',
      },
    })

    expect(wrapper.find('.justify-end').html()).toContain('Cliquer')
  })
})

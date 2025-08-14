import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'

describe('ProductCard', () => {
  it('renders with title slot', () => {
    const wrapper = mount(ProductCard, {
      props: {
        title: 'Test Product',
      },
      slots: {
        title: 'Légumes frais',
      },
    })

    expect(wrapper.text()).toContain('Légumes frais')
  })

  it('renders with text and actions slots', () => {
    const wrapper = mount(ProductCard, {
      props: {
        title: 'Test Product',
      },
      slots: {
        title: 'Légumes',
        text: '<div>Description du produit</div>',
        actions: '<button>Voir plus</button>',
      },
    })

    expect(wrapper.text()).toContain('Légumes')
    expect(wrapper.text()).toContain('Description du produit')
    expect(wrapper.text()).toContain('Voir plus')
  })

  it('has hover effect class', () => {
    const wrapper = mount(ProductCard, {
      props: {
        title: 'Test Product',
      },
    })

    expect(wrapper.find('.product-card').exists()).toBe(true)
  })
})

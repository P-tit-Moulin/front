import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createPinia } from 'pinia'
import ProducerCard from '@/components/ProducerCard.vue'

describe('ProducerCard - Simple', () => {
  const mockProducer = {
    id: 1,
    nom: 'Test Producer',
    description: 'Test description',
    com_name: 'Test City',
  }

  it('renders producer information correctly', async () => {
    const wrapper = mount(ProducerCard, {
      props: {
        item: mockProducer,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Test Producer')
    expect(wrapper.text()).toContain('Test description')
    expect(wrapper.text()).toContain('Voir mes produits')
  })

  it('emits events correctly', async () => {
    const wrapper = mount(ProducerCard, {
      props: {
        item: mockProducer,
        close: true,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    await wrapper.vm.$nextTick()

    await wrapper.vm.$emit('goToProducer')
    await wrapper.vm.$emit('close')

    expect(wrapper.emitted()).toHaveProperty('goToProducer')
    expect(wrapper.emitted()).toHaveProperty('close')
  })
})

import { describe, it, expect } from 'vitest'
import { getFamilyIcon, getFamilyColor } from '@/utils/familyUtils'

describe('familyUtils', () => {
  describe('getFamilyIcon', () => {
    it('returns correct icons for known families', () => {
      expect(getFamilyIcon('Légumes')).toBe('mdi-carrot')
      expect(getFamilyIcon('Fruits')).toBe('mdi-food-apple')
    })

    it('returns default icon for unknown families', () => {
      expect(getFamilyIcon('Unknown')).toBe('mdi-tag')
      expect(getFamilyIcon('')).toBe('mdi-tag')
      expect(getFamilyIcon(null)).toBe('mdi-tag')
    })
  })

  describe('getFamilyColor', () => {
    it('returns correct colors for known families', () => {
      expect(getFamilyColor('Légumes')).toBe('light-green')
      expect(getFamilyColor('Fruits')).toBe('green')
    })

    it('returns default color for unknown families', () => {
      expect(getFamilyColor('Unknown')).toBe('primary')
      expect(getFamilyColor('')).toBe('primary')
      expect(getFamilyColor(null)).toBe('primary')
    })
  })
})

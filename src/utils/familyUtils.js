export function getFamilyIcon(family) {
  const iconMap = {
    Fruits: 'mdi-food-apple',
    Légumes: 'mdi-carrot',
    Viandes: 'mdi-cow',
    Poissons: 'mdi-fish',
    Épicerie: 'mdi-basket',
    Jus: 'mdi-cup-water',
    Crèmerie: 'mdi-bottle-tonic',
    'Boissons alcoolisées': 'mdi-glass-cocktail',
    'Produits non alimentaires': 'mdi-package-variant',
  }
  return iconMap[family] || 'mdi-tag'
}

export function getFamilyColor(family) {
  const colorMap = {
    Fruits: 'green',
    Légumes: 'light-green',
    Viandes: 'red',
    Poissons: 'blue',
    Épicerie: 'amber',
    Jus: 'deep-purple',
    Crèmerie: 'indigo',
    'Boissons alcoolisées': 'deep-orange',
    'Produits non alimentaires': 'grey',
  }
  return colorMap[family] || 'primary'
}

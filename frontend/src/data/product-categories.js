const productCategories = [
  { value: 'clothing', label: 'Clothing', note: 'Comfort, considered' },
  { value: 'shoes', label: 'Shoes', note: 'Made to move in' },
  { value: 'accessories', label: 'Accessories', note: 'Everyday essentials' },
  { value: 'home', label: 'Home & living', note: 'Furniture, decor & more' },
  { value: 'furniture', label: 'Furniture', note: 'A place to settle' },
  { value: 'lighting', label: 'Lighting', note: 'A softer kind of glow' },
  { value: 'tableware', label: 'Tableware', note: 'Gather around' },
  { value: 'textiles', label: 'Textiles & rugs', note: 'Comfort underfoot' },
  { value: 'storage', label: 'Storage', note: 'A place for everything' },
  { value: 'decor', label: 'Decor & art', note: 'Finishing touches' },
]

const homeProductCategories = new Set([
  'home',
  'furniture',
  'lighting',
  'tableware',
  'textiles',
  'storage',
  'decor',
])

export default productCategories

export function productMatchesCategory(productCategory, selectedCategory) {
  const category = productCategory || 'home'
  if (selectedCategory === 'home') return homeProductCategories.has(category)
  return category === selectedCategory
}

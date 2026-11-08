import { groupCategories } from '@/components/archive/categoryGroups'

const category = (slug: string) => ({ id: slug.length, name: slug, slug })

test('divide le categorie nei gruppi, e quelle sconosciute in "Altre"', () => {
  const groups = groupCategories([
    category('gt3'),
    category('sportive'),
    category('concept'),
    category('nuova'),
  ])

  expect(groups.map((group) => group.key)).toEqual([
    'road',
    'racing',
    'concept',
    'other',
  ])
  expect(groups[0].categories.map((c) => c.slug)).toEqual(['sportive'])
  expect(groups[3].categories.map((c) => c.slug)).toEqual(['nuova'])
})

test('non mostra i gruppi vuoti', () => {
  expect(
    groupCategories([category('formula-1')]).map((group) => group.key),
  ).toEqual(['racing'])
})

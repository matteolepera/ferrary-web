import { paginate } from './paginate'

const items = Array.from({ length: 45 }, (_, index) => index + 1)

test('divide in pagine da 20', () => {
  expect(paginate(items, 1)).toMatchObject({ page: 1, lastPage: 3 })
  expect(paginate(items, 3).items).toEqual([41, 42, 43, 44, 45])
})

test('una pagina che non esiste diventa la più vicina', () => {
  expect(paginate(items, 9).page).toBe(3)
  expect(paginate([], 4)).toEqual({ items: [], page: 1, lastPage: 1 })
})

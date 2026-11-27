/** Quante righe per pagina negli elenchi che si sfogliano nel browser */
export const PAGE_SIZE = 20

/**
 * Una pagina di un elenco già scaricato: le sue righe, e la pagina giusta.
 * Una pagina che non esiste più (dopo un filtro o un'eliminazione) diventa l'ultima.
 */
export function paginate<T>(items: T[], page: number, size = PAGE_SIZE) {
  const lastPage = Math.max(1, Math.ceil(items.length / size))
  const current = Math.min(Math.max(page, 1), lastPage)

  return {
    items: items.slice((current - 1) * size, current * size),
    page: current,
    lastPage,
  }
}

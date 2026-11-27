import { countryName } from '@/lib/format'

/**
 * I paesi presenti in un elenco, una volta sola e in ordine di nome: le scelte del filtro.
 * Così il filtro propone solo i paesi che danno almeno un risultato.
 */
export function countryOptions(codes: (string | null)[]) {
  const unique = [...new Set(codes.filter((code) => code !== null))]

  return unique
    .map((code) => ({ value: code, label: countryName(code) ?? code }))
    .sort((a, b) => a.label.localeCompare(b.label, 'it'))
}

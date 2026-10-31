/**
 * Un nome trasformato in slug, come fa Str::slug del backend: "Purosangue Sportivo" diventa "purosangue-sportivo".
 * Serve solo per l'anteprima: lo slug vero lo decide il backend.
 */
export function slugify(text: string) {
  return (
    text
      // "è" diventa "e" più un accento separato, che la riga dopo toglie
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      // Tutto ciò che non è lettera o numero diventa un trattino, e i trattini consecutivi uno solo
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  )
}

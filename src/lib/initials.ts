/** Le iniziali di un nome, per gli avatar: "Matteo Le Pera" diventa "ML" */
export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

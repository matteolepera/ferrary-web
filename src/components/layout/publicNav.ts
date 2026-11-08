/** I cataloghi: le persone e i motori dietro le Ferrari */
export const catalogLinks = [
    { to: '/motori', label: 'catalogs.engines.title' },
    { to: '/designer', label: 'catalogs.designers.title' },
    { to: '/piloti', label: 'catalogs.drivers.title' },
] as const

/** Una pagina dei cataloghi è aperta: la voce "Cataloghi" va segnata come attiva */
export function isCatalogPath(pathname: string) {
    return catalogLinks.some((link) => pathname.startsWith(link.to))
}
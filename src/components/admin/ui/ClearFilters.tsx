/** «Azzera filtri», in fondo alla barra dei filtri: compare solo se c'è qualcosa da azzerare */
export function ClearFilters({
  visible,
  onClear,
}: {
  visible: boolean
  onClear: () => void
}) {
  if (!visible) return null

  return (
    <button
      type="button"
      onClick={onClear}
      className="text-xs font-semibold text-neutral-400 underline-offset-4 transition-colors hover:text-white hover:underline"
    >
      Azzera filtri
    </button>
  )
}

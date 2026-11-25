/**
 * Il riquadro dei campi dell'admin, uguale per testo, menu e aree di testo.
 * "focus" serve al select e alla textarea, "focus-within" al campo con icona o unità,
 * dove il focus è sull'input dentro il riquadro.
 */
export function fieldBox(error?: string) {
  return [
    'bg-[#080808] rounded-[0.875rem] border text-[0.9375rem] text-neutral-100 transition-[border-color,box-shadow]',
    'outline-none focus:border-neutral-200 focus:ring-4 focus:ring-white/6',
    'focus-within:border-neutral-200 focus-within:ring-4 focus-within:ring-white/6',
    // Disattivato: tratteggiato e spento, così non sembra un campo vuoto da riempire
    'disabled:cursor-not-allowed disabled:border-dashed disabled:border-white/10 disabled:bg-[repeating-linear-gradient(135deg,#0d0d0d_0_6px,#090909_6px_12px)] disabled:text-neutral-600',
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:border-dashed has-[:disabled]:border-white/10 has-[:disabled]:bg-[repeating-linear-gradient(135deg,#0d0d0d_0_6px,#090909_6px_12px)] has-[:disabled]:text-neutral-600',
    error ? 'border-errore' : 'border-white/15',
  ].join(' ')
}

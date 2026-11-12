import type { ReactNode } from 'react'

type StatePageProps = {
  /** Il segno enorme in filigrana: "404", "!?" */
  watermark: string
  /** L'etichetta con il segno rosso: "Errore 404" */
  eyebrow: string
  title: string
  text: string
  /** I pulsanti, uno accanto all'altro dal tablet in su */
  children: ReactNode
  className?: string
}

/**
 * Una pagina di stato, come la 404 o l'errore imprevisto: il riflettore, un segno enorme in filigrana,
 * l'etichetta con il segno rosso obliquo, il titolo, il testo e i pulsanti con la forma della Y.
 */
export function StatePage({
  watermark,
  eyebrow,
  title,
  text,
  children,
  className = '',
}: StatePageProps) {
  return (
    <section
      className={`riflettore relative isolate flex min-h-[36rem] flex-col justify-end overflow-hidden md:min-h-[44rem] ${className}`}
    >
      {/* La filigrana: decorazione, il titolo vero è sotto */}
      <span
        aria-hidden="true"
        className="font-display absolute inset-x-0 top-[8%] -z-10 text-center text-[11rem] leading-none font-extrabold tracking-[-0.06em] whitespace-nowrap text-neutral-900 md:text-[20rem] lg:text-[clamp(20rem,30vw,26rem)]"
      >
        {watermark}
      </span>

      <div className="mx-auto w-full max-w-[1360px] px-5 pb-16 md:px-10 md:pb-24">
        <p className="text-rosso-acceso flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
          <span
            aria-hidden="true"
            className="bg-rosso-acceso h-[3px] w-3.5 -skew-x-[28deg] shadow-[0_0_8px_rgba(255,59,48,0.6)]"
          />
          {eyebrow}
        </p>
        <h1 className="font-display mt-4 text-[2.75rem] leading-[0.95] font-extrabold tracking-[-0.04em] md:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-neutral-300 md:mt-5 md:text-lg">
          {text}
        </p>

        <div className="mt-8 flex flex-col gap-3 md:mt-10 md:flex-row">
          {children}
        </div>
      </div>
    </section>
  )
}

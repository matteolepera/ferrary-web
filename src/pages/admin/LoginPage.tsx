import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { isTooManyRequests, validationErrors } from '@/api/errors'
import monogram from '@/assets/brand/ferrary-y-rosso.svg'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { AdminField } from '@/components/admin/ui/AdminField'
import { PasswordField } from '@/components/admin/ui/PasswordField'
import { PageLoader } from '@/components/layout/PageLoader'
import { Logo } from '@/components/Logo'
import { useCurrentUser, useLogin } from '@/hooks/useAuth'

/** La pagina da aprire dopo il login: solo indirizzi dell'area admin, mai siti esterni */
function safeDestination(value: string | null) {
  return value?.startsWith('/admin') ? value : '/admin'
}

/** Il monogramma nel cerchio rosso, lo stesso in cima alla barra dell'admin */
function Monogram() {
  return (
    <span className="border-rosso bg-notte flex size-11 items-center justify-center rounded-full border shadow-[0_0_22px_rgb(212_0_0/0.35)]">
      <img src={monogram} alt="" className="h-[1.125rem] w-auto" />
    </span>
  )
}

/** Le card dell'admin: angoli da 24 px ed entrata morbida, come nel pannello */
const card = 'rounded-3xl border border-linea motion-safe:animate-comparsa'

/**
 * Login dello staff. L'area admin è solo in italiano: i testi sono scritti qui, senza i18next.
 */
export function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { data: user, isPending: checking } = useCurrentUser()
  const login = useLogin()

  const destination = safeDestination(params.get('da'))

  if (checking) {
    return <PageLoader />
  }

  // Già collegato: niente da fare qui
  if (user) {
    return <Navigate to={destination} replace />
  }

  const fieldErrors = validationErrors(login.error)
  const generalError =
    login.error && !fieldErrors
      ? isTooManyRequests(login.error)
        ? 'Troppi tentativi di accesso. Riprova tra un minuto.'
        : 'Impossibile accedere in questo momento. Riprova.'
      : null

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    login.mutate(
      {
        email: String(data.get('email')),
        password: String(data.get('password')),
      },
      // Sostituisce la pagina di login nella cronologia: Indietro non ci riporta qui
      { onSuccess: () => navigate(destination, { replace: true }) },
    )
  }

  return (
    <div
      lang="it"
      className="bg-notte min-h-dvh p-3 text-neutral-100 md:p-4 lg:grid lg:grid-cols-[1.15fr_1fr] lg:gap-4"
    >
      <title>Accedi – Ferrary</title>

      {/* Dal desktop: la card "banner", come quella di benvenuto del pannello */}
      <section
        className={[
          card,
          'relative hidden flex-col overflow-hidden px-9 py-8 lg:flex',
          'bg-ombra bg-[radial-gradient(ellipse_70%_60%_at_70%_72%,rgb(212_0_0/0.42),transparent_70%)]',
        ].join(' ')}
      >
        <Link
          to="/"
          aria-label="Ferrary, vai al sito"
          className="flex items-center gap-3 self-start"
        >
          <Monogram />
          <Logo alt="" className="h-5 w-auto" />
        </Link>

        <div className="relative z-10 mt-18">
          <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase">
            Area staff
          </p>
          <h2 className="font-display mt-3.5 text-5xl leading-none font-extrabold tracking-[-0.035em] xl:text-[3.5rem]">
            Il museo,
            <br />
            <span className="text-neutral-500">dietro le quinte.</span>
          </h2>
        </div>

        <img
          src="/images/home/sf90-stradale-1200.webp"
          alt=""
          className="absolute right-[-70px] bottom-6 w-[78%] drop-shadow-[0_30px_36px_rgb(0_0_0/0.65)]"
        />
      </section>

      {/* Il modulo: su mobile è l'unica card, a tutto schermo */}
      <main
        className={[
          card,
          'bg-ombra flex min-h-[calc(100dvh-1.5rem)] flex-col px-6 py-6 md:min-h-[calc(100dvh-2rem)] md:px-9 md:py-8',
          '[animation-delay:100ms] [animation-fill-mode:backwards]',
        ].join(' ')}
      >
        <div className="flex items-center">
          {/* Su mobile il monogramma sta qui; dal desktop è nella card di sinistra */}
          <Link to="/" aria-label="Ferrary, vai al sito" className="lg:hidden">
            <Monogram />
          </Link>
          <Link
            to="/"
            className="ml-auto text-xs font-semibold text-neutral-400 transition-colors hover:text-white"
          >
            ← Torna al sito
          </Link>
        </div>

        <div className="my-auto w-full max-w-sm self-center py-10">
          <h1 className="font-display text-[2.5rem] leading-none font-extrabold tracking-[-0.035em]">
            Accedi
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Inserisci le credenziali che ti ha assegnato il Master.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-7 flex flex-col gap-5"
          >
            {generalError && (
              <p
                role="alert"
                className="border-errore/40 bg-errore/10 text-errore rounded-2xl border px-4 py-3 text-[0.8125rem]"
              >
                {generalError}
              </p>
            )}

            <AdminField
              label="Email"
              name="email"
              type="email"
              placeholder="nome@ferrary.it"
              autoComplete="username"
              required
              error={fieldErrors?.email?.[0]}
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
                </svg>
              }
            />
            <PasswordField
              label="Password"
              name="password"
              autoComplete="current-password"
              required
              error={fieldErrors?.password?.[0]}
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3" />
                </svg>
              }
            />

            <AdminButton
              type="submit"
              disabled={login.isPending}
              className="mt-2 w-full"
            >
              {login.isPending ? 'Accesso in corso…' : 'Accedi'}
              {!login.isPending && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
            </AdminButton>
          </form>
        </div>

        <p className="text-center text-xs leading-relaxed text-neutral-400">
          Accesso riservato allo staff.
        </p>
      </main>
    </div>
  )
}

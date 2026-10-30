import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import { isTooManyRequests, validationErrors } from '@/api/errors'
import { PageLoader } from '@/components/layout/PageLoader'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { useCurrentUser, useLogin } from '@/hooks/useAuth'

/** La pagina da aprire dopo il login: solo indirizzi dell'area admin, mai siti esterni */
function safeDestination(value: string | null) {
  return value?.startsWith('/admin') ? value : '/admin'
}

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
      className="bg-notte min-h-screen text-neutral-100 lg:grid lg:grid-cols-2"
    >
      <title>Accedi – Ferrary</title>

      {/* Dal desktop: la SF90 sotto il riflettore */}
      <div
        aria-hidden="true"
        className="border-linea riflettore relative hidden overflow-hidden border-r lg:flex lg:items-center lg:justify-center"
      >
        <img
          src="/images/sf90-stradale-1200.webp"
          alt=""
          className="w-[80%] drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]"
        />
      </div>

      <main className="flex min-h-screen flex-col px-6 py-8 md:px-12 lg:px-20">
        <Link to="/" className="self-start" aria-label="Ferrary, vai al sito">
          <Logo alt="" className="h-7 w-auto" />
        </Link>

        <div className="my-auto w-full max-w-sm py-12">
          <p className="text-rosso-acceso text-[0.6875rem] font-semibold tracking-[0.22em] uppercase md:text-xs">
            Area staff
          </p>
          <h1 className="font-display mt-3 text-[2.625rem] leading-none font-extrabold tracking-[-0.035em] md:text-5xl">
            Accedi
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-400">
            Riservato allo staff di Ferrary: gestione del catalogo, delle foto e
            dei cataloghi.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-10 flex flex-col gap-5"
          >
            {generalError && (
              <p
                role="alert"
                className="border-errore/40 bg-errore/10 text-errore border px-4 py-3 text-sm"
              >
                {generalError}
              </p>
            )}

            <TextField
              label="Email"
              name="email"
              type="email"
              autoComplete="username"
              required
              error={fieldErrors?.email?.[0]}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              error={fieldErrors?.password?.[0]}
            />

            <Button
              type="submit"
              disabled={login.isPending}
              className="mt-2 w-full"
            >
              {login.isPending ? 'Accesso in corso…' : 'Accedi'}
            </Button>
          </form>
        </div>

        <Link
          to="/"
          className="self-start text-xs font-semibold tracking-[0.16em] text-neutral-400 uppercase hover:text-white"
        >
          ← Torna al sito
        </Link>
      </main>
    </div>
  )
}

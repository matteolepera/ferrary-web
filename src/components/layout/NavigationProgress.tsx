import { useNavigation } from 'react-router'

/**
 * Una sottile barra rossa in cima allo schermo, mentre arriva la pagina successiva.
 */
export function NavigationProgress() {
  const navigation = useNavigation()
  const loading = navigation.state === 'loading'

  return (
    <div
      aria-hidden="true"
      className={[
        'bg-rosso fixed inset-x-0 top-0 z-[80] h-0.5 origin-left transition-transform ease-out',
        // Mentre carica, la barra avanza lentamente fino a tre quarti; finito, sparisce subito
        loading ? 'scale-x-75 duration-[2000ms]' : 'scale-x-0 duration-0',
      ].join(' ')}
    />
  )
}

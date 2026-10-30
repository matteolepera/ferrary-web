import { Link } from 'react-router'
import { Monogram } from '@/components/admin/Monogram'
import { adminButtonClass } from '@/components/admin/ui/adminButtonClass'

/**
 * Sul telefono, al posto dell'area admin: tabelle, foto e moduli hanno bisogno di spazio.
 * Sparisce dai 700 pixel in su, dove compare l'area vera.
 */
export function SmallScreenNotice() {
  return (
    <div className="bg-notte flex min-h-dvh flex-col items-center justify-center px-8 text-center text-neutral-100 min-[700px]:hidden">
      <Monogram />
      <h1 className="font-display mt-8 text-[2rem] leading-tight font-extrabold tracking-[-0.035em]">
        Serve uno schermo più grande
      </h1>
      <p className="mt-4 max-w-[30ch] text-[0.9375rem] leading-relaxed text-neutral-400">
        L'area staff è pensata per tablet e computer: tabelle, foto e moduli
        hanno bisogno di spazio.
      </p>
      <Link to="/" className={adminButtonClass('outline', 'mt-8')}>
        Torna al sito
      </Link>
    </div>
  )
}

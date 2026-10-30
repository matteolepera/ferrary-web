import { Link } from 'react-router'
import { roleLabels } from '@/components/admin/adminNav'
import { AdminCard } from '@/components/admin/ui/AdminCard'
import { Avatar } from '@/components/admin/ui/Avatar'
import { useStaff } from '@/hooks/useStaff'

/** Quanti avatar mostrare prima del "+N" */
const VISIBLE = 5

type StaffCardProps = {
  /** Chi sta guardando: il suo avatar è rosso, come nell'attività */
  currentUserId?: number
  delay?: number
  className?: string
}

/**
 * Chi fa parte dello staff, con il ruolo. Ha una sua richiesta e i suoi stati,
 * così un problema qui non blocca il resto del pannello.
 */
export function StaffCard({
  currentUserId,
  delay,
  className = '',
}: StaffCardProps) {
  const { data: staff, isPending, isError } = useStaff()

  return (
    <AdminCard
      aria-labelledby="pannello-staff"
      delay={delay}
      className={`p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h2
          id="pannello-staff"
          className="font-display text-xl font-extrabold tracking-[-0.03em]"
        >
          Staff
        </h2>
        <Link
          to="/admin/staff"
          className="text-xs font-semibold text-neutral-300 transition-colors hover:text-white"
        >
          Gestisci <span aria-hidden="true">→</span>
        </Link>
      </div>

      {isPending && (
        <div aria-busy="true" className="mt-4.5 flex gap-3.5">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="size-13 animate-pulse rounded-full bg-white/5"
            />
          ))}
        </div>
      )}

      {isError && (
        <p className="mt-4.5 text-sm text-neutral-400">
          Impossibile caricare lo staff.
        </p>
      )}

      {staff && (
        <ul className="mt-4.5 flex flex-wrap gap-3.5">
          {staff.slice(0, VISIBLE).map((person) => (
            <li key={person.id} className="w-16 text-center">
              <Avatar
                name={person.name}
                highlighted={person.id === currentUserId}
                className="mx-auto size-13 text-base"
              />
              <p className="mt-2 truncate text-xs font-semibold">
                {person.name.split(' ')[0]}
              </p>
              <p className="mt-0.5 text-[0.6875rem] text-neutral-400">
                {roleLabels[person.role]}
              </p>
            </li>
          ))}

          {staff.length > VISIBLE && (
            <li className="w-16 text-center">
              <span className="mx-auto flex size-13 items-center justify-center rounded-full border border-dashed border-white/15 text-sm font-semibold text-neutral-300">
                +{staff.length - VISIBLE}
              </span>
              <p className="mt-2 text-xs text-neutral-400">altri</p>
            </li>
          )}
        </ul>
      )}
    </AdminCard>
  )
}

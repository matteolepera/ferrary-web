import { useState, type ComponentProps } from 'react'
import { AdminField } from './AdminField'

type PasswordFieldProps = Omit<
  ComponentProps<typeof AdminField>,
  'type' | 'trailing'
>

/**
 * Campo password con il pulsante per mostrarla o nasconderla: utile soprattutto da telefono.
 */
export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <AdminField
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          aria-label="Mostra la password"
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
          className="flex rounded-full p-1 text-neutral-500 transition-colors hover:text-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {visible ? (
              <path d="M3 3l18 18M10.6 6.1A9.6 9.6 0 0 1 12 6c5.5 0 9 6 9 6a15 15 0 0 1-3 3.6M6.5 6.6C4.4 8 3 12 3 12s3.5 6 9 6c1.5 0 2.8-.4 4-1" />
            ) : (
              <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            )}
          </svg>
        </button>
      }
    />
  )
}

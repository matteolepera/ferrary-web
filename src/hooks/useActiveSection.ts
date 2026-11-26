import { useEffect, useState } from 'react'

/**
 * La sezione che si sta leggendo, tra quelle con questi id (gli id dei loro titoli):
 * l'ultima il cui titolo è salito oltre un terzo dello schermo. In fondo alla pagina,
 * dove le ultime sezioni non salgono abbastanza, vale l'ultima.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  // Una stringa al posto dell'array: l'effetto riparte solo se cambiano davvero gli id
  const key = ids.join(',')

  useEffect(() => {
    const list = key.split(',')
    let frame = 0

    function update() {
      frame = 0
      const line = window.innerHeight / 3
      let current = list[0]

      for (const id of list) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= line) {
          current = id
        }
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      setActive(atBottom ? list[list.length - 1] : current)
    }

    // Un calcolo per fotogramma al massimo, anche se lo scorrimento manda tanti eventi
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [key])

  return active
}

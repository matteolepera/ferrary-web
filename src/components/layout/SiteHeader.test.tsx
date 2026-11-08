import { fireEvent, screen, within, act, waitFor } from '@testing-library/react'
import { renderRoute } from '@/test/utils'

const mainNav = () => within(screen.getByRole('navigation', { name: 'Principale' }))

test('segna la pagina attiva nella pillola', async () => {
    renderRoute('/modelli')

    expect(await mainNav().findByRole('link', { name: 'Archivio' })).toHaveAttribute('aria-current', 'page')
    expect(mainNav().getByRole('link', { name: 'La storia' })).not.toHaveAttribute('aria-current')
})

test('apre il menu dei cataloghi, e lo chiude con Esc', () => {
    renderRoute('/modelli')

    const toggle = mainNav().getByRole('button', { name: 'Cataloghi' })
    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(mainNav().getByRole('link', { name: 'Motori' })).toHaveAttribute('href', '/motori')
    expect(mainNav().getByRole('link', { name: 'Piloti' })).toHaveAttribute('href', '/piloti')

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

test('accende "Famiglie" quando la sezione arriva al centro dello schermo', async () => {
    // jsdom non ha IntersectionObserver: ne usiamo uno finto, e lo facciamo scattare noi
    const callbacks: IntersectionObserverCallback[] = []
    vi.stubGlobal(
        'IntersectionObserver',
        class {
            constructor(callback: IntersectionObserverCallback) {
                callbacks.push(callback)
            }
            observe() { }
            disconnect() { }
        },
    )

    renderRoute('/')
    await waitFor(() => expect(callbacks.length).toBeGreaterThan(0))

    const families = mainNav().getByRole('link', { name: 'Famiglie' })
    expect(families).not.toHaveAttribute('aria-current')

    act(() => {
        callbacks.at(-1)?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
    })

    expect(families).toHaveAttribute('aria-current', 'true')
    vi.unstubAllGlobals()
})
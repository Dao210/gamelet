import { act, fireEvent, render, screen } from '@testing-library/react'
import PulsefrontGame from '@/components/pulsefront/PulsefrontGame'
import messages from '@/messages/en.json'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, values: Record<string, string | number> = {}) => {
    let result: unknown = messages.pulsefront
    for (const part of key.split('.')) result = (result as Record<string, unknown>)[part]
    return String(result).replace(/\{(\w+)\}/g, (_, name: string) => String(values[name] ?? name))
  }
}))
jest.mock('@/i18n/routing', () => ({ Link: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a> }))

describe('Pulsefront controls', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => window.setTimeout(() => callback(performance.now()), 16))
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => window.clearTimeout(id))
    localStorage.clear()
    Element.prototype.scrollTo = jest.fn()
    Element.prototype.scrollIntoView = jest.fn()
  })
  afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers() })

  it('waits for start, dispatches from keyboard-selected ratios, and pauses on blur', () => {
    render(<PulsefrontGame />)
    expect(screen.getByTestId('core-7')).toBeDisabled()
    act(() => { jest.advanceTimersByTime(2000) })
    expect(screen.getByTestId('battle-clock')).toHaveTextContent('00:00')
    fireEvent.click(screen.getByRole('button', { name: 'Launch mission ↗' }))
    fireEvent.keyDown(window, { key: '1' })
    expect(screen.getByRole('button', { name: '25%' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByTestId('core-7'))
    expect(screen.getByRole('status')).toHaveTextContent('8 energy ready')
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.getByTestId('core-7')).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(screen.getByTestId('core-7'))
    fireEvent.click(screen.getByTestId('core-1'))
    expect(screen.getByRole('status')).toHaveTextContent('Fleet dispatched')
    expect(screen.getByTestId('core-7')).toHaveTextContent('26')
    act(() => { jest.advanceTimersByTime(1100) })
    expect(screen.getByTestId('battle-clock')).toHaveTextContent('00:01')
    fireEvent.blur(window)
    const clock = screen.getByTestId('battle-clock').textContent
    act(() => { jest.advanceTimersByTime(4000) })
    expect(screen.getByTestId('battle-clock').textContent).toBe(clock)
    expect(screen.getByRole('heading', { name: 'Hold position.' })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'p' })
    expect(screen.queryByRole('heading', { name: 'Hold position.' })).not.toBeInTheDocument()
  })

  it('configures the large map, zooms, and resets without leaking a running clock', () => {
    render(<PulsefrontGame />)
    fireEvent.click(screen.getByRole('button', { name: 'Expanse' }))
    expect(screen.getAllByTestId(/^core-/)).toHaveLength(61)
    fireEvent.change(screen.getByLabelText('AI difficulty'), { target: { value: 'cadet' } })
    fireEvent.click(screen.getByRole('button', { name: 'Launch mission ↗' }))
    fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(screen.getByTestId('pulsefront-board')).toHaveStyle({ width: '150%' })
    expect(screen.getByLabelText('Sector')).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: '↶ Reset & choose a sector' }))
    expect(screen.getByLabelText('Sector')).toBeEnabled()
    expect(screen.getByTestId('battle-clock')).toHaveTextContent('00:00')
    expect(screen.getByTestId('pulsefront-board')).toHaveStyle({ width: '100%' })
  })

  it('resumes from help with P without leaving an overlay over a live battle', () => {
    render(<PulsefrontGame />)
    fireEvent.click(screen.getByRole('button', { name: 'Launch mission ↗' }))
    fireEvent.click(screen.getByRole('button', { name: 'Flight instructions ↗' }))
    expect(screen.getByRole('heading', { name: 'Flight instructions' })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'p' })
    expect(screen.queryByRole('heading', { name: 'Flight instructions' })).not.toBeInTheDocument()
    expect(screen.getByTestId('core-7')).toBeEnabled()
  })
})

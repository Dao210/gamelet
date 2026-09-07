import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import PatchesGame from '@/components/patches/PatchesGame'
import { starter } from '@/lib/patches/levels/starter-easy'
import { newProgress, STORAGE_KEY } from '@/lib/patches/progress'
import messages from '@/messages/en.json'

jest.mock('next-intl', () => {
  const translate = (key: string, values: Record<string, string | number> = {}) => {
    let result: unknown = messages.patches
    for (const part of key.split('.')) result = (result as Record<string, unknown>)[part]
    return String(result).replace(/\{(\w+)\}/g, (_, name: string) => String(values[name] ?? name))
  }
  return { useTranslations: () => translate }
})
jest.mock('@/i18n/routing', () => ({ Link: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a> }))
jest.mock('@/lib/analytics', () => ({ trackGameEvent: jest.fn() }))
const draw = (a: number, b: number) => { fireEvent.click(screen.getByTestId(`patch-cell-${a}`)); fireEvent.click(screen.getByTestId(`patch-cell-${b}`)) }
const boot = async () => { const view = render(<PatchesGame initialPuzzle={starter} />); await waitFor(() => expect(screen.getByTestId('patch-cell-0')).toBeEnabled()); return view }

describe('Patches play and local recovery', () => {
  beforeEach(() => { localStorage.clear(); window.history.replaceState({}, '', '/en/patches') })
  afterEach(() => jest.restoreAllMocks())
  it('places using two corners, reports invalid area, removes a patch and supports history', async () => {
    await boot()
    draw(6, 6)
    expect(screen.getByText(messages.patches.errors.area)).toBeInTheDocument()
    draw(0, 7)
    const undo = screen.getByRole('button', { name: messages.patches.undo })
    expect(undo).toBeEnabled()
    fireEvent.click(undo)
    expect(undo).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: messages.patches.redo }))
    expect(undo).toBeEnabled()
    fireEvent.click(screen.getByTestId('patch-cell-0'))
    expect(screen.getByText(messages.patches.removed)).toBeInTheDocument()
  })
  it('finishes a complete board and persists one independent result', async () => {
    await boot()
    for (const r of starter.solution) draw(r[0] * 5 + r[1], r[2] * 5 + r[3])
    await waitFor(() => expect(screen.getByRole('heading', { name: messages.patches.won })).toBeInTheDocument())
    const p = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(p.completed[starter.id].hints).toBe(0)
    expect(p.current.rects).toHaveLength(6)
    expect(screen.getByTestId('patch-cell-0')).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: messages.patches.replay }))
    await waitFor(() => expect(screen.getByTestId('patch-cell-0')).toBeEnabled())
    expect(screen.getByTestId('patches-clock')).toHaveTextContent('00:00')
    expect(screen.getByRole('button', { name: messages.patches.undo })).toBeDisabled()
  })
  it('keeps hint application explicit and marks the saved game assisted', async () => {
    const view = await boot()
    fireEvent.click(screen.getByRole('button', { name: messages.patches.hint }))
    expect(screen.queryByRole('button', { name: messages.patches.placeHint })).not.toBeInTheDocument()
    expect(view.container.querySelector('.highlight')).toHaveStyle({ width: '20%', height: '20%' })
    fireEvent.click(screen.getByRole('button', { name: messages.patches.explain }))
    fireEvent.click(screen.getByRole('button', { name: messages.patches.placeHint }))
    await waitFor(() => expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).current.hints).toBe(1))
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).current.rects).toEqual([starter.solution[3]])
  })
  it('restores paused progress and stops edits during another-tab conflict', async () => {
    const current = { id: starter.id, version: 1, rects: [starter.solution[0]], seconds: 42, hints: 0, mode: 'practice', day: null }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...newProgress(), current }))
    window.history.replaceState({}, '', `/en/patches#p=${starter.id}`)
    render(<PatchesGame initialPuzzle={starter} />)
    await waitFor(() => expect(screen.getByText(messages.patches.restored)).toBeInTheDocument())
    expect(screen.getByTestId('patches-clock')).toHaveTextContent('00:42')
    expect(screen.getByTestId('patch-cell-0')).toBeDisabled()
    fireEvent.click(screen.getAllByRole('button', { name: messages.patches.resume })[0])
    expect(screen.getByTestId('patch-cell-0')).toBeEnabled()
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: JSON.stringify({ ...newProgress(), current, updatedAt: Date.now() + 1000 }) })))
    expect(screen.getByRole('alert')).toHaveTextContent(messages.patches.tabConflict)
    expect(screen.getByRole('button', { name: messages.patches.hint })).toBeDisabled()
    expect(screen.getByTestId('patch-cell-0')).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: messages.patches.keepThis }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
  it('navigates cells with arrows and keeps undo shortcuts inside the board', async () => {
    await boot()
    const cell = screen.getByTestId('patch-cell-0')
    act(() => cell.focus())
    fireEvent.keyDown(cell, { key: 'ArrowRight' })
    expect(screen.getByTestId('patch-cell-1')).toHaveFocus()
    draw(0, 7)
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true })
    expect(screen.getByRole('button', { name: messages.patches.undo })).toBeEnabled()
    fireEvent.keyDown(cell, { key: 'z', ctrlKey: true })
    expect(screen.getByRole('button', { name: messages.patches.undo })).toBeDisabled()
  })
  it('opens the learning path and loads a stable shared puzzle', async () => {
    window.history.replaceState({}, '', '/en/patches#p=patches-medium-0051')
    render(<PatchesGame initialPuzzle={starter} />)
    await waitFor(() => expect(screen.getByRole('grid')).toHaveAttribute('aria-rowcount', '6'))
    fireEvent.click(screen.getByRole('button', { name: messages.patches.modes.learn }))
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(72))
    expect(screen.getByRole('grid')).toHaveAttribute('aria-rowcount', '3')
  })
  it('continues playing when browser storage is unavailable', async () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Quota exceeded', 'QuotaExceededError') })
    await boot()
    draw(0, 7)
    await waitFor(() => expect(screen.getByText(messages.patches.storageUnavailable)).toBeInTheDocument())
    expect(screen.getByTestId('patch-cell-3')).toBeEnabled()
    expect(screen.getByRole('button', { name: messages.patches.undo })).toBeEnabled()
  })
  it('shows an unknown-link message while leaving the starter playable', async () => {
    window.history.replaceState({}, '', '/en/patches#p=not-a-puzzle')
    await boot()
    expect(screen.getByText(messages.patches.unknownPuzzle)).toBeInTheDocument()
    draw(0, 7)
    expect(screen.getByRole('button', { name: messages.patches.undo })).toBeEnabled()
  })
  it('starts time on play and excludes time spent paused', async () => {
    jest.useFakeTimers()
    try {
      const view = await boot()
      act(() => { jest.advanceTimersByTime(2000) })
      expect(screen.getByTestId('patches-clock')).toHaveTextContent('00:00')
      draw(0, 7)
      act(() => { jest.advanceTimersByTime(1500) })
      expect(screen.getByTestId('patches-clock')).toHaveTextContent('00:01')
      fireEvent.click(screen.getByRole('button', { name: messages.patches.pause }))
      act(() => { jest.advanceTimersByTime(5000) })
      expect(screen.getByTestId('patches-clock')).toHaveTextContent('00:01')
      fireEvent.click(screen.getAllByRole('button', { name: messages.patches.resume })[0])
      act(() => { jest.advanceTimersByTime(1000) })
      expect(screen.getByTestId('patches-clock')).toHaveTextContent('00:02')
      view.unmount()
    } finally { jest.useRealTimers() }
  })

})

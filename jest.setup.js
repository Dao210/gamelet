import '@testing-library/jest-dom'

const mockReact = require('react')

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock framer-motion without leaking motion-only props to DOM nodes.
const mockMotionProps = new Set([
  'animate',
  'exit',
  'initial',
  'layout',
  'layoutId',
  'transition',
  'variants',
  'viewport',
  'whileHover',
  'whileInView',
  'whileTap'
])

const mockMotionComponentCache = new Map()

const mockCreateMotionComponent = (tag) => {
  if (mockMotionComponentCache.has(tag)) {
    return mockMotionComponentCache.get(tag)
  }

  const MotionComponent = ({ children, ...props }) => {
    const domProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !mockMotionProps.has(key))
    )
    return mockReact.createElement(tag, domProps, children)
  }
  MotionComponent.displayName = `MockMotion.${tag}`
  mockMotionComponentCache.set(tag, MotionComponent)
  return MotionComponent
}

jest.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, tag) => mockCreateMotionComponent(tag)
  }),
  AnimatePresence: ({ children }) => children,
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

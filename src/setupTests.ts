// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// Mock window.matchMedia for AG Grid
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver for AG Grid
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;
global.ResizeObserver.prototype.observe = jest.fn();
global.ResizeObserver.prototype.unobserve = jest.fn();
global.ResizeObserver.prototype.disconnect = jest.fn();

// Minimal fetch polyfill for environments without fetch (tests may override per-file)
if (typeof global.fetch === 'undefined') {
  // @ts-ignore
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
  // @ts-ignore
  globalThis.fetch = global.fetch;
  // @ts-ignore
  window.fetch = global.fetch;
}
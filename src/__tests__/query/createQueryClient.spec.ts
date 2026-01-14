const { createQueryClient } = require('samplebundle/tanstackquery');

describe('createQueryClient (consumer tests)', () => {
  test('creates a QueryClient with defaults', () => {
    const qc = createQueryClient();
    expect(qc).toBeDefined();
    // defaultOptions should exist
    // @ts-ignore
    expect(qc.defaultOptions).toBeDefined();
  });

  test('merges custom configuration', () => {
    const qc = createQueryClient({ defaultOptions: { queries: { staleTime: 12345 } } });
    expect(qc.defaultOptions?.queries?.staleTime).toBe(12345);
  });

  test('default refetchOnWindowFocus is false', () => {
    const qc = createQueryClient();
    // @ts-ignore
    expect(qc.defaultOptions?.queries?.refetchOnWindowFocus).toBe(false);
  });

  test('retry function avoids retrying 4xx errors', () => {
    const qc = createQueryClient();
    const fn = qc.defaultOptions?.queries?.retry;
    expect(typeof fn).toBe('function');
    // simulate 404 error
    expect(fn(0, { status: 404 })).toBe(false);
    // simulate network error
    expect(fn(0, {})).toBe(true);
  });

  test('staleTime default is reasonable (>0)', () => {
    const qc = createQueryClient();
    expect((qc.defaultOptions?.queries?.staleTime || 0)).toBeGreaterThan(0);
  });
});
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { createQueryClient } from 'samplebundle/tanstackquery';

/**
 * Focused CRUD + Search tests using the reusable tanstack query setup.
 * All network interactions use global.fetch mocks and the library's fetchJson
 * so we exercise the shared code-paths consumers will use.
 */

describe('Product CRUD + Search using useAppQuery / useMutation', () => {
  type Product = { id: number; title: string; category?: string };
  const initialProducts: Product[] = [
    { id: 1, title: 'Blue Shirt', category: 'clothing' },
    { id: 2, title: 'Red Shirt', category: 'clothing' },
    { id: 3, title: 'Smartphone', category: 'electronics' }
  ];

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  test('READ: fetches and returns product list', async () => {
    // GET /products
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => initialProducts });

    const lib = require('samplebundle/tanstackquery');
    const qc = createQueryClient();

    function Reader() {
      const { data } = lib.useAppQuery(['products'], () => lib.fetchJson('https://fakestoreapi.com/products'));
      return <div>{data ? (data as Product[]).map((p: Product) => p.title).join(',') : 'loading'}</div>;
    }

    render(<lib.QueryClientProvider client={qc}><Reader /></lib.QueryClientProvider>);

    await waitFor(() => expect(screen.getByText(/Blue Shirt/)).toBeInTheDocument());
  });

  test('SEARCH: returns filtered results by title (case-insensitive)', async () => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => initialProducts });

    const lib = require('samplebundle/tanstackquery');
    const qc = createQueryClient();

    function Searcher({ q }: { q: string }) {
      const { data } = lib.useAppQuery(['products', q], async () => {
        const all = await lib.fetchJson('https://fakestoreapi.com/products');
        if (!q) return all;
        return (all as Product[]).filter((p: Product) => p.title.toLowerCase().includes(q.toLowerCase()));
      });
      return <div>{data ? (data as Product[]).map((d: Product) => d.title).join(',') : 'loading'}</div>;
    }

    const { rerender } = render(
      <lib.QueryClientProvider client={qc}>
        <Searcher q="" />
      </lib.QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText(/Blue Shirt/)).toBeInTheDocument());

    rerender(
      <lib.QueryClientProvider client={qc}>
        <Searcher q="phone" />
      </lib.QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText(/Smartphone/)).toBeInTheDocument());
  });

  test('SEARCH: returns empty results when none match', async () => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => initialProducts });

    const lib = require('samplebundle/tanstackquery');
    const qc = createQueryClient();

    function Searcher({ q }: { q: string }) {
      const { data } = lib.useAppQuery(['products', q], async () => {
        const all = await lib.fetchJson('https://fakestoreapi.com/products');
        if (!q) return all;
        return (all as Product[]).filter((p: Product) => p.title.toLowerCase().includes(q.toLowerCase()));
      });
      return <div>{data ? (data as Product[]).length : -1}</div>;
    }

    render(
      <lib.QueryClientProvider client={qc}>
        <Searcher q="nothing" />
      </lib.QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText('0')).toBeInTheDocument());
  });

  test('CREATE: POST adds a product and list is refetched to include it', async () => {
    const created = { id: 4, title: 'Coffee Mug', category: 'kitchen' };
    // initial GET
    let calls = 0;
    // GET returns initialProducts first, then after create returns [...initial, created]
    global.fetch = jest.fn().mockImplementation((url, init) => {
      const method = init?.method ?? 'GET';
      if (method === 'GET') {
        calls += 1;
        if (calls === 1) return Promise.resolve({ ok: true, json: async () => initialProducts });
        return Promise.resolve({ ok: true, json: async () => [...initialProducts, created] });
      }
      // POST
      if (method === 'POST') return Promise.resolve({ ok: true, json: async () => created });
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    const lib = require('samplebundle/tanstackquery');
    const qc = createQueryClient();

    function Cmp() {
      const { data } = lib.useAppQuery(['products'], () => lib.fetchJson('https://fakestoreapi.com/products'));
      return (
        <div>
          <div>{data ? data.length : 'loading'}</div>
          <button
            onClick={async () => {
              await lib.fetchJson('https://fakestoreapi.com/products', { method: 'POST', body: JSON.stringify({ title: 'Coffee Mug' }) });
              qc.invalidateQueries({ queryKey: ['products'] });
            }}
          >
            create
          </button>
        </div>
      );
    }

    render(
      <lib.QueryClientProvider client={qc}>
        <Cmp />
      </lib.QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText('3')).toBeInTheDocument());

    fireEvent.click(screen.getByText('create'));

    await waitFor(() => expect(screen.getByText('4')).toBeInTheDocument());
  });

  test('UPDATE: PUT updates a product and list reflects change', async () => {
    const updated = { id: 1, title: 'Blue Shirt - Updated', category: 'clothing' };
    // initial GET
    let calls = 0;
    // first GET returns initialProducts, second GET returns products with updated first item
    global.fetch = jest.fn().mockImplementation((url, init) => {
      const method = init?.method ?? 'GET';
      if (method === 'GET') {
        calls += 1;
        if (calls === 1) return Promise.resolve({ ok: true, json: async () => initialProducts });
        return Promise.resolve({ ok: true, json: async () => [updated, initialProducts[1], initialProducts[2]] });
      }
      // PUT
      if (method === 'PUT') return Promise.resolve({ ok: true, json: async () => updated });
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    const lib = require('samplebundle/tanstackquery');
    const qc = createQueryClient();

    function Cmp() {
      const { data } = lib.useAppQuery(['products'], () => lib.fetchJson('https://fakestoreapi.com/products'));
      return (
        <div>
          <div>{data ? (data as Product[])[0].title : 'loading'}</div>
          <button
            onClick={async () => {
              await lib.fetchJson(`https://fakestoreapi.com/products/1`, { method: 'PUT', body: JSON.stringify({ id: 1, title: 'Blue Shirt - Updated' }) });
              qc.invalidateQueries({ queryKey: ['products'] });
            }}
          >
            update
          </button>
        </div>
      );
    }

    render(
      <lib.QueryClientProvider client={qc}>
        <Cmp />
      </lib.QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText('Blue Shirt')).toBeInTheDocument());

    fireEvent.click(screen.getByText('update'));

    await waitFor(() => expect(screen.getByText('Blue Shirt - Updated')).toBeInTheDocument());
  });

  test('DELETE: DELETE removes a product from the list after refetch', async () => {
    // initial GET returns 3 items, after delete returns 2 items (without id=2)
    let calls = 0;
    global.fetch = jest.fn().mockImplementation((url, init) => {
      const method = init?.method ?? 'GET';
      if (method === 'GET') {
        calls += 1;
        if (calls === 1) return Promise.resolve({ ok: true, json: async () => initialProducts });
        return Promise.resolve({ ok: true, json: async () => initialProducts.filter((p) => p.id !== 2) });
      }
      // DELETE
      if (method === 'DELETE') return Promise.resolve({ ok: true, json: async () => ({}) });
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    const lib = require('samplebundle/tanstackquery');
    const qc = createQueryClient();

    function Cmp() {
      const { data } = lib.useAppQuery(['products'], () => lib.fetchJson('https://fakestoreapi.com/products'));
      return (
        <div>
          <div>{data ? data.length : 'loading'}</div>
          <button
            onClick={async () => {
              await lib.fetchJson(`https://fakestoreapi.com/products/2`, { method: 'DELETE' });
              qc.invalidateQueries({ queryKey: ['products'] });
            }}
          >
            delete
          </button>
        </div>
      );
    }

    render(
      <lib.QueryClientProvider client={qc}>
        <Cmp />
      </lib.QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText('3')).toBeInTheDocument());

    fireEvent.click(screen.getByText('delete'));

    await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument());
  });

  test('CREATE error triggers onError', async () => {
    const err = new Error('create failed');
    global.fetch = jest.fn().mockImplementation((url, init) => {
      if (init && init.method === 'POST') return Promise.resolve({ ok: false, status: 500, json: async () => ({ message: 'fail' }) });
      return Promise.resolve({ ok: true, json: async () => initialProducts });
    });

    const lib = require('samplebundle/tanstackquery');
    const qc = createQueryClient();

    const onError = jest.fn();

    function Cmp() {
      return (
        <button
          onClick={async () => {
            try {
              await lib.fetchJson('https://fakestoreapi.com/products', { method: 'POST', body: JSON.stringify({ title: 'X' }) });
            } catch (e) {
              onError(e);
            }
          }}
        >
          create
        </button>
      );
    }

    render(
      <lib.QueryClientProvider client={qc}>
        <Cmp />
      </lib.QueryClientProvider>
    );

    fireEvent.click(screen.getByText('create'));

    await waitFor(() => expect(onError).toHaveBeenCalled());
  });

  test('DEDUP: concurrent readers with same key perform a single network call', async () => {
    const fakeProducts = [{ id: 1 }];
    const network = jest.fn().mockResolvedValue({ ok: true, json: async () => fakeProducts });
    // @ts-ignore
    global.fetch = network;

    const lib = require('samplebundle/tanstackquery');
    const qc = createQueryClient();

    function Reader() {
      const { data } = lib.useAppQuery(['products'], () => lib.fetchJson('https://fakestoreapi.com/products'));
      return <div>{data ? 'ok' : 'loading'}</div>;
    }

    render(
      <lib.QueryClientProvider client={qc}>
        <Reader />
        <Reader />
      </lib.QueryClientProvider>
    );

    await waitFor(() => expect(network).toHaveBeenCalledTimes(1));
  });

  test('STALENESS: staleTime prevents immediate refetch on a second subscriber', async () => {
    const fakeProducts = [{ id: 1 }];
    // @ts-ignore
    const network = jest.fn().mockResolvedValue({ ok: true, json: async () => fakeProducts });
    // @ts-ignore
    global.fetch = network;

    const lib = require('samplebundle/tanstackquery');
    const qc = createQueryClient();

    function Reader({ tag }: { tag: string }) {
      const { data } = lib.useAppQuery(['products'], () => lib.fetchJson('https://fakestoreapi.com/products'), { staleTime: 100000 });
      return <div>{data ? tag : 'loading'}</div>;
    }

    const { rerender } = render(
      <lib.QueryClientProvider client={qc}>
        <Reader tag="A" />
      </lib.QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByText('A')).toBeInTheDocument());

    rerender(
      <lib.QueryClientProvider client={qc}>
        <Reader tag="B" />
      </lib.QueryClientProvider>
    );

    // still only one network call because of staleness
    await waitFor(() => expect(network).toHaveBeenCalledTimes(1));
  });
});
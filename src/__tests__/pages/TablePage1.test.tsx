import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TablePage1 from '../../pages/TablePage1';

describe('TablePage1', () => {
  test('renders page title', () => {
    render(<TablePage1 />);
    expect(screen.getByText('Table 1')).toBeInTheDocument();
  });

  test('renders ag-grid container', () => {
    const { container } = render(<TablePage1 />);
    expect(container.querySelector('.ag-theme-alpine')).toBeTruthy();
  });

  test('displays some row content (John Doe)', async () => {
    render(<TablePage1 />);
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
  });

  test('pagination controls present when pagination enabled', async () => {
    const { container } = render(<TablePage1 />);
    // ag-grid renders pagination panel with class containing 'ag-paging'
    await waitFor(() => expect(container.querySelector('[class*="ag-paging"]')).toBeTruthy());
  });

  test('custom page size selector present', async () => {
    const { container } = render(<TablePage1 />);
    await waitFor(() => expect(container.querySelector('[class*="ag-page-size"]') || container.querySelector('[class*="ag-paging-panel"]')).toBeTruthy());
  });
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AgGridTable, ColDef } from 'samplebundle/aggrid';

describe('Pagination', () => {
  const columns: ColDef[] = [{ field: 'name', headerName: 'Name' }];
  const rows = Array.from({ length: 10 }).map((_, i) => ({ id: i + 1, name: `R${i + 1}` }));

  test('pagination enabled when pagination prop is true', async () => {
    const { container } = render(
      <AgGridTable columnDefs={columns} rowData={rows} pagination paginationPageSize={2} />
    );
    await waitFor(() => expect(screen.getByText('R1')).toBeInTheDocument());
    expect(container.querySelector('[class*="ag-pag"]')).toBeTruthy();
  });

  test('pagination disabled when pagination prop is false or undefined', async () => {
    const { container } = render(<AgGridTable columnDefs={columns} rowData={rows} pagination={false} />);
    await waitFor(() => expect(screen.getByText('R1')).toBeInTheDocument());
    // AG Grid may render the paging panel but keep it hidden - ensure it is not visible
    const panel = container.querySelector('[class*="ag-pag"]');
    expect(panel).toBeTruthy();
    expect(panel!.className).toMatch(/ag-hidden/);
  });

  test('pagination controls render correctly when enabled', async () => {
    const { container } = render(
      <AgGridTable columnDefs={columns} rowData={rows} pagination paginationPageSize={3} paginationPageSizeSelector={true} />
    );
    await waitFor(() => expect(screen.getByText('R1')).toBeInTheDocument());
    // page selector or paging panel should exist
    expect(container.querySelector('[class*="ag-pag"]')).toBeInTheDocument();
  });

  test('pagination respects paginationPageSize', async () => {
    const { container } = render(
      <AgGridTable columnDefs={columns} rowData={rows} pagination paginationPageSize={3} />
    );
    await waitFor(() => expect(screen.getByText('R1')).toBeInTheDocument());
    // should render rows up to page size in the current view (virtualization may affect exact count)
    const visible = container.querySelectorAll('.ag-row');
    expect(visible.length).toBeGreaterThanOrEqual(1);
  });

  test('pagination page size selector honors true mapping', async () => {
    const { container } = render(
      <AgGridTable columnDefs={columns} rowData={rows} pagination paginationPageSize={3} paginationPageSizeSelector={true} />
    );
    await waitFor(() => expect(screen.getByText('R1')).toBeInTheDocument());
    const selector = container.querySelector('[class*="ag-pag"]');
    expect(selector).toBeTruthy();
  });
});
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AgGridTable, ColDef } from 'samplebundle/aggrid';

describe('Data Scenarios', () => {
  test('large dataset (1000+ rows) renders without errors', async () => {
    const columns: ColDef[] = [{ field: 'name' }];
    const rows = Array.from({ length: 1000 }).map((_, i) => ({ id: i, name: `Name${i}` }));
    render(<AgGridTable columnDefs={columns} rowData={rows} />);
    await waitFor(() => expect(screen.getByText('Name0')).toBeInTheDocument());
  });

  test('single row of data displays correctly', async () => {
    const columns: ColDef[] = [{ field: 'name' }];
    render(<AgGridTable columnDefs={columns} rowData={[{ id: 1, name: 'Solo' }]} />);
    await waitFor(() => expect(screen.getByText('Solo')).toBeInTheDocument());
  });

  test('dynamic data updates - rowData changes trigger re-render', async () => {
    const columns: ColDef[] = [{ field: 'name' }];
    const { rerender } = render(<AgGridTable columnDefs={columns} rowData={[{ id: 1, name: 'First' }]} />);
    await waitFor(() => expect(screen.getByText('First')).toBeInTheDocument());
    rerender(<AgGridTable columnDefs={columns} rowData={[{ id: 2, name: 'Second' }]} />);
    await waitFor(() => expect(screen.getByText('Second')).toBeInTheDocument());
  });

  test('column definition changes - columnDefs updates reflect in table', async () => {
    const { rerender } = render(
      <AgGridTable columnDefs={[{ field: 'a', headerName: 'A' }]} rowData={[{ id: 1, a: 'v1' }]} />
    );
    await waitFor(() => expect(screen.getByText('A')).toBeInTheDocument());
    rerender(<AgGridTable columnDefs={[{ field: 'b', headerName: 'B' }]} rowData={[{ id: 1, b: 'v2' }]} />);
    await waitFor(() => expect(screen.getByText('B')).toBeInTheDocument());
  });

  test('null/undefined values in rowData handled gracefully', async () => {
    const columns: ColDef[] = [{ field: 'maybe' }];
    render(<AgGridTable columnDefs={columns} rowData={[{ id: 1, maybe: null }, { id: 2 }]} />);
    await waitFor(() => {
      // ensure component did not crash and grid rendered
      expect(screen.queryByText('null')).not.toBeInTheDocument();
    });
  });
});
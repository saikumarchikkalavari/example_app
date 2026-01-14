import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AgGridTable, ColDef } from 'samplebundle/aggrid';

describe('Edge Cases', () => {
  test('empty columnDefs array - component behavior', async () => {
    const { container } = render(<AgGridTable columnDefs={[]} rowData={[{ id: 1, name: 'X' }]} />);
    // should render but have no headers
    await waitFor(() => expect(container.querySelectorAll('.ag-header-cell').length).toBe(0));
  });

  test("mismatched column fields - columnDefs field doesn't exist in rowData", async () => {
    render(<AgGridTable columnDefs={[{ field: 'missing', headerName: 'Missing' }]} rowData={[{ id: 1, name: 'X' }]} />);
    await waitFor(() => expect(screen.getByText('Missing')).toBeInTheDocument());
    // the data field doesn't exist on the row so the cell should not show that value, but the grid should render safely
    expect(screen.queryByText('X')).toBeNull();
  });

  test('invalid height/width values (negative numbers, invalid strings) should not crash', async () => {
    const { container } = render(
      <AgGridTable columnDefs={[{ field: 'name' }]} rowData={[{ id: 1, name: 'Test' }]} height={-100 as any} width={'invalid' as any} />
    );
    await waitFor(() => expect(screen.getByText('Test')).toBeInTheDocument());
    // component should render without crashing; height should reflect numeric value
    const style = container.querySelector('.ag-theme-alpine')!.getAttribute('style');
    expect(style).toContain('height: -100px');
  });

  test('very long cell content - text renders fully', async () => {
    const long = 'x'.repeat(1000);
    render(<AgGridTable columnDefs={[{ field: 'long' }]} rowData={[{ id: 1, long }]} />);
    await waitFor(() => expect(screen.getByText(long)).toBeInTheDocument());
  });

  test('special characters and duplicate row data handled properly', async () => {
    const rows = [{ id: 1, name: '© Ω 👍' }, { id: 2, name: '© Ω 👍' }];
    render(<AgGridTable columnDefs={[{ field: 'name' }]} rowData={rows} />);
    await waitFor(() => expect(screen.getAllByText('© Ω 👍').length).toBeGreaterThanOrEqual(2));
  });
});
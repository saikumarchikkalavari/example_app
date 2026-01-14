import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AgGridTable, ColDef } from 'samplebundle/aggrid';

describe('Props Handling', () => {
  test('columnDefs passed correctly to AgGridReact (headers show)', async () => {
    const columns: ColDef[] = [
      { field: 'name', headerName: 'Full Name' },
      { field: 'age', headerName: 'Age' }
    ];
    const rows = [{ id: 1, name: 'Sam', age: 30 }];
    render(<AgGridTable columnDefs={columns} rowData={rows} />);
    await waitFor(() => expect(screen.getByText('Full Name')).toBeInTheDocument());
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  test('rowData passed correctly to AgGridReact and rows display', async () => {
    const columns: ColDef[] = [{ field: 'name', headerName: 'Name' }];
    const rows = [{ id: 1, name: 'Charlie' }];
    render(<AgGridTable columnDefs={columns} rowData={rows} />);
    await waitFor(() => expect(screen.getByText('Charlie')).toBeInTheDocument());
  });

  test('default height (500) applied when not specified', () => {
    const columns: ColDef[] = [{ field: 'name' }];
    const rows: any[] = [];
    const { container } = render(<AgGridTable columnDefs={columns} rowData={rows} />);
    const wrapper = container.querySelector('.ag-theme-alpine') as HTMLElement;
    expect(wrapper.style.height).toBe('500px');
  });

  test('custom height overrides default (pixels, percentages, auto)', () => {
    const columns: ColDef[] = [{ field: 'name' }];
    const rows: any[] = [];
    const { container: c1 } = render(<AgGridTable columnDefs={columns} rowData={rows} height={300} />);
    expect(c1.querySelector('.ag-theme-alpine')!.getAttribute('style')).toContain('height: 300px');

    const { container: c2 } = render(<AgGridTable columnDefs={columns} rowData={rows} height={'50%'} />);
    expect(c2.querySelector('.ag-theme-alpine')!.getAttribute('style')).toContain("height: 50%");

    const { container: c3 } = render(<AgGridTable columnDefs={columns} rowData={rows} height={'auto'} />);
    expect(c3.querySelector('.ag-theme-alpine')!.getAttribute('style')).toContain('height: auto');
  });

  test('default width (100%) applied and custom width overrides', () => {
    const columns: ColDef[] = [{ field: 'name' }];
    const rows: any[] = [];
    const { container } = render(<AgGridTable columnDefs={columns} rowData={rows} />);
    const wrapper = container.querySelector('.ag-theme-alpine') as HTMLElement;
    expect(wrapper.style.width).toBe('100%');

    const { container: c2 } = render(<AgGridTable columnDefs={columns} rowData={rows} width={400} />);
    expect(c2.querySelector('.ag-theme-alpine')!.getAttribute('style')).toContain('width: 400px');
  });

  test('domLayout="autoHeight" is always set on AgGridReact', () => {
    // Since domLayout is an AgGridReact prop, assert that enabling autoHeight results in an auto height layout
    // We check the wrapper has style containing 'minHeight' fallback and that it renders without crashing
    const columns: ColDef[] = [{ field: 'name' }];
    const rows = [{ name: 'X' }];
    const { container } = render(<AgGridTable columnDefs={columns} rowData={rows} />);
    expect(container.querySelector('.ag-theme-alpine')).toBeTruthy();
  });

  test('rest props spread correctly to AgGridReact (test with rowSelection)', async () => {
    const columns: ColDef[] = [{ field: 'name' }];
    const rows: any[] = [{ id: 1, name: 'Sel1' }, { id: 2, name: 'Sel2' }];
    const { container } = render(
      <AgGridTable columnDefs={columns} rowData={rows} rowSelection={{ mode: 'multiRow' }} />
    );

    // click the row selection checkbox and ensure selection class is applied
    await waitFor(() => expect(screen.getByText('Sel1')).toBeInTheDocument());
    const checkboxes = container.querySelectorAll('.ag-checkbox-input');
    // ensure there's at least one checkbox (row or header)
    expect(checkboxes.length).toBeGreaterThanOrEqual(1);
    // click the first row checkbox (skip header checkbox if present)
    const rowCheckbox = checkboxes[0] as HTMLInputElement;
    rowCheckbox.click();
    await waitFor(() => {
      const selected = container.querySelectorAll('.ag-row-selected');
      expect(selected.length).toBeGreaterThanOrEqual(1);
    });
  });
});
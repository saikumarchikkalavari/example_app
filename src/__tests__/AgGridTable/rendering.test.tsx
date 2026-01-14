import React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import { AgGridTable, ColDef } from 'samplebundle/aggrid';

const columns: ColDef[] = [{ field: 'name', headerName: 'Name' }];
const rows = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

describe('Rendering & Basic Functionality', () => {
  test('component renders successfully with minimum required props', async () => {
    const { container } = render(<AgGridTable columnDefs={columns} rowData={rows} />);
    expect(container.querySelector('.ag-theme-alpine')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
  });

  test('correct theme class applied - "ag-theme-alpine" present in the DOM', () => {
    const { container } = render(<AgGridTable columnDefs={columns} rowData={rows} />);
    expect(container.querySelector('.ag-theme-alpine')).toBeTruthy();
  });

  test('custom className appended correctly alongside the default theme class', () => {
    const { container } = render(<AgGridTable columnDefs={columns} rowData={rows} className="my-table" />);
    const wrapper = container.querySelector('.ag-theme-alpine');
    expect(wrapper).toHaveClass('my-table');
  });

  test('AgGridReact component is rendered as a child', async () => {
    const { container } = render(<AgGridTable columnDefs={columns} rowData={rows} />);
    // ag-grid root elements have class starting with 'ag-'
    expect(container.querySelector('[class*="ag-"]')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Bob')).toBeInTheDocument());
  });

  test('empty state handling - renders correctly when rowData is an empty array', async () => {
    const { container } = render(<AgGridTable columnDefs={columns} rowData={[]} />);
    // should render grid root but zero data rows
    await waitFor(() => {
      const rows = container.querySelectorAll('.ag-row');
      expect(rows.length).toBe(0);
    });
  });
});
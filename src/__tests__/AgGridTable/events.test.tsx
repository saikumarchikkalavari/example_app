import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AgGridTable, ColDef } from 'samplebundle/aggrid';

describe('Event Handling', () => {
  const columns: ColDef[] = [{ field: 'name', headerName: 'Name' }];
  const rows = [{ id: 1, name: 'ClickMe' }, { id: 2, name: 'ClickMeToo' }];

  test('onRowClicked callback triggers when a row is clicked', async () => {
    const onRowClicked = jest.fn();
    const { container } = render(<AgGridTable columnDefs={columns} rowData={rows} onRowClicked={onRowClicked} />);
    await waitFor(() => expect(screen.getByText('ClickMe')).toBeInTheDocument());
    const row = container.querySelector('.ag-row');
    expect(row).toBeTruthy();
    row && fireEvent.click(row as Element);
    await waitFor(() => expect(onRowClicked).toHaveBeenCalled());
  });

  test('event object passed to onRowClicked contains correct row data', async () => {
    const onRowClicked = jest.fn();
    const { container } = render(<AgGridTable columnDefs={columns} rowData={rows} onRowClicked={onRowClicked} />);
    await waitFor(() => expect(screen.getByText('ClickMeToo')).toBeInTheDocument());
    const rowsEl = container.querySelectorAll('.ag-row');
    const target = rowsEl && rowsEl[1];
    expect(target).toBeTruthy();
    target && fireEvent.click(target as Element);
    await waitFor(() => expect(onRowClicked).toHaveBeenCalled());
    const eventArg = onRowClicked.mock.calls[0][0];
    expect(eventArg?.data?.name || eventArg?.node?.data?.name).toBe('ClickMeToo');
  });

  test('multiple row clicks handled correctly', async () => {
    const onRowClicked = jest.fn();
    const { container } = render(<AgGridTable columnDefs={columns} rowData={rows} onRowClicked={onRowClicked} />);
    await waitFor(() => expect(screen.getByText('ClickMe')).toBeInTheDocument());
    const rowsEl = container.querySelectorAll('.ag-row');
    expect(rowsEl.length).toBeGreaterThanOrEqual(2);
    fireEvent.click(rowsEl[0] as Element);
    fireEvent.click(rowsEl[1] as Element);
    await waitFor(() => expect(onRowClicked).toHaveBeenCalledTimes(2));
  });

  test('optional callback - component works when onRowClicked is not provided', async () => {
    render(<AgGridTable columnDefs={columns} rowData={rows} />);
    await waitFor(() => expect(screen.getByText('ClickMe')).toBeInTheDocument());
    expect(() => fireEvent.click(screen.getByText('ClickMe'))).not.toThrow();
  });

  test('onSelectionChanged callback triggers and contains selected rows', async () => {
    const onSelectionChanged = jest.fn();
    const { container } = render(
      <AgGridTable columnDefs={columns} rowData={rows} rowSelection={{ mode: 'multiRow' }} onSelectionChanged={onSelectionChanged} />
    );
    await waitFor(() => expect(screen.getByText('ClickMe')).toBeInTheDocument());
    // click the row selection checkbox to trigger selection
    const checkboxes = container.querySelectorAll('.ag-checkbox-input');
    expect(checkboxes.length).toBeGreaterThanOrEqual(1);
    const firstRowCheckbox = checkboxes[0] as HTMLInputElement;
    fireEvent.click(firstRowCheckbox);
    await waitFor(() => expect(onSelectionChanged).toHaveBeenCalled());
    const arg = onSelectionChanged.mock.calls[0][0];
    expect(arg).toBeDefined();
  });
});
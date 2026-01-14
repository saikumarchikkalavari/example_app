import React from 'react';
import { AgGridTable, ColDef } from 'samplebundle/aggrid';

const columnDefs: ColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'age', headerName: 'Age', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 }
];

const rowData = [
  { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com' },
  { id: 4, name: 'Alice Brown', age: 28, email: 'alice@example.com' },
  { id: 5, name: 'Charlie Green', age: 31, email: 'charlie@example.com' },
  { id: 6, name: 'Diana Prince', age: 27, email: 'diana@example.com' },
  { id: 7, name: 'Ethan Hunt', age: 40, email: 'ethan@example.com' },
  { id: 8, name: 'Fiona Glenanne', age: 33, email: 'fiona@example.com' },
  { id: 9, name: 'George King', age: 29, email: 'george@example.com' },
  { id: 10, name: 'Hannah Scott', age: 26, email: 'hannah@example.com' },
  { id: 11, name: 'Ian Wright', age: 45, email: 'ian@example.com' },
  { id: 12, name: 'Julia Roberts', age: 52, email: 'julia@example.com' }
];

export default function TablePage1() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Table 1</h2>
      <AgGridTable columnDefs={columnDefs} rowData={rowData} pagination={true} paginationPageSize={5} paginationPageSizeSelector={true} />
    </div>
  );
} 

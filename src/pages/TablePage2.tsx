import React from 'react';
import { AgGridTable, ColDef } from 'samplebundle/aggrid';
import { createQueryClient, fetchJson, useAppQuery, QueryClientProvider } from 'samplebundle/tanstackquery';
import Loader from '../components/Loader/Loader';

const columnDefs: ColDef[] = [
  { field: 'product', headerName: 'Product', flex: 1 },
  { field: 'price', headerName: 'Price', flex: 1 },
  { field: 'stock', headerName: 'Stock', flex: 1 }
];

function ProductTable() {
  const { data: products, isLoading, isError, error } = useAppQuery(['fakestore', 'products'], () => fetchJson('https://fakestoreapi.com/products') as any);

  const rowData = React.useMemo(() => {
    if (!products) return [];
    return (products as any[]).map((p: any) => ({ id: p.id, product: p.title, price: p.price, stock: p.rating?.count ?? 0 }));
  }, [products]);

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading products: {(error as any)?.message || 'Unknown'}</div>;

  return <AgGridTable columnDefs={columnDefs} rowData={rowData} pagination paginationPageSizeSelector />;
}

export default function TablePage2() {
  const qc = React.useMemo(() => createQueryClient(), []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Table 2 - FakeStore Products</h2>
      <QueryClientProvider client={qc}>
        <ProductTable />
      </QueryClientProvider>
    </div>
  );
}

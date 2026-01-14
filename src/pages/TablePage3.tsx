import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import { AgGridTable, ColDef } from 'samplebundle/aggrid';
import { createQueryClient, fetchJson, useAppQuery, QueryClientProvider } from 'samplebundle/tanstackquery';
import Loader from '../components/Loader/Loader';

const columnDefs: ColDef[] = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  { field: 'title', headerName: 'Title', flex: 2 },
  { field: 'category', headerName: 'Category', flex: 1 },
  { field: 'price', headerName: 'Price', flex: 0.8 }
];

function ProductSearchTable({ query }: { query: string }) {
  const { data: products, isLoading, isError, error } = useAppQuery(
    ['fakestore', 'products', query],
    async () => {
      const all = (await fetchJson('https://fakestoreapi.com/products')) as any[];
      if (!query) return all;
      const q = query.toLowerCase();
      return all.filter((p) => {
        return (
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        );
      });
    },
    { staleTime: 1000 * 60 } as any // cache for 1 minute
  );

  const rowData = React.useMemo(() => {
    if (!products) return [];
    return (products as any[]).map((p: any) => ({ id: p.id, title: p.title, category: p.category, price: `$${p.price}` }));
  }, [products]);

  if (isLoading) return <Loader message="Searching products..." />;
  if (isError) return <div>Error loading products: {(error as any)?.message || 'Unknown'}</div>;

  return <AgGridTable columnDefs={columnDefs} rowData={rowData} pagination paginationPageSize={10} />;
}

export default function TablePage3() {
  const qc = React.useMemo(() => createQueryClient(), []);
  const [search, setSearch] = React.useState('');
  const [debounced, setDebounced] = React.useState(search);

  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 400);
    return () => clearTimeout(id);
  }, [search]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Product Search</h2>
      <QueryClientProvider client={qc}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, description or category"
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {search ? (
                    <IconButton aria-label="clear search" size="small" onClick={() => setSearch('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ) : null}
                </InputAdornment>
              )
            }}
          />
        </Box>

        <ProductSearchTable query={debounced} />
      </QueryClientProvider>
    </div>
  );
} 

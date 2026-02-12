import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import DataTable, { Column } from '../../components/common/DataTable';
import { DropSizeResult } from '../../types/entities';
import { dropSizeResultApi } from '../../services/backend';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const DropSizeResultsList = () => {
  const [results, setResults] = useState<DropSizeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await dropSizeResultApi.getAll();
      setResults(data);
    } catch (err) {
      setError('Failed to load drop size results');
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<DropSizeResult>[] = [
    { id: 'order_id', label: 'Order ID', minWidth: 150 },
    { id: 'fixed_cost', label: 'Fixed Cost', minWidth: 120, align: 'right', format: (v) => formatCurrency(v as number) },
    { id: 'unit_variable_cost', label: 'Unit Var Cost', minWidth: 120, align: 'right', format: (v) => formatCurrency(v as number) },
    { id: 'unit_revenue', label: 'Unit Revenue', minWidth: 120, align: 'right', format: (v) => formatCurrency(v as number) },
    { id: 'min_profitable_quantity', label: 'Min Profitable Qty', minWidth: 140, align: 'right', format: (v) => (v as number).toFixed(2) },
    { id: 'calculated_at', label: 'Calculated', minWidth: 150, format: (v) => formatDateTime((v as string) || '') },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <Box>
      <h1 className="text-3xl font-semibold mb-6">Drop Size Results</h1>
      {error && <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>}
      <DataTable
        columns={columns}
        data={results}
        onView={(row) => navigate(`/drop-size-results/${row.id}`)}
        getRowId={(row) => row.id}
        title="Drop Size Results"
      />
    </Box>
  );
};

export default DropSizeResultsList;

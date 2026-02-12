import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import DataTable, { Column } from '../../components/common/DataTable';
import { CostResult } from '../../types/entities';
import { costResultApi } from '../../services/backend';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const CostResultsList = () => {
  const [results, setResults] = useState<CostResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await costResultApi.getAll();
      setResults(data);
    } catch (err) {
      setError('Failed to load cost results');
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<CostResult>[] = [
    { id: 'order_id', label: 'Order ID', minWidth: 150 },
    { id: 'transport_cost', label: 'Transport Cost', minWidth: 120, align: 'right', format: (v) => formatCurrency(v as number) },
    { id: 'warehouse_cost', label: 'Warehouse Cost', minWidth: 120, align: 'right', format: (v) => formatCurrency(v as number) },
    { id: 'cost_to_serve', label: 'Cost to Serve', minWidth: 120, align: 'right', format: (v) => formatCurrency(v as number) },
    { id: 'profit', label: 'Profit', minWidth: 120, align: 'right', format: (v) => formatCurrency(v as number) },
    { id: 'profitable', label: 'Profitable', minWidth: 100, format: (v) => (v ? 'Yes' : 'No') },
    { id: 'calculated_at', label: 'Calculated', minWidth: 150, format: (v) => formatDateTime((v as string) || '') },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <Box>
      <h1 className="text-3xl font-semibold mb-6">Cost Results</h1>
      {error && <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>}
      <DataTable
        columns={columns}
        data={results}
        onView={(row) => navigate(`/cost-results/${row.id}`)}
        getRowId={(row) => row.id}
        title="Cost Results"
      />
    </Box>
  );
};

export default CostResultsList;

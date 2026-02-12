import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DropSizeResult } from '../../types/entities';
import { dropSizeResultApi } from '../../services/backend';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const DropSizeResultDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<DropSizeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await dropSizeResultApi.getById(id!);
      setResult(data);
    } catch (err) {
      setError('Failed to load drop size result');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error && !result) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/drop-size-results')} className="mt-4">Back to Drop Size Results</Button>
      </Box>
    );
  }
  if (!result) return null;

  return (
    <Box>
      <Box className="flex items-center gap-4 mb-6">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/drop-size-results')}>Back</Button>
        <Typography variant="h4" className="flex-1 font-semibold">Drop Size Result Details</Typography>
      </Box>
      {error && <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>}
      <Paper className="p-6">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Order ID</Typography>
            <Typography variant="body1" className="mb-4">{result.order_id}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Fixed Cost</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(result.fixed_cost)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Unit Variable Cost</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(result.unit_variable_cost)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Unit Revenue</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(result.unit_revenue)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Min Profitable Quantity</Typography>
            <Typography variant="body1" className="mb-4">{result.min_profitable_quantity.toFixed(2)}</Typography>
          </Grid>
          {result.calculated_at && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" className="text-gray-500 mb-1">Calculated At</Typography>
              <Typography variant="body1">{formatDateTime(result.calculated_at)}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default DropSizeResultDetails;

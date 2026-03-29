import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid, Chip, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CostResult } from '../../types/entities';
import { costResultApi } from '../../services/backend';
import { formatCurrency, formatDateTime, formatPercent } from '../../utils/formatters';

const CostResultDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<CostResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await costResultApi.getById(id!);
      setResult(data);
    } catch (err) {
      setError('Failed to load cost result');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error && !result) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/cost-results')} className="mt-4">Back to Cost Results</Button>
      </Box>
    );
  }
  if (!result) return null;

  return (
    <Box>
      <Box className="flex items-center gap-4 mb-6">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/cost-results')}>Back</Button>
        <Typography variant="h4" className="flex-1 font-semibold">Cost Result Details</Typography>
      </Box>
      {error && <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>}
      <Paper className="p-6">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Order ID</Typography>
            <Typography variant="body1" className="mb-4">{result.order_id}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Profitable</Typography>
            <Chip label={result.profitable ? 'Yes' : 'No'} color={result.profitable ? 'success' : 'default'} variant="outlined" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Transport Cost</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(result.transport_cost)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Warehouse Cost</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(result.warehouse_cost)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Admin Cost</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(result.admin_cost)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Return Cost</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(result.return_cost)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Cost to Serve</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(result.cost_to_serve)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Gross Margin</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(result.profit)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Margin %</Typography>
            <Typography variant="body1" className="mb-4">{result.profit_margin_pct != null ? formatPercent(result.profit_margin_pct) : 'N/A'}</Typography>
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

export default CostResultDetails;

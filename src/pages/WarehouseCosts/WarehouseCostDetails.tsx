import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { WarehouseCost, Organization } from '../../types/entities';
import { warehouseCostApi, organizationApi } from '../../services/backend';
import { formatCurrency, formatDate } from '../../utils/formatters';

const WarehouseCostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cost, setCost] = useState<WarehouseCost | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [costData, orgsData] = await Promise.all([warehouseCostApi.getById(id!), organizationApi.getAll()]);
      setCost(costData);
      setOrganizations(orgsData);
    } catch (err) {
      setError('Failed to load warehouse cost');
    } finally {
      setLoading(false);
    }
  };

  const getOrgName = (orgId: string) => organizations.find((o) => o.id === orgId)?.name || orgId;

  if (loading) return <div>Loading...</div>;
  if (error && !cost) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/warehouse-costs')} className="mt-4">Back</Button>
      </Box>
    );
  }
  if (!cost) return null;

  return (
    <Box>
      <Box className="flex items-center gap-4 mb-6">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/warehouse-costs')}>Back</Button>
        <Typography variant="h4" className="flex-1 font-semibold">Warehouse Cost Details</Typography>
      </Box>
      {error && <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>}
      <Paper className="p-6">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Organization</Typography>
            <Typography variant="body1" className="mb-4">{getOrgName(cost.organization_id)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Effective From</Typography>
            <Typography variant="body1" className="mb-4">{formatDate(cost.effective_from)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Pick Cost Per Line</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(cost.pick_cost_per_line)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Pack Cost</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(cost.pack_cost)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Pallet Handling Cost</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(cost.pallet_handling_cost)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Storage Cost Per Day</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(cost.storage_cost_per_day)}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default WarehouseCostDetails;

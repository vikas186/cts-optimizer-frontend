import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TransportCost, Route, Organization } from '../../types/entities';
import { transportCostApi, routeApi, organizationApi } from '../../services/backend';
import { formatCurrency } from '../../utils/formatters';

const TransportCostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cost, setCost] = useState<TransportCost | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [costData, routesData, orgsData] = await Promise.all([
        transportCostApi.getById(id!),
        routeApi.getAll(),
        organizationApi.getAll(),
      ]);
      setCost(costData);
      setRoutes(routesData);
      setOrganizations(orgsData);
    } catch (err) {
      setError('Failed to load transport cost');
    } finally {
      setLoading(false);
    }
  };

  const getRouteId = (routeId: string) => routes.find((r) => (r as Route & { id?: string }).id === routeId || r.route_id === routeId)?.route_id ?? routeId;
  const getOrgName = (orgId: string) => organizations.find((o) => o.id === orgId)?.name || orgId;

  if (loading) return <div>Loading...</div>;
  if (error && !cost) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/transport-costs')} className="mt-4">Back</Button>
      </Box>
    );
  }
  if (!cost) return null;

  return (
    <Box>
      <Box className="flex items-center gap-4 mb-6">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/transport-costs')}>Back</Button>
        <Typography variant="h4" className="flex-1 font-semibold">Transport Cost Details</Typography>
      </Box>
      {error && <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>}
      <Paper className="p-6">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Route</Typography>
            <Typography variant="body1" className="mb-4">{getRouteId(cost.route_id)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Organization</Typography>
            <Typography variant="body1" className="mb-4">{getOrgName(cost.organization_id)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Base Cost</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(cost.base_cost)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Cost Per Kg</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(cost.cost_per_kg)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Cost Per Km</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(cost.cost_per_km)}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TransportCostDetails;

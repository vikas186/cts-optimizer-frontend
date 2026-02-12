import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Route, Organization } from '../../types/entities';
import { routeApi, organizationApi } from '../../services/backend';

const RouteDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [route, setRoute] = useState<Route | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [routeData, orgsData] = await Promise.all([routeApi.getById(id!), organizationApi.getAll()]);
      setRoute(routeData);
      setOrganizations(orgsData);
    } catch (err) {
      setError('Failed to load route');
    } finally {
      setLoading(false);
    }
  };

  const getOrgName = (orgId: string) => organizations.find((o) => o.id === orgId)?.name || orgId;

  if (loading) return <div>Loading...</div>;
  if (error && !route) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/routes')} className="mt-4">Back to Routes</Button>
      </Box>
    );
  }
  if (!route) return null;

  return (
    <Box>
      <Box className="flex items-center gap-4 mb-6">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/routes')}>Back</Button>
        <Typography variant="h4" className="flex-1 font-semibold">Route Details</Typography>
      </Box>
      {error && <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>}
      <Paper className="p-6">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Route ID</Typography>
            <Typography variant="h6" className="mb-4">{route.route_id}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Organization</Typography>
            <Typography variant="body1" className="mb-4">{getOrgName(route.organization_id)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Distance (km)</Typography>
            <Typography variant="body1" className="mb-4">{route.distance_km.toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default RouteDetails;

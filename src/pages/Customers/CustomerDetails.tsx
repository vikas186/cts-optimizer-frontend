import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid, Chip, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Customer, Organization } from '../../types/entities';
import { customerApi, organizationApi } from '../../services/backend';
import { formatCurrency } from '../../utils/formatters';

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [customerData, orgsData] = await Promise.all([customerApi.getById(id!), organizationApi.getAll()]);
      setCustomer(customerData);
      setOrganizations(orgsData);
    } catch (err) {
      setError('Failed to load customer');
    } finally {
      setLoading(false);
    }
  };

  const getOrgName = (orgId: string) => organizations.find((o) => o.id === orgId)?.name || orgId;

  if (loading) return <div>Loading...</div>;
  if (error && !customer) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/customers')} className="mt-4">Back to Customers</Button>
      </Box>
    );
  }
  if (!customer) return null;

  return (
    <Box>
      <Box className="flex items-center gap-4 mb-6">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/customers')}>Back</Button>
        <Typography variant="h4" className="flex-1 font-semibold">Customer Details</Typography>
      </Box>
      {error && <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>}
      <Paper className="p-6">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Customer ID</Typography>
            <Typography variant="h6" className="mb-4">{customer.customer_id}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Organization</Typography>
            <Typography variant="body1" className="mb-4">{getOrgName(customer.organization_id)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Segment</Typography>
            <Chip label={customer.segment} variant="outlined" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Revenue Per Unit</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(customer.revenue_per_unit)}</Typography>
          </Grid>
          {(customer as Customer & { id?: string }).id && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" className="text-gray-500 mb-1">ID</Typography>
              <Chip label={(customer as Customer & { id?: string }).id} variant="outlined" />
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default CustomerDetails;

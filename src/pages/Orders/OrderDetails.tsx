import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Order, Customer, Route, Organization } from '../../types/entities';
import { orderApi, customerApi, routeApi, organizationApi } from '../../services/backend';
import { formatCurrency, formatDate } from '../../utils/formatters';

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
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
      const [orderData, customersData, routesData, orgsData] = await Promise.all([
        orderApi.getById(id!),
        customerApi.getAll(),
        routeApi.getAll(),
        organizationApi.getAll(),
      ]);
      setOrder(orderData);
      setCustomers(customersData);
      setRoutes(routesData);
      setOrganizations(orgsData);
    } catch (err) {
      setError('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const getCustomerId = (customerId: string) =>
    customers.find((r) => (r as { id?: string }).id === customerId || r.customer_id === customerId)?.customer_id ?? customerId;
  const getRouteId = (routeId: string) =>
    routes.find((x) => (x as { id?: string }).id === routeId || x.route_id === routeId)?.route_id ?? routeId;
  const getOrgName = (orgId: string) => organizations.find((o) => o.id === orgId)?.name || orgId;

  if (loading) return <div>Loading...</div>;
  if (error && !order) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')} className="mt-4">Back to Orders</Button>
      </Box>
    );
  }
  if (!order) return null;

  return (
    <Box>
      <Box className="flex items-center gap-4 mb-6">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')}>Back</Button>
        <Typography variant="h4" className="flex-1 font-semibold">Order Details</Typography>
      </Box>
      {error && <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>}
      <Paper className="p-6">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Order ID</Typography>
            <Typography variant="h6" className="mb-4">{order.order_id}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Organization</Typography>
            <Typography variant="body1" className="mb-4">{getOrgName(order.organization_id)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Customer</Typography>
            <Typography variant="body1" className="mb-4">{getCustomerId(order.customer_id)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Route</Typography>
            <Typography variant="body1" className="mb-4">{getRouteId(order.route_id)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">SKU</Typography>
            <Typography variant="body1" className="mb-4">{order.sku}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Quantity</Typography>
            <Typography variant="body1" className="mb-4">{order.quantity}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Revenue</Typography>
            <Typography variant="body1" className="mb-4">{formatCurrency(order.revenue)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Order Date</Typography>
            <Typography variant="body1" className="mb-4">{formatDate(order.order_date)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Weight (kg)</Typography>
            <Typography variant="body1" className="mb-4">{order.weight_kg}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Volume (m³)</Typography>
            <Typography variant="body1" className="mb-4">{order.volume_m3}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Lines</Typography>
            <Typography variant="body1" className="mb-4">{order.lines}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Pallets</Typography>
            <Typography variant="body1" className="mb-4">{order.pallets}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default OrderDetails;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import DataTable, { Column } from '../../components/common/DataTable';
import { Order, Customer, Route, Organization } from '../../types/entities';
import { orderApi, customerApi, routeApi, organizationApi } from '../../services/backend';
import { formatCurrency, formatDate } from '../../utils/formatters';

const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, customersData, routesData, orgsData] = await Promise.all([
        orderApi.getAll(),
        customerApi.getAll(),
        routeApi.getAll(),
        organizationApi.getAll(),
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
      setRoutes(routesData);
      setOrganizations(orgsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const orderId = (o: Order) => (o as Order & { id?: string }).id ?? o.order_id;
  const getCustomerId = (id: string) => customers.find((c) => (c as Customer & { id?: string }).id === id || c.customer_id === id)?.customer_id ?? id;
  const getRouteId = (id: string) => routes.find((r) => (r as Route & { id?: string }).id === id || r.route_id === id)?.route_id ?? id;
  const getOrgName = (orgId: string) => organizations.find((o) => o.id === orgId)?.name || orgId;

  const columns: Column<Order>[] = [
    { id: 'order_id', label: 'Order ID', minWidth: 150 },
    { id: 'organization_id', label: 'Organization', minWidth: 180, format: (v) => getOrgName(v as string) },
    { id: 'customer_id', label: 'Customer', minWidth: 150, format: (v) => getCustomerId(v as string) },
    { id: 'route_id', label: 'Route', minWidth: 120, format: (v) => getRouteId(v as string) },
    { id: 'sku', label: 'SKU', minWidth: 120 },
    { id: 'quantity', label: 'Quantity', minWidth: 100, align: 'right' },
    { id: 'revenue', label: 'Revenue', minWidth: 120, align: 'right', format: (v) => formatCurrency(v as number) },
    { id: 'order_date', label: 'Order Date', minWidth: 120, format: (v) => formatDate(v as string) },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <Box>
      <h1 className="text-3xl font-semibold mb-6">Orders</h1>
      {error && <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>}
      <DataTable
        columns={columns}
        data={orders}
        onView={(row) => navigate(`/orders/${orderId(row)}`)}
        getRowId={(row) => orderId(row)}
        title="Orders"
      />
    </Box>
  );
};

export default OrdersList;

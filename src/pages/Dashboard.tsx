import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Card, CardContent, Button, Alert } from '@mui/material';
import {
  organizationApi,
  userApi,
  customerApi,
  orderApi,
  costResultApi,
  calculateApi,
  exportApi,
} from '../services/backend';
import { formatCurrency } from '../utils/formatters';
import { useEffect } from 'react';
import CalculateIcon from '@mui/icons-material/Calculate';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    organizations: 0,
    users: 0,
    customers: 0,
    orders: 0,
    totalRevenue: 0,
    profitableOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [calcLoading, setCalcLoading] = useState<string | null>(null);
  const [calcMessage, setCalcMessage] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [orgs, users, customers, orders, costResults] = await Promise.all([
        organizationApi.getAll(),
        userApi.getAll(),
        customerApi.getAll(),
        orderApi.getAll(),
        costResultApi.getAll(),
      ]);
      const totalRevenue = orders.reduce((sum, o) => sum + o.revenue, 0);
      const profitableOrders = costResults.filter((cr) => cr.profitable).length;
      setStats({
        organizations: orgs.length,
        users: users.length,
        customers: customers.length,
        orders: orders.length,
        totalRevenue,
        profitableOrders,
      });
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleRunCostToServe = async () => {
    setCalcLoading('cost-to-serve');
    setCalcMessage(null);
    try {
      const res = await calculateApi.runCostToServe();
      setCalcMessage(`Cost-to-serve calculated for ${res.calculated} orders.`);
      await loadStats();
    } catch (err) {
      setCalcMessage(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setCalcLoading(null);
    }
  };

  const handleRunDropSize = async () => {
    setCalcLoading('drop-size');
    setCalcMessage(null);
    try {
      const res = await calculateApi.runDropSize();
      setCalcMessage(`Drop-size calculated for ${res.calculated} orders.`);
      await loadStats();
    } catch (err) {
      setCalcMessage(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setCalcLoading(null);
    }
  };

  const handleRunAll = async () => {
    setCalcLoading('all');
    setCalcMessage(null);
    try {
      const res = await calculateApi.runAll();
      setCalcMessage(`Cost-to-serve: ${res.cost_to_serve.calculated} orders. Drop-size: ${res.drop_size.calculated} orders.`);
      await loadStats();
    } catch (err) {
      setCalcMessage(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setCalcLoading(null);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCostResults = async () => {
    setExportLoading('cost-results');
    try {
      const blob = await exportApi.costResults(false);
      downloadBlob(blob, 'cost-results.csv');
    } catch (err) {
      setCalcMessage(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExportLoading(null);
    }
  };

  const handleExportDropSizeResults = async () => {
    setExportLoading('drop-size-results');
    try {
      const blob = await exportApi.dropSizeResults();
      downloadBlob(blob, 'drop-size-results.csv');
    } catch (err) {
      setCalcMessage(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExportLoading(null);
    }
  };

  const handleExportOrdersWithAnalytics = async () => {
    setExportLoading('orders-analytics');
    try {
      const blob = await exportApi.ordersWithAnalytics();
      downloadBlob(blob, 'orders-with-analytics.csv');
    } catch (err) {
      setCalcMessage(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExportLoading(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  const statCards = [
    { title: 'Organizations', value: stats.organizations },
    { title: 'Users', value: stats.users },
    { title: 'Customers', value: stats.customers },
    { title: 'Orders', value: stats.orders },
    { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue) },
    { title: 'Profitable Orders', value: stats.profitableOrders },
  ];

  return (
    <Box>
      <Typography variant="h4" className="mb-6 font-semibold">
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" className="text-gray-500 mb-2">
                  {card.title}
                </Typography>
                <Typography variant="h4" className="font-semibold">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" className="mt-8 mb-3 font-semibold">
        Data &amp; calculations
      </Typography>
      <Grid container spacing={2} className="mb-4">
        <Grid item>
          <Button variant="outlined" startIcon={<CloudUploadIcon />} onClick={() => navigate('/upload')}>
            Import Excel
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<CalculateIcon />}
            onClick={handleRunCostToServe}
            disabled={!!calcLoading}
          >
            {calcLoading === 'cost-to-serve' ? 'Running…' : 'Run cost-to-serve'}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<CalculateIcon />}
            onClick={handleRunDropSize}
            disabled={!!calcLoading}
          >
            {calcLoading === 'drop-size' ? 'Running…' : 'Run drop-size'}
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" startIcon={<CalculateIcon />} onClick={handleRunAll} disabled={!!calcLoading}>
            {calcLoading === 'all' ? 'Running…' : 'Run all'}
          </Button>
        </Grid>
      </Grid>
      {calcMessage && (
        <Alert severity={calcMessage.startsWith('Cost-to-serve') || calcMessage.startsWith('Drop-size') ? 'success' : 'error'} className="mb-4" onClose={() => setCalcMessage(null)}>
          {calcMessage}
        </Alert>
      )}

      <Typography variant="h6" className="mt-6 mb-3 font-semibold">
        Export CSV
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportCostResults}
            disabled={!!exportLoading}
          >
            {exportLoading === 'cost-results' ? '…' : 'Cost results'}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportDropSizeResults}
            disabled={!!exportLoading}
          >
            {exportLoading === 'drop-size-results' ? '…' : 'Drop size results'}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportOrdersWithAnalytics}
            disabled={!!exportLoading}
          >
            {exportLoading === 'orders-analytics' ? '…' : 'Orders with analytics'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

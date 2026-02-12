import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import DataTable, { Column } from '../../components/common/DataTable';
import { TransportCost, Route, Organization } from '../../types/entities';
import { transportCostApi, routeApi, organizationApi } from '../../services/backend';
import { formatCurrency } from '../../utils/formatters';

const TransportCostsList = () => {
  const [costs, setCosts] = useState<TransportCost[]>([]);
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
      const [costsData, routesData, orgsData] = await Promise.all([
        transportCostApi.getAll(),
        routeApi.getAll(),
        organizationApi.getAll(),
      ]);
      setCosts(costsData);
      setRoutes(routesData);
      setOrganizations(orgsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getRouteId = (routeId: string) => routes.find((r) => (r as Route & { id?: string }).id === routeId || r.route_id === routeId)?.route_id ?? routeId;
  const getOrgName = (orgId: string) => organizations.find((o) => o.id === orgId)?.name || orgId;

  const columns: Column<TransportCost>[] = [
    { id: 'route_id', label: 'Route', minWidth: 150, format: (v) => getRouteId(v as string) },
    { id: 'organization_id', label: 'Organization', minWidth: 200, format: (v) => getOrgName(v as string) },
    { id: 'base_cost', label: 'Base Cost', minWidth: 120, align: 'right', format: (v) => formatCurrency(v as number) },
    { id: 'cost_per_kg', label: 'Cost/kg', minWidth: 100, align: 'right', format: (v) => formatCurrency(v as number) },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <Box>
      <h1 className="text-3xl font-semibold mb-6">Transport Costs</h1>
      {error && <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>}
      <DataTable
        columns={columns}
        data={costs}
        onView={(row) => navigate(`/transport-costs/${row.id}`)}
        getRowId={(row) => row.id}
        title="Transport Costs"
      />
    </Box>
  );
};

export default TransportCostsList;

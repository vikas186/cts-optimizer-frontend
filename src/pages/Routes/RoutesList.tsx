import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import DataTable, { Column } from '../../components/common/DataTable';
import { Route, Organization } from '../../types/entities';
import { routeApi, organizationApi } from '../../services/backend';

const RoutesList = () => {
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
      const [routesData, orgsData] = await Promise.all([routeApi.getAll(), organizationApi.getAll()]);
      setRoutes(routesData);
      setOrganizations(orgsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getOrgName = (orgId: string) => organizations.find((o) => o.id === orgId)?.name || orgId;
  const rowId = (r: Route) => (r as Route & { id?: string }).id ?? r.route_id;

  const columns: Column<Route>[] = [
    { id: 'route_id', label: 'Route ID', minWidth: 150 },
    { id: 'organization_id', label: 'Organization', minWidth: 200, format: (v) => getOrgName(v as string) },
    { id: 'distance_km', label: 'Distance (km)', minWidth: 120, align: 'right', format: (v) => (v as number).toFixed(2) },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <Box>
      <h1 className="text-3xl font-semibold mb-6">Routes</h1>
      {error && <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>}
      <DataTable
        columns={columns}
        data={routes}
        onView={(row) => navigate(`/routes/${rowId(row)}`)}
        getRowId={(row) => rowId(row)}
        title="Routes"
      />
    </Box>
  );
};

export default RoutesList;

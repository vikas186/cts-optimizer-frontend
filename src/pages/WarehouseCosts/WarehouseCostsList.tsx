import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import DataTable, { Column } from '../../components/common/DataTable';
import { WarehouseCost, Organization } from '../../types/entities';
import { warehouseCostApi, organizationApi } from '../../services/backend';
import { formatCurrency, formatDate } from '../../utils/formatters';

const WarehouseCostsList = () => {
  const [warehouseCosts, setWarehouseCosts] = useState<WarehouseCost[]>([]);
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
      const [costsData, orgsData] = await Promise.all([warehouseCostApi.getAll(), organizationApi.getAll()]);
      setWarehouseCosts(costsData);
      setOrganizations(orgsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getOrgName = (orgId: string) => organizations.find((o) => o.id === orgId)?.name || orgId;

  const columns: Column<WarehouseCost>[] = [
    { id: 'organization_id', label: 'Organization', minWidth: 200, format: (v) => getOrgName(v as string) },
    { id: 'pick_cost_per_line', label: 'Pick Cost/Line', minWidth: 120, align: 'right', format: (v) => formatCurrency(v as number) },
    { id: 'pack_cost', label: 'Pack Cost', minWidth: 120, align: 'right', format: (v) => formatCurrency(v as number) },
    { id: 'effective_from', label: 'Effective From', minWidth: 150, format: (v) => formatDate(v as string) },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <Box>
      <h1 className="text-3xl font-semibold mb-6">Warehouse Costs</h1>
      {error && <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>}
      <DataTable
        columns={columns}
        data={warehouseCosts}
        onView={(row) => navigate(`/warehouse-costs/${row.id}`)}
        getRowId={(row) => row.id}
        title="Warehouse Costs"
      />
    </Box>
  );
};

export default WarehouseCostsList;

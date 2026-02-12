import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import DataTable, { Column } from '../../components/common/DataTable';
import { Customer, Organization } from '../../types/entities';
import { customerApi, organizationApi } from '../../services/backend';
import { formatCurrency } from '../../utils/formatters';

const CustomersList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
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
      const [customersData, orgsData] = await Promise.all([customerApi.getAll(), organizationApi.getAll()]);
      setCustomers(customersData);
      setOrganizations(orgsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getOrgName = (orgId: string) => organizations.find((o) => o.id === orgId)?.name || orgId;
  const rowId = (r: Customer) => (r as Customer & { id?: string }).id ?? r.customer_id;

  const columns: Column<Customer>[] = [
    { id: 'customer_id', label: 'Customer ID', minWidth: 150 },
    { id: 'organization_id', label: 'Organization', minWidth: 200, format: (v) => getOrgName(v as string) },
    { id: 'segment', label: 'Segment', minWidth: 120 },
    { id: 'revenue_per_unit', label: 'Revenue Per Unit', minWidth: 150, align: 'right', format: (v) => formatCurrency(v as number) },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <Box>
      <h1 className="text-3xl font-semibold mb-6">Customers</h1>
      {error && <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>}
      <DataTable
        columns={columns}
        data={customers}
        onView={(row) => navigate(`/customers/${rowId(row)}`)}
        getRowId={(row) => rowId(row)}
        title="Customers"
      />
    </Box>
  );
};

export default CustomersList;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import DataTable, { Column } from '../../components/common/DataTable';
import { Organization } from '../../types/entities';
import { organizationApi } from '../../services/backend';
import { formatDate } from '../../utils/formatters';

const OrganizationsList = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const data = await organizationApi.getAll();
      setOrganizations(data);
    } catch (err) {
      setError('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Organization>[] = [
    { id: 'name', label: 'Name', minWidth: 200 },
    {
      id: 'created_at',
      label: 'Created At',
      minWidth: 150,
      format: (value) => formatDate(value as string),
    },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <Box>
      <h1 className="text-3xl font-semibold mb-6">Organizations</h1>
      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <DataTable
        columns={columns}
        data={organizations}
        onView={(row) => navigate(`/organizations/${row.id}`)}
        getRowId={(row) => row.id}
        title="Organizations"
      />
    </Box>
  );
};

export default OrganizationsList;

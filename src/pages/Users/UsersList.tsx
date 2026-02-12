import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import DataTable, { Column } from '../../components/common/DataTable';
import { User, Organization } from '../../types/entities';
import { userApi, organizationApi } from '../../services/backend';
import { formatDate } from '../../utils/formatters';

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
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
      const [usersData, orgsData] = await Promise.all([userApi.getAll(), organizationApi.getAll()]);
      setUsers(usersData);
      setOrganizations(orgsData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getOrgName = (orgId: string) => organizations.find((o) => o.id === orgId)?.name || orgId;

  const columns: Column<User>[] = [
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'organization_id', label: 'Organization', minWidth: 200, format: (v) => getOrgName(v as string) },
    { id: 'role', label: 'Role', minWidth: 100 },
    { id: 'created_at', label: 'Created At', minWidth: 150, format: (v) => formatDate(v as string) },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <Box>
      <h1 className="text-3xl font-semibold mb-6">Users</h1>
      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>
      )}
      <DataTable
        columns={columns}
        data={users}
        onView={(row) => navigate(`/users/${row.id}`)}
        getRowId={(row) => row.id}
        title="Users"
      />
    </Box>
  );
};

export default UsersList;

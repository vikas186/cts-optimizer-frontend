import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid, Chip, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { User, Organization } from '../../types/entities';
import { userApi, organizationApi } from '../../services/backend';
import { formatDate } from '../../utils/formatters';

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userData, orgsData] = await Promise.all([userApi.getById(id!), organizationApi.getAll()]);
      setUser(userData);
      setOrganizations(orgsData);
    } catch (err) {
      setError('Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const getOrgName = (orgId: string) => organizations.find((o) => o.id === orgId)?.name || orgId;

  if (loading) return <div>Loading...</div>;
  if (error && !user) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/users')} className="mt-4">Back to Users</Button>
      </Box>
    );
  }
  if (!user) return null;

  return (
    <Box>
      <Box className="flex items-center gap-4 mb-6">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/users')}>Back</Button>
        <Typography variant="h4" className="flex-1 font-semibold">User Details</Typography>
      </Box>
      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>{error}</Alert>
      )}
      <Paper className="p-6">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Email</Typography>
            <Typography variant="h6" className="mb-4">{user.email}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Role</Typography>
            <Chip label={user.role} variant="outlined" className="capitalize" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Organization</Typography>
            <Typography variant="body1" className="mb-4">{getOrgName(user.organization_id)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Created At</Typography>
            <Typography variant="body1" className="mb-4">{formatDate(user.created_at)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">ID</Typography>
            <Chip label={user.id} variant="outlined" />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserDetails;

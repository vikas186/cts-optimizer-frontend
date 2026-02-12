import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Grid, Chip, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Organization } from '../../types/entities';
import { organizationApi } from '../../services/backend';
import { formatDate } from '../../utils/formatters';

const OrganizationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadOrganization();
  }, [id]);

  const loadOrganization = async () => {
    try {
      setLoading(true);
      const data = await organizationApi.getById(id!);
      setOrganization(data);
    } catch (err) {
      setError('Failed to load organization');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error && !organization) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/organizations')} className="mt-4">
          Back to Organizations
        </Button>
      </Box>
    );
  }
  if (!organization) return null;

  return (
    <Box>
      <Box className="flex items-center gap-4 mb-6">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/organizations')}>
          Back
        </Button>
        <Typography variant="h4" className="flex-1 font-semibold">
          Organization Details
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Paper className="p-6">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Name</Typography>
            <Typography variant="h6" className="mb-4">{organization.name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">Created At</Typography>
            <Typography variant="body1" className="mb-4">{formatDate(organization.created_at)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" className="text-gray-500 mb-1">ID</Typography>
            <Chip label={organization.id} variant="outlined" />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default OrganizationDetails;

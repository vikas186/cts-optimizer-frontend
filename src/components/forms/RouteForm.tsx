import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, MenuItem, Box } from '@mui/material';
import { Route, Organization } from '../../types/entities';

interface RouteFormProps {
  data?: Route;
  organizations: Organization[];
  onSubmit: (data: Route) => void;
}

const RouteForm = ({ data, organizations, onSubmit }: RouteFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Route>({
    defaultValues: data || {
      route_id: '',
      organization_id: '',
      distance_km: 0,
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        route_id: data.route_id,
        organization_id: data.organization_id,
        distance_km: data.distance_km,
      });
    }
  }, [data, reset]);

  const onSubmitForm = (formData: Route) => {
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} id="route-form">
      <Box className="space-y-4">
        <TextField
          fullWidth
          label="Route ID"
          {...register('route_id', { required: 'Route ID is required' })}
          error={!!errors.route_id}
          helperText={errors.route_id?.message}
          disabled={!!data}
        />
        <TextField
          fullWidth
          select
          label="Organization"
          {...register('organization_id', { required: 'Organization is required' })}
          error={!!errors.organization_id}
          helperText={errors.organization_id?.message}
        >
          {organizations.map((org) => (
            <MenuItem key={org.id} value={org.id}>
              {org.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Distance (km)"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('distance_km', {
            required: 'Distance is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Distance must be positive' },
          })}
          error={!!errors.distance_km}
          helperText={errors.distance_km?.message}
        />
      </Box>
    </form>
  );
};

export default RouteForm;


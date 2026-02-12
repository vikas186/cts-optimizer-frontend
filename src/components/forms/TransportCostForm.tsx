import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, MenuItem, Box } from '@mui/material';
import { TransportCost, Route, Organization } from '../../types/entities';

interface TransportCostFormProps {
  data?: TransportCost;
  routes: Route[];
  organizations: Organization[];
  onSubmit: (data: Omit<TransportCost, 'id'>) => void;
}

const TransportCostForm = ({
  data,
  routes,
  organizations,
  onSubmit,
}: TransportCostFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<Omit<TransportCost, 'id'>>({
    defaultValues: data || {
      route_id: '',
      organization_id: '',
      base_cost: 0,
      cost_per_kg: 0,
      cost_per_km: 0,
    },
  });

  const selectedRouteId = watch('route_id');

  useEffect(() => {
    if (data) {
      reset({
        route_id: data.route_id,
        organization_id: data.organization_id,
        base_cost: data.base_cost,
        cost_per_kg: data.cost_per_kg,
        cost_per_km: data.cost_per_km,
      });
    }
  }, [data, reset]);

  // Filter routes by selected organization
  const filteredRoutes = selectedRouteId
    ? routes.filter((r) => r.organization_id === watch('organization_id') || r.route_id === selectedRouteId)
    : routes;

  const onSubmitForm = (formData: Omit<TransportCost, 'id'>) => {
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} id="transport-cost-form">
      <Box className="space-y-4">
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
          select
          label="Route"
          {...register('route_id', { required: 'Route is required' })}
          error={!!errors.route_id}
          helperText={errors.route_id?.message}
        >
          {filteredRoutes.map((route) => (
            <MenuItem key={route.route_id} value={route.route_id}>
              {route.route_id} ({route.distance_km} km)
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Base Cost"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('base_cost', {
            required: 'Base cost is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost must be positive' },
          })}
          error={!!errors.base_cost}
          helperText={errors.base_cost?.message}
        />
        <TextField
          fullWidth
          label="Cost Per Kg"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('cost_per_kg', {
            required: 'Cost per kg is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost must be positive' },
          })}
          error={!!errors.cost_per_kg}
          helperText={errors.cost_per_kg?.message}
        />
        <TextField
          fullWidth
          label="Cost Per Km"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('cost_per_km', {
            required: 'Cost per km is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost must be positive' },
          })}
          error={!!errors.cost_per_km}
          helperText={errors.cost_per_km?.message}
        />
      </Box>
    </form>
  );
};

export default TransportCostForm;


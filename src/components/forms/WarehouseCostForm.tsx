import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, MenuItem, Box } from '@mui/material';
import { WarehouseCost, Organization } from '../../types/entities';

interface WarehouseCostFormProps {
  data?: WarehouseCost;
  organizations: Organization[];
  onSubmit: (data: Omit<WarehouseCost, 'id'>) => void;
}

const WarehouseCostForm = ({ data, organizations, onSubmit }: WarehouseCostFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<WarehouseCost, 'id'>>({
    defaultValues: data || {
      organization_id: '',
      pick_cost_per_line: 0,
      pack_cost: 0,
      pallet_handling_cost: 0,
      storage_cost_per_day: 0,
      effective_from: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        organization_id: data.organization_id,
        pick_cost_per_line: data.pick_cost_per_line,
        pack_cost: data.pack_cost,
        pallet_handling_cost: data.pallet_handling_cost,
        storage_cost_per_day: data.storage_cost_per_day,
        effective_from: data.effective_from.split('T')[0],
      });
    }
  }, [data, reset]);

  const onSubmitForm = (formData: Omit<WarehouseCost, 'id'>) => {
    onSubmit({
      ...formData,
      effective_from: new Date(formData.effective_from).toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} id="warehouse-cost-form">
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
          label="Pick Cost Per Line"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('pick_cost_per_line', {
            required: 'Pick cost per line is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost must be positive' },
          })}
          error={!!errors.pick_cost_per_line}
          helperText={errors.pick_cost_per_line?.message}
        />
        <TextField
          fullWidth
          label="Pack Cost"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('pack_cost', {
            required: 'Pack cost is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost must be positive' },
          })}
          error={!!errors.pack_cost}
          helperText={errors.pack_cost?.message}
        />
        <TextField
          fullWidth
          label="Pallet Handling Cost"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('pallet_handling_cost', {
            required: 'Pallet handling cost is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost must be positive' },
          })}
          error={!!errors.pallet_handling_cost}
          helperText={errors.pallet_handling_cost?.message}
        />
        <TextField
          fullWidth
          label="Storage Cost Per Day"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('storage_cost_per_day', {
            required: 'Storage cost per day is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost must be positive' },
          })}
          error={!!errors.storage_cost_per_day}
          helperText={errors.storage_cost_per_day?.message}
        />
        <TextField
          fullWidth
          label="Effective From"
          type="date"
          InputLabelProps={{ shrink: true }}
          {...register('effective_from', { required: 'Effective from date is required' })}
          error={!!errors.effective_from}
          helperText={errors.effective_from?.message}
        />
      </Box>
    </form>
  );
};

export default WarehouseCostForm;


import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, MenuItem, Box } from '@mui/material';
import { Customer, Organization } from '../../types/entities';

interface CustomerFormProps {
  data?: Customer;
  organizations: Organization[];
  onSubmit: (data: Customer) => void;
}

const CustomerForm = ({ data, organizations, onSubmit }: CustomerFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Customer>({
    defaultValues: data || {
      customer_id: '',
      organization_id: '',
      segment: '',
      revenue_per_unit: 0,
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        customer_id: data.customer_id,
        organization_id: data.organization_id,
        segment: data.segment,
        revenue_per_unit: data.revenue_per_unit,
      });
    }
  }, [data, reset]);

  const onSubmitForm = (formData: Customer) => {
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} id="customer-form">
      <Box className="space-y-4">
        <TextField
          fullWidth
          label="Customer ID"
          {...register('customer_id', { required: 'Customer ID is required' })}
          error={!!errors.customer_id}
          helperText={errors.customer_id?.message}
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
          select
          label="Segment"
          {...register('segment', { required: 'Segment is required' })}
          error={!!errors.segment}
          helperText={errors.segment?.message}
        >
          <MenuItem value="Enterprise">Enterprise</MenuItem>
          <MenuItem value="SMB">SMB</MenuItem>
          <MenuItem value="SOHO">SOHO</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Revenue Per Unit"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('revenue_per_unit', {
            required: 'Revenue per unit is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Revenue must be positive' },
          })}
          error={!!errors.revenue_per_unit}
          helperText={errors.revenue_per_unit?.message}
        />
      </Box>
    </form>
  );
};

export default CustomerForm;


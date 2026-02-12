import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, MenuItem, Box } from '@mui/material';
import { DropSizeResult, Order, Organization } from '../../types/entities';

interface DropSizeResultFormProps {
  data?: DropSizeResult;
  orders: Order[];
  organizations: Organization[];
  onSubmit: (data: Omit<DropSizeResult, 'id' | 'calculated_at'>) => void;
}

const DropSizeResultForm = ({
  data,
  orders,
  organizations,
  onSubmit,
}: DropSizeResultFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<Omit<DropSizeResult, 'id' | 'calculated_at'>>({
    defaultValues: data || {
      order_id: '',
      organization_id: '',
      fixed_cost: 0,
      unit_variable_cost: 0,
      unit_revenue: 0,
      min_profitable_quantity: 0,
    },
  });

  const selectedOrgId = watch('organization_id');

  useEffect(() => {
    if (data) {
      reset({
        order_id: data.order_id,
        organization_id: data.organization_id,
        fixed_cost: data.fixed_cost,
        unit_variable_cost: data.unit_variable_cost,
        unit_revenue: data.unit_revenue,
        min_profitable_quantity: data.min_profitable_quantity,
      });
    }
  }, [data, reset]);

  // Filter orders by selected organization
  const filteredOrders = selectedOrgId
    ? orders.filter((o) => o.organization_id === selectedOrgId)
    : orders;

  const onSubmitForm = (formData: Omit<DropSizeResult, 'id' | 'calculated_at'>) => {
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} id="drop-size-result-form">
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
          label="Order"
          {...register('order_id', { required: 'Order is required' })}
          error={!!errors.order_id}
          helperText={errors.order_id?.message}
          disabled={!selectedOrgId}
        >
          {filteredOrders.map((order) => (
            <MenuItem key={order.order_id} value={order.order_id}>
              {order.order_id} - {order.sku}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Fixed Cost"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('fixed_cost', {
            required: 'Fixed cost is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost must be positive' },
          })}
          error={!!errors.fixed_cost}
          helperText={errors.fixed_cost?.message}
        />
        <TextField
          fullWidth
          label="Unit Variable Cost"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('unit_variable_cost', {
            required: 'Unit variable cost is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost must be positive' },
          })}
          error={!!errors.unit_variable_cost}
          helperText={errors.unit_variable_cost?.message}
        />
        <TextField
          fullWidth
          label="Unit Revenue"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('unit_revenue', {
            required: 'Unit revenue is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Revenue must be positive' },
          })}
          error={!!errors.unit_revenue}
          helperText={errors.unit_revenue?.message}
        />
        <TextField
          fullWidth
          label="Min Profitable Quantity"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('min_profitable_quantity', {
            required: 'Min profitable quantity is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Quantity must be positive' },
          })}
          error={!!errors.min_profitable_quantity}
          helperText={errors.min_profitable_quantity?.message}
        />
      </Box>
    </form>
  );
};

export default DropSizeResultForm;


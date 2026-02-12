import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, MenuItem, Box } from '@mui/material';
import { Order, Customer, Route, Organization } from '../../types/entities';

interface OrderFormProps {
  data?: Order;
  customers: Customer[];
  routes: Route[];
  organizations: Organization[];
  onSubmit: (data: Order) => void;
}

const OrderForm = ({ data, customers, routes, organizations, onSubmit }: OrderFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<Order>({
    defaultValues: data || {
      order_id: '',
      organization_id: '',
      customer_id: '',
      route_id: '',
      sku: '',
      quantity: 0,
      revenue: 0,
      weight_kg: 0,
      volume_m3: 0,
      lines: 0,
      pallets: 0,
      order_date: new Date().toISOString().split('T')[0],
    },
  });

  const selectedOrgId = watch('organization_id');

  useEffect(() => {
    if (data) {
      reset({
        order_id: data.order_id,
        organization_id: data.organization_id,
        customer_id: data.customer_id,
        route_id: data.route_id,
        sku: data.sku,
        quantity: data.quantity,
        revenue: data.revenue,
        weight_kg: data.weight_kg,
        volume_m3: data.volume_m3,
        lines: data.lines,
        pallets: data.pallets,
        order_date: data.order_date,
      });
    }
  }, [data, reset]);

  // Filter customers and routes by selected organization
  const filteredCustomers = selectedOrgId
    ? customers.filter((c) => c.organization_id === selectedOrgId)
    : customers;
  const filteredRoutes = selectedOrgId
    ? routes.filter((r) => r.organization_id === selectedOrgId)
    : routes;

  const onSubmitForm = (formData: Order) => {
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} id="order-form">
      <Box className="space-y-4">
        <TextField
          fullWidth
          label="Order ID"
          {...register('order_id', { required: 'Order ID is required' })}
          error={!!errors.order_id}
          helperText={errors.order_id?.message}
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
          label="Customer"
          {...register('customer_id', { required: 'Customer is required' })}
          error={!!errors.customer_id}
          helperText={errors.customer_id?.message}
          disabled={!selectedOrgId}
        >
          {filteredCustomers.map((customer) => (
            <MenuItem key={customer.customer_id} value={customer.customer_id}>
              {customer.customer_id} - {customer.segment}
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
          disabled={!selectedOrgId}
        >
          {filteredRoutes.map((route) => (
            <MenuItem key={route.route_id} value={route.route_id}>
              {route.route_id} ({route.distance_km} km)
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="SKU"
          {...register('sku', { required: 'SKU is required' })}
          error={!!errors.sku}
          helperText={errors.sku?.message}
        />
        <TextField
          fullWidth
          label="Quantity"
          type="number"
          inputProps={{ min: 1 }}
          {...register('quantity', {
            required: 'Quantity is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Quantity must be at least 1' },
          })}
          error={!!errors.quantity}
          helperText={errors.quantity?.message}
        />
        <TextField
          fullWidth
          label="Revenue"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('revenue', {
            required: 'Revenue is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Revenue must be positive' },
          })}
          error={!!errors.revenue}
          helperText={errors.revenue?.message}
        />
        <TextField
          fullWidth
          label="Weight (kg)"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('weight_kg', {
            required: 'Weight is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Weight must be positive' },
          })}
          error={!!errors.weight_kg}
          helperText={errors.weight_kg?.message}
        />
        <TextField
          fullWidth
          label="Volume (m³)"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('volume_m3', {
            required: 'Volume is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Volume must be positive' },
          })}
          error={!!errors.volume_m3}
          helperText={errors.volume_m3?.message}
        />
        <TextField
          fullWidth
          label="Lines"
          type="number"
          inputProps={{ min: 1 }}
          {...register('lines', {
            required: 'Lines is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Lines must be at least 1' },
          })}
          error={!!errors.lines}
          helperText={errors.lines?.message}
        />
        <TextField
          fullWidth
          label="Pallets"
          type="number"
          inputProps={{ min: 0 }}
          {...register('pallets', {
            required: 'Pallets is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Pallets must be non-negative' },
          })}
          error={!!errors.pallets}
          helperText={errors.pallets?.message}
        />
        <TextField
          fullWidth
          label="Order Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          {...register('order_date', { required: 'Order date is required' })}
          error={!!errors.order_date}
          helperText={errors.order_date?.message}
        />
      </Box>
    </form>
  );
};

export default OrderForm;


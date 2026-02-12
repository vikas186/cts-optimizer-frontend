import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, MenuItem, Box } from '@mui/material';
import { CostResult, Order, Organization } from '../../types/entities';

interface CostResultFormProps {
  data?: CostResult;
  orders: Order[];
  organizations: Organization[];
  onSubmit: (data: Omit<CostResult, 'id' | 'calculated_at'>) => void;
}

type CostResultFormValues = Omit<CostResult, 'id' | 'calculated_at' | 'profitable'> & { profitable: string };

const CostResultForm = ({ data, orders, organizations, onSubmit }: CostResultFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CostResultFormValues>({
    defaultValues: data
      ? {
          ...data,
          profitable: String(data.profitable),
        }
      : {
          order_id: '',
          organization_id: '',
          transport_cost: 0,
          warehouse_cost: 0,
          admin_cost: 0,
          return_cost: 0,
          cost_to_serve: 0,
          profit: 0,
          profitable: 'true',
        },
  });

  const selectedOrgId = watch('organization_id');

  useEffect(() => {
    if (data) {
      reset({
        order_id: data.order_id,
        organization_id: data.organization_id,
        transport_cost: data.transport_cost,
        warehouse_cost: data.warehouse_cost,
        admin_cost: data.admin_cost,
        return_cost: data.return_cost,
        cost_to_serve: data.cost_to_serve,
        profit: data.profit,
        profitable: String(data.profitable),
      });
    }
  }, [data, reset]);

  // Filter orders by selected organization
  const filteredOrders = selectedOrgId
    ? orders.filter((o) => o.organization_id === selectedOrgId)
    : orders;

  const onSubmitForm = (formData: CostResultFormValues) => {
    onSubmit({
      ...formData,
      profitable: formData.profitable === 'true',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} id="cost-result-form">
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
          label="Transport Cost"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('transport_cost', {
            required: 'Transport cost is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost must be positive' },
          })}
          error={!!errors.transport_cost}
          helperText={errors.transport_cost?.message}
        />
        <TextField
          fullWidth
          label="Warehouse Cost"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('warehouse_cost', {
            required: 'Warehouse cost is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost must be positive' },
          })}
          error={!!errors.warehouse_cost}
          helperText={errors.warehouse_cost?.message}
        />
        <TextField
          fullWidth
          label="Admin Cost"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('admin_cost', {
            required: 'Admin cost is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost must be positive' },
          })}
          error={!!errors.admin_cost}
          helperText={errors.admin_cost?.message}
        />
        <TextField
          fullWidth
          label="Return Cost"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('return_cost', {
            required: 'Return cost is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost must be positive' },
          })}
          error={!!errors.return_cost}
          helperText={errors.return_cost?.message}
        />
        <TextField
          fullWidth
          label="Cost to Serve"
          type="number"
          inputProps={{ step: '0.01', min: 0 }}
          {...register('cost_to_serve', {
            required: 'Cost to serve is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Cost must be positive' },
          })}
          error={!!errors.cost_to_serve}
          helperText={errors.cost_to_serve?.message}
        />
        <TextField
          fullWidth
          label="Profit"
          type="number"
          inputProps={{ step: '0.01' }}
          {...register('profit', {
            required: 'Profit is required',
            valueAsNumber: true,
          })}
          error={!!errors.profit}
          helperText={errors.profit?.message}
        />
        <TextField
          fullWidth
          select
          label="Profitable"
          {...register('profitable', { required: true })}
          error={!!errors.profitable}
          helperText={errors.profitable?.message}
          defaultValue={data?.profitable !== undefined ? String(data.profitable) : 'true'}
        >
          <MenuItem value="true">Yes</MenuItem>
          <MenuItem value="false">No</MenuItem>
        </TextField>
      </Box>
    </form>
  );
};

export default CostResultForm;


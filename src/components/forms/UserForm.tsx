import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, MenuItem, Box } from '@mui/material';
import { User, Organization } from '../../types/entities';

export type UserFormData = Omit<User, 'id' | 'created_at'> & { password?: string };

interface UserFormProps {
  data?: User;
  organizations: Organization[];
  onSubmit: (data: UserFormData) => void;
}

const UserForm = ({ data, organizations, onSubmit }: UserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    defaultValues: data
      ? { organization_id: data.organization_id, email: data.email, role: data.role }
      : { organization_id: '', email: '', role: 'user', password: '' },
  });

  useEffect(() => {
    if (data) {
      reset({
        organization_id: data.organization_id,
        email: data.email,
        role: data.role,
      });
    }
  }, [data, reset]);

  const onSubmitForm = (formData: UserFormData) => {
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} id="user-form">
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
          label="Email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        {!data && (
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register('password', { required: !data ? 'Password is required' : false })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
        {data && (
          <TextField
            fullWidth
            label="New password (leave blank to keep)"
            type="password"
            {...register('password')}
          />
        )}
        <TextField
          fullWidth
          select
          label="Role"
          {...register('role', { required: 'Role is required' })}
          error={!!errors.role}
          helperText={errors.role?.message}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </TextField>
      </Box>
    </form>
  );
};

export default UserForm;


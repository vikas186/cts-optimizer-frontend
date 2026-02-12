import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Box } from '@mui/material';
import { Organization } from '../../types/entities';

interface OrganizationFormProps {
  data?: Organization;
  onSubmit: (data: Omit<Organization, 'id' | 'created_at'>) => void;
}

const OrganizationForm = ({ data, onSubmit }: OrganizationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<Organization, 'id' | 'created_at'>>({
    defaultValues: data || { name: '' },
  });

  useEffect(() => {
    if (data) {
      reset({ name: data.name });
    }
  }, [data, reset]);

  const onSubmitForm = (formData: Omit<Organization, 'id' | 'created_at'>) => {
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} id="organization-form">
      <Box className="space-y-4">
        <TextField
          fullWidth
          label="Organization Name"
          {...register('name', { required: 'Organization name is required' })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
      </Box>
    </form>
  );
};

export default OrganizationForm;


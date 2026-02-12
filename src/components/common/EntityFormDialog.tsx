import { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';

interface EntityFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
}

const EntityFormDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  children,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  maxWidth = 'md',
  loading = false,
}: EntityFormDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle className="font-semibold">{title}</DialogTitle>
      <DialogContent>
        <Box className="pt-2">{children}</Box>
      </DialogContent>
      <DialogActions className="px-6 py-4">
        <Button onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntityFormDialog;


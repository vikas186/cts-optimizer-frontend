import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Box, Paper, Typography, Button, Alert, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { uploadApi } from '../services/backend';

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [result, setResult] = useState<{
    imported: { warehouse_costs: number; transport_costs: number; orders: number };
    calculations?: { dropSize?: { calculated: number }; costToServe?: { calculated: number } };
    errors?: Array<{ sheet?: string; message?: string }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      const msg = 'Please select an Excel file (.xlsx or .xls)';
      setError(msg);
      toast.error(msg);
      return;
    }
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const data = await uploadApi.uploadExcel(file);
      setResult({ imported: data.imported, calculations: data.calculations });
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      const calc = data.calculations;
      const calcNote =
        calc?.dropSize || calc?.costToServe
          ? ` Calculated: ${calc.costToServe?.calculated ?? '—'} cost-to-serve, ${calc.dropSize?.calculated ?? '—'} drop-size.`
          : '';
      toast.success(
        `Imported: ${data.imported.warehouse_costs} warehouse costs, ${data.imported.transport_costs} transport costs, ${data.imported.orders} orders.${calcNote}`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
      toast.error(msg);
      const ax = err as { response?: { data?: { errors?: Array<{ sheet?: string; message?: string }> } } };
      if (ax.response?.data?.errors) {
        setResult((r) => ({ ...r, imported: (r?.imported ?? { warehouse_costs: 0, transport_costs: 0, orders: 0 }), errors: ax.response!.data!.errors }));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('Permanently delete all Excel-imported data for your organization (orders, costs, routes, customers, results)?')) return;
    setDeleting(true);
    setError(null);
    setResult(null);
    try {
      await uploadApi.deleteExcelData();
      setResult(null);
      setError(null);
      toast.success('All Excel data deleted.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" className="mb-6 font-semibold">
        Import data
      </Typography>
      <Paper className="p-6 max-w-2xl">
        <Typography variant="subtitle1" className="mb-2 font-medium">
          Upload Excel (CTS template)
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-4">
          Upload a workbook with sheets: <code>warehouse_costs</code>, <code>transport_costs</code>, and <code>orders</code>. Customers and routes are created from IDs in the file.
        </Typography>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-50 file:text-primary-700"
        />
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={handleUpload}
          disabled={uploading || !file}
        >
          {uploading ? 'Uploading…' : 'Upload'}
        </Button>
        {uploading && <LinearProgress className="mt-4" />}

        {result && (
          <Alert severity="info" className="mt-4">
            Imported: {result.imported.warehouse_costs} warehouse costs, {result.imported.transport_costs} transport costs, {result.imported.orders} orders.
            {result.calculations?.costToServe != null || result.calculations?.dropSize != null ? (
              <>
                {' '}
                Auto-calculated: {result.calculations.costToServe?.calculated ?? '—'} cost-to-serve,{' '}
                {result.calculations.dropSize?.calculated ?? '—'} drop-size orders.
              </>
            ) : null}
            {result.errors?.length ? ` Errors: ${result.errors.map((e) => e.message || e.sheet).join('; ')}` : ''}
          </Alert>
        )}
        {error && (
          <Alert severity="error" className="mt-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Typography variant="subtitle1" className="mt-8 mb-2 font-medium">
          Clear imported data
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-4">
          Remove all data that was imported via Excel for your organization (cost results, drop size results, orders, transport costs, warehouse costs, routes, customers).
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteSweepIcon />}
          onClick={handleClearData}
          disabled={deleting}
        >
          {deleting ? 'Deleting…' : 'Clear Excel data'}
        </Button>
      </Paper>
    </Box>
  );
};

export default Upload;

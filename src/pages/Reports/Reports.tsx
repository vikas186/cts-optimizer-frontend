import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Box,
  Typography,
  Button,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import DataTable, { Column } from '../../components/common/DataTable';
import {
  REPORT_SLUGS,
  REPORT_LABELS,
  ReportSlug,
  reportApi,
  calculateApi,
} from '../../services/backend';
import { parseCsv } from '../../utils/csv';
import { formatReportCell, humanizeColumnHeader } from '../../utils/reportFormatters';

const REPORTS_NOT_READY = 'Upload data and run calculation first.';

type ReportCache = {
  headers: string[];
  rows: Record<string, string>[];
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const Reports = () => {
  const [tab, setTab] = useState(0);
  const slug = REPORT_SLUGS[tab];
  const [cache, setCache] = useState<Partial<Record<ReportSlug, ReportCache>>>({});
  const [notReady, setNotReady] = useState<Partial<Record<ReportSlug, boolean>>>({});
  const [loadingSlug, setLoadingSlug] = useState<ReportSlug | null>(null);
  const [downloadSlug, setDownloadSlug] = useState<ReportSlug | null>(null);
  const [recalculating, setRecalculating] = useState(false);
  const cacheRef = useRef(cache);
  cacheRef.current = cache;

  const loadReport = useCallback(async (reportSlug: ReportSlug, force = false) => {
    if (!force && cacheRef.current[reportSlug]) return;
    setLoadingSlug(reportSlug);
    setNotReady((prev) => ({ ...prev, [reportSlug]: false }));
    try {
      const text = await reportApi.fetchCsv(reportSlug);
      const parsed = parseCsv(text);
      setCache((prev) => ({ ...prev, [reportSlug]: parsed }));
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setNotReady((prev) => ({ ...prev, [reportSlug]: true }));
        setCache((prev) => {
          const next = { ...prev };
          delete next[reportSlug];
          return next;
        });
      } else {
        const msg = err instanceof Error ? err.message : 'Failed to load report';
        toast.error(msg);
      }
    } finally {
      setLoadingSlug(null);
    }
  }, []);

  useEffect(() => {
    void loadReport(REPORT_SLUGS[tab]);
  }, [tab, loadReport]);

  const handleTabChange = (_: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  const handleDownload = async (reportSlug: ReportSlug) => {
    setDownloadSlug(reportSlug);
    try {
      const blob = await reportApi.downloadBlob(reportSlug);
      downloadBlob(blob, `${reportSlug}.csv`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        toast.error(REPORTS_NOT_READY);
      } else {
        toast.error(err instanceof Error ? err.message : 'Download failed');
      }
    } finally {
      setDownloadSlug(null);
    }
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      const res = await calculateApi.runAll();
      toast.success(
        `Recalculated: ${res.cost_to_serve.calculated} cost-to-serve, ${res.drop_size.calculated} drop-size.`
      );
      setCache({});
      setNotReady({});
      await loadReport(slug, true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Recalculation failed');
    } finally {
      setRecalculating(false);
    }
  };

  const current = cache[slug];
  const columns: Column<Record<string, string>>[] = useMemo(() => {
    if (!current?.headers.length) return [];
    return current.headers.map((h) => ({
      id: h,
      label: humanizeColumnHeader(h),
      align: /cost|revenue|profit|cts|savings|margin|allocated|expected|quantity|volume/i.test(h)
        ? 'right'
        : 'left',
      format: (value: string) => formatReportCell(h, value),
    }));
  }, [current]);

  const showNotReady = notReady[slug];
  const isLoading = loadingSlug === slug;

  return (
    <Box>
      <Box className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Typography variant="h4" className="font-semibold">
          Reports
        </Typography>
        <Box className="flex flex-wrap gap-2">
          <Button
            variant="contained"
            startIcon={recalculating ? <CircularProgress size={18} color="inherit" /> : <CalculateIcon />}
            onClick={handleRecalculate}
            disabled={recalculating}
          >
            {recalculating ? 'Recalculating…' : 'Recalculate'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload(slug)}
            disabled={!!downloadSlug}
          >
            {downloadSlug === slug ? 'Downloading…' : 'Download CSV'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => loadReport(slug, true)}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" className="mb-4">
        Summary and analysis reports generated after Excel upload or recalculation. Data is CSV-only; tables below are parsed client-side.
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        className="mb-4 border-b"
      >
        {REPORT_SLUGS.map((s) => (
          <Tab key={s} label={REPORT_LABELS[s]} />
        ))}
      </Tabs>

      {isLoading && <LinearProgress className="mb-4" />}

      {showNotReady && (
        <Alert severity="warning" className="mb-4">
          {REPORTS_NOT_READY}
        </Alert>
      )}

      {!showNotReady && !current && !isLoading && (
        <Alert severity="info" className="mb-4">
          Select a report tab or click Refresh to load data.
        </Alert>
      )}

      {current && current.rows.length > 0 && (
        <DataTable
          title={REPORT_LABELS[slug]}
          columns={columns}
          data={current.rows}
          searchPlaceholder={`Search ${REPORT_LABELS[slug].toLowerCase()}…`}
          getRowId={(row) => current.headers.map((h) => row[h]).join('\0')}
        />
      )}

      {current && current.rows.length === 0 && !isLoading && (
        <Alert severity="info">No rows in this report.</Alert>
      )}
    </Box>
  );
};

export default Reports;

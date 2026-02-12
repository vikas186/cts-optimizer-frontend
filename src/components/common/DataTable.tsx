import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  InputAdornment,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  searchPlaceholder?: string;
  title?: string;
  getRowId: (row: T) => string | number;
}

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder = 'Search...',
  title,
  getRowId,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.id as keyof T];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const renderCellContent = (column: Column<T>, row: T) => {
    const value = row[column.id as keyof T];
    if (column.format) {
      return column.format(value, row);
    }
    return value?.toString() || '-';
  };

  if (isMobile) {
    // Mobile card view
    return (
      <Box>
        {title && (
          <Typography variant="h5" className="mb-4 font-semibold">
            {title}
          </Typography>
        )}
        <Box className="mb-4">
          <TextField
            fullWidth
            size="small"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box className="space-y-4">
          {paginatedData.map((row) => (
            <Card key={getRowId(row)} className="shadow-sm">
              <CardContent>
                {columns.map((column) => (
                  <Box key={String(column.id)} className="mb-3 last:mb-0">
                    <Typography variant="caption" className="text-gray-500 font-medium">
                      {column.label}
                    </Typography>
                    <Typography variant="body2" className="mt-1">
                      {renderCellContent(column, row)}
                    </Typography>
                  </Box>
                ))}
                <Box className="flex gap-2 mt-4 pt-4 border-t">
                  {onView && (
                    <IconButton size="small" onClick={() => onView(row)} color="primary">
                      <VisibilityIcon />
                    </IconButton>
                  )}
                  {onEdit && (
                    <IconButton size="small" onClick={() => onEdit(row)} color="primary">
                      <EditIcon />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton size="small" onClick={() => onDelete(row)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
        <TablePagination
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          className="mt-4"
        />
      </Box>
    );
  }

  // Desktop table view
  return (
    <Paper className="shadow-sm">
      {title && (
        <Box className="p-4 border-b">
          <Typography variant="h5" className="font-semibold">
            {title}
          </Typography>
        </Box>
      )}
      <Box className="p-4 border-b">
        <TextField
          fullWidth
          size="small"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  className="font-semibold bg-gray-50"
                >
                  {column.label}
                </TableCell>
              ))}
              {(onEdit || onDelete || onView) && (
                <TableCell align="right" className="font-semibold bg-gray-50">
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)} align="center">
                  <Typography className="py-8 text-gray-500">No data available</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={getRowId(row)}>
                  {columns.map((column) => {
                    return (
                      <TableCell key={String(column.id)} align={column.align}>
                        {renderCellContent(column, row)}
                      </TableCell>
                    );
                  })}
                  {(onEdit || onDelete || onView) && (
                    <TableCell align="right">
                      <Box className="flex justify-end gap-1">
                        {onView && (
                          <IconButton size="small" onClick={() => onView(row)} color="primary">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        )}
                        {onEdit && (
                          <IconButton size="small" onClick={() => onEdit(row)} color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                        {onDelete && (
                          <IconButton size="small" onClick={() => onDelete(row)} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default DataTable;


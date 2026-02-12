/**
 * Backend API — aligned with current backend (read-only data + upload/calculate/export).
 * - Auth: register (email+password), login, getMe
 * - Entities: GET list + GET by id only (no create/update/delete; data via Excel upload)
 * - Upload: POST /api/upload/excel, DELETE /api/upload/excel-data
 * - Calculate: POST cost-to-serve, drop-size, all
 * - Export: GET CSV endpoints
 */
import { api, unwrap } from './api';
import type {
  Organization,
  User,
  Customer,
  Route,
  WarehouseCost,
  TransportCost,
  Order,
  CostResult,
  DropSizeResult,
} from '../types/entities';

// --- Organizations (GET only) ---
export const organizationApi = {
  getAll: (): Promise<Organization[]> =>
    api.get('/organizations').then((r) => unwrap(r) as Organization[]),
  getById: (id: string): Promise<Organization> =>
    api.get(`/organizations/${id}`).then((r) => unwrap(r) as Organization),
};

// --- Users (GET only) ---
export const userApi = {
  getAll: (): Promise<User[]> =>
    api.get('/users').then((r) => unwrap(r) as User[]),
  getById: (id: string): Promise<User> =>
    api.get(`/users/${id}`).then((r) => unwrap(r) as User),
};

// --- Customers (GET only) ---
export const customerApi = {
  getAll: (): Promise<Customer[]> =>
    api.get('/customers').then((r) => unwrap(r) as Customer[]),
  getById: (id: string): Promise<Customer> =>
    api.get(`/customers/${id}`).then((r) => unwrap(r) as Customer),
};

// --- Routes (GET only) ---
export const routeApi = {
  getAll: (): Promise<Route[]> =>
    api.get('/routes').then((r) => unwrap(r) as Route[]),
  getById: (id: string): Promise<Route> =>
    api.get(`/routes/${id}`).then((r) => unwrap(r) as Route),
};

// --- Warehouse Costs (GET only) ---
export const warehouseCostApi = {
  getAll: (): Promise<WarehouseCost[]> =>
    api.get('/warehouse-costs').then((r) => unwrap(r) as WarehouseCost[]),
  getById: (id: string): Promise<WarehouseCost> =>
    api.get(`/warehouse-costs/${id}`).then((r) => unwrap(r) as WarehouseCost),
};

// --- Transport Costs (GET only) ---
export const transportCostApi = {
  getAll: (): Promise<TransportCost[]> =>
    api.get('/transport-costs').then((r) => unwrap(r) as TransportCost[]),
  getById: (id: string): Promise<TransportCost> =>
    api.get(`/transport-costs/${id}`).then((r) => unwrap(r) as TransportCost),
};

// --- Orders (GET only) ---
export const orderApi = {
  getAll: (): Promise<Order[]> =>
    api.get('/orders').then((r) => unwrap(r) as Order[]),
  getById: (id: string): Promise<Order> =>
    api.get(`/orders/${id}`).then((r) => unwrap(r) as Order),
};

// --- Cost Results (GET only) ---
export const costResultApi = {
  getAll: (): Promise<CostResult[]> =>
    api.get('/cost-results').then((r) => unwrap(r) as CostResult[]),
  getById: (id: string): Promise<CostResult> =>
    api.get(`/cost-results/${id}`).then((r) => unwrap(r) as CostResult),
};

// --- Drop Size Results (GET only) ---
export const dropSizeResultApi = {
  getAll: (): Promise<DropSizeResult[]> =>
    api.get('/drop-size-results').then((r) => unwrap(r) as DropSizeResult[]),
  getById: (id: string): Promise<DropSizeResult> =>
    api.get(`/drop-size-results/${id}`).then((r) => unwrap(r) as DropSizeResult),
};

// --- Upload ---
export interface UploadExcelResult {
  imported: { warehouse_costs: number; transport_costs: number; orders: number };
  parsed_counts?: { warehouse_costs: number; transport_costs: number; orders: number };
  errors?: Array<{ sheet?: string; message?: string }>;
}
type DeletedCounts = Record<string, number>;

export const uploadApi = {
  uploadExcel: (file: File): Promise<UploadExcelResult> => {
    const form = new FormData();
    form.append('file', file);
    return api
      .post<{ success?: boolean; message?: string; data?: UploadExcelResult; errors?: Array<{ sheet?: string; message?: string }> }>(
        '/upload/excel',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      .then((r) => {
        const body = r.data;
        if (body?.data) {
          return { ...body.data, errors: body.errors };
        }
        throw new Error(body?.message || 'Upload failed');
      });
  },
  deleteExcelData: (): Promise<{ deleted: DeletedCounts }> =>
    api.delete('/upload/excel-data').then((r) => {
      const data = unwrap(r) as { deleted?: DeletedCounts };
      return { deleted: data?.deleted ?? {} };
    }),
};

// --- Calculate ---
export const calculateApi = {
  runCostToServe: (): Promise<{ calculated: number }> =>
    api.post('/calculate/cost-to-serve').then((r) => unwrap(r) as { calculated: number }),
  runDropSize: (): Promise<{ calculated: number }> =>
    api.post('/calculate/drop-size').then((r) => unwrap(r) as { calculated: number }),
  runAll: (): Promise<{ cost_to_serve: { calculated: number }; drop_size: { calculated: number } }> =>
    api.post('/calculate/all').then((r) => unwrap(r) as { cost_to_serve: { calculated: number }; drop_size: { calculated: number } }),
};

// --- Export (CSV download) ---
export const exportApi = {
  costResults: (includeOrder?: boolean): Promise<Blob> =>
    api
      .get('/export/cost-results', {
        params: includeOrder ? { includeOrder: '1' } : undefined,
        responseType: 'blob',
      })
      .then((r) => r.data as Blob),
  dropSizeResults: (): Promise<Blob> =>
    api.get('/export/drop-size-results', { responseType: 'blob' }).then((r) => r.data as Blob),
  ordersWithAnalytics: (): Promise<Blob> =>
    api.get('/export/orders-with-analytics', { responseType: 'blob' }).then((r) => r.data as Blob),
};

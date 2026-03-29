// Entity type definitions based on ERD

export interface Organization {
  id: string; // uuid
  name: string;
  created_at: string; // timestamp
}

export interface User {
  id: string; // uuid
  organization_id: string; // uuid, FK to Organizations
  email: string;
  role: string;
  created_at: string; // timestamp
  updated_at?: string;
}

export interface Customer {
  id?: string; // uuid (backend)
  customer_id: string;
  organization_id: string;
  segment: string;
  revenue_per_unit: number;
  created_at?: string;
  updated_at?: string;
}

export interface WarehouseCost {
  id: string;
  organization_id: string;
  pick_cost_per_line: number;
  pack_cost: number;
  pallet_handling_cost: number;
  storage_cost_per_day: number;
  effective_from: string;
  created_at?: string;
  updated_at?: string;
}

export interface Route {
  id?: string; // uuid (backend)
  route_id: string;
  organization_id: string;
  distance_km: number;
  created_at?: string;
  updated_at?: string;
}

export interface TransportCost {
  id: string;
  route_id: string;
  organization_id: string;
  base_cost: number;
  cost_per_kg: number;
  cost_per_km: number;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id?: string;
  order_id: string;
  organization_id: string;
  customer_id: string;
  route_id: string;
  sku: string;
  quantity: number;
  revenue: number;
  weight_kg: number;
  volume_m3: number;
  lines: number;
  pallets: number;
  order_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface CostResult {
  id: string; // uuid
  order_id: string; // FK to Orders
  organization_id: string; // uuid, FK to Organizations
  transport_cost: number; // float
  warehouse_cost: number; // float
  admin_cost: number; // float
  return_cost: number; // float
  cost_to_serve: number; // float
  profit: number; // float
  profit_margin_pct?: number | null; // float
  profitable: boolean;
  calculated_at: string; // timestamp
}

export interface DropSizeResult {
  id: string; // uuid
  order_id: string; // FK to Orders
  organization_id: string; // uuid, FK to Organizations
  fixed_cost: number; // float
  unit_variable_cost: number; // float
  unit_revenue: number; // float
  min_profitable_quantity: number; // float
  calculated_at: string; // timestamp
}


import {
  Organization,
  User,
  Customer,
  WarehouseCost,
  Route,
  TransportCost,
  Order,
  CostResult,
  DropSizeResult,
} from '../types/entities';

// Generate UUID helper
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Mock data storage
let organizations: Organization[] = [];
let users: User[] = [];
let customers: Customer[] = [];
let warehouseCosts: WarehouseCost[] = [];
let routes: Route[] = [];
let transportCosts: TransportCost[] = [];
let orders: Order[] = [];
let costResults: CostResult[] = [];
let dropSizeResults: DropSizeResult[] = [];

// Initialize mock data
const initializeMockData = () => {
  // Organizations
  organizations = [
    {
      id: 'org-1',
      name: 'Acme Corporation',
      created_at: new Date('2023-01-15').toISOString(),
    },
    {
      id: 'org-2',
      name: 'Global Logistics Inc',
      created_at: new Date('2023-02-20').toISOString(),
    },
    {
      id: 'org-3',
      name: 'Supply Chain Solutions',
      created_at: new Date('2023-03-10').toISOString(),
    },
  ];

  // Users
  users = [
    {
      id: 'user-1',
      organization_id: 'org-1',
      email: 'admin@acme.com',
      role: 'admin',
      created_at: new Date('2023-01-16').toISOString(),
    },
    {
      id: 'user-2',
      organization_id: 'org-1',
      email: 'manager@acme.com',
      role: 'manager',
      created_at: new Date('2023-01-17').toISOString(),
    },
    {
      id: 'user-3',
      organization_id: 'org-2',
      email: 'admin@global.com',
      role: 'admin',
      created_at: new Date('2023-02-21').toISOString(),
    },
    {
      id: 'user-4',
      organization_id: 'org-3',
      email: 'user@supply.com',
      role: 'user',
      created_at: new Date('2023-03-11').toISOString(),
    },
  ];

  // Customers
  customers = [
    { customer_id: 'CUST-001', organization_id: 'org-1', segment: 'Enterprise', revenue_per_unit: 150.0 },
    { customer_id: 'CUST-002', organization_id: 'org-1', segment: 'SMB', revenue_per_unit: 75.0 },
    { customer_id: 'CUST-003', organization_id: 'org-1', segment: 'Enterprise', revenue_per_unit: 200.0 },
    { customer_id: 'CUST-004', organization_id: 'org-2', segment: 'Enterprise', revenue_per_unit: 180.0 },
    { customer_id: 'CUST-005', organization_id: 'org-2', segment: 'SMB', revenue_per_unit: 90.0 },
    { customer_id: 'CUST-006', organization_id: 'org-3', segment: 'Enterprise', revenue_per_unit: 220.0 },
  ];

  // Routes
  routes = [
    { route_id: 'ROUTE-001', organization_id: 'org-1', distance_km: 150.5 },
    { route_id: 'ROUTE-002', organization_id: 'org-1', distance_km: 75.2 },
    { route_id: 'ROUTE-003', organization_id: 'org-1', distance_km: 200.0 },
    { route_id: 'ROUTE-004', organization_id: 'org-2', distance_km: 120.8 },
    { route_id: 'ROUTE-005', organization_id: 'org-2', distance_km: 95.3 },
    { route_id: 'ROUTE-006', organization_id: 'org-3', distance_km: 180.7 },
  ];

  // Warehouse Costs
  warehouseCosts = [
    {
      id: 'wc-1',
      organization_id: 'org-1',
      pick_cost_per_line: 2.5,
      pack_cost: 5.0,
      pallet_handling_cost: 15.0,
      storage_cost_per_day: 0.5,
      effective_from: new Date('2023-01-01').toISOString(),
    },
    {
      id: 'wc-2',
      organization_id: 'org-1',
      pick_cost_per_line: 2.8,
      pack_cost: 5.5,
      pallet_handling_cost: 16.0,
      storage_cost_per_day: 0.6,
      effective_from: new Date('2023-06-01').toISOString(),
    },
    {
      id: 'wc-3',
      organization_id: 'org-2',
      pick_cost_per_line: 3.0,
      pack_cost: 6.0,
      pallet_handling_cost: 18.0,
      storage_cost_per_day: 0.7,
      effective_from: new Date('2023-02-01').toISOString(),
    },
    {
      id: 'wc-4',
      organization_id: 'org-3',
      pick_cost_per_line: 2.2,
      pack_cost: 4.5,
      pallet_handling_cost: 14.0,
      storage_cost_per_day: 0.4,
      effective_from: new Date('2023-03-01').toISOString(),
    },
  ];

  // Transport Costs
  transportCosts = [
    {
      id: 'tc-1',
      route_id: 'ROUTE-001',
      organization_id: 'org-1',
      base_cost: 100.0,
      cost_per_kg: 0.5,
      cost_per_km: 1.2,
    },
    {
      id: 'tc-2',
      route_id: 'ROUTE-002',
      organization_id: 'org-1',
      base_cost: 80.0,
      cost_per_kg: 0.4,
      cost_per_km: 1.0,
    },
    {
      id: 'tc-3',
      route_id: 'ROUTE-003',
      organization_id: 'org-1',
      base_cost: 120.0,
      cost_per_kg: 0.6,
      cost_per_km: 1.5,
    },
    {
      id: 'tc-4',
      route_id: 'ROUTE-004',
      organization_id: 'org-2',
      base_cost: 95.0,
      cost_per_kg: 0.45,
      cost_per_km: 1.1,
    },
    {
      id: 'tc-5',
      route_id: 'ROUTE-005',
      organization_id: 'org-2',
      base_cost: 85.0,
      cost_per_kg: 0.42,
      cost_per_km: 1.0,
    },
    {
      id: 'tc-6',
      route_id: 'ROUTE-006',
      organization_id: 'org-3',
      base_cost: 110.0,
      cost_per_kg: 0.55,
      cost_per_km: 1.3,
    },
  ];

  // Orders
  orders = [
    {
      order_id: 'ORD-001',
      organization_id: 'org-1',
      customer_id: 'CUST-001',
      route_id: 'ROUTE-001',
      sku: 'SKU-1001',
      quantity: 50,
      revenue: 7500.0,
      weight_kg: 250.0,
      volume_m3: 2.5,
      lines: 10,
      pallets: 2,
      order_date: '2023-04-15',
    },
    {
      order_id: 'ORD-002',
      organization_id: 'org-1',
      customer_id: 'CUST-002',
      route_id: 'ROUTE-002',
      sku: 'SKU-1002',
      quantity: 30,
      revenue: 2250.0,
      weight_kg: 150.0,
      volume_m3: 1.5,
      lines: 5,
      pallets: 1,
      order_date: '2023-04-16',
    },
    {
      order_id: 'ORD-003',
      organization_id: 'org-1',
      customer_id: 'CUST-003',
      route_id: 'ROUTE-003',
      sku: 'SKU-1003',
      quantity: 100,
      revenue: 20000.0,
      weight_kg: 500.0,
      volume_m3: 5.0,
      lines: 20,
      pallets: 5,
      order_date: '2023-04-17',
    },
    {
      order_id: 'ORD-004',
      organization_id: 'org-2',
      customer_id: 'CUST-004',
      route_id: 'ROUTE-004',
      sku: 'SKU-2001',
      quantity: 75,
      revenue: 13500.0,
      weight_kg: 375.0,
      volume_m3: 3.75,
      lines: 15,
      pallets: 3,
      order_date: '2023-04-18',
    },
    {
      order_id: 'ORD-005',
      organization_id: 'org-2',
      customer_id: 'CUST-005',
      route_id: 'ROUTE-005',
      sku: 'SKU-2002',
      quantity: 40,
      revenue: 3600.0,
      weight_kg: 200.0,
      volume_m3: 2.0,
      lines: 8,
      pallets: 2,
      order_date: '2023-04-19',
    },
    {
      order_id: 'ORD-006',
      organization_id: 'org-3',
      customer_id: 'CUST-006',
      route_id: 'ROUTE-006',
      sku: 'SKU-3001',
      quantity: 120,
      revenue: 26400.0,
      weight_kg: 600.0,
      volume_m3: 6.0,
      lines: 25,
      pallets: 6,
      order_date: '2023-04-20',
    },
  ];

  // Cost Results
  costResults = orders.map((order) => {
    const transportCost = transportCosts.find((tc) => tc.route_id === order.route_id);
    const warehouseCost = warehouseCosts.find((wc) => wc.organization_id === order.organization_id);
    
    const transport = transportCost
      ? transportCost.base_cost +
        transportCost.cost_per_kg * order.weight_kg +
        transportCost.cost_per_km * order.weight_kg
      : 0;
    
    const warehouse = warehouseCost
      ? warehouseCost.pick_cost_per_line * order.lines +
        warehouseCost.pack_cost +
        warehouseCost.pallet_handling_cost * order.pallets
      : 0;
    
    const admin = order.revenue * 0.05;
    const returnCost = order.revenue * 0.02;
    const costToServe = transport + warehouse + admin + returnCost;
    const profit = order.revenue - costToServe;
    
    return {
      id: generateUUID(),
      order_id: order.order_id,
      organization_id: order.organization_id,
      transport_cost: transport,
      warehouse_cost: warehouse,
      admin_cost: admin,
      return_cost: returnCost,
      cost_to_serve: costToServe,
      profit: profit,
      profitable: profit > 0,
      calculated_at: new Date().toISOString(),
    };
  });

  // Drop Size Results
  dropSizeResults = orders.map((order) => {
    const customer = customers.find((c) => c.customer_id === order.customer_id);
    const warehouseCost = warehouseCosts.find((wc) => wc.organization_id === order.organization_id);
    const transportCost = transportCosts.find((tc) => tc.route_id === order.route_id);
    
    const fixedCost = transportCost ? transportCost.base_cost : 0;
    const unitVariableCost = warehouseCost
      ? warehouseCost.pick_cost_per_line + warehouseCost.pack_cost / order.quantity
      : 0;
    const unitRevenue = customer ? customer.revenue_per_unit : 0;
    const minProfitableQuantity = unitRevenue > unitVariableCost
      ? Math.ceil(fixedCost / (unitRevenue - unitVariableCost))
      : 0;
    
    return {
      id: generateUUID(),
      order_id: order.order_id,
      organization_id: order.organization_id,
      fixed_cost: fixedCost,
      unit_variable_cost: unitVariableCost,
      unit_revenue: unitRevenue,
      min_profitable_quantity: minProfitableQuantity,
      calculated_at: new Date().toISOString(),
    };
  });
};

// Initialize on import
initializeMockData();

// API functions for Organizations
export const organizationService = {
  getAll: async (): Promise<Organization[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...organizations];
  },
  getById: async (id: string): Promise<Organization | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return organizations.find((o) => o.id === id);
  },
  create: async (data: Omit<Organization, 'id' | 'created_at'>): Promise<Organization> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newOrg: Organization = {
      ...data,
      id: generateUUID(),
      created_at: new Date().toISOString(),
    };
    organizations.push(newOrg);
    return newOrg;
  },
  update: async (id: string, data: Partial<Organization>): Promise<Organization> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = organizations.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Organization not found');
    organizations[index] = { ...organizations[index], ...data };
    return organizations[index];
  },
  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = organizations.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Organization not found');
    organizations.splice(index, 1);
  },
};

// API functions for Users
export const userService = {
  getAll: async (): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...users];
  },
  getById: async (id: string): Promise<User | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return users.find((u) => u.id === id);
  },
  create: async (data: Omit<User, 'id' | 'created_at'>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newUser: User = {
      ...data,
      id: generateUUID(),
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
  },
  update: async (id: string, data: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...data };
    return users[index];
  },
  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    users.splice(index, 1);
  },
};

// API functions for Customers
export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...customers];
  },
  getById: async (id: string): Promise<Customer | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return customers.find((c) => c.customer_id === id);
  },
  create: async (data: Customer): Promise<Customer> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    customers.push(data);
    return data;
  },
  update: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = customers.findIndex((c) => c.customer_id === id);
    if (index === -1) throw new Error('Customer not found');
    customers[index] = { ...customers[index], ...data };
    return customers[index];
  },
  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = customers.findIndex((c) => c.customer_id === id);
    if (index === -1) throw new Error('Customer not found');
    customers.splice(index, 1);
  },
};

// API functions for WarehouseCosts
export const warehouseCostService = {
  getAll: async (): Promise<WarehouseCost[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...warehouseCosts];
  },
  getById: async (id: string): Promise<WarehouseCost | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return warehouseCosts.find((wc) => wc.id === id);
  },
  create: async (data: Omit<WarehouseCost, 'id'>): Promise<WarehouseCost> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newWC: WarehouseCost = {
      ...data,
      id: generateUUID(),
    };
    warehouseCosts.push(newWC);
    return newWC;
  },
  update: async (id: string, data: Partial<WarehouseCost>): Promise<WarehouseCost> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = warehouseCosts.findIndex((wc) => wc.id === id);
    if (index === -1) throw new Error('WarehouseCost not found');
    warehouseCosts[index] = { ...warehouseCosts[index], ...data };
    return warehouseCosts[index];
  },
  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = warehouseCosts.findIndex((wc) => wc.id === id);
    if (index === -1) throw new Error('WarehouseCost not found');
    warehouseCosts.splice(index, 1);
  },
};

// API functions for Routes
export const routeService = {
  getAll: async (): Promise<Route[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...routes];
  },
  getById: async (id: string): Promise<Route | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return routes.find((r) => r.route_id === id);
  },
  create: async (data: Route): Promise<Route> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    routes.push(data);
    return data;
  },
  update: async (id: string, data: Partial<Route>): Promise<Route> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = routes.findIndex((r) => r.route_id === id);
    if (index === -1) throw new Error('Route not found');
    routes[index] = { ...routes[index], ...data };
    return routes[index];
  },
  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = routes.findIndex((r) => r.route_id === id);
    if (index === -1) throw new Error('Route not found');
    routes.splice(index, 1);
  },
};

// API functions for TransportCosts
export const transportCostService = {
  getAll: async (): Promise<TransportCost[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...transportCosts];
  },
  getById: async (id: string): Promise<TransportCost | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return transportCosts.find((tc) => tc.id === id);
  },
  create: async (data: Omit<TransportCost, 'id'>): Promise<TransportCost> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newTC: TransportCost = {
      ...data,
      id: generateUUID(),
    };
    transportCosts.push(newTC);
    return newTC;
  },
  update: async (id: string, data: Partial<TransportCost>): Promise<TransportCost> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = transportCosts.findIndex((tc) => tc.id === id);
    if (index === -1) throw new Error('TransportCost not found');
    transportCosts[index] = { ...transportCosts[index], ...data };
    return transportCosts[index];
  },
  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = transportCosts.findIndex((tc) => tc.id === id);
    if (index === -1) throw new Error('TransportCost not found');
    transportCosts.splice(index, 1);
  },
};

// API functions for Orders
export const orderService = {
  getAll: async (): Promise<Order[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...orders];
  },
  getById: async (id: string): Promise<Order | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return orders.find((o) => o.order_id === id);
  },
  create: async (data: Order): Promise<Order> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    orders.push(data);
    return data;
  },
  update: async (id: string, data: Partial<Order>): Promise<Order> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = orders.findIndex((o) => o.order_id === id);
    if (index === -1) throw new Error('Order not found');
    orders[index] = { ...orders[index], ...data };
    return orders[index];
  },
  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = orders.findIndex((o) => o.order_id === id);
    if (index === -1) throw new Error('Order not found');
    orders.splice(index, 1);
  },
};

// API functions for CostResults
export const costResultService = {
  getAll: async (): Promise<CostResult[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...costResults];
  },
  getById: async (id: string): Promise<CostResult | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return costResults.find((cr) => cr.id === id);
  },
  getByOrderId: async (orderId: string): Promise<CostResult[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return costResults.filter((cr) => cr.order_id === orderId);
  },
  create: async (data: Omit<CostResult, 'id' | 'calculated_at'>): Promise<CostResult> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newCR: CostResult = {
      ...data,
      id: generateUUID(),
      calculated_at: new Date().toISOString(),
    };
    costResults.push(newCR);
    return newCR;
  },
  update: async (id: string, data: Partial<CostResult>): Promise<CostResult> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = costResults.findIndex((cr) => cr.id === id);
    if (index === -1) throw new Error('CostResult not found');
    costResults[index] = { ...costResults[index], ...data };
    return costResults[index];
  },
  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = costResults.findIndex((cr) => cr.id === id);
    if (index === -1) throw new Error('CostResult not found');
    costResults.splice(index, 1);
  },
};

// API functions for DropSizeResults
export const dropSizeResultService = {
  getAll: async (): Promise<DropSizeResult[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...dropSizeResults];
  },
  getById: async (id: string): Promise<DropSizeResult | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return dropSizeResults.find((dsr) => dsr.id === id);
  },
  getByOrderId: async (orderId: string): Promise<DropSizeResult[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return dropSizeResults.filter((dsr) => dsr.order_id === orderId);
  },
  create: async (data: Omit<DropSizeResult, 'id' | 'calculated_at'>): Promise<DropSizeResult> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newDSR: DropSizeResult = {
      ...data,
      id: generateUUID(),
      calculated_at: new Date().toISOString(),
    };
    dropSizeResults.push(newDSR);
    return newDSR;
  },
  update: async (id: string, data: Partial<DropSizeResult>): Promise<DropSizeResult> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = dropSizeResults.findIndex((dsr) => dsr.id === id);
    if (index === -1) throw new Error('DropSizeResult not found');
    dropSizeResults[index] = { ...dropSizeResults[index], ...data };
    return dropSizeResults[index];
  },
  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = dropSizeResults.findIndex((dsr) => dsr.id === id);
    if (index === -1) throw new Error('DropSizeResult not found');
    dropSizeResults.splice(index, 1);
  },
};


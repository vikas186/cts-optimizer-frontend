import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import { Reports } from './pages/Reports';

// Organizations
import { OrganizationsList, OrganizationDetails } from './pages/Organizations';

// Users
import { UsersList, UserDetails } from './pages/Users';

// Customers
import { CustomersList, CustomerDetails } from './pages/Customers';

// Routes
import { RoutesList, RouteDetails } from './pages/Routes';

// Warehouse Costs
import { WarehouseCostsList, WarehouseCostDetails } from './pages/WarehouseCosts';

// Transport Costs
import { TransportCostsList, TransportCostDetails } from './pages/TransportCosts';

// Orders
import { OrdersList, OrderDetails } from './pages/Orders';

// Cost Results
import { CostResultsList, CostResultDetails } from './pages/CostResults';

// Drop Size Results
import { DropSizeResultsList, DropSizeResultDetails } from './pages/DropSizeResults';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="p-8">Loading...</div>;
  if (!token) return <Navigate to="/login" state={{ from: { pathname: location.pathname } }} replace />;
  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/reports" element={<Reports />} />
            
            {/* Organizations */}
            <Route path="/organizations" element={<OrganizationsList />} />
            <Route path="/organizations/:id" element={<OrganizationDetails />} />
            
            {/* Users */}
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<UserDetails />} />
            
            {/* Customers */}
            <Route path="/customers" element={<CustomersList />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            
            {/* Routes */}
            <Route path="/routes" element={<RoutesList />} />
            <Route path="/routes/:id" element={<RouteDetails />} />
            
            {/* Warehouse Costs */}
            <Route path="/warehouse-costs" element={<WarehouseCostsList />} />
            <Route path="/warehouse-costs/:id" element={<WarehouseCostDetails />} />
            
            {/* Transport Costs */}
            <Route path="/transport-costs" element={<TransportCostsList />} />
            <Route path="/transport-costs/:id" element={<TransportCostDetails />} />
            
            {/* Orders */}
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            
            {/* Cost Results */}
            <Route path="/cost-results" element={<CostResultsList />} />
            <Route path="/cost-results/:id" element={<CostResultDetails />} />
            
            {/* Drop Size Results */}
            <Route path="/drop-size-results" element={<DropSizeResultsList />} />
            <Route path="/drop-size-results/:id" element={<DropSizeResultDetails />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;


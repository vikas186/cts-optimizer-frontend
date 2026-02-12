import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const drawerWidth = 256;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Import data', path: '/upload', icon: <CloudUploadIcon /> },
  { label: 'Organizations', path: '/organizations', icon: <BusinessIcon /> },
  { label: 'Users', path: '/users', icon: <PersonIcon /> },
  { label: 'Customers', path: '/customers', icon: <PeopleIcon /> },
  { label: 'Warehouse Costs', path: '/warehouse-costs', icon: <WarehouseIcon /> },
  { label: 'Transport Costs', path: '/transport-costs', icon: <LocalShippingIcon /> },
  { label: 'Orders', path: '/orders', icon: <ShoppingCartIcon /> },
  { label: 'Cost Results', path: '/cost-results', icon: <AssessmentIcon /> },
  { label: 'Drop Size Results', path: '/drop-size-results', icon: <AnalyticsIcon /> },
];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box>
      <Toolbar className="bg-primary-500 text-white">
        <Typography variant="h6" noWrap component="div" className="font-semibold">
          CTS Optimizer
        </Typography>
      </Toolbar>
      {user && (
        <Box className="px-4 py-2 border-b text-sm text-gray-600">
          {user.email}
        </Box>
      )}
      <List className="pt-2">
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              className={`${
                location.pathname === item.path
                  ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-500'
                  : 'hover:bg-gray-100'
              }`}
            >
              <ListItemIcon
                className={
                  location.pathname === item.path ? 'text-primary-600' : 'text-gray-600'
                }
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={() => logout()} className="hover:bg-gray-100">
            <ListItemIcon className="text-gray-600">
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box component="nav" className="md:block">
      {isMobile && (
        <Box className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md md:hidden">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" className="ml-2 font-semibold">
              CTS Optimizer
            </Typography>
          </Toolbar>
        </Box>
      )}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Navigation;


import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box className="flex min-h-screen bg-gray-50">
      <Navigation />
      <Box className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <Container maxWidth="xl" className="py-6 px-4 md:px-6">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;


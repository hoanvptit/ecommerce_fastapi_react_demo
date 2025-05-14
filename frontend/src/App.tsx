import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { ProductList } from './components/ProductList';
import { CategoryList } from './components/CategoryList';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import ProductTable from './components/ProductTable';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const MainContent = styled(Box)<{ theme?: Theme }>(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    [theme.breakpoints.up('md')]: '250px 1fr'
  },
  gap: theme.spacing(3),
}));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                E-Commerce Store
              </Typography>
            </Toolbar>
          </AppBar>
          <Container sx={{ mt: 3 }}>
            <MainContent>
              <Box>
                <CategoryList />
              </Box>
              <Box>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <ProductList />
                    </ProtectedRoute>
                  } />
                  <Route path="/category/:categoryId" element={
                    <ProtectedRoute>
                      <ProductList categoryId={Number(window.location.pathname.split('/')[2])} />
                    </ProtectedRoute>
                  } />
                  <Route path="/products/table" element={
                    <ProtectedRoute>
                      <ProductTable />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Box>
            </MainContent>
          </Container>
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;
